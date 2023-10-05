export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    console.log(process.env.VERCEL_URL);

    return res.status(200).json({message: "Hello, world", success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
