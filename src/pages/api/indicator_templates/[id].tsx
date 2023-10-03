import {PrismaClient} from "@prisma/client";
import availableIndicators from "../indicators/availableIndicators";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const indicatorTemplate = await getIndicatorTemplate(req.query.id);
    return res
      .status(200)
      .json({indicatorTemplate: indicatorTemplate, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getIndicatorTemplate(id: number) {
  const indicatorTemplate = await prisma.indicatorTemplate.findUnique({
    select: {
      id: true,
      name: true,
      indicators: {
        select: {
          id: true,
          name: true,
          source: true,
          associated_function: true,
          config: true,
        },
      },
    },
    where: {
      id: Number(id),
    },
  });

  const result = {...indicatorTemplate};

  const newIndicatorsList = availableIndicators.indicators.map(
    (availableIndicator) => {
      const indicatorIntemplate = indicatorTemplate?.indicators.find(
        (indicatorInTemplate) =>
          indicatorInTemplate.associated_function ===
          availableIndicator.associated_function
      );

      if (indicatorIntemplate) {
        return {
          ...availableIndicator,
          ...indicatorIntemplate,
          checked: true,
          config: JSON.parse(indicatorIntemplate.config || ""),
        };
      } else {
        return availableIndicator;
      }
    }
  );

  result.indicators = newIndicatorsList;

  return result;
}
