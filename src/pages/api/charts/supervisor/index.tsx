import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "PUT") {
    const company = await updateCharts(req.body, res, req);
    res.status(200).json({company});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function updateCharts(data: any, res: any, req: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  await prisma.chart_company.deleteMany({
    where: {
      companyId: Number(token.companyId),
    },
  });

  data.charts.forEach(async (chart: any) => {
    if (chart.checked) {
      await prisma.chart_company.create({
        data: {
          chartId: chart.id,
          companyId: Number(token.companyId),
        },
      });
    }
  });
}
