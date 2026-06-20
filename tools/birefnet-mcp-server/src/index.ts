#!/usr/bin/env node

/**
 * BiRefNet MCP server.
 *
 * Exposes background-removal tools to Cursor / Claude / any MCP client.
 * Each tool call shells out to the Python CLI in `tools/birefnet.py`
 * (via `tools/activate-birefnet.sh`) and parses its structured stderr.
 *
 * Tool surface:
 *   - list-birefnet-models  → enumerate model variants
 *   - remove-background     → single image → RGBA PNG
 *   - batch-remove-background → directory of images → directory of PNGs
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  removeBackground,
  batchRemoveBackground,
  listBirefnetModels,
} from "./tools/index.js";
import {
  BirefnetModel,
  RemoveBackgroundOptions,
  BatchRemoveBackgroundOptions,
} from "./types.js";

const ModelEnum = z.enum([
  "dynamic",
  "portrait",
  "matting",
  "hr-matting",
  "hr",
  "dis",
  "lite",
]);

const RemoveBackgroundSchema = z.object({
  imagePath: z.string().describe("Absolute path to the source image (jpg, png, webp, heic, tiff, bmp)."),
  outputPath: z.string().describe("Absolute path to write the RGBA cutout. Always PNG — the file extension is forced."),
  model: ModelEnum.optional().describe("Model variant. Default 'dynamic' (any-resolution, best for real-world photos)."),
  maxSide: z.number().int().positive().optional().describe("Cap the longest input side to N pixels. Default: model's recommendation."),
});

const BatchRemoveBackgroundSchema = z.object({
  inputDir: z.string().describe("Absolute path to a directory of source images."),
  outputDir: z.string().describe("Absolute path to a directory of RGBA PNGs. Created if missing."),
  model: ModelEnum.optional().describe("Model variant. Default 'dynamic'."),
  maxSide: z.number().int().positive().optional().describe("Cap the longest input side to N pixels."),
  overwrite: z.boolean().optional().describe("Overwrite existing outputs (default: skip)."),
});

const server = new McpServer({
  name: "birefnet",
  version: "0.1.0",
});

server.tool(
  "list-birefnet-models",
  `List the BiRefNet model variants this server can load.
Each entry includes the HuggingFace repo, the default max input side, and a short note on when to use it.`,
  {},
  async () => {
    const models = listBirefnetModels();
    return {
      content: [
        { type: "text", text: `BiRefNet model variants:\n${JSON.stringify(models, null, 2)}` },
      ],
      models,
    };
  },
);

server.tool(
  "remove-background",
  `Remove the background from a single image and write an RGBA cutout (PNG).

The output's alpha channel is the BiRefNet matte, so it drops straight into the nikah-web asset pipeline (see tools/README.md). For multiple images, prefer batch-remove-background so the model is loaded only once.

Examples:
  - remove-background from /path/photo.jpg, save to /path/photo-cutout.png
  - extract a portrait with model='portrait', maxSide=1024`,
  RemoveBackgroundSchema.shape,
  async (opts: RemoveBackgroundOptions) => {
    const result = await removeBackground(opts);
    return {
      content: [
        {
          type: "text",
          text: `Background removed: ${result.inputPath} (${result.width}x${result.height}) -> ${result.outputPath} in ${result.elapsedSeconds.toFixed(2)}s (${(result.outputBytes/1024).toFixed(1)} KB, model=${result.model})`,
        },
      ],
      result,
    };
  },
);

server.tool(
  "batch-remove-background",
  `Remove backgrounds from every image in a directory.

Always prefer this over per-image calls when the user gives a folder. The model is loaded once and amortised across all images, so a 12-image prewedding batch finishes in ~3-4 minutes on M1 instead of ~12x the per-image startup cost.

Examples:
  - cut out everything in /Users/me/raw-photos/ into /Users/me/cutouts/
  - re-run with overwrite=true to force re-processing of existing outputs`,
  BatchRemoveBackgroundSchema.shape,
  async (opts: BatchRemoveBackgroundOptions) => {
    const result = await batchRemoveBackground(opts);
    return {
      content: [
        {
          type: "text",
          text: `Batch done: ${result.succeeded}/${result.total} succeeded, ${result.failed} failed, ${result.skipped} skipped (model=${result.model}, input=${result.inputDir}, output=${result.outputDir})`,
        },
      ],
      result,
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});

// Re-export model enum to keep TS happy if the file is tree-shaken.
export type { BirefnetModel };
