import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const user = await getUser(req.query.id);
    res.status(200).json({user});
  }
}

//create a function to get a user using prisma
async function getUser(id: number) {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      roleId: true,
      role: {
        select: {
          name: true,
        },
      },
      companyId: true,
    },
    where: {
      id: Number(id),
    },
  });
  return user;
}
