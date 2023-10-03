import {PrismaClient} from "@prisma/client";
import {yearsOfActivity} from "constants/indicators/years-of-activity";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  if (req.method === "GET") {
    const indicators = await getIndicators(req, res);
    return res.status(200).json({indicators, success: true});
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

  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

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

  //update the template
  await prisma.indicatorTemplate.update({
    where: {
      id: Number(data.id),
    },
    data: {
      name: data.name,
      company: {
        connect: {
          id: companyId,
        },
      },
    },
  });

  //update config and name in indicators from data
  await Promise.all(
    data.indicators.map(async (indicator: any) => {
      await prisma.indicator.update({
        where: {
          id: Number(indicator.id),
        },
        data: {
          name: indicator.name,
          config: JSON.stringify(indicator.config),
        },
      });
    })
  );

  return res
    .status(200)
    .json({message: "Indicator Template Updated", success: true});
}

async function createIndicators(req: any, res: any) {
  const data = req.body;

  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

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
  const token = await getToken({req});

  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

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

  if (user?.role.name === "supervisor") {
    return {indicators: [yearsOfActivity]};
  } else {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
}
