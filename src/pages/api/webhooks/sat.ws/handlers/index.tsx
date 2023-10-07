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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function credentialCreated(payload: any) {
  //TODO: Implement WEBHOOK: CREDENTIAL CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function linkUpdated(payload: any) {
  // TODO: Implement WEBHOOK: LINK UPDATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractionCreated(payload: any) {
  //TODO: Implement WEBHOOK: EXTRACTION CREATED
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxreturnCreated(payload: any) {
  //TODO: implement WEBHOOK: TAX RETURN CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fileCreated(payload: any) {
  //TODO: implement WEBHOOK: FILE CREATED
}

async function invoiceCreated(payload: any) {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function invoicePaymentCreated(payload: any) {
  //TODO: implement WEBHOOK: INVOICE PAYMENT CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exportCreated(payload: any) {
  //TODO: implement WEBHOOK: EXPORT CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exportUpdated(payload: any) {
  //TODO: implement WEBHOOK: EXPORT UPDATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxStatusCreated(payload: any) {
  //TODO: implement WEBHOOK: TAX STATUS CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxStatusUpdated(payload: any) {
  //TODO: implement WEBHOOK: TAX STATUS UPDATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxComplianceCheckCreated(payload: any) {
  //TODO: implement WEBHOOK: TAX COMPLIANCE CHECK CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxComplianceCheckUpdated(payload: any) {
  //TODO: implement WEBHOOK: TAX COMPLIANCE CHECK UPDATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxRetentionCreated(payload: any) {
  //TODO: implement WEBHOOK: TAX RETENTION CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function taxRetentionUpdated(payload: any) {
  //TODO: implement WEBHOOK: TAX RETENTION UPDATED
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
function electronicAccountingRecordCreated(payload: any) {
  //TODO: implement WEBHOOK: ELECTRONIC ACCOUNTING RECORD CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function electronicAccountingRecordUpdated(payload: any) {
  //TODO: implement WEBHOOK: ELECTRONIC ACCOUNTING RECORD UPDATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function invoiceLineItemCreated(payload: any) {
  //TODO: implement WEBHOOK: INVOICE LINE ITEM CREATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function invoiceUpdated(payload: any) {
  //TODO: implement WEBHOOK: INVOICE UPDATED
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function invoicePaymentUpdated(payload: any) {
  //TODO: implement WEBHOOK: INVOICE PAYMENT UPDATED
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
