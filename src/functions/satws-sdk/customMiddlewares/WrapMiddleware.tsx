import {IFetchRequest, IFetchResponse, IMiddleware} from "@crazyfactory/tinka";

export class WrapMiddleware
  implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>>
{
  public process(
    options: IFetchRequest,
    next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>
  ): Promise<IFetchResponse<any>> {
    return next(options).then((response) => response.json());
  }
}
