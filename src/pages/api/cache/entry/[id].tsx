import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const cacheEntry = await getCacheEntry(req.query.id);

    return res.status(200).json({cacheEntry: cacheEntry, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getCacheEntry(id: string) {
  //get the requestlog using id as uuid and get the associated querycache
  const requestLog = await prisma.queryCache.findFirst({
    where: {
      uuid: id,
    },
    select: {
      content: true,
      url: true,
      method: true,
    },
  });
  return requestLog;
}
