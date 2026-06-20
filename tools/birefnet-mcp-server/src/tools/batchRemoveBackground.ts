import { promises as fs } from "node:fs";
import path from "node:path";
import { segmentBatch } from "../pythonRunner.js";
import {
  BatchRemoveBackgroundOptions,
  BatchRemoveBackgroundOutput,
  BirefnetModel,
} from "../types.js";

/** Segment every image in inputDir into outputDir. */
export const batchRemoveBackground = async (
  options: BatchRemoveBackgroundOptions,
): Promise<BatchRemoveBackgroundOutput> => {
  const { inputDir, outputDir, model, maxSide, overwrite } = options;

  const inStat = await fs.stat(inputDir).catch(() => null);
  if (!inStat || !inStat.isDirectory()) {
    throw new Error(`Input directory does not exist: ${inputDir}`);
  }
  await fs.mkdir(outputDir, { recursive: true });

  const result = await segmentBatch({ inputDir, outputDir, model, maxSide, overwrite });
  return {
    model: (model ?? "dynamic") as BirefnetModel,
    inputDir,
    outputDir,
    total: result.totalImages,
    succeeded: result.results.length,
    failed: result.failures.length,
    skipped: result.skipped,
    results: result.results.map((r) => ({
      inputPath: r.inputPath,
      outputPath: r.outputPath,
      model: (model ?? "dynamic") as BirefnetModel,
      width: r.width,
      height: r.height,
      elapsedSeconds: r.elapsedSeconds,
      outputBytes: r.outputBytes,
    })),
    failures: result.failures,
  };
};
