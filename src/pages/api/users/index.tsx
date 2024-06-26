import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

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
  } else if (req.method === "PUT") {
    // eslint-disable-next-line no-console
    console.log(req.body);

    //check that all fields are filled
    if (!req.body.email || !req.body.roleId || !req.body.companyId) {
      return res.status(400).json({message: "Missing fields", success: false});
    }

    //check that email exists
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({message: "User not found", success: false});
    }

    if (req.body.password.length > 0) {
      if (
        req.body.password.length >= 4 &&
        req.body.password.length <= 16 &&
        //the same with repassword
        req.body.password === req.body.repassword
      ) {
        const hashedPassword = await generatePassword(req.body.password);
        await prisma.user.update({
          where: {
            email: req.body.email,
          },
          data: {
            password: hashedPassword,
          },
        });
      } else {
        return res.status(400).json({
          message: "Password lenght invalid or they dont match",
          success: false,
        });
      }
    }

    //make the prisma update of roleId and companyId
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        roleId: Number(req.body.roleId),
        companyId: Number(req.body.companyId),
      },
    });

    return res.status(200).json({success: true});
  } else if (req.method === "GET") {
    const users = await getUsers();
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

async function generatePassword(password: string) {
  const hash = await bcrypt.hash(password, "$2b$10$gaZiwMSD2p06JeCDpcukC.");
  return hash;
}

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      id: true,
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

async function createUser(req: any, res: any) {
  const body = req.body;
  const hashedPassword = await generatePassword(body.password);
  try {
    await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        roleId: Number(body.roleId),
        companyId: Number(body.companyId),
      },
    });
    return res.status(200).json({success: true});
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({error: "Error creando el usuario", success: false});
  }
}
