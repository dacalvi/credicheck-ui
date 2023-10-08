import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";
import {addToQueue} from "functions/queue";
import {generateUUID} from "functions/uuid";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  if (req.method === "GET") {
    const processes = await getProcesses(req, res);
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
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  //get the indicators based on the template selected by the user
  const indicators = await prisma.indicator.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      templateId: Number(data.indicatorTemplate),
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
      name: indicator.name,
      description: "Reporte para " + indicator.name,
      processId: newProcess.id,
      indicatorId: indicator.id,
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

async function getProcesses(req: any, res: any) {
  //TODO: Refactor this!
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);

  //get the user company
  const user = await prisma.user.findUnique({
    where: {
      id: Number(token.id),
    },
    select: {
      role: {
        select: {
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (user?.role.name === "supervisor") {
    //get the processes for the current company
    const processes = await prisma.process.findMany({
      select: {
        client: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            owner: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        id: true,
        name: true,
        description: true,
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
      },

      where: {
        client: {
          owner: {
            company: {
              id: user.company.id,
            },
          },
        },
        deleted: false,
      },
    });
    return processes;
  } else if (user?.role.name === "agente") {
    //process by agent
    const processes = await prisma.process.findMany({
      where: {
        client: {
          ownerId: Number(token.id),
        },
        deleted: false,
      },
      orderBy: {
        id: "desc",
      },
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
    //create a deep copy of the processes
    const processCopy = JSON.parse(JSON.stringify(processes));

    for (const process of processCopy) {
      let finishedSteps = 0;
      for (const step of process.steps) {
        if (step.state === "FINISHED") {
          finishedSteps++;
        } else {
          break;
        }
      }
      process.percent = Math.round(
        (finishedSteps / process.steps.length) * 100
      );
    }

    return processCopy;
  } else {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
}
