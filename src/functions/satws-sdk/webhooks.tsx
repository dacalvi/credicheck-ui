import {Service} from "@crazyfactory/tinka";
import {WebhooksResponseType} from "./types/WebhooksResponseType";

export class WebhooksNode extends Service {
  public getWebHooks(
    url?: string,
    events?: string[],
    enabled?: boolean,
    page?: number,
    itemsPerPage?: number
  ): Promise<WebhooksResponseType> {
    //create a query string with all the parameters
    let query = "";
    if (url) {
      query += `url=${url}&`;
    }
    if (events) {
      query += `event=${events}&`;
    }
    if (enabled) {
      query += `enabled=${enabled}&`;
    }
    if (page) {
      query += `page=${page}&`;
    }
    if (itemsPerPage) {
      query += `itemsPerPage=${itemsPerPage}&`;
    }
    // eslint-disable-next-line no-console
    console.log("query", `/webhook-endpoints?${query}`);
    return this.client.process({
      url: `/webhook-endpoints?${query}`,
    });
  }

  public updateWebHook(
    id: string,
    url: string,
    events: [],
    enabled: boolean
  ): Promise<WebhooksResponseType> {
    const payload = {
      url: url,
      enabled: enabled,
    };

    // eslint-disable-next-line no-console
    console.log("payload", payload);

    // eslint-disable-next-line no-console
    console.log("query", `/webhook-endpoints/${id}`);
    return this.client.process({
      url: `/webhook-endpoints/${id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
  }

  public deleteWebHook(id: string): Promise<WebhooksResponseType> {
    // eslint-disable-next-line no-console
    console.log("query", `/webhook-endpoints/${id}`);
    return this.client.process({
      url: `/webhook-endpoints/${id}`,
      method: "DELETE",
    });
  }
}
