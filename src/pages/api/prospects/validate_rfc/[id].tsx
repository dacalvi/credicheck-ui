import axios from "axios";
import {getToken} from "next-auth/jwt";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const token = await getToken({req});
    if (token?.id) {
      const data = {
        id: req.query.id,
      };
      const url = `${process.env.SAT_WS_URL}/rfc/validate/${data.id}`;
      const headers = {
        "X-API-KEY": process.env.SAT_WS_API_KEY,
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.get(url, {headers});
        // eslint-disable-next-line no-console
        console.log(response.data);

        if (response.data.valid === true) {
          return res
            .status(200)
            .json({message: "Success", success: true, response: response.data});
        } else {
          return res
            .status(200)
            .json({message: "Error", success: false, response: response.data});
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return null;
      }
    } else {
      return res.status(401).json({message: "Unauthorized", success: false});
    }

    //req.body.rfc
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
