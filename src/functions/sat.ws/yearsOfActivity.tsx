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

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: Result.REJECT,
      score: 0,
      result_explanation: `${yearsOfActivity}`,
    };

    if (yearsOfActivity >= 5) {
      result.result = Result.SKIP;
      result.score = 100;
    } else if (yearsOfActivity >= 2 && yearsOfActivity < 5) {
      result.result = Result.SKIP;
      result.score = 50;
    } else if (yearsOfActivity >= 1 && yearsOfActivity < 2) {
      result.result = Result.SKIP;
      result.score = 25;
    } else if (yearsOfActivity < 1) {
      result.result = Result.MANUAL;
      result.score = 0;
    }

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
