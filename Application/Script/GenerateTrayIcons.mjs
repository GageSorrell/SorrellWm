/**
 * Render the tray/taskbar icon assets into multi-resolution `.ico` files, using the
 * locally installed Inkscape CLI to rasterize each size and a small hand-rolled ICO
 * packer (Windows `.ico` supports embedding PNG-compressed frames directly, so no
 * image-processing dependency is required).
 *
 * The default icon reuses the Fluent UI `BoardColor` icon (the same one used by the
 * Command Palette extension in `/Package/SorrellWmCommandPalette`). The simplified
 * icon is a hand-drawn approximation of the "◱" (U+25F1 WHITE SQUARE WITH LOWER LEFT
 * QUADRANT) glyph, drawn as vector shapes rather than rendered text so it stays crisp
 * at tray sizes without depending on a system font's glyph coverage.
 *
 * @file      GenerateTrayIcons.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const InkscapeExecutable = "C:/Program Files/Inkscape/bin/inkscape.exe";
const ApplicationDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const ResourceDirectory = join(ApplicationDirectory, "Resource");

/** Icon sizes recommended for Windows applications (taskbar, Explorer, tray, shortcuts). */
const IconSizes = [ 16, 24, 32, 48, 64, 128, 256 ];

/** `BoardColor` path and gradient data, 20x20 viewBox, copied from `@fluentui/react-icons`. */
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
function WrapBoardColor(CanvasSize)
{
    const FillRatio = 0.8;
    const IconSize = CanvasSize * FillRatio;
    const Offset = (CanvasSize - IconSize) / 2;
    // The Fluent icon's visible artwork spans (3, 3) through (17, 17) inside
    // its 20x20 view box.  Remove that built-in margin before applying our own;
    // otherwise the two margins compound and the taskbar glyph renders at only
    // 56% of the available width.
    const ArtworkMinimum = 3;
    const ArtworkSize = 14;
    const Scale = IconSize / ArtworkSize;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${ CanvasSize }" height="${ CanvasSize }" viewBox="0 0 ${ CanvasSize } ${ CanvasSize }">
  <g transform="translate(${ Offset } ${ Offset }) scale(${ Scale }) translate(-${ ArtworkMinimum } -${ ArtworkMinimum })">${ BoardColorBody }</g>
</svg>`;
}

/**
 * A vector approximation of "◱" (U+25F1 WHITE SQUARE WITH LOWER LEFT QUADRANT): a
 * stroked square outline with a solid square filling its lower-left quadrant, both
 * drawn in a single color.
 */
function WrapSimplified(CanvasSize, StrokeColor)
{
    const Margin = CanvasSize * 0.14;
    const Side = CanvasSize - Margin * 2;
    const StrokeWidth = Math.max(1, CanvasSize * 0.09);
    const QuadrantSide = Side / 2;
    const QuadrantX = Margin;
    const QuadrantY = Margin + Side - QuadrantSide;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${ CanvasSize }" height="${ CanvasSize }" viewBox="0 0 ${ CanvasSize } ${ CanvasSize }">
  <rect x="${ Margin }" y="${ Margin }" width="${ Side }" height="${ Side }" fill="none" stroke="${ StrokeColor }" stroke-width="${ StrokeWidth }" />
  <rect x="${ QuadrantX }" y="${ QuadrantY }" width="${ QuadrantSide }" height="${ QuadrantSide }" fill="${ StrokeColor }" />
</svg>`;
}

const Variants = [
    { FileName: "TrayIconColor.ico", Wrap: (Size) => WrapBoardColor(Size) },
    { FileName: "TrayIconSimplifiedLight.ico", Wrap: (Size) => WrapSimplified(Size, "#151515") },
    { FileName: "TrayIconSimplifiedDark.ico", Wrap: (Size) => WrapSimplified(Size, "#ffffff") }
];

/** Pack same-icon PNGs of different sizes into a single Windows `.ico` file. */
function BuildIco(Frames)
{
    const HeaderSize = 6;
    const EntrySize = 16;
    const DirectorySize = HeaderSize + EntrySize * Frames.length;
    const Header = Buffer.alloc(HeaderSize);
    Header.writeUInt16LE(0, 0);
    Header.writeUInt16LE(1, 2);
    Header.writeUInt16LE(Frames.length, 4);

    const Entries = Buffer.alloc(EntrySize * Frames.length);
    const ImageBuffers = [ ];
    let Offset = DirectorySize;

    Frames.forEach((Frame, Index) =>
    {
        const EntryOffset = Index * EntrySize;
        const SizeByte = Frame.Size >= 256 ? 0 : Frame.Size;
        Entries.writeUInt8(SizeByte, EntryOffset);
        Entries.writeUInt8(SizeByte, EntryOffset + 1);
        Entries.writeUInt8(0, EntryOffset + 2);
        Entries.writeUInt8(0, EntryOffset + 3);
        Entries.writeUInt16LE(1, EntryOffset + 4);
        Entries.writeUInt16LE(32, EntryOffset + 6);
        Entries.writeUInt32LE(Frame.Png.length, EntryOffset + 8);
        Entries.writeUInt32LE(Offset, EntryOffset + 12);
        Offset += Frame.Png.length;
        ImageBuffers.push(Frame.Png);
    });

    return Buffer.concat([ Header, Entries, ...ImageBuffers ]);
}

const TempDirectory = mkdtempSync(join(tmpdir(), "sorrellwm-tray-icons-"));

try
{
    for (const Variant of Variants)
    {
        const Frames = IconSizes.map((Size) =>
        {
            const SvgPath = join(TempDirectory, `${ Variant.FileName }-${ Size }.svg`);
            const PngPath = join(TempDirectory, `${ Variant.FileName }-${ Size }.png`);
            writeFileSync(SvgPath, Variant.Wrap(Size));
            execFileSync(InkscapeExecutable, [
                SvgPath,
                "--export-type=png",
                `--export-filename=${ PngPath }`,
                "-w", String(Size),
                "-h", String(Size)
            ]);
            return { Png: readFileSync(PngPath), Size };
        });

        const IcoPath = join(ResourceDirectory, Variant.FileName);
        writeFileSync(IcoPath, BuildIco(Frames));
        console.log(`Rendered ${ IcoPath }`);
    }
}
finally
{
    rmSync(TempDirectory, { force: true, recursive: true });
}
