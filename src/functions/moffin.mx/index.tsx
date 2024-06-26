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
      result.result_explanation = `El RFC ${payload.rfc} se encuentra en la lista negra del SAT
      Cantidad de facturas emitidas: ${blackListStatus.data.issued[0].invoices}
      Cantidad de facturas recibidas: ${blackListStatus.data.received[0].invoices}
      `;
    } else {
      result.result = "SKIP";
      result.score = 100;
      result.result_explanation = `El RFC ${payload.rfc} no se encuentra en la lista negra del SAT`;
    }

    return result;
  } catch (error) {
    return null;
  }
};
