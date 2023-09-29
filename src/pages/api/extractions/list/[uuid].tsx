import {PrismaClient} from "@prisma/client";
import axios from "axios";
import {getClientExtractions} from "../user/[uuid]";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return await getExtractions(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getExtractions(req: any, res: any) {
  const {uuid} = req.query;

  const url = `${process.env.SAT_WS_URL}/extractions?taxpayer.id=${uuid}`;
  const headers = {
    "X-API-KEY": process.env.SAT_WS_API_KEY,
    "Content-Type": "application/json",
  };
  const response = await axios.get(url, {headers});

  response.data["hydra:member"].forEach(async (extraction: any) => {
    const {id, taxpayer, ...rest} = extraction;
    //update extraction status from response
    try {
      await prisma.extraction.update({
        where: {uuid: id},
        data: {status: rest.status},
      });
    } catch (err) {
      //console.log(err);
    }
  });

  //create and return an array of extractions with the
  const client = await getClientExtractions(uuid);

  if (!client?.extractions || client.extractions.length === 0) {
    return res
      .status(404)
      .json({message: "Extraction Not found", success: false});
  }

  return res
    .status(200)
    .json({extractions: client?.extractions, success: true});
}
