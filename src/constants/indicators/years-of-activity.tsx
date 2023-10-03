import {Result} from "constants/values";

export const yearsOfActivity = {
  id: 1,
  name: "Años de actividad",
  order: 0,
  sourceId: 1,
  source: {
    id: 1,
    name: "SAT.WS",
    order: 0,
  },
  associated_function: "years-of-activity",
  defaultConfig: {
    segments: [5, 10],
    segmentResults: [Result.REJECT, Result.MANUAL, Result.SKIP],
    resultScores: [0, 50, 100],
  },
  config: "",
};
