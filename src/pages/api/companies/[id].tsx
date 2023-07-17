import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const company = await getCompany(req.query.id);
    res.status(200).json({company});
  } else if (req.method === "PUT") {
    const company = await updateCompany(req.query.id, req.body);
    res.status(200).json({company});
  } else if (req.method === "DELETE") {
    await deleteCompany(req.query.id, req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function deleteCompany(id: number, req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

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
  // eslint-disable-next-line no-console
  console.log(data);
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
