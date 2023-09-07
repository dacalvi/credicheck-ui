import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const user = await getProspect(req.query.uuid);
    res.status(200).json({user});
  }
}

async function getProspect(uuid: string) {
  const user = await prisma.client.findUnique({
    select: {
      id: true,
      email: true,
      cellPhone: true,
      firstName: true,
      lastName: true,
      companyName: true,
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    where: {
      uuid: uuid,
    },
  });
  return user;
}
