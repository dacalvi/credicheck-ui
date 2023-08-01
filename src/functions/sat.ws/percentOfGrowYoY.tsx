//import axios from "axios";
//import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const percentOfGrowYoY = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    //get the first day of the previous month of the last year
    const firstDayOfPreviousMonthOfLastYear = new Date();
    firstDayOfPreviousMonthOfLastYear.setFullYear(
      firstDayOfPreviousMonthOfLastYear.getFullYear() - 1
    );
    firstDayOfPreviousMonthOfLastYear.setMonth(
      firstDayOfPreviousMonthOfLastYear.getMonth() - 1
    );
    firstDayOfPreviousMonthOfLastYear.setDate(1);

    //get the last day of the previous month of the last year
    const lastDayOfPreviousMonthOfLastYear = new Date();
    lastDayOfPreviousMonthOfLastYear.setFullYear(
      lastDayOfPreviousMonthOfLastYear.getFullYear() - 1
    );
    lastDayOfPreviousMonthOfLastYear.setMonth(
      lastDayOfPreviousMonthOfLastYear.getMonth()
    );
    lastDayOfPreviousMonthOfLastYear.setDate(0);

    const totals = await sdk.insights.getSalesRevenue(
      payload.rfc,
      firstDayOfPreviousMonthOfLastYear.toISOString().split("T")[0],
      lastDayOfPreviousMonthOfLastYear.toISOString().split("T")[0],
      "monthly",
      "total"
    );

    const lastYearMonthEarnings =
      totals.data.length === 0 ? 0 : totals.data[0].mxnAmount;

    //get the first day of the previous month of the current year
    const firstDayOfPreviousMonthOfCurrentYear = new Date();
    firstDayOfPreviousMonthOfCurrentYear.setMonth(
      firstDayOfPreviousMonthOfCurrentYear.getMonth() - 1
    );
    firstDayOfPreviousMonthOfCurrentYear.setDate(1);

    //get the last day of the previous month of the current year
    const lastDayOfPreviousMonthOfCurrentYear = new Date();
    lastDayOfPreviousMonthOfCurrentYear.setMonth(
      lastDayOfPreviousMonthOfCurrentYear.getMonth()
    );
    lastDayOfPreviousMonthOfCurrentYear.setDate(0);

    const totals2 = await sdk.insights.getSalesRevenue(
      payload.rfc,
      firstDayOfPreviousMonthOfCurrentYear.toISOString().split("T")[0],
      lastDayOfPreviousMonthOfCurrentYear.toISOString().split("T")[0],
      "monthly",
      "total"
    );

    const currentYearMonthEarnings =
      totals2.data.length === 0 ? 0 : totals2.data[0].mxnAmount;

    const percentOfGrow =
      ((currentYearMonthEarnings - lastYearMonthEarnings) /
        lastYearMonthEarnings) *
      100;

    //get the entire part of the percentOfGrow
    const percentOfGrowEntirePart = Math.floor(percentOfGrow);

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "REJECT",
      score: 0,
      result_explanation: ``,
    };

    if (percentOfGrowEntirePart >= 30) {
      result.result = "SKIP";
      result.score = 100;
      result.result_explanation = `El crecimiento de las ventas del mes actual con respecto al mismo mes del año anterior es de ${percentOfGrowEntirePart}%, por lo que se considera que el contribuyente es de bajo riesgo.`;
    }

    if (percentOfGrowEntirePart > 15 && percentOfGrowEntirePart < 30) {
      result.result = "SKIP";
      result.score = 50;
      result.result_explanation = `El crecimiento de las ventas del mes actual con respecto al mismo mes del año anterior es de ${percentOfGrowEntirePart}%, por lo que se considera que el contribuyente es de mediano riesgo.`;
    }

    if (percentOfGrowEntirePart >= 0 && percentOfGrowEntirePart <= 15) {
      result.result = "SKIP";
      result.score = 0;
      result.result_explanation = `El crecimiento de las ventas del mes actual con respecto al mismo mes del año anterior es de ${percentOfGrowEntirePart}%, por lo que se considera que el contribuyente es de alto riesgo.`;
    }

    if (percentOfGrowEntirePart < 0) {
      result.result = "REJECT";
      result.score = 0;
      result.result_explanation = `El crecimiento de las ventas del mes actual con respecto al mismo mes del año anterior es de ${percentOfGrowEntirePart}%, por lo que se considera que el contribuyente es de alto riesgo.`;
    }

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
