import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";
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
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);

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
