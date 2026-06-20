import { promises as fs } from "node:fs";
import path from "node:path";
import { segmentOne } from "../pythonRunner.js";
import { RemoveBackgroundOptions, RemoveBackgroundOutput } from "../types.js";

/** Segment a single image and write a clean RGBA cutout. */
export const removeBackground = async (
  options: RemoveBackgroundOptions,
): Promise<RemoveBackgroundOutput> => {
  const { imagePath, outputPath, model, maxSide } = options;

  if (!(await fileExists(imagePath))) {
    throw new Error(`Image file does not exist: ${imagePath}`);
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const result = await segmentOne({ inputPath: imagePath, outputPath, model, maxSide });
  return {
    inputPath: imagePath,
    outputPath: result.outputPath,
    model: (model ?? "dynamic") as RemoveBackgroundOutput["model"],
    width: result.width,
    height: result.height,
    elapsedSeconds: result.elapsedSeconds,
    outputBytes: result.outputBytes,
  };
};

async function fileExists(p: string): Promise<boolean> {
  try {
    const s = await fs.stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}
