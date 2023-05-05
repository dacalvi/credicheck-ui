import {PrismaClient} from "@prisma/client";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    if (
      !req.body.email ||
      !req.body.cellPhone ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.rfc
    ) {
      return res
        .status(400)
        .json({message: "Missing input fields", success: false});
      //validate if email length is greater than 4
    } else if (req.body.email.length < 1) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    } else if (req.body.cellPhone.length < 1) {
      return res.status(400).json({
        message: "Cell Phone is required",
        success: false,
      });
    } else if (req.body.firstName.length < 1) {
      return res.status(400).json({
        message: "First Name is required",
        success: false,
      });
    } else if (req.body.lastName.length < 1) {
      return res.status(400).json({
        message: "Last Name is required",
        success: false,
      });
    } else if (req.body.rfc.length < 1) {
      return res.status(400).json({
        message: "RFC is required",
        success: false,
      });
    }

    return await createProspect(req, res);
  } else if (req.method === "GET") {
    const prospects = await getProspects();
    return res.status(200).json({prospects, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProspects() {
  const prospects = await prisma.client.findMany({
    select: {
      id: true,
      rfc: true,
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
  });
  return prospects;
}

async function createProspect(req: any, res: any) {
  const token = await getToken({req});
  if (token?.id) {
    const client = await prisma.client.create({
      data: {
        email: req.body.email,
        cellPhone: req.body.cellPhone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        rfc: req.body.rfc,
        owner: {
          connect: {
            id: Number(token?.id),
          },
        },
      },
    });

    if (req.body.startProcess) {
      await prisma.process.create({
        data: {
          state: "PENDING",
          client: {
            connect: {
              id: client.id,
            },
          },
          name: req.body.firstName + " " + req.body.lastName,
          description: "Initial process",
        },
      });
    }
  }

  return res.status(200).json({message: "Prospect created", success: true});
}
