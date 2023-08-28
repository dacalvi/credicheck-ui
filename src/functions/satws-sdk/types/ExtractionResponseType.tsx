export type ExtractionResponseType = {
  context: string;
  id: string;
  type: string;
  extractionResponseTypeID: string;
  taxpayer: Taxpayer;
  extractor: string;
  options: Options;
  status: string;
  startedAt: string;
  finishedAt: string;
  rateLimitedAt: string;
  errorCode: null;
  createdDataPoints: number;
  updatedDataPoints: number;
  createdAt: string;
  updatedAt: string;
};

export type Options = {
  types: string[];
  period: Period;
};

export type Period = {
  from: string;
  to: string;
};

export type Taxpayer = {
  id: string;
  type: string;
  taxpayerID: string;
  personType: string;
  registrationDate: string;
  name: string;
};
