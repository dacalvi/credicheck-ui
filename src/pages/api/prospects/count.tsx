import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const prospectsCount = await getProspectsCount(req, res);
    return res.status(200).json({prospectsCount, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProspectsCount(req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  if (token.roleId === 2) {
    //supervisor
    const companyId = token?.companyId;
    //get the prospect count where owner belongs to companyId
    const prospects = await prisma.client.findMany({
      select: {
        id: true,
      },
      where: {
        owner: {
          companyId: Number(companyId),
        },
      },
    });
    return prospects.length;
  }

  const prospectsCount = await prisma.client.count({
    where: {
      owner: {
        id: Number(token?.id),
      },
    },
  });
  return prospectsCount;
}
