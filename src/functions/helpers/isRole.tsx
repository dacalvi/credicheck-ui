import {RoleList} from "constants/roles";
import {getToken} from "next-auth/jwt";

//TODO: Implement this function and use it in all api endpoints

export async function isRole(req: any, roleList: RoleList[]): Promise<boolean> {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({
    req: req,
    secret: secret,
  });

  if (!token) {
    return false;
  }

  if (token.roleId && roleList.includes(token.roleId)) {
    return true;
  }
  return false;
}
