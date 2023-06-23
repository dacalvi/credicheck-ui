export type TrialBalanceResponseType = {
  data: Data;
};

export type Data = {
  periods: Periods;
  accounts: Accounts;
};

export type Accounts = {
  the100: The100;
};

export type Periods = {
  the202012: Periods202012;
};

export type Children = {
  the102: The100;
};

export type The100 = {
  code: string;
  description: string;
  trialBalance: TrialBalance;
  children?: Children;
};

export type TrialBalance = {
  the202012: TrialBalance202012;
};

export type TrialBalance202012 = {
  initialBalance: number;
  credits: number;
  debits: number;
  endingBalance: number;
};

export type Periods202012 = {
  year: number;
  month: number;
};
