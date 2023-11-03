import {Result} from "constants/values";

export const percentOfGrowYoy = {
  id: 1,
  name: "% de Crecimiento YoY",
  order: 0,
  sourceId: 1,
  source: {
    id: 1,
    name: "SAT.WS",
    order: 0,
  },
  associated_function: "percent-of-grow-yoy",
  defaultConfig: {
    segments: [5, 10],
    segmentResults: [Result.REJECT, Result.MANUAL, Result.SKIP],
    resultScores: [0, 50, 100],
  },
  config: "",
  checked: false,
};
