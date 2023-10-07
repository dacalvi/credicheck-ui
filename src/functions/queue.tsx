import axios from "axios";

export const addToQueue = async (uuid: string) => {
  const targetUrl =
    process.env.ENVIRONMENT === "development"
      ? process.env.TUNNEL_URL + "/api/queue/" + uuid
      : process.env.VERCEL_URL + "/api/queue/" + uuid;

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
