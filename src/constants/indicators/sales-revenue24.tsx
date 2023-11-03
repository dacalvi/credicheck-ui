import {Result} from "constants/values";

export const salesRevenue24 = {
  name: "Monto Facturado últimos 24 meses",
  order: 0,
  sourceId: 1,
  source: {
    id: 1,
    name: "SAT.WS",
    order: 0,
  },
  associated_function: "sales-revenue24",
  defaultConfig: {
    segments: [5, 10],
    segmentResults: [Result.REJECT, Result.MANUAL, Result.SKIP],
    resultScores: [0, 50, 100],
  },
  config: "",
  checked: false,
};
