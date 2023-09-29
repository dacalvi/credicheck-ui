import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const indicatorTemplates = await getIndicatorTemplates();
    return res
      .status(200)
      .json({indicatorTemplates: indicatorTemplates, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getIndicatorTemplates() {
  const indicatorTemplates = await prisma.indicatorTemplate.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return indicatorTemplates;
}
