import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const charts = await getCharts();
    return res.status(200).json({charts: charts, success: true});
  } else if (req.method === "POST") {
    return await createChart(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function createChart(req: any, res: any) {
  const {name, description} = req.body;
  try {
    const chart = await prisma.chart.create({
      data: {
        name,
        description,
        order: 0,
      },
    });
    return res.status(200).json({chart: chart, success: true});
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          message: "Ya existe un grafico con ese nombre",
          success: false,
        });
      }
    }
    return res.status(500).json({message: error.message, success: false});
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
