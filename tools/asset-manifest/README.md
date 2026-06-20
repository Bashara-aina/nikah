# Asset manifest

SHA-256 + sharp metadata for every image in the nikah monorepo. The single source of truth for "are these two files the same?" claims. See `.cursor/rules/image-verification.mdc` for the policy.

## Usage

```bash
# Build (or rebuild) the manifest. Walks /assets, /public/assets, /Recovered.
node tools/asset-manifest/build-manifest.mjs

# Show added/removed/changed since the last build.
node tools/asset-manifest/build-manifest.mjs --diff

# Look up by sha256 prefix.
node tools/asset-manifest/query.mjs find abc123…

# Look up by exact sha256.
node tools/asset-manifest/query.mjs where abc123…full…

# Look up by relative path.
node tools/asset-manifest/query.mjs path assets/scenes/hero-bg.webp

# List every duplicate group (same sha256, different paths).
node tools/asset-manifest/query.mjs duplicates
```

## Outputs

- `tools/asset-manifest/manifest.json` — full structured manifest. Schema:
  ```ts
  {
    generatedAt: string;          // ISO-8601
    repoRoot: string;
    roots: ("assets"|"public"|"recovered")[];
    entryCount: number;
    duplicateCount: number;
    entries: Array<{
      path: string;               // monorepo-relative, forward slashes
      root: string;               // which top-level dir
      sha256: string;             // 64 hex chars
      sizeBytes: number;
      mtimeMs: number;
      format?: string;
      width?: number;
      height?: number;
      channels?: number;
      hasAlpha?: boolean;
      space?: string;
    }>;
  }
  ```
- `tools/asset-manifest/manifest.txt` — human-readable summary, includes a "duplicates" section at the bottom.

## What it does NOT do

- It does not decide whether a file should be promoted or deleted. The decision is yours; this just gives you ground truth.
- It does not scan HEIC reliably (`libheif` is not in the libvips build that ships with sharp). HEIC files will appear in the manifest with an `error` field on metadata; the file walk still records their sha256.

## Updating

Re-run `node tools/asset-manifest/build-manifest.mjs` any time you add, remove, or modify assets. Run with `--diff` to see what changed since the last build.