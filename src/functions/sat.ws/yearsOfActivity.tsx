import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {TaxStatusResponseType} from "functions/satws-sdk/types/TaxStatusResponseType";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const yearsOfActivity = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    // eslint-disable-next-line no-console
    console.log(payload);

    const taxStatus: TaxStatusResponseType = await sdk.taxStatus.getTaxStatus(
      payload.rfc
    );

    const yearsOfActivity = taxStatus["hydra:member"][0].startedOperationsAt
      ? new Date().getFullYear() -
        new Date(taxStatus["hydra:member"][0].startedOperationsAt).getFullYear()
      : 0;

    const config = {
      segments: [5],
      segmentResults: [Result.REJECT, Result.SKIP],
      resultScores: [0, 100],
    };

    const index = config.segments.findIndex(
      (element) => yearsOfActivity >= element
    );

    if (index !== -1) {
      return {
        processId: payload.processId,
        uuid: payload.uuid,
        result: config.segmentResults[index + 1],
        score: 100,
        result_explanation: `${yearsOfActivity}`,
      };
    } else {
      return {
        processId: payload.processId,
        uuid: payload.uuid,
        result: Result.REJECT,
        score: 0,
        result_explanation: `${yearsOfActivity}`,
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
