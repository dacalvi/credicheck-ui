export type WebhookPayloadType = {
  sat_ws_url: string;
  sat_ws_api_key: string;
  id?: string;
  url?: string;
  events?: any[];
  enabled?: boolean;
  page?: number;
  itemsPerPage?: number;
};
