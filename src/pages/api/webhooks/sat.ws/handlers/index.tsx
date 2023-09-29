import {PrismaClient} from "@prisma/client";
import {createExtractions} from "functions/sat.ws/createExtractions";

async function credentialUpdated(payload: any) {
  const prisma = new PrismaClient();

  const {object} = payload;

  const prospect = await prisma.client.findFirst({
    where: {
      satwsid: object.id,
    },
  });

  if (prospect) {
    await prisma.client.update({
      where: {
        id: prospect.id,
      },
      data: {
        credentials_status: object.status,
      },
    });
  }

  if (prospect) {
    const extractionsOfUser = await prisma.extraction.findMany({
      where: {
        clientId: prospect.id,
      },
    });

    if (object.status === "valid") {
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
  console.log("WEBHOOK: CREDENTIAL CREATED");
}

function linkUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: LINK UPDATED");
}

function extractionCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: EXTRACTION CREATED");
}

async function extractionUpdated(payload: any) {
  const {object} = payload;
  const prisma = new PrismaClient();
  await prisma.extraction.update({
    where: {
      uuid: object.id,
    },
    data: {
      status: object.status,
    },
  });
}

function taxreturnCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX RETURN CREATED");
}

function fileCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: FILE CREATED");
}

async function invoiceCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: INVOICE CREATED");
  const prisma = new PrismaClient();
  await prisma.invoice.create({
    data: {
      uuid: payload.object.invoice.uuid,
      pac: payload.object.invoice.pac,
      pdf: payload.object.invoice.pdf,
      tax: payload.object.invoice.tax,
      xml: payload.object.invoice.xml,
      type: payload.object.invoice.type,
      total: payload.object.invoice.total,
      usage: payload.object.invoice.usage,
      status: payload.object.invoice.status,
      version: payload.object.invoice.version,
      currency: payload.object.invoice.currency,
      discount: payload.object.invoice.discount,
      isIssuer: payload.object.invoice.isIssuer,
      issuedAt: payload.object.invoice.issuedAt,
      subtotal: payload.object.invoice.subtotal,
      dueAmount: payload.object.invoice.dueAmount,
      reference: payload.object.invoice.reference,
      canceledAt: payload.object.invoice.canceledAt,
      isReceiver: payload.object.invoice.isReceiver,
      paidAmount: payload.object.invoice.paidAmount,
      certifiedAt: payload.object.invoice.certifiedAt,
      fullyPaidAt: payload.object.invoice.fullyPaidAt,
      paymentType: payload.object.invoice.paymentType,
      exchangeRate: payload.object.invoice.exchangeRate,
      placeOfIssue: payload.object.invoice.placeOfIssue,
      paymentMethod: payload.object.invoice.paymentMethod,
      internalIdentifier: payload.object.invoice.internalIdentifier,
      subtotalCreditedAmount: payload.object.invoice.subtotalCreditedAmount,
      cancellationStatus: "",
      cancellationProcessStatus: "",
      issuerName: "",
      receiverRfc: "",
      receiverName: "",
      creditedAmount: "",
      lastPaymentDate: "",
      issuerRfc: "",
      appliedTaxes: "",
      totalTransferredTaxes: "",
      transferredLocalTaxes: "",
      transferredValueAddedTax: "",
      transferredSinTax: "",
      totalRetainedTaxes: "",
      retainedLocalTaxes: "",
      retainedValueAddedTax: "",
      retainedIncomeTax: "",
      retainedSinTax: "",
    },
  });
}

function invoicePaymentCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: INVOICE PAYMENT CREATED");
}

function exportCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: EXPORT CREATED");
}

function exportUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: EXPORT UPDATED");
}

function taxStatusCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX STATUS CREATED");
}

function taxStatusUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX STATUS UPDATED");
}

function taxComplianceCheckCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX COMPLIANCE CHECK CREATED");
}

function taxComplianceCheckUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX COMPLIANCE CHECK UPDATED");
}

function taxRetentionCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX RETENTION CREATED");
}

function taxRetentionUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: TAX RETENTION UPDATED");
}

function electronicAccountingRecordCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: ELECTRONIC ACCOUNTING RECORD CREATED");
}

function electronicAccountingRecordUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: ELECTRONIC ACCOUNTING RECORD UPDATED");
}

function invoiceLineItemCreated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: INVOICE LINE ITEM CREATED");
}

function invoiceUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: INVOICE UPDATED");
}

function invoicePaymentUpdated(payload: any) {
  // eslint-disable-next-line no-console
  console.log(payload);
  // eslint-disable-next-line no-console
  console.log("WEBHOOK: INVOICE PAYMENT UPDATED");
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
  "invoice_payment.updated": invoicePaymentUpdated,
  "invoice.updated": invoiceUpdated,
  "invoice_line_item.created": invoiceLineItemCreated,
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
