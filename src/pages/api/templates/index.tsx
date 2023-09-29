import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const templates = await getTemplates();
    return res.status(200).json({templates: templates, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getTemplates() {
  const templates = await prisma.indicatorTemplate.findMany({
    orderBy: [{id: "desc"}],
  });
  return templates;
}
