import {WebhookPayloadType} from "types/webhookPayload.type";
import {
  getWebhooks,
  updateWebhook,
  addWebhook,
} from "functions/sat.ws/webhooks";
export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const webhooks = await listWebhooks();
    return res.status(200).json({webhooks: webhooks, success: true});
  } else if (req.method === "PUT") {
    const payload: WebhookPayloadType = {
      sat_ws_url: process.env.SAT_WS_URL || "",
      sat_ws_api_key: process.env.SAT_WS_API_KEY || "",
      enabled: req.body.enabled,
    };

    if (req.query.id === undefined) {
      return res.status(400).json({message: "id is undefined", success: false});
    }
    payload.id = req.query.id;

    const result = await updateWebhook(payload);

    if (!result) {
      return res.status(400).json({message: "Bad request", success: false});
    }

    return res.status(200).json({webhooks: result, success: true});
  } else if (req.method === "POST") {
    const payload: WebhookPayloadType = {
      sat_ws_url: process.env.SAT_WS_URL || "",
      sat_ws_api_key: process.env.SAT_WS_API_KEY || "",
      events: [req.body.event],
    };

    const result = await addWebhook(payload);

    // eslint-disable-next-line no-console
    console.log(payload, result);
    return res.status(200).json({webhooks: result, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }

  async function listWebhooks() {
    const payload: WebhookPayloadType = {
      sat_ws_url: process.env.SAT_WS_URL || "",
      sat_ws_api_key: process.env.SAT_WS_API_KEY || "",
    };
    const result = await getWebhooks(payload);
    if (!result) {
      return null;
    }
    result["hydra:member"].forEach((element) => {
      delete element.signingSecret;
    });
    return result["hydra:member"];
  }
}
