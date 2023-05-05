import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const prospectsCount = await getProspectsCount();
    return res.status(200).json({prospectsCount, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProspectsCount() {
  const prospectsCount = await prisma.client.count();
  return prospectsCount;
}
