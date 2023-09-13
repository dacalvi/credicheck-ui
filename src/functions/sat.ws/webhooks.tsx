import {WebhooksResponseType} from "functions/satws-sdk/types/WebhooksResponseType";
import {WebhookPayloadType} from "types/webhookPayload.type";
import axios from "axios";
import {SimpleResponseType} from "functions/satws-sdk/types/SimpleResponseType";

export const getWebhooks = async (
  payload: WebhookPayloadType
): Promise<WebhooksResponseType | null> => {
  try {
    const options = {
      method: "GET",
      url: `${payload.sat_ws_url}/webhook-endpoints`,
      headers: {
        "X-API-KEY": payload.sat_ws_api_key,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};

export const updateWebhook = async (
  payload: WebhookPayloadType
): Promise<WebhooksResponseType | null> => {
  try {
    if (payload.id === undefined) throw new Error("id is undefined");
    if (payload.url === undefined) throw new Error("url is undefined");
    if (payload.events === undefined) throw new Error("event is undefined");
    if (payload.enabled === undefined) throw new Error("enabled is undefined");
    const options = {
      method: "PUT",
      url: `${payload.sat_ws_url}/webhook-endpoints/${payload.id}`,
      headers: {
        "X-API-KEY": payload.sat_ws_api_key,
        "Content-Type": "application/json",
      },
      data: {
        url: payload.url,
        events: payload.events,
        enabled: payload.enabled,
      },
    };
    const response = await axios.request(options);
    // eslint-disable-next-line no-console
    console.log(response.data);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};

export const deleteWebhook = async (
  payload: WebhookPayloadType
): Promise<SimpleResponseType | null> => {
  try {
    if (payload.id === undefined) throw new Error("id is undefined");
    const options = {
      method: "DELETE",
      url: `${payload.sat_ws_url}/webhook-endpoints/${payload.id}`,
      headers: {
        "X-API-KEY": payload.sat_ws_api_key,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(options);
    return response.status === 204
      ? {message: "success", success: true}
      : {message: "error", success: false};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};

export const addWebhook = async (payload: WebhookPayloadType) => {
  try {
    const options = {
      method: "POST",
      url: `${payload.sat_ws_url}/webhook-endpoints`,
      headers: {
        "X-API-KEY": payload.sat_ws_api_key,
        "Content-Type": "application/json",
      },
      data: {
        url:
          process.env.ENVIRONMENT === "development"
            ? process.env.TUNNEL_URL + "/api/webhooks/sat.ws"
            : process.env.NEXT_PUBLIC_API_URL + "/webhooks/sat.ws",
        events: payload.events,
        enabled: true,
      },
    };

    const response = await axios.request(options);
    // eslint-disable-next-line no-console
    console.log(response.data);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
