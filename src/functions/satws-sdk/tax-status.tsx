import {Service} from "@crazyfactory/tinka";
import {TaxStatusResponseType} from "./types/TaxStatusResponseType";

export class TaxStatusNode extends Service {
  public getTaxStatus(rfc: string): Promise<TaxStatusResponseType> {
    // eslint-disable-next-line no-console
    console.log("query", `/taxpayers/${rfc}/tax-status`);
    return this.client.process({
      url: `/taxpayers/${rfc}/tax-status`,
    });
  }
}
