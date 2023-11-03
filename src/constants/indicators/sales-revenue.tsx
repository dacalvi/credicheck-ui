import {Result} from "constants/values";

export const salesRevenue = {
  name: "Monto Facturado últimos 12 meses",
  order: 0,
  sourceId: 1,
  source: {
    id: 1,
    name: "SAT.WS",
    order: 0,
  },
  associated_function: "sales-revenue",
  defaultConfig: {
    segments: [10, 30],
    segmentResults: [Result.REJECT, Result.SKIP, Result.SKIP],
    resultScores: [0, 50, 100],
  },
  config: "",
  checked: false,
};
