import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const requests = await getRequests();
    return res.status(200).json({requests: requests, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getRequests() {
  const requests = await prisma.requestLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return requests;
}
