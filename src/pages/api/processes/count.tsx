import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const processesCount = await getProcessesCount();
    return res.status(200).json({processesCount, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProcessesCount() {
  const processesCount = await prisma.process.count();
  return processesCount;
}
