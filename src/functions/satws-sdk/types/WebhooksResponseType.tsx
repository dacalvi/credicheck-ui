export type WebhooksResponseType = {
  context: string;
  id: string;
  type: string;
  "hydra:member": HydraMember[];
  hydraTotalItems: number;
  hydraView: HydraView;
  hydraSearch: HydraSearch;
};

export type HydraMember = {
  id: string;
  type: string;
  hydraMemberID: string;
  url: string;
  signingSecret?: string;
  events: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type HydraSearch = {
  type: string;
  hydraTemplate: string;
  hydraVariableRepresentation: string;
  hydraMapping: HydraMapping[];
};

export type HydraMapping = {
  type: string;
  variable: string;
  property: string;
  required: boolean;
};

export type HydraView = {
  id: string;
  type: string;
  hydraFirst: string;
  hydraNext: string;
  hydraLast: string;
};
