import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";
import {PrismaClient} from "@prisma/client";

type IndicatorConfigType = {
  segments: number[];
  segmentResults: Result[];
  resultScores: number[];
};

export const getSalesRevenue24 = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  const prisma = new PrismaClient();
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    //get the first day of month from 12 months ago

    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    const twoyearsago = new Date();
    lastYear.setFullYear(today.getFullYear() - 2);

    const salesrevenue_response = await sdk.insights.getSalesRevenue(
      payload.rfc,
      twoyearsago.toISOString().split("T")[0],
      lastYear.toISOString().split("T")[0],
      "monthly",
      "total"
    );

    if (salesrevenue_response.data.length === 0) {
      return null;
    }

    //please, add up every mxnAmount property in salesrevenue_response.data  and store the result in acc_salesRevenue
    let acc_salesRevenue = 0;
    salesrevenue_response.data.forEach((element) => {
      acc_salesRevenue += element.mxnAmount;
    });

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

    let rango = 0;
    for (let i = 0; i < config.segments.length; i++) {
      if (acc_salesRevenue > config.segments[i]) {
        rango = i + 1;
      }
    }

    return {
      processId: payload.processId,
      uuid: payload.uuid,
      result: config.segmentResults[rango],
      score: config.resultScores[rango],
      result_explanation: `${acc_salesRevenue}`,
    };
  } catch (error) {
    return null;
  }
};
