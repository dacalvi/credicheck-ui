import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "DELETE") {
    await deleteProcess(req.query.id, req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function deleteProcess(id: number, req: any, res: any) {
  //delete a process if process is owned by the user
  const token = await getToken({req});

  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  //get the user company
  const user = await prisma.user.findUnique({
    where: {
      id: Number(token.id),
    },
    select: {
      id: true,
      role: {
        select: {
          name: true,
          id: true,
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

  //get the process to delete
  const process = await prisma.process.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      client: {
        select: {
          owner: {
            select: {
              companyId: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (
    (user?.role.name === "supervisor" &&
      process?.client.owner.companyId === user?.company.id) ||
    (user?.role.name === "agente" && process?.client.owner.id === user?.id)
  ) {
    //soft delete the process
    await prisma.process.update({
      where: {
        id: Number(id),
      },
      data: {
        deleted: true,
      },
    });
    return res.status(200).json({message: "Process deleted", success: true});
  } else {
    return res
      .status(401)
      .json({message: "Unauthorized for this user", success: false});
  }
}
