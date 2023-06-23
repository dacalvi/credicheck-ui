export type TaxStatusResponseType = {
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
  rfc: string;
  cif: number;
  person: Person;
  company: Company;
  email: string;
  phone: string;
  address: Address;
  economicActivities: EconomicActivity[];
  taxRegimes: TaxRegime[];
  obligations: Obligation[];
  startedOperationsAt: Date;
  status: string;
  statusUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  streetReferences: string[];
  streetNumber: string;
  buildingNumber: string;
  locality: string;
  municipality: string;
  postalCode: string;
  state: string;
  streetName: string;
  streetType: string;
  neighborhood: string;
  statusRaw: string;
};

export type Company = {
  legalName: string;
  tradeName: string;
  entityType: string;
};

export type EconomicActivity = {
  name: string;
  order: string;
  percentage: string;
  endDate: Date;
  startDate: Date;
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

export type Obligation = {
  description: string;
  dueDate: string;
  endDate: Date;
  startDate: Date;
};

export type Person = {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  curp: string;
};

export type TaxRegime = {
  name: string;
  endDate: Date;
  startDate: Date;
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
