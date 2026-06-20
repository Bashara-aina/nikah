/** Shared data types. Mirror lib/validation.ts (zod). */

export type Kehadiran = "hadir" | "tidak" | "diusahakan";

export interface RsvpInput {
  to?: string;
  nama: string;
  kehadiran: Kehadiran;
  jumlah: number;
  pesan?: string;
  hp?: string;
  t: number;
}

export interface WishInput {
  nama: string;
  pesan: string;
  hp?: string;
  t: number;
}

export interface Wish {
  nama: string;
  pesan: string;
  ts: number;
}

export interface Guest {
  nama: string;
  slug?: string;
  grup?: string;
}

/** API response envelope (SPEC 03 §2, SPEC 10 §consistency). */
export interface ApiOk<T> {
  ok: true;
  data?: T;
}
export interface ApiErr {
  ok: false;
  error: string;
  fields?: Record<string, string>;
}
export type ApiResponse<T = unknown> = ApiOk<T> | ApiErr;

/** MiniMax image generation (NIKAH-MASTER-TECHSTACK.md §7). */
export type MinimaxAspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
export type MinimaxResponseFormat = "url" | "b64_json";

export interface MinimaxImageRequest {
  model: "image-01";
  prompt: string;
  aspect_ratio: MinimaxAspectRatio;
  n: 1 | 2 | 3 | 4;
  response_format: MinimaxResponseFormat;
}

export interface MinimaxImageDataItem {
  url?: string;
  b64_json?: string;
}

export interface MinimaxImageResponse {
  images: MinimaxImageDataItem[];
}

/** MiniMax image-to-video. The provider returns a `task_id`; the caller
 *  polls until status is Success/Fail. Model names match the MiniMax
 *  public docs (image-01 / image-01-live for stills; MiniMax-Hailuo-* and
 *  I2V-01-* for video). */
export type MinimaxVideoModel =
  | "MiniMax-Hailuo-2.3"
  | "MiniMax-Hailuo-2.3-Fast"
  | "MiniMax-Hailuo-02"
  | "I2V-01-Director"
  | "I2V-01-live"
  | "I2V-01";

export interface MinimaxVideoCreateRequest {
  model: MinimaxVideoModel;
  first_frame_image: string;
  prompt: string;
  prompt_optimizer?: boolean;
  duration?: 6 | 10;
  resolution?: "512P" | "720P" | "768P" | "1080P";
}

export interface MinimaxVideoCreateResponse {
  task_id: string;
}

export type MinimaxVideoStatus =
  | "Queueing"
  | "Preparing"
  | "Processing"
  | "Success"
  | "Fail";

export interface MinimaxVideoQueryResponse {
  status: MinimaxVideoStatus;
  file_id?: string;
  video_url?: string;
  error?: { code?: string; message?: string };
}