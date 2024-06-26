import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const company = await getCompany(req.query.id);
    res.status(200).json({company});
  } else if (req.method === "PUT") {
    const company = await updateCompany(req.query.id, req.body);
    res.status(200).json({company, success: true});
  } else if (req.method === "DELETE") {
    await deleteCompany(req.query.id, req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function deleteCompany(id: number, req: any, res: any) {
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);

  //get the user company
  const user = await prisma.user.findUnique({
    where: {
      id: Number(token.id),
    },
    select: {
      role: {
        select: {
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (user?.role.name !== "super") {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
  const company = await prisma.company.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({company});
}

async function updateCompany(id: number, data: any) {
  const company = await prisma.company.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
    },
  });
  return company;
}

async function getCompany(id: number) {
  const company = await prisma.company.findUnique({
    where: {
      id: Number(id),
    },
  });
  return company;
}
