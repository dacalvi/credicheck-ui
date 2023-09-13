import {WebhookPayloadType} from "types/webhookPayload.type";
import {updateWebhook, deleteWebhook} from "functions/sat.ws/webhooks";
export default async function handler(req: any, res: any) {
  if (req.method === "PUT") {
    const payload: WebhookPayloadType = {
      sat_ws_url: process.env.SAT_WS_URL || "",
      sat_ws_api_key: process.env.SAT_WS_API_KEY || "",
      url: req.body.url,
      events: req.body.events,
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
  } else if (req.method === "DELETE") {
    const payload: WebhookPayloadType = {
      sat_ws_url: process.env.SAT_WS_URL || "",
      sat_ws_api_key: process.env.SAT_WS_API_KEY || "",
      id: req.query.id,
    };
    const result = await deleteWebhook(payload);
    if (!result?.success) {
      return res.status(400).json({message: "Bad request", success: false});
    }
    return res.status(200).json({result: result, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
