export type CustomerConcentrationResponseType = {
  data: CustomerConcentrationItem[];
};

export type CustomerConcentrationItem = {
  name: string;
  rfc: string;
  total: number;
  share: number;
  transactions: Transaction[];
};

export type Transaction = {
  date: string;
  total: number;
};
