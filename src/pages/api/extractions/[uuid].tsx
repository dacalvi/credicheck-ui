import type {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {ExtractionResponseType} from "functions/satws-sdk/types/ExtractionResponseType";
import {createExtractionOnSatWs} from "functions/extractions";

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

  if (extractionRecord.extractor === "invoice") {
    const options = {
      types: ["I", "E", "P", "N", "T"],
      period: {
        from: new Date("2019-01-01"),
        to: new Date(),
      },
      issued: true,
      received: true,
      xml: true,
      pdf: true,
      complement: -1,
    };
    const extractionStatus: ExtractionResponseType =
      await createExtractionOnSatWs(
        extractionRecord.taxPayerId,
        extractionRecord.extractor,
        options
      );
    await saveExtractionStatus(uuid as string, extractionStatus);
    return res.status(200).json({uuid, success: true});
  }

  if (
    extractionRecord.extractor === "monthly_tax_return" ||
    extractionRecord.extractor === "annual_tax_return" ||
    extractionRecord.extractor === "electronic_accounting" ||
    extractionRecord.extractor === "rif_tax_return"
  ) {
    const options = {
      period: {
        from: new Date("2019-01-01"),
        to: new Date(),
      },
    };
    const extractionStatus: ExtractionResponseType =
      await createExtractionOnSatWs(
        extractionRecord.taxPayerId,
        extractionRecord.extractor,
        options
      );
    await saveExtractionStatus(uuid as string, extractionStatus);
    return res.status(200).json({uuid, success: true});
  }

  if (
    extractionRecord.extractor === "tax_status" ||
    extractionRecord.extractor === "tax_compliance"
  ) {
    const extractionStatus: ExtractionResponseType =
      await createExtractionOnSatWs(
        extractionRecord.taxPayerId,
        extractionRecord.extractor,
        {}
      );
    await saveExtractionStatus(uuid as string, extractionStatus);
    return res.status(200).json({uuid, success: true});
  }

  if (extractionRecord.extractor === "tax_retention") {
    const options = {
      period: {
        from: new Date("2019-01-01"),
        to: new Date(),
      },
      issued: true,
      received: true,
      xml: true,
      pdf: true,
      complement: -1,
    };
    const extractionStatus: ExtractionResponseType =
      await createExtractionOnSatWs(
        extractionRecord.taxPayerId,
        extractionRecord.extractor,
        options
      );
    await saveExtractionStatus(uuid as string, extractionStatus);
    return res.status(200).json({uuid, success: true});
  }

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
