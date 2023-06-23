import {Service, Client, ContentTypeMiddleware} from "@crazyfactory/tinka";
import {InsightsNode} from "./insights";
import {WrapMiddleware} from "./customMiddlewares/WrapMiddleware";
import {ApiKeyMiddleware} from "./customMiddlewares/ApiKeyMiddleware";
import {TaxStatusNode} from "./tax-status";
import {TaxPayersNode} from "./taxpayers";

export class SatwsSdk extends Service {
  public static instance: SatwsSdk | null = null;
  apiKey = "";
  public static getInstance(baseUrl: string, apiKey: string): SatwsSdk {
    if (SatwsSdk.instance === null) {
      SatwsSdk.instance = SatwsSdk.createSdk(baseUrl, apiKey);
    }
    return SatwsSdk.instance;
  }

  public static createSdk(baseUrl: string, apiKey: string): SatwsSdk {
    const client = new Client({baseUrl});
    client.addMiddleware(new WrapMiddleware());
    client.addMiddleware(new ContentTypeMiddleware());
    client.addMiddleware(new ApiKeyMiddleware(apiKey));
    return new SatwsSdk(client);
  }

  public get insights(): InsightsNode {
    return new InsightsNode(this.client);
  }

  public get taxStatus(): TaxStatusNode {
    return new TaxStatusNode(this.client);
  }

  public get taxPayers(): TaxPayersNode {
    return new TaxPayersNode(this.client);
  }
}
