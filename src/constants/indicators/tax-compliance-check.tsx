import {Result} from "constants/values";

export const taxComplianceCheck = {
  id: 1,
  name: "Opinion de cumplimiento",
  order: 0,
  sourceId: 1,
  source: {
    id: 1,
    name: "SAT.WS",
    order: 0,
  },
  associated_function: "tax-compliance-check",
  defaultConfig: {
    segments: [5, 10],
    segmentResults: [Result.REJECT, Result.MANUAL, Result.SKIP],
    resultScores: [0, 50, 100],
  },
  config: "",
  checked: false,
};
