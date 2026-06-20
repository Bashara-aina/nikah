type BirefnetModel = "dynamic" | "portrait" | "matting" | "hr-matting" | "hr" | "dis" | "lite";

interface ModelInfo {
  alias: BirefnetModel;
  hfRepo: string;
  maxSide: number;
  note: string;
}

interface RemoveBackgroundOptions {
  /** Absolute path to the source image (jpg, png, webp, heic, ...). */
  imagePath: string;
  /** Absolute path to write the RGBA cutout (always PNG). */
  outputPath: string;
  /** Model variant. Default: `dynamic` (any-resolution, best for real-world photos). */
  model?: BirefnetModel;
  /** Cap the longest input side to N pixels. Default: model's recommendation. */
  maxSide?: number;
}

interface BatchRemoveBackgroundOptions {
  /** Absolute path to a directory of source images (jpg/png/webp/heic/...). */
  inputDir: string;
  /** Absolute path to a directory of RGBA cutouts. Created if missing. */
  outputDir: string;
  /** Model variant. Default: `dynamic`. */
  model?: BirefnetModel;
  /** Cap the longest input side to N pixels. Default: model's recommendation. */
  maxSide?: number;
  /** Overwrite existing outputs (default: skip). */
  overwrite?: boolean;
}

interface RemoveBackgroundOutput {
  inputPath: string;
  outputPath: string;
  model: BirefnetModel;
  width: number;
  height: number;
  elapsedSeconds: number;
  outputBytes: number;
}

interface BatchRemoveBackgroundOutput {
  model: BirefnetModel;
  inputDir: string;
  outputDir: string;
  total: number;
  succeeded: number;
  failed: number;
  skipped: number;
  results: RemoveBackgroundOutput[];
  failures: { inputPath: string; error: string }[];
}

type ToolName = "list-birefnet-models" | "remove-background" | "batch-remove-background";

export {
  BirefnetModel,
  ModelInfo,
  RemoveBackgroundOptions,
  BatchRemoveBackgroundOptions,
  RemoveBackgroundOutput,
  BatchRemoveBackgroundOutput,
  ToolName,
};
