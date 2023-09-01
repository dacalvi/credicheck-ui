//import axios from "axios";
//import {Result} from "constants/values";
import {SatwsSdk} from "functions/satws-sdk";
import {InvoicingBlacklistStatusResponseType} from "functions/satws-sdk/types/InvoicingBlacklistStatusResponseType";
import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";

export const blackListStatus = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    const sdk = SatwsSdk.getInstance(
      `${payload.sat_ws_url}`,
      payload.sat_ws_api_key
    );

    // eslint-disable-next-line no-console
    console.log(payload);

    const blackListStatus: InvoicingBlacklistStatusResponseType =
      await sdk.insights.getInvoicingBlacklistStatus(payload.rfc);

    const result = {
      processId: payload.processId,
      uuid: payload.uuid,
      result: "REJECT",
      score: 0,
      result_explanation: ``,
    };

    if (
      blackListStatus.data.issued[0].invoices > 0 ||
      blackListStatus.data.received[0].invoices > 0
    ) {
      result.result = "REJECT";
      result.score = 0;
      result.result_explanation = `emitidas: ${blackListStatus.data.issued[0].invoices}
      recibidas: ${blackListStatus.data.received[0].invoices}
      `;
    } else {
      result.result = "SKIP";
      result.score = 100;
      result.result_explanation = `No se encuentra`;
    }

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
