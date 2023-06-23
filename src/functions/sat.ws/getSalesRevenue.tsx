import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const getSalesRevenue = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

    const salesrevenue_response = await sdk.insights.getSalesRevenue(
      payload.rfc,
      firstDayOfYear.toISOString().split("T")[0],
      lastDayOfYear.toISOString().split("T")[0],
      "yearly",
      "total"
    );

    if (salesrevenue_response.data.length === 0) {
      return null;
    }

    //cut acc_salesRevenue to 2 decimals

    const acc_salesRevenue = salesrevenue_response.data[0].mxnAmount;
    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "",
      score: 0,
      result_explanation: `Ventas acumuladas: $${acc_salesRevenue.toFixed(2)}`,
    };

    if (acc_salesRevenue >= 3000000) {
      result.result = Result.SKIP;
      result.score = 100;
    } else if (acc_salesRevenue >= 1000000 && acc_salesRevenue < 3000000) {
      result.result = Result.SKIP;
      result.score = 50;
    } else if (acc_salesRevenue < 1000000) {
      result.result = Result.REJECT;
      result.score = 0;
    }
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
