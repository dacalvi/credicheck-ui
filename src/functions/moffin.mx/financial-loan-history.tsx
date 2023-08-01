import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const financialLoanHistory = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    /*
    const sdk = MoffinSdk.getInstance(
      payload.moffin_mx_url,
      payload.moffin_mx_api_key
    );
        */

    //create a random variable between 0 and 2
    const random = Math.floor(Math.random() * 3);
    const statuses = ["SKIP", "REJECT", "MANUAL"];

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: statuses[random],
      score: Math.floor(Math.random() * 100),
      result_explanation: ``,
    };

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
