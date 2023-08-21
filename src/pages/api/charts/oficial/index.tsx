import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const charts = await getCharts();
    return res.status(200).json({charts: charts, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getCharts() {
  const charts = await prisma.chart.findMany({
    orderBy: {
      order: "asc",
    },
  });
  return charts;
}
