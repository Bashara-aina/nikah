import { MODEL_REGISTRY } from "../pythonRunner.js";
import { ModelInfo } from "../types.js";

/** Return the list of available BiRefNet model variants. */
export const listBirefnetModels = (): ModelInfo[] =>
  MODEL_REGISTRY.map((m) => ({
    alias: m.alias as ModelInfo["alias"],
    hfRepo: m.hfRepo,
    maxSide: m.maxSide,
    note: m.note,
  }));
