export type StepType = {
  id: number;
  name: string;
  description: string;
  uuid: string;
  process: {
    id: number;
    client: {
      rfc: string;
    };
  };
  indicator: {
    id: number;
    associated_function: string;
  };
};
