export type AssociatedFunctionResponseType = {
  processId: number;
  uuid: string;
  result: string;
  score: number;
  result_explanation?: string;
} | null;
