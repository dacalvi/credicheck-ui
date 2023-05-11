import {PrismaClient} from "@prisma/client";
import {addToQueue} from "functions/queue";
import {generateUUID} from "functions/uuid";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  if (req.method === "GET") {
    const processes = await getProcesses();
    return res.status(200).json({processes, success: true});
  } else if (req.method === "POST") {
    return await createProcess(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function createProcess(req: any, res: any) {
  const data = req.body;
  const token = await getToken({req});

  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  //get the indicators for the companyId using the company_indicator relation table
  const indicators = await prisma.company_indicator.findMany({
    select: {
      indicator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      companyId: Number(token.companyId),
    },
  });

  const newProcess = await prisma.process.create({
    data: {
      name: data.name,
      description: data.description,
      clientId: Number(data.clientId),
    },
  });

  const steps = indicators.map((indicator, index) => {
    return {
      name: indicator.indicator.name,
      description: "Proceso para " + indicator.indicator.name,
      processId: newProcess.id,
      indicatorId: indicator.indicator.id,
      order: index,
      uuid: generateUUID(),
    };
  });

  await prisma.step.createMany({
    data: steps,
  });

  //add the steps to the queue
  for (const step of steps) {
    await addToQueue(step.uuid);
  }

  return res.status(200).json({message: "Process created", success: true});
}

async function getProcesses() {
  const processes = await prisma.process.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      client: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      steps: {
        select: {
          id: true,
          name: true,
          description: true,
          state: true,
          result: true,
          score: true,
          uuid: true,
          resultExplanation: true,
        },
      },
      state: true,
    },
  });

  return processes;
}
