import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const companies = await getCompanies();
    return res.status(200).json({companies, success: true});
  } else if (req.method === "POST") {
    return await createCompany(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function createCompany(req: any, res: any) {
  const {name} = req.body;
  const company = await prisma.company.create({
    data: {
      name,
    },
  });
  return res.status(200).json({company, success: true});
}

async function getCompanies() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return companies;
}
