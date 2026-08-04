<span style="font-size: 12px;">Documentation for SorrellWm.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../../License.md).</span>

# Releasing the Application

**Purpose.**&ensp;This document describes how a tagged commit becomes signed-looking, downloadable Windows installers on [GitHub Releases](https://github.com/GageSorrell/SorrellWm/releases). It complements the packaging material in [Application Overview](./ApplicationOverview.md#packaging-and-security).

## Overview

[`Application/electron-builder.yml`](../../Application/electron-builder.yml) already describes how to package the application into NSIS installers for Windows x64 and ARM64. Releasing adds one more step on top of that: publishing those installers, and the `latest.yml` metadata electron-builder's auto-updater reads, to a GitHub Release.

```text
git tag wm-v0.2.0 && git push --tags
        │
        ▼
.github/workflows/Release.yml (windows-latest)
        │
        ├─ npm ci                      install every workspace
        ├─ npm run release -w @sorrell/wm
        │     ├─ npm run build         typecheck + electron-vite build
        │     └─ electron-builder --publish always
        │
        ▼
GitHub Release "wm-v0.2.0"
        SorrellWm-0.2.0-win-x64.exe
        SorrellWm-0.2.0-win-arm64.exe
        latest.yml
```

## Prerequisites

- The repository's **Settings → Actions → General → Workflow permissions** is set to "Read and write permissions." The workflow authenticates with the default `GITHUB_TOKEN`; without write access, the publish step fails with an HTTP 403 when it tries to create the release.
- `Application/package.json`'s `version` has been bumped to the version being released. electron-builder derives the artifact and release name from this field, not from the git tag.
- The working tree is otherwise identical to what `npm run make -w @sorrell/wm` already builds and packages successfully locally.

## Configuration

Two files carry the release configuration:

| File | Role |
| --- | --- |
| [`Application/electron-builder.yml`](../../Application/electron-builder.yml) | Adds a `publish` block (`provider: github`, `owner: GageSorrell`, `repo: SorrellWm`) alongside the existing packaging and NSIS configuration. |
| [`Application/package.json`](../../Application/package.json) | Adds the `release` script: `npm run build && electron-builder --publish always`. `--publish always` uploads regardless of whether the working tree is a CI-detected release branch. |
| [`.github/workflows/Release.yml`](../../.github/workflows/Release.yml) | Triggers on tags matching `wm-v*.*.*`, installs the monorepo on `windows-latest`, and runs `npm run release -w @sorrell/wm` with `GH_TOKEN` set from the default `GITHUB_TOKEN`. |

The `wm-v*.*.*` tag pattern is deliberately namespaced away from the per-package tags [`MirrorPackages.yml`](../../.github/workflows/MirrorPackages.yml) reacts to on `*`, so cutting a package mirror tag never triggers an application release and vice versa.

## Cutting a Release

```powershell
# 1. Bump the application version
npm version 0.2.0 --no-git-tag-version -w @sorrell/wm
git add Application/package.json
git commit -m "Release 0.2.0"

# 2. Tag and push
git tag wm-v0.2.0
git push origin Master --tags
```

Pushing the tag starts the workflow. It builds on `windows-latest` because the NSIS target and native-module rebuild both require Windows, and publishes the two installer artifacts plus `latest.yml` to a GitHub Release named after the tag.

## Verifying Locally First

`--publish always` is the only step a CI-only workflow adds. Everything before it is exactly what a developer already runs to sanity-check packaging:

```powershell
npm run typecheck -w @sorrell/wm
npm run test -w @sorrell/wm
npm run package -w @sorrell/wm      # unpacked build in Application/Distribution
npm run smoke:packaged -w @sorrell/wm
npm run make -w @sorrell/wm         # full NSIS installers, no publish
```

Run these before tagging. The release workflow does not run lint, tests, or the packaged smoke test on its own — it assumes the tagged commit already passed them.

## Code Signing

Neither the installer nor the workflow signs the produced `.exe`. Unsigned installers trigger a Windows SmartScreen "unrecognized app" warning on first run. This is a distribution-quality gap, not a functional one; closing it requires acquiring a code-signing certificate (for example, from Sectigo or DigiCert, or a cloud HSM-backed EV certificate) and adding signing configuration to `electron-builder.yml` plus the corresponding secret to the workflow. Track this alongside the "installer/update policy" item in [Application Overview's growth list](./ApplicationOverview.md#current-foundation-and-expected-growth).

## Related Files

- [`Application/electron-builder.yml`](../../Application/electron-builder.yml) defines packaging, NSIS targets, and the `publish` block.
- [`Application/package.json`](../../Application/package.json) defines the `release` script.
- [`.github/workflows/Release.yml`](../../.github/workflows/Release.yml) defines the CI trigger and job.
- [`.github/workflows/MirrorPackages.yml`](../../.github/workflows/MirrorPackages.yml) is the other tag-triggered workflow in this repository; its `*` tag trigger is why release tags use the `wm-v` prefix.
- [Application Overview](./ApplicationOverview.md) covers the packaging and security model these installers ship.
