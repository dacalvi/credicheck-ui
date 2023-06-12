export type SalesRevenueResponseType = {
  data: Datum[];
  stats: Stat[];
};

export type Datum = {
  mxnAmount: number;
  groupName: string;
  date: string;
  dateLabel: string;
  transactions: number;
};

export type Stat = {
  total: number;
  hits: number;
  date: string;
  dateLabel: string;
};
