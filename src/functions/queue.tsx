import axios from "axios";

export const addToQueue = async (uuid: string) => {
  const targetUrl =
    process.env.ENVIRONMENT === "development"
      ? process.env.TUNNEL_URL + "/api/queue/" + uuid
      : process.env.NEXT_PUBLIC_API_URL + "/queue/" + uuid;

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
