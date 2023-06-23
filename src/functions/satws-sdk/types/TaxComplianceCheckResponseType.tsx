export type TaxComplianceCheckResponseType = {
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
  file: File;
  internalIdentifier: string;
  taxpayer: Taxpayer;
  result: string;
  checkedAt: Date;
  createdAt: Date;
};

export type File = {
  id: string;
  type: string;
  fileID: string;
  fileType: string;
  resource: string;
  mimeType: string;
  extension: string;
  size: number;
  filename: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Taxpayer = {
  rfc: string;
  name: string;
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
