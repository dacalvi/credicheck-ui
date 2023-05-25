import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: {method: string; body: {email: any; password: any}},
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {(arg0: {message: string; success: boolean}): any; new (): any};
    };
  }
) {
  if (req.method === "POST") {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({message: "Missing email or password", success: false});
      //validate if email length is greater than 4
    } else {
      return await validateCredentials(req, res);
    }
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function validateCredentials(
  req: {method?: string; body: any},
  res: {status: any}
) {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      roleId: true,
      password: true,
      companyId: true,
      company: {
        select: {
          name: true,
        },
      },
    },
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return res
      .status(400)
      .json({message: "Invalid username or password", success: false});
  } else {
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      "$2b$10$gaZiwMSD2p06JeCDpcukC."
    );
    if (user.password !== hashedPassword) {
      return res
        .status(400)
        .json({message: "Invalid username or password", success: false});
    } else {
      return res.status(200).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        success: true,
        roleId: user.roleId,
        companyId: user.companyId,
        companyName: user.company?.name,
      });
    }
  }
}
