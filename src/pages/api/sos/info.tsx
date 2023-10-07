import {get_url} from "functions/helpers";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      message: "Hello, world",
      url: get_url(),
      success: true,
    });
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
