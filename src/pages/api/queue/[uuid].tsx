import type {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import axios from "axios";
import {Result} from "constants/values";

const prisma = new PrismaClient();

type StepType = {
  id: number;
  name: string;
  description: string;
  uuid: string;
  process: {
    id: number;
    client: {
      rfc: string;
    };
  };
  indicator: {
    id: number;
    associated_function: string;
  };
};

type CommonPayloadType = {
  sat_ws_url: string;
  sat_ws_api_key: string;
  processId: number;
  uuid: string;
  rfc?: string;
};

type AssociatedFunctionResponseType = {
  processId: number;
  uuid: string;
  result: string;
  score: number;
  result_explanation?: string;
} | null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {uuid} = req.query;

  //get the step from the database
  const step = await prisma.step.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      uuid: true,
      process: {
        select: {
          id: true,
          client: {
            select: {
              rfc: true,
            },
          },
        },
      },
      indicator: {
        select: {
          id: true,
          associated_function: true,
        },
      },
    },
    where: {
      uuid: uuid as string,
    },
  });

  if (!step) {
    return res.status(404).json({message: "Not found", success: false});
  }
  await call_associated_function(step);

  return res.status(200).json({uuid, step, success: true});
  // fail: res.status(400).send();
}

async function call_associated_function(step: StepType) {
  const payload: CommonPayloadType = {
    sat_ws_url: process.env.SAT_WS_URL || "",
    sat_ws_api_key: process.env.SAT_WS_API_KEY || "",
    processId: step.process.id,
    uuid: step.uuid,
    rfc: step.process.client.rfc,
  };

  if (step?.indicator.associated_function === "sales-revenue") {
    saveResult(await getSalesRevenue(payload));
  }
}

async function saveResult(result: AssociatedFunctionResponseType) {
  if (result) {
    //update the step with the result
    await prisma.step.update({
      where: {
        uuid: result.uuid,
      },
      data: {
        result:
          result.result === Result.SKIP
            ? "SKIP"
            : result.result === Result.MANUAL
            ? "MANUAL"
            : "REJECT",
        score: result.score,
        state: "FINISHED",
        resultExplanation: result.result_explanation,
      },
    });

    //update the process state
    await updateProcessState(result.processId);
  }
}

async function updateProcessState(processId: number) {
  //get all steps from the process
  const steps = await prisma.step.findMany({
    select: {
      state: true,
    },
    where: {
      processId,
    },
  });

  //check if all steps are finished
  const allStepsFinished = steps.every((step) => step.state === "FINISHED");
  await prisma.process.update({
    where: {
      id: processId,
    },
    data: {
      state: allStepsFinished ? "FINISHED" : "IN_PROGRESS",
    },
  });
}

const getSalesRevenue = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  const url = `${payload.sat_ws_url}/insights/${payload.rfc}/sales-revenue`;
  const headers = {
    "X-API-KEY": payload.sat_ws_api_key,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, {headers});
    const months = response.data.data;
    //iterate over months and get the total  of sales revenue using the mxnAmount field

    const acc_salesRevenue = months.reduce((acc: any, month: any) => {
      return acc + month.mxnAmount;
    }, 0);

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "",
      score: 0,
      result_explanation: `Ventas acumuladas: $${acc_salesRevenue}`,
    };

    switch (acc_salesRevenue) {
      case acc_salesRevenue >= 3000000:
        result.result = Result.SKIP;
        result.score = 100;
        break;
      case acc_salesRevenue >= 1000000 && acc_salesRevenue < 3000000:
        result.result = Result.SKIP;
        result.score = 50;
        break;
      case acc_salesRevenue < 1000000:
        result.result = Result.REJECT;
        result.score = 0;
        break;
      default:
        break;
    }
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
