import {getToken} from "next-auth/jwt";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const token = await getToken({req});
    return res.status(200).json({
      message: "Hello, world2",
      vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL, // http://localhost:3000
      success: true,
      token: token,
    });
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
