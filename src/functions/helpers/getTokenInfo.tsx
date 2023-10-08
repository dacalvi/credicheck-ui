import {getToken} from "next-auth/jwt";
export async function getTokenInfo(req: any) {
  const secret = process.env.NEXT_AUTH_SECRET;
  const token = await getToken({
    req: req,
    secret: secret,
  });

  if (!token) {
    return false;
  } else {
    return token;
  }
}
