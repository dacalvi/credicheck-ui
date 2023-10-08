import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {isRole} from "functions/helpers/isRole";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const usersCount = await getUsersCount(req, res);
    return res.status(200).json({usersCount, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getUsersCount(req: any, res: any) {
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const usersCount = await prisma.user.count();
  return usersCount;
}
