import {IFetchResponse, Service} from "@crazyfactory/tinka";
import {SalesRevenueResponseType} from "./types/SalesRevenueResponseType";

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
  ): Promise<IFetchResponse<SalesRevenueResponseType>> {
    //create a query string with the parameters from, to, periodicity and type if they are not undefined
    let query = "";
    if (from) {
      query += `from=${from}`;
    }
    if (to) {
      query += `&to=${to}`;
    }
    if (periodicity) {
      query += `&periodicity=${periodicity}`;
    }
    if (type) {
      query += `&type=${type}`;
    }
    return this.client.process({
      url: `/insights/${rfc}/sales-revenue?${query}`,
    });
  }
}
