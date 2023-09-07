import {IFetchRequest, IFetchResponse, IMiddleware} from "@crazyfactory/tinka";

export class CacheMiddleware
  implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>>
{
  public process(
    options: IFetchRequest,
    next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>
  ) {
    return next(options).then(async (response) => {
      return response.json();
    });
  }
}
