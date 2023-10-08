import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const chart = await getChart(req.query.id);
    res.status(200).json({chart: chart});
  } else if (req.method === "PUT") {
    const company = await updateChart(req.query.id, req.body);
    res.status(200).json({company});
  } else if (req.method === "DELETE") {
    await deleteChart(req.query.id, req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function deleteChart(id: number, req: any, res: any) {
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);

  //get the user company
  const user = await prisma.user.findUnique({
    where: {
      id: Number(token.id),
    },
    select: {
      role: {
        select: {
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (user?.role.name !== "super") {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
  const company = await prisma.chart.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({company});
}

async function updateChart(id: number, data: any) {
  const company = await prisma.chart.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
  return company;
}

async function getChart(id: number) {
  const chart = await prisma.chart.findUnique({
    where: {
      id: Number(id),
    },
  });
  return chart;
}
