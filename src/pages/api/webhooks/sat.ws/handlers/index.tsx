import {PrismaClient} from "@prisma/client";
import {createExtractions} from "functions/sat.ws/createExtractions";

async function credentialUpdated(payload: any) {
  const prisma = new PrismaClient();

  const {object} = payload;

  if (object.status === "valid") {
    const prospect = await prisma.client.findFirst({
      where: {
        satwsid: object.id,
      },
    });

    if (prospect) {
      const extractionsOfUser = await prisma.extraction.findMany({
        where: {
          clientId: prospect.id,
        },
      });

      if (extractionsOfUser.length === 0) {
        await createExtractions(prospect);
      }
    }
  }
}

function credentialCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("CREDENTIAL CREATED");
}

function linkUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("LINK UPDATED");
}

function extractionCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("EXTRACTION CREATED");
}

function extractionUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("EXTRACTION UPDATED");
}

function taxreturnCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX RETURN CREATED");
}

function fileCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("FILE CREATED");
}

function invoiceCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("INVOICE CREATED");
}

function invoicePaymentCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("INVOICE PAYMENT CREATED");
}

function exportCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("EXPORT CREATED");
}

function exportUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("EXPORT UPDATED");
}

function taxStatusCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX STATUS CREATED");
}

function taxStatusUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX STATUS UPDATED");
}

function taxComplianceCheckCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX COMPLIANCE CHECK CREATED");
}

function taxComplianceCheckUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX COMPLIANCE CHECK UPDATED");
}

function taxRetentionCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX RETENTION CREATED");
}

function taxRetentionUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("TAX RETENTION UPDATED");
}

function electronicAccountingRecordCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("ELECTRONIC ACCOUNTING RECORD CREATED");
}

function electronicAccountingRecordUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("ELECTRONIC ACCOUNTING RECORD UPDATED");
}

// eslint-disable-next-line @typescript-eslint/ban-types
const magicCall: {[K: string]: Function} = {
  "credential.updated": credentialUpdated,
  "credential.created": credentialCreated,
  "link.updated": linkUpdated,
  "extraction.created": extractionCreated,
  "extraction.updated": extractionUpdated,
  "tax_return.created": taxreturnCreated,
  "file.created": fileCreated,
  "invoice.created": invoiceCreated,
  "invoice_payment.created": invoicePaymentCreated,
  "export.created": exportCreated,
  "export.updated": exportUpdated,
  "tax_status.created": taxStatusCreated,
  "tax_status.updated": taxStatusUpdated,
  "tax_compliance_check.created": taxComplianceCheckCreated,
  "tax_compliance_check.updated": taxComplianceCheckUpdated,
  "tax_retention.created": taxRetentionCreated,
  "tax_retention.updated": taxRetentionUpdated,
  "electronic_accounting_record.created": electronicAccountingRecordCreated,
  "electronic_accounting_record.updated": electronicAccountingRecordUpdated,
};

export function webhookHandler(name: string, payload: any) {
  if (magicCall[name]) {
    return magicCall[name](payload);
  }

  throw new Error(`Method '${name}' is not implemented.`);
}
