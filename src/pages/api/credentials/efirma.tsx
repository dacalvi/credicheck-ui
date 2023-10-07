export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    return await authenticateEfirma(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function authenticateEfirma(req: any, res: any) {
  return res.status(200).json({message: "Success", success: true});
}
