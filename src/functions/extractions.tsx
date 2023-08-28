import axios from "axios";

export const createExtraction = async (uuid: string | null) => {
  if (uuid === null) return null;
  if (uuid === "") return null;

  const targetUrl =
    process.env.ENVIRONMENT === "development"
      ? process.env.TUNNEL_URL + "/api/extractions/" + uuid
      : process.env.NEXT_PUBLIC_API_URL + "/extractions/" + uuid;

  const fetchUrl = `https://api.serverlessq.com?id=${process.env.SERVERLESSQ_QUEUE_ID}&target=${targetUrl}`;

  const headers = {
    "x-api-key": process.env.SERVERLESSQ_API_TOKEN,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(fetchUrl, {headers});
    // eslint-disable-next-line no-console
    console.log(response.data);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
