import axios from "axios";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const salesRevenue = await getSalesRevenue(req.query.rfc_id);
    return res.status(200).json({salesRevenue, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

const getSalesRevenue = async (rfc_id: string) => {
  const SAT_WS_URL = process.env.SAT_WS_URL;
  const SAT_WS_API_KEY = process.env.SAT_WS_API_KEY;

  const url = `${SAT_WS_URL}/insights/${rfc_id}/sales-revenue`;
  const headers = {
    "X-API-KEY": SAT_WS_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, {headers});
    const months = response.data.data;
    //iterate over months and get the total  of sales revenue using the mxnAmount field

    const acc_salesRevenue = months.reduce((acc: any, month: any) => {
      return acc + month.mxnAmount;
    }, 0);

    return acc_salesRevenue;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};
