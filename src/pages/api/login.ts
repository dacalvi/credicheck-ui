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
    } else {
      return await validateCredentials(req, res);
    }
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function validateCredentials(req, res) {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
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
      return res.status(200).json({username: user.username, success: true});
    }
  }
}
