import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({message: "Missing username or password", success: false});
      //validate if username length is greater than 4
    } else if (req.body.username.length < 4) {
      return res.status(400).json({
        message: "Username must be at least 4 characters long",
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
}

async function generatePassword(password: string) {
  // eslint-disable-next-line no-console
  const hash = await bcrypt.hash(password, "$2b$10$gaZiwMSD2p06JeCDpcukC.");
  return hash;
}

async function createUser(req, res) {
  const body = req.body;
  const hashedPassword = await generatePassword(body.password);
  try {
    await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
      },
    });
    return res.status(200).json({success: true});
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({error: "Error creating user", success: false});
  }
}
