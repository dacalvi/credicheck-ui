import {IFetchRequest, IFetchResponse, IMiddleware} from "@crazyfactory/tinka";

export class ApiKeyMiddleware
  implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>>
{
  apiKey = "";
  //create a constructor that receives the api key as a parameter
  // eslint-disable-next-line no-useless-constructor
  public constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public process(
    options: IFetchRequest,
    next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>
  ): Promise<IFetchResponse<any>> {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers = {
      "X-API-KEY": this.apiKey,
    };
    // eslint-disable-next-line no-console
    return next(options).then((response) => response);
  }
}
