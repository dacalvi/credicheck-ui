import {Client, PrismaClient} from "@prisma/client";
import {createExtraction} from "functions/extractions";
import {generateUUID} from "functions/uuid";
import {getToken} from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    //validate that rfc, email and cellPhone are not empty
    if (!req.body.rfc || !req.body.email || !req.body.cellPhone) {
      return res.status(400).json({
        message: "Campos RFC, Email y Celular no deben estar vacios",
        success: false,
      });
    } else if (req.body.rfc.length === 12 && req.body.companyName.length < 1) {
      return res
        .status(400)
        .json({message: "Razon social no puede estar vacia", success: false});
    } else if (
      req.body.rfc.length === 13 &&
      (!req.body.firstName || !req.body.lastName)
    ) {
      return res.status(400).json({
        message: "Nombre y Apellido no pueden estar vacios",
        success: false,
      });
    } else if (req.body.rfc.length < 12 || req.body.rfc.length > 13) {
      return res
        .status(400)
        .json({message: "RFC debe tener 12 o 13 caracteres", success: false});
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
    } else if (req.body.rfc.length < 1) {
      return res.status(400).json({
        message: "RFC is required",
        success: false,
      });
    }
    return await createProspect(req, res);
  } else if (req.method === "GET") {
    const prospects = await getProspects(req, res);
    return res.status(200).json({prospects, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProspects(req: any, res: any) {
  const token = await getToken({req});
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  //supervisor
  if (token?.roleId === 2) {
    const supervisorProspects = await prisma.client.findMany({
      where: {
        owner: {
          companyId: Number(token?.companyId),
        },
      },
      select: {
        id: true,
        rfc: true,
        email: true,
        cellPhone: true,
        firstName: true,
        lastName: true,
        uuid: true,
        satwsid: true,
        companyName: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return supervisorProspects;
  }
  const prospects = await prisma.client.findMany({
    where: {
      owner: {
        id: Number(token?.id),
      },
    },
    select: {
      id: true,
      rfc: true,
      email: true,
      cellPhone: true,
      firstName: true,
      lastName: true,
      uuid: true,
      satwsid: true,
      companyName: true,
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
    const newProspect = await prisma.client.create({
      data: {
        email: req.body.email,
        cellPhone: req.body.cellPhone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        rfc: req.body.rfc,
        uuid: generateUUID(),
        companyName: req.body.companyName,
        owner: {
          connect: {
            id: Number(token?.id),
          },
        },
      },
    });

    createExtractions(newProspect, req);

    return res.status(200).json({
      message: "Prospect created",
      success: true,
      newProspect: newProspect,
    });
  } else {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
}

async function createExtractions(newProspect: Client, req: any) {
  const extractionFields = [
    "invoice",
    "annual_tax_return",
    "monthly_tax_return",
    "electronic_accounting",
    "rif_tax_return",
    "tax_compliance",
    "tax_status",
    "tax_retention",
  ];

  extractionFields.forEach(async (field) => {
    if (req.body["extraction_" + field] === true) {
      const newExtraction = await prisma.extraction.create({
        data: {
          taxPayerId: req.body.rfc,
          localId: generateUUID(),
          client: {
            connect: {
              id: newProspect.id,
            },
          },
          extractor: field,
        },
      });
      createExtraction(newExtraction.localId);
    }
  });
}
