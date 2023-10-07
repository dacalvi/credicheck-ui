import {webhookHandler} from "./handlers";
export default async function handler(req: any, res: any) {
  const {data, type} = req.body;
  if (!data || !type) {
    return res.status(400).json({message: "Bad Request", success: false});
  }
  try {
    await webhookHandler(type, data);
  } catch (e) {
    return res
      .status(500)
      .json({message: "Internal Server Error", success: false});
  }

  return res.status(200).json({message: "OK", success: true});
}
