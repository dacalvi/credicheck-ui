import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {TaxStatusResponseType} from "functions/satws-sdk/types/TaxStatusResponseType";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";
import {PrismaClient} from "@prisma/client";

type IndicatorConfigType = {
  segments: number[];
  segmentResults: Result[];
  resultScores: number[];
};

export const yearsOfActivity = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  const prisma = new PrismaClient();

  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    const taxStatus: TaxStatusResponseType = await sdk.taxStatus.getTaxStatus(
      payload.rfc
    );

    const yearsOfActivity = taxStatus["hydra:member"][0].startedOperationsAt
      ? new Date().getFullYear() -
        new Date(taxStatus["hydra:member"][0].startedOperationsAt).getFullYear()
      : 0;

    //get the indicator from the database, from the indicatorId in the indicator table
    const indicator = await prisma.indicator.findUnique({
      select: {
        id: true,
        config: true,
      },
      where: {
        id: payload.indicatorId,
      },
    });

    //if indicator is null raise error
    if (!indicator) {
      throw new Error("Indicator not found");
    }

    if (indicator.config === null) {
      throw new Error("Indicator config not found");
    }

    const config: IndicatorConfigType = JSON.parse(indicator.config);

    //TODO: stress this indicator

    let rango = 0;
    for (let i = 0; i < config.segments.length; i++) {
      if (yearsOfActivity > config.segments[i]) {
        rango = i + 1;
      }
    }

    return {
      processId: payload.processId,
      uuid: payload.uuid,
      result: config.segmentResults[rango],
      score: 100,
      result_explanation: `${yearsOfActivity}`,
    };
  } catch (error) {
    return null;
  }
};
