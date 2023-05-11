import axios from "axios";
import {Result} from "constants/values";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const getSalesRevenue = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  const url = `${payload.sat_ws_url}/insights/${payload.rfc}/sales-revenue`;
  const headers = {
    "X-API-KEY": payload.sat_ws_api_key,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, {headers});
    const months = response.data.data;
    //iterate over months and get the total  of sales revenue using the mxnAmount field

    const acc_salesRevenue = months.reduce((acc: any, month: any) => {
      return acc + month.mxnAmount;
    }, 0);

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "",
      score: 0,
      result_explanation: `Ventas acumuladas: $${acc_salesRevenue}`,
    };

    switch (acc_salesRevenue) {
      case acc_salesRevenue >= 3000000:
        result.result = Result.SKIP;
        result.score = 100;
        break;
      case acc_salesRevenue >= 1000000 && acc_salesRevenue < 3000000:
        result.result = Result.SKIP;
        result.score = 50;
        break;
      case acc_salesRevenue < 1000000:
        result.result = Result.REJECT;
        result.score = 0;
        break;
      default:
        break;
    }
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
