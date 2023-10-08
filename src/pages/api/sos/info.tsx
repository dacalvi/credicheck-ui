import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const isRoleValid = await isRole(req, [
      RoleList.SUPER,
      RoleList.SUPERVISOR,
    ]);
    if (!isRoleValid) {
      return res.status(401).json({message: "Unauthorized", success: false});
    }

    const token = await getTokenInfo(req);

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
