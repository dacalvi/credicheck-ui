import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "DELETE") {
    await deleteUser(req.query.id, req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function deleteUser(id: number, req: any, res: any) {
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

  //get the users from the company with the id
  const users = await prisma.user.findMany({
    where: {
      companyId: companyId,
      id: Number(id),
      roleId: 3,
    },
  });

  if (users.length > 0) {
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({message: "User deleted", success: true});
  }
}
