//import axios from "axios";
//import {Result} from "constants/values";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const yearsOfActivity = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  /*
  const url = `${payload.sat_ws_url}/tax-compliance-checks/${payload.rfc}`;
  const headers = {
    "X-API-KEY": payload.sat_ws_api_key,
    "Content-Type": "application/json",
  };
  */
  try {
    //const response = await axios.get(url, {headers});
    //const complianceResult = response.data.result;
    //iterate over months and get the total  of sales revenue using the mxnAmount field

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "SKIP",
      score: 100,
      result_explanation: `Resultado: favorable`,
    };
    /*
    switch (complianceResult) {
      case complianceResult === "positive":
        result.result = Result.SKIP;
        result.score = 100;
        break;
      case complianceResult === "no_obligations":
        result.result = Result.MANUAL;
        result.score = 0;
        break;
      case complianceResult === "negative":
        result.result = Result.REJECT;
        result.score = 0;
        break;
      default:
        break;
    }
    */
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
