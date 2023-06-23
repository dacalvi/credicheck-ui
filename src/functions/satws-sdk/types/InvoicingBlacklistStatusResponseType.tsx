export type InvoicingBlacklistStatusResponseType = {
  data: Data;
};

export type Data = {
  issued: Issued[];
  received: Issued[];
};

export type Issued = {
  invoices: number;
  taxpayer: Taxpayer;
};

export type Taxpayer = {
  rfc: string;
  name: string;
  blacklistStatus: string;
};
