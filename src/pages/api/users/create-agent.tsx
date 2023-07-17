import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  //const session = await getServerSession(req, res, authOptions);
  //if (session) {
  if (req.method === "POST") {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({message: "Missing email or password", success: false});
      //validate if email length is greater than 4
    } else if (req.body.email.length < 4) {
      return res.status(400).json({
        message: "email must be at least 4 characters long",
        success: false,
      });
    } else if (req.body.password.length < 4) {
      return res.status(400).json({
        message: "Password must be at least 4 characters long",
        success: false,
      });
    } else if (req.body.password.length > 16) {
      return res.status(400).json({
        message: "Password must be less than 17 characters long",
        success: false,
      });
    }
    return await createUser(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
  res.end();
}

async function generatePassword(password: string) {
  // eslint-disable-next-line no-console
  const hash = await bcrypt.hash(password, "$2b$10$gaZiwMSD2p06JeCDpcukC.");
  return hash;
}

async function createUser(req: any, res: any) {
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
          id: true,
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

  const body = req.body;
  const hashedPassword = await generatePassword(body.password);
  try {
    await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        roleId: 3,
        companyId: user?.company.id || 0,
      },
    });
    return res.status(200).json({success: true});
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({error: "Error creando el usuario", success: false});
  }
}
