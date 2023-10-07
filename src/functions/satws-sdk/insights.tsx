import {Service} from "@crazyfactory/tinka";
import {SalesRevenueResponseType} from "./types/SalesRevenueResponseType";
import {BalanceSheetResponseType} from "./types/BalanceSheetResponseType";
import {InvoicingBlacklistStatusResponseType} from "./types/InvoicingBlacklistStatusResponseType";
import {CustomerConcentrationResponseType} from "./types/CustomerConcentrationResponseType";

export class InsightsNode extends Service {
  public getSalesRevenue(
    rfc: string,
    from?: string,
    to?: string,
    periodicity?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly",
    type?:
      | "total"
      | "currency"
      | "customers"
      | "export"
      | "customer-type"
      | "payment-type"
      | "products"
  ): Promise<SalesRevenueResponseType> {
    //create a query string with the parameters from, to, periodicity and type if they are not undefined
    let query = "";
    if (from) {
      query += `options[from]=${from}`;
    }
    if (to) {
      query += `&options[to]=${to}`;
    }
    if (periodicity) {
      query += `&options[periodicity]=${periodicity}`;
    }
    if (type) {
      query += `&options[type]=${type}`;
    }
    return this.client.process({
      url: `/insights/${rfc}/sales-revenue?${query}`,
      method: "GET",
    });
  }

  public getBalanceSheet(
    rfc: string,
    from?: string,
    to?: string
  ): Promise<BalanceSheetResponseType> {
    //create a query string with the parameters from, to, periodicity and type if they are not undefined
    let query = "";
    if (from) {
      query += `options[from]=${from}`;
    }
    if (to) {
      query += `&options[to]=${to}`;
    }
    return this.client.process({
      url: `/insights/${rfc}/balance-sheet?${query}`,
      method: "GET",
    });
  }

  public getInvoicingBlacklistStatus(
    rfc: string,
    from?: string,
    to?: string
  ): Promise<InvoicingBlacklistStatusResponseType> {
    //create a query string with the parameters from, to, periodicity and type if they are not undefined
    let query = "";
    if (from) {
      query += `options[from]=${from}`;
    }
    if (to) {
      query += `&options[to]=${to}`;
    }
    return this.client.process({
      url: `/insights/${rfc}/invoicing-blacklist?${query}`,
      method: "GET",
    });
  }

  public getTrialBalance(
    rfc: string,
    from?: string,
    to?: string,
    periodicity?: "monthly" | "yearly"
  ) {
    //create a query string with the parameters from, to, periodicity and type if they are not undefined
    let query = "";
    if (from) {
      query += `options[from]=${from}`;
    }
    if (to) {
      query += `&options[to]=${to}`;
    }
    if (periodicity) {
      query += `&options[periodicity]=${periodicity}`;
    }
    return this.client.process({
      url: `/insights/${rfc}/trial-balance?${query}`,
      method: "GET",
    });
  }

  public getCustomerConcentration(
    rfc: string,
    from?: string,
    to?: string
  ): Promise<CustomerConcentrationResponseType> {
    //create a query string with the parameters from, to, periodicity and type if they are not undefined
    let query = "";
    if (from) {
      query += `options[from]=${from}`;
    }
    if (to) {
      query += `&options[to]=${to}`;
    }
    return this.client.process({
      url: `/insights/${rfc}/customer-concentration?${query}`,
      method: "GET",
    });
  }
}
