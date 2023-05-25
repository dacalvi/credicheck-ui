import {PrismaClient} from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    return await authenticateCiec(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function authenticateCiec(req: any, res: any) {
  const data = req.body;

  // eslint-disable-next-line no-console
  console.log(data);

  data.type = "ciec";
  const url = `${process.env.SAT_WS_URL}/credentials`;
  const headers = {
    "X-API-KEY": process.env.SAT_WS_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, data, {headers});

    // eslint-disable-next-line no-console
    console.log(response.data);

    if (response.status !== 202)
      return res.status(200).json({message: "Error", success: false});

    if (response.status === 202) {
      //update the client satwsid field with the ciec id

      //get tax-status from satws
      const u = `${process.env.SAT_WS_URL}/taxpayers/${data.rfc}/tax-status`;
      // eslint-disable-next-line no-console
      console.log(u);

      const r = await axios.get(u, {headers});

      // eslint-disable-next-line no-console
      console.log(r.data["hydra:member"][0].address);

      await prisma.client.update({
        where: {
          uuid: req.body.uuid,
        },
        data: {
          satwsid: response.data.id,
        },
      });

      //remove password from response
      delete response.data.password;

      return res
        .status(200)
        .json({message: "Success", success: true, response: response.data});
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }

  return res.status(200).json({message: "Success", success: true});
}
