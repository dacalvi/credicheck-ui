export type ExtractorInvoiceOptions = {
  taxpayer: string;
  extractor: string;
  options: Options;
};

export type Options = {
  types: string[];
  period: Period;
};

export type Period = {
  from: Date;
  to: Date;
};
