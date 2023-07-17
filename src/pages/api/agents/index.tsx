import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const users = await getUsers(req, res);
    return res.status(200).json({users, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
  /*
  } else {
    // Not Signed in
    res.status(401);
  }
  */
  res.end();
}

async function getUsers(req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  //get the company id from the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: token?.email,
    },
  });
  const companyId = user?.companyId;

  //get the users from the company
  const users = await prisma.user.findMany({
    where: {
      companyId: companyId,
      roleId: 3,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      roleId: true,
      role: {
        select: {
          name: true,
        },
      },
      company: {
        select: {
          name: true,
        },
      },
    },
  });
  return users;
}
