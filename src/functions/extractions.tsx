import axios from "axios";

export const createExtraction = async (uuid: string | null) => {
  if (uuid === null) return null;
  if (uuid === "") return null;

  const targetUrl =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
      ? process.env.TUNNEL_URL + "/api/extractions/" + uuid
      : process.env.NEXT_PUBLIC_PROTOCOL +
        "://" +
        process.env.NEXT_PUBLIC_VERCEL_URL +
        "/api/extractions/" +
        uuid;

  const fetchUrl = `https://api.serverlessq.com?id=${process.env.SERVERLESSQ_QUEUE_ID}&target=${targetUrl}`;

  const headers = {
    "x-api-key": process.env.SERVERLESSQ_API_TOKEN,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(fetchUrl, {headers});
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createExtractionOnSatWs = async (
  taxPayerId: string,
  extractor: string,
  opt: any
) => {
  const options = {
    method: "POST",
    url: process.env.SAT_WS_URL + `/extractions`,
    headers: {
      "X-API-KEY": process.env.SAT_WS_API_KEY,
      "Content-Type": "application/json",
    },
    data: {
      taxpayer: `/taxpayers/${taxPayerId}`,
      extractor: extractor,
      options: opt,
    },
  };
  const response = await axios.request(options);

  return response.data;
};
