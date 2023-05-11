import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const company = await getCompany(req.query.id);
    res.status(200).json({company});
  } else if (req.method === "PUT") {
    const company = await updateCompany(req.query.id, req.body);
    res.status(200).json({company});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
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
