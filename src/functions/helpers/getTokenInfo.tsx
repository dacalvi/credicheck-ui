import {getToken} from "next-auth/jwt";
export async function getTokenInfo(req: any) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({
    req: req,
    secret: secret,
  });

  return token ? token : {};
}
