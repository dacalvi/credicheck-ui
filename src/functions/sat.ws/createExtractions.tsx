import {Client, PrismaClient} from "@prisma/client";
import {createExtraction} from "functions/extractions";
import {generateUUID} from "functions/uuid";

const prisma = new PrismaClient();

export async function createExtractions(newProspect: Client) {
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
    const newExtraction = await prisma.extraction.create({
      data: {
        taxPayerId: newProspect.rfc,
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
  });
}
