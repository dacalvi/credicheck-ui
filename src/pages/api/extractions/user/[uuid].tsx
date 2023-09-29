import type {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {get} from "react-hook-form";
//import {ExtractionResponseType} from "functions/satws-sdk/types/ExtractionResponseType";
//import {createExtractionOnSatWs} from "functions/extractions";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {uuid} = req.query; // uuid is the client's uuid
  const client = await getClientExtractions(uuid);

  if (!client?.extractions || client.extractions.length === 0) {
    return res
      .status(404)
      .json({message: "Extraction Not found", success: false});
  }

  return res
    .status(200)
    .json({extractions: client?.extractions, success: true});
}

export async function getClientExtractions(uuid: any) {
  //get the client by uuid
  const client = await prisma.client.findUnique({
    select: {
      extractions: {
        select: {
          id: true,
          uuid: true,
          extractor: true,
          status: true,
        },
      },
    },
    where: {
      uuid: uuid as string,
    },
  });

  return client;
}

//save extraction status to database

/*
async function saveExtractionStatus(
  extractionId: string,
  extractionStatus: ExtractionResponseType
) {
  await prisma.extraction.update({
    where: {
      localId: extractionId,
    },
    data: {
      uuid: extractionStatus.id,
      taxPayerId: extractionStatus.taxpayer.id,
      taxPayerName: extractionStatus.taxpayer.name,
      taxPayerPersonType: extractionStatus.taxpayer.personType,
      //taxPayerRegistrationDate get the date part
      taxPayerRegistrationDate: new Date(
        extractionStatus.taxpayer.registrationDate
      ),
      extractor: extractionStatus.extractor,
      optionsTypes: extractionStatus.options.types
        ? extractionStatus.options.types.toString()
        : null,
      optionsPeriodFrom: extractionStatus.options.period
        ? new Date(extractionStatus.options.period.from)
        : null,
      optionsPeriodTo: extractionStatus.options.period
        ? new Date(extractionStatus.options.period.to)
        : null,
      optionsJson: JSON.stringify(extractionStatus.options),
      status: extractionStatus.status,
      startedAt: extractionStatus.startedAt,
      finishedAt: extractionStatus.finishedAt,
      rateLimitedAt: extractionStatus.rateLimitedAt,
      errorCode: extractionStatus.errorCode,
      createdDataPoints: extractionStatus.createdDataPoints,
      updatedDataPoints: extractionStatus.updatedDataPoints,
      createdAt: new Date(extractionStatus.createdAt),
      updatedAt: new Date(extractionStatus.updatedAt),
    },
  });
}
*/
