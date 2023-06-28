import {Service, Client, ContentTypeMiddleware} from "@crazyfactory/tinka";
import {WrapMiddleware} from "./customMiddlewares/WrapMiddleware";
import {ApiKeyMiddleware} from "./customMiddlewares/ApiKeyMiddleware";

export class MoffinSdk extends Service {
  public static instance: MoffinSdk | null = null;
  apiKey = "";
  public static getInstance(baseUrl: string, apiKey: string): MoffinSdk {
    if (MoffinSdk.instance === null) {
      MoffinSdk.instance = MoffinSdk.createSdk(baseUrl, apiKey);
    }
    return MoffinSdk.instance;
  }

  public static createSdk(baseUrl: string, apiKey: string): MoffinSdk {
    const client = new Client({baseUrl});
    client.addMiddleware(new WrapMiddleware());
    client.addMiddleware(new ContentTypeMiddleware());
    client.addMiddleware(new ApiKeyMiddleware(apiKey));
    return new MoffinSdk(client);
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
