import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const requests = await createUser();
    return res.status(200).json({requests: requests, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function generatePassword(password: string) {
  // eslint-disable-next-line no-console
  const hash = await bcrypt.hash(password, "$2b$10$gaZiwMSD2p06JeCDpcukC.");
  return hash;
}

async function createUser() {
  const adminRole = await prisma.role.create({
    data: {
      id: 1,
      name: "Super Admin",
    },
  });

  const company = await prisma.company.create({
    data: {
      name: "Credicheck Inc",
    },
  });

  const hashedPassword = await generatePassword("batman");
  await prisma.user.create({
    data: {
      firstName: "Daniel",
      lastName: "Calvi",
      email: "dacalvi@gmail.com",
      password: hashedPassword,
      roleId: Number(adminRole.id),
      companyId: Number(company.id),
    },
  });
}
