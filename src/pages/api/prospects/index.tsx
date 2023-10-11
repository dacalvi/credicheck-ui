import {PrismaClient} from "@prisma/client";
import {RoleList} from "constants/roles";
import {getTokenInfo} from "functions/helpers/getTokenInfo";
import {isRole} from "functions/helpers/isRole";

import {generateUUID} from "functions/uuid";

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
  //TODO: Refactor Candidate
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);

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
        credentials_status: true,
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
      credentials_status: true,
    },
  });
  return prospects;
}

async function createProspect(req: any, res: any) {
  const isRoleValid = await isRole(req, [
    RoleList.SUPERVISOR,
    RoleList.SUPER,
    RoleList.AGENTE,
  ]);
  if (!isRoleValid) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const token = await getTokenInfo(req);

  if (token?.id) {
    const newProspect = await prisma.client.create({
      data: {
        email: req.body.email,
        cellPhone: req.body.cellPhone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        createReportId: Number(req.body.indicatorTemplate),
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

    return res.status(200).json({
      message: "Prospect created",
      success: true,
      newProspect: newProspect,
    });
  } else {
    return res.status(401).json({message: "Unauthorized", success: false});
  }
}
