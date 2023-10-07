import {Service} from "@crazyfactory/tinka";
import {TaxComplianceCheckResponseType} from "./types/TaxComplianceCheckResponseType";

export class TaxPayersNode extends Service {
  public getTaxComplianceCheck(
    rfc: string,
    internalIdentifier?: string,
    taxPayerRfc?: string,
    taxPayerName?: string,
    result?: string,
    checkedAtBefore?: string,
    checkedAtStrictlyBefore?: string,
    checkedAtAfter?: string,
    checkedAtStrictlyAfter?: string,
    createdAtBefore?: string,
    createdAtStrictlyBefore?: string,
    createdAtAfter?: string,
    createdAtStrictlyAfter?: string,
    orderCreatedAt?: string,
    page?: number,
    itemsPerPage?: number
  ): Promise<TaxComplianceCheckResponseType> {
    //create a query string with all the parameters except rfc
    let query = "";
    if (internalIdentifier) {
      query += `internalIdentifier=${internalIdentifier}`;
    }
    if (taxPayerRfc) {
      query += `&taxpayer.rfc=${taxPayerRfc}`;
    }
    if (taxPayerName) {
      query += `&taxpayer.name=${taxPayerName}`;
    }
    if (result) {
      query += `&result=${result}`;
    }
    if (checkedAtBefore) {
      query += `&checkedAt[before]=${checkedAtBefore}`;
    }
    if (checkedAtStrictlyBefore) {
      query += `&checkedAt[strictly_before]=${checkedAtStrictlyBefore}`;
    }
    if (checkedAtAfter) {
      query += `&checkedAt[after]=${checkedAtAfter}`;
    }
    if (checkedAtStrictlyAfter) {
      query += `&checkedAt[strictly_after]=${checkedAtStrictlyAfter}`;
    }
    if (createdAtBefore) {
      query += `&createdAt[before]=${createdAtBefore}`;
    }
    if (createdAtStrictlyBefore) {
      query += `&createdAt[strictly_before]=${createdAtStrictlyBefore}`;
    }
    if (createdAtAfter) {
      query += `&createdAt[after]=${createdAtAfter}`;
    }
    if (createdAtStrictlyAfter) {
      query += `&createdAt[strictly_after]=${createdAtStrictlyAfter}`;
    }
    if (orderCreatedAt) {
      query += `&order[createdAt]=${orderCreatedAt}`;
    }
    if (page) {
      query += `&page=${page}`;
    }
    if (itemsPerPage) {
      query += `&itemsPerPage=${itemsPerPage}`;
    }

    return this.client.process({
      url: `/taxpayers/${rfc}/tax-compliance-checks?${query}`,
    });
  }
}
