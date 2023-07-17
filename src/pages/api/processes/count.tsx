import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return await getProcessesCount(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProcessesCount(req: any, res: any) {
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

  if (user?.role.name === "super") {
    const processes = await prisma.process.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    const processesCount = processes.length;
    return res.status(200).json({processesCount, success: true});
  } else {
    const processes = await prisma.process.findMany({
      where: {
        client: {
          ownerId: Number(token.id),
        },
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    const processesCount = processes.length;
    return res.status(200).json({processesCount, success: true});
  }
}
