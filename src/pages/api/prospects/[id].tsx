import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const user = await getProspect(req.query.id);
    res.status(200).json({user});
  }
}

async function getProspect(id: number) {
  const user = await prisma.client.findUnique({
    select: {
      id: true,
      email: true,
      cellPhone: true,
      firstName: true,
      lastName: true,
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    where: {
      id: Number(id),
    },
  });
  return user;
}
