import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const companiesCount = await getCompaniesCount(req, res);
    return res
      .status(200)
      .json({companiesCount: companiesCount, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getCompaniesCount(req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
  const companiesCount = await prisma.company.count();
  return companiesCount;
}
