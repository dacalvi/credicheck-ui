export type BalanceSheetResponseType = {
  [x: string]: number | string | Child[] | undefined;
  category: string;
  children: Child[];
};

export type Child = {
  [x: string]: number | string | Child[] | undefined;
  category: string;
  children?: Child[];
};
