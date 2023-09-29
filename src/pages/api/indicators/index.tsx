import {PrismaClient} from "@prisma/client";
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
    return await updateIndicators(req);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function updateIndicators(req: any) {
  const data = req.body;
  // eslint-disable-next-line no-console
  console.log(data);
  /*
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

  //for each indicator marked with checked true, update the company_indicator table using user.company.id as companyId
  for (const indicator of data.indicators) {
    if (indicator.checked) {
      const found = await prisma.company_indicator.findFirst({
        where: {
          companyId: companyId,
          indicatorId: indicator.id,
        },
      });
      if (!found) {
        await prisma.company_indicator.create({
          data: {
            companyId: companyId,
            indicatorId: indicator.id,
          },
        });
      }
    } else {
      const found = await prisma.company_indicator.findFirst({
        where: {
          companyId: companyId,
          indicatorId: indicator.id,
        },
      });
      if (found) {
        await prisma.company_indicator.delete({
          where: {
            id: found.id,
          },
        });
      }
    }
  }

  return res.status(200).json({message: "Indicators Updated", success: true});
  */
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
    //get all the indicators
    const indicators = await prisma.example_Indicator.findMany({
      select: {
        id: true,
        name: true,
        order: true,
        source: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {indicators: indicators};
  } else {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
}
