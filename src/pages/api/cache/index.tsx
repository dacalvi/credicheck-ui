import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const cacheEntries = await getCacheEntries();
    return res.status(200).json({cacheEntries: cacheEntries, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getCacheEntries() {
  const charts = await prisma.queryCache.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return charts;
}
