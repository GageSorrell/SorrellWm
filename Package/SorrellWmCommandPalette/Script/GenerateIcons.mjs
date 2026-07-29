/**
 * Render the Fluent UI `BoardColor` icon into the tile and list-icon PNG
 * assets required by Package.appxmanifest, using the locally installed
 * Inkscape CLI.
 *
 * The path and gradient data below is copied from the compiled
 * `BoardColor` export in `@fluentui/react-icons` (a 20x20 icon, since
 * `createFluentIcon` maps its `"1em"` width to a 20 viewBox).
 *
 * @file      GenerateIcons.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const InkscapeExecutable = "C:/Program Files/Inkscape/bin/inkscape.exe";
const PackageDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const AssetsDirectory = join(PackageDirectory, "SorrellWmCommandPalette", "Assets");

/** `BoardColor` path and gradient data, 20x20 viewBox. */
const BoardColorBody = `
  <path d="m17 12-3.5-.5-3.5.5-.5 2.5.5 2.5h4a3 3 0 0 0 3-3v-2Z" fill="url(#ic_fluent_board_20_color__a)" />
  <path d="m10 3-.5 4.5.5 4.5h7V6a3 3 0 0 0-3-3h-4Z" fill="url(#ic_fluent_board_20_color__b)" />
  <path d="M10 17V8l-3.5-.5L3 8v6a3 3 0 0 0 3 3h4Z" fill="url(#ic_fluent_board_20_color__c)" />
  <path d="M10 3v5H3V6a3 3 0 0 1 3-3h4Z" fill="url(#ic_fluent_board_20_color__d)" />
  <defs>
    <linearGradient id="ic_fluent_board_20_color__a" x1="7" y1="9.5" x2="11.1" y2="18.88" gradientUnits="userSpaceOnUse">
      <stop stop-color="#B0F098" />
      <stop offset="1" stop-color="#52D17C" />
    </linearGradient>
    <linearGradient id="ic_fluent_board_20_color__b" x1="11" y1="4" x2="16.33" y2="10.74" gradientUnits="userSpaceOnUse">
      <stop stop-color="#52D17C" />
      <stop offset="1" stop-color="#309C61" />
    </linearGradient>
    <linearGradient id="ic_fluent_board_20_color__c" x1="4" y1="9" x2="9.46" y2="14.56" gradientUnits="userSpaceOnUse">
      <stop stop-color="#42B870" />
      <stop offset="1" stop-color="#1A7F7C" />
    </linearGradient>
    <linearGradient id="ic_fluent_board_20_color__d" x1="4" y1="4" x2="6.07" y2="9.01" gradientUnits="userSpaceOnUse">
      <stop stop-color="#B0F098" />
      <stop offset="1" stop-color="#64DE89" />
    </linearGradient>
  </defs>`;

/** Wrap {@link BoardColorBody} in a square canvas, centered with margin. */
function WrapSquare(CanvasSize, FillRatio)
{
    const IconSize = CanvasSize * FillRatio;
    const Offset = (CanvasSize - IconSize) / 2;
    const Scale = IconSize / 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${ CanvasSize }" height="${ CanvasSize }" viewBox="0 0 ${ CanvasSize } ${ CanvasSize }">
  <g transform="translate(${ Offset } ${ Offset }) scale(${ Scale })">${ BoardColorBody }</g>
</svg>`;
}

/** Wrap {@link BoardColorBody} in a wide canvas, centered with margin. */
function WrapWide(CanvasWidth, CanvasHeight, FillRatio)
{
    const IconSize = CanvasHeight * FillRatio;
    const OffsetX = (CanvasWidth - IconSize) / 2;
    const OffsetY = (CanvasHeight - IconSize) / 2;
    const Scale = IconSize / 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${ CanvasWidth }" height="${ CanvasHeight }" viewBox="0 0 ${ CanvasWidth } ${ CanvasHeight }">
  <g transform="translate(${ OffsetX } ${ OffsetY }) scale(${ Scale })">${ BoardColorBody }</g>
</svg>`;
}

const Jobs = [
    { FileName: "LockScreenLogo.scale-200.png", Svg: WrapSquare(48, 0.72), Width: 48, Height: 48 },
    { FileName: "Square44x44Logo.scale-200.png", Svg: WrapSquare(88, 0.72), Width: 88, Height: 88 },
    { FileName: "Square44x44Logo.targetsize-24_altform-unplated.png", Svg: WrapSquare(24, 0.84), Width: 24, Height: 24 },
    { FileName: "Square150x150Logo.scale-200.png", Svg: WrapSquare(300, 0.72), Width: 300, Height: 300 },
    // Also used as the extension's icon within the Command Palette itself.
    { FileName: "StoreLogo.png", Svg: WrapSquare(256, 0.8), Width: 256, Height: 256 },
    { FileName: "Wide310x150Logo.scale-200.png", Svg: WrapWide(620, 300, 0.68), Width: 620, Height: 300 },
    { FileName: "SplashScreen.scale-200.png", Svg: WrapWide(1240, 600, 0.55), Width: 1240, Height: 600 }
];

const TempDirectory = mkdtempSync(join(tmpdir(), "sorrellwm-cmdpal-icons-"));

try
{
    for (const Job of Jobs)
    {
        const SvgPath = join(TempDirectory, Job.FileName.replace(/\.png$/u, ".svg"));
        const PngPath = join(AssetsDirectory, Job.FileName);
        writeFileSync(SvgPath, Job.Svg);
        execFileSync(InkscapeExecutable, [
            SvgPath,
            "--export-type=png",
            `--export-filename=${ PngPath }`,
            "-w", String(Job.Width),
            "-h", String(Job.Height)
        ]);
        console.log(`Rendered ${ PngPath }`);
    }
}
finally
{
    rmSync(TempDirectory, { force: true, recursive: true });
}
