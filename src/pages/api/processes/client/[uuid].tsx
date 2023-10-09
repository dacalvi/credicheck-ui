import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {isRole} from "functions/helpers/isRole";

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
    const {uuid} = req.query;
    const processes = await getProcesses(req, res, uuid);
    return res.status(200).json({processes, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
async function getProcesses(req: any, res: any, uuid: string) {
  //TODO: Refactor this!
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const isSupervisor = await isRole(req, [RoleList.SUPERVISOR]);
  const isAgente = await isRole(req, [RoleList.AGENTE]);

  if (isSupervisor) {
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
          uuid: uuid,
        },
        deleted: false,
      },
    });
    return processes;
  } else if (isAgente) {
    //process by agent
    const processes = await prisma.process.findMany({
      where: {
        client: {
          uuid: uuid,
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
