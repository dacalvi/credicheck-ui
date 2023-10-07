import {Service} from "@crazyfactory/tinka";
import {TaxStatusResponseType} from "./types/TaxStatusResponseType";

export class TaxStatusNode extends Service {
  public getTaxStatus(rfc: string): Promise<TaxStatusResponseType> {
    return this.client.process({
      url: `/taxpayers/${rfc}/tax-status`,
    });
  }
}
