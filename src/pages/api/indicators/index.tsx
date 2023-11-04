import {PrismaClient} from "@prisma/client";
import {yearsOfActivity} from "constants/indicators/years-of-activity";
import {taxComplianceCheck} from "constants/indicators/tax-compliance-check";
import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";
import {salesRevenue} from "constants/indicators/sales-revenue";
import {salesRevenue24} from "constants/indicators/sales-revenue24";
import {blackListStatus} from "constants/indicators/black-list-status";
import {percentOfGrowYoy} from "constants/indicators/percent-of-grow-yoy";
import {percentBigClientsConcentration} from "constants/indicators/percent-big-clients-concentration";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return await getIndicators(req, res);
  } else if (req.method === "POST") {
    return await createIndicators(req, res);
  } else if (req.method === "PUT") {
    return await updateIndicators(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function updateIndicators(req: any, res: any) {
  const data = req.body;

  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);
  const companyId = token.companyId;

  //update the template
  await prisma.indicatorTemplate.update({
    where: {
      id: Number(data.id),
    },
    data: {
      name: data.name,
      company: {
        connect: {
          id: Number(companyId),
        },
      },
    },
  });

  //update config and name in indicators from data or create them if id dont exist
  const indicators = data.indicators.map((indicator: any) => {
    return {
      id: indicator.id ? Number(indicator.id) : undefined,
      name: indicator.name,
      order: indicator.order,
      sourceId: indicator.sourceId,
      associated_function: indicator.associated_function,
      templateId: Number(data.id),
      config: JSON.stringify(indicator.config),
      checked: indicator.checked,
    };
  });

  await Promise.all(
    indicators.map(async (indicator: any) => {
      const indicatorId = indicator.id;
      delete indicator.id;
      if (indicatorId) {
        await prisma.indicator.update({
          where: {
            id: Number(indicatorId),
          },
          data: indicator,
        });
      } else {
        await prisma.indicator.create({
          data: indicator,
        });
      }
    })
  );

  return res
    .status(200)
    .json({message: "Indicator Template Updated", success: true});
}

async function createIndicators(req: any, res: any) {
  const data = req.body;

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

  const companyId = Number(user?.company.id);

  //create the template
  const template = await prisma.indicatorTemplate.create({
    data: {
      name: data.name,
      company: {
        connect: {
          id: companyId,
        },
      },
    },
  });

  //create the indicators
  const indicators = data.indicators.map((indicator: any) => {
    return {
      name: indicator.name,
      order: indicator.order,
      sourceId: indicator.sourceId,
      associated_function: indicator.associated_function,
      templateId: template.id,
      config: JSON.stringify(indicator.config),
    };
  });

  await prisma.indicator.createMany({
    data: indicators,
  });

  return res
    .status(200)
    .json({message: "Indicator Template Created", success: true});
}

async function getIndicators(req: any, res: any) {
  const isRoleValid = await isRole(req, [RoleList.SUPERVISOR]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const isSupervisor = await isRole(req, [RoleList.SUPERVISOR]);

  if (isSupervisor) {
    const indicators = {
      indicators: [
        yearsOfActivity,
        taxComplianceCheck,
        salesRevenue,
        salesRevenue24,
        blackListStatus,
        percentOfGrowYoy,
        percentBigClientsConcentration,
      ],
    };
    return res.status(200).json({indicators, success: true});
  } else {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
}
