import type {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {SatwsSdk} from "functions/satws-sdk";
import {ExtractionResponseType} from "functions/satws-sdk/types/ExtractionResponseType";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {uuid} = req.query;

  const extractionRecord = await prisma.extraction.findUnique({
    select: {
      id: true,
      extractor: true,
      taxPayerId: true,
    },
    where: {
      localId: uuid as string,
    },
  });

  if (!extractionRecord) {
    return res
      .status(404)
      .json({message: "Extraction Not found", success: false});
  }

  const sdk = SatwsSdk.getInstance(
    `${process.env.SAT_WS_URL}`,
    `${process.env.SAT_WS_API_KEY}`
  );

  const extractionStatus: ExtractionResponseType =
    await sdk.extractions.createExtraction(
      extractionRecord.taxPayerId,
      extractionRecord.extractor,
      {}
    );
  await saveExtractionStatus(uuid as string, extractionStatus);
  return res.status(200).json({uuid, success: true});
  // fail: res.status(400).send();
}

//save extraction status to database
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
