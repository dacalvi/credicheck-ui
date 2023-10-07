import {PrismaClient} from "@prisma/client";

export async function invoiceCreated(payload: any) {
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
