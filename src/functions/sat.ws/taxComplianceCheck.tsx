//import axios from "axios";
//import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {TaxComplianceCheckResponseType} from "functions/satws-sdk/types/TaxComplianceCheckResponseType";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const taxComplianceCheck = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    // eslint-disable-next-line no-console
    console.log(payload);

    const complianceCheck: TaxComplianceCheckResponseType =
      await sdk.taxPayers.getTaxComplianceCheck(payload.rfc);

    const complianceResult = complianceCheck["hydra:member"][0].result;

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "SKIP",
      score: 100,
      result_explanation: ``,
    };

    if (!complianceResult) return null;

    if (
      complianceResult === "positive" ||
      complianceResult === "no_obligations" ||
      complianceResult === "negative"
    ) {
      if (complianceResult === "positive") {
        result.result = "SKIP";
        result.score = 100;
        result.result_explanation = "Positivo";
      } else if (complianceResult === "no_obligations") {
        result.result = "MANUAL";
        result.score = 0;
        result.result_explanation = "Sin obligaciones";
      } else if (complianceResult === "negative") {
        result.result = "REJECT";
        result.score = 0;
        result.result_explanation = "Negativo";
      }
    } else {
      return null;
    }

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
