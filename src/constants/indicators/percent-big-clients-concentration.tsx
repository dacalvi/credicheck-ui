import {Result} from "constants/values";

export const percentBigClientsConcentration = {
  id: 1,
  name: "% Concentracion con clientes mas importante",
  order: 0,
  sourceId: 1,
  source: {
    id: 1,
    name: "SAT.WS",
    order: 0,
  },
  associated_function: "percent-big-clients-concentration",
  defaultConfig: {
    segments: [5, 10],
    segmentResults: [Result.REJECT, Result.MANUAL, Result.SKIP],
    resultScores: [0, 50, 100],
  },
  config: "",
  checked: false,
};
