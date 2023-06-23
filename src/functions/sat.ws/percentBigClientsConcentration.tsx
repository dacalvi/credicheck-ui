//import axios from "axios";
//import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const percentBigClientsConcentration = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    //get the first day of this year
    const firstDayOfThisYear = new Date();
    firstDayOfThisYear.setMonth(0);
    firstDayOfThisYear.setDate(1);

    //get the last day of this year
    const lastDayOfThisYear = new Date();
    lastDayOfThisYear.setMonth(11);
    lastDayOfThisYear.setDate(31);

    const customer_concentration_result =
      await sdk.insights.getCustomerConcentration(
        payload.rfc,
        firstDayOfThisYear.toISOString().split("T")[0],
        lastDayOfThisYear.toISOString().split("T")[0]
      );

    const customer_concentration = customer_concentration_result.data[0].share;

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "REJECT",
      score: 0,
      result_explanation: ``,
    };

    if (customer_concentration < 10) {
      result.result = "SKIP";
      result.score = 100;
      result.result_explanation = `La concentración de clientes es de ${customer_concentration}%, por lo que no se considera un riesgo.`;
    } else if (customer_concentration >= 10 && customer_concentration < 20) {
      result.result = "SKIP";
      result.score = 50;
      result.result_explanation = `La concentración de clientes es de ${customer_concentration}%, por lo que se considera un riesgo medio.`;
    } else if (customer_concentration >= 20 && customer_concentration < 30) {
      result.result = "SKIP";
      result.score = 25;
      result.result_explanation = `La concentración de clientes es de ${customer_concentration}%, por lo que se considera un riesgo alto.`;
    } else if (customer_concentration >= 30) {
      result.result = "REJECT";
      result.score = 0;
      result.result_explanation = `La concentración de clientes es de ${customer_concentration}%, por lo que se considera un riesgo muy alto.`;
    }

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
