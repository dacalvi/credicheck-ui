import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {isRole} from "functions/helpers/isRole";
import {getTokenInfo} from "functions/helpers/getTokenInfo";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const isRoleValid = await isRole(req, [
    RoleList.SUPER,
    RoleList.SUPERVISOR,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  if (req.method === "GET") {
    const indicatorTemplates = await getIndicatorTemplates(req);
    return res
      .status(200)
      .json({indicatorTemplates: indicatorTemplates, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getIndicatorTemplates(req: any) {
  const token = await getTokenInfo(req);

  const indicatorTemplates = await prisma.indicatorTemplate.findMany({
    where: {
      companyId: Number(token.companyId),
    },
    orderBy: {
      id: "desc",
    },
  });
  return indicatorTemplates;
}
