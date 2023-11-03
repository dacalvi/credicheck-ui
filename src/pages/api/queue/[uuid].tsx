import type {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {StepType} from "types/step.type";
import {Result} from "constants/values";
import {CommonPayloadType} from "types/commonPayload.type";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {getSalesRevenue} from "functions/sat.ws/getSalesRevenue";
import {taxComplianceCheck} from "functions/sat.ws/taxComplianceCheck";
import {blackListStatus} from "functions/sat.ws/blackListStatus";
import {yearsOfActivity} from "functions/sat.ws/yearsOfActivity";
import {percentOfGrowYoY} from "functions/sat.ws/percentOfGrowYoY";
import {percentBigClientsConcentration} from "functions/sat.ws/percentBigClientsConcentration";
import {clientPortfolio} from "functions/moffin.mx/client-portfolio";
import {financialLoanHistory} from "functions/moffin.mx/financial-loan-history";
import {financialClosedLoanHistory} from "functions/moffin.mx/financial-closed-loan-history";
import {consumerLoanHistory} from "functions/moffin.mx/consumer-loan-history";
import {getSalesRevenue24} from "functions/sat.ws/getSalesRevenue24";

const prisma = new PrismaClient();

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
    moffin_mx_url: process.env.MOFFIN_MX_URL || "",
    moffin_mx_api_key: process.env.MOFFIN_MX_API_KEY || "",
    processId: step.process.id,
    uuid: step.uuid,
    rfc: step.process.client.rfc,
    indicatorId: step.indicator.id,
  };

  /*
    Crear una funcion en la carpeta de funciones asociadas
    importarla aqui
    agregar una condicion para llamarla con el payload correcto
    agregar registro en la base de datos en la tabla Indicator con el nombre de la funcion asociada
  */

  if (step?.indicator.associated_function === "tax-compliance-check") {
    saveResult(await taxComplianceCheck(payload));
  }

  if (step?.indicator.associated_function === "sales-revenue") {
    saveResult(await getSalesRevenue(payload));
  }

  if (step?.indicator.associated_function === "sales-revenue24") {
    saveResult(await getSalesRevenue24(payload));
  }

  if (step?.indicator.associated_function === "black-list-status") {
    saveResult(await blackListStatus(payload));
  }

  if (step?.indicator.associated_function === "years-of-activity") {
    saveResult(await yearsOfActivity(payload));
  }

  if (step?.indicator.associated_function === "percent-of-grow-yoy") {
    saveResult(await percentOfGrowYoY(payload));
  }

  if (step?.indicator.associated_function === "percent-of-grow-yoy") {
    saveResult(await percentOfGrowYoY(payload));
  }

  if (
    step?.indicator.associated_function === "percent-big-clients-concentration"
  ) {
    saveResult(await percentBigClientsConcentration(payload));
  }

  //Reporte para Calificacion de la Cartera
  if (step?.indicator.associated_function === "client-portfolio") {
    saveResult(await clientPortfolio(payload));
  }

  //Situación creditos fin. a la fecha (los últimos 6 meses) vigentes y cerrados
  if (step?.indicator.associated_function === "financial-loan-history") {
    saveResult(await financialLoanHistory(payload));
  }

  //Historial de créditos consumo (ultimos 24 meses)
  if (step?.indicator.associated_function === "consumer-loan-history") {
    saveResult(await consumerLoanHistory(payload));
  }

  //Créditos financieros cerrados forma de liquidación
  if (step?.indicator.associated_function === "financial-closed-loan-history") {
    saveResult(await financialClosedLoanHistory(payload));
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
