/**
 * Branded PNG data returned by Windows file-icon operations.
 *
 * @module @sorrell/windows/File
 *
 * @file      File.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Brand, Option, Predicate, String } from "effect";

/**
 * A base64-encoded PNG image.
 *
 * @since 1.0.0
 */
export type Png = Brand.Branded<string, "Png">;

export namespace Png
{
    export/**
           * Determines whether a given `string` is a valid IHDR chunk.
           *
           * @since 1.0.0
           */
    const IsIhdrChunk = (Value: unknown): boolean =>
    {
        if (!Predicate.isString(Value))
        {
            return false;
        }

        if (Value.length % 4 !== 0)
        {
            return false;
        }

        try
        {
            const BinaryContent = atob(Value);

            const ExpectedPngSignature = [
                0x89,
                0x50,
                0x4e,
                0x47,
                0x0d,
                0x0a,
                0x1a,
                0x0a
            ] as const;

            if (BinaryContent.length < 24)
            {
                return false;
            }

            for (
                let ByteIndex = 0;
                ByteIndex < ExpectedPngSignature.length;
                ByteIndex++
            )
            {
                if (
                    BinaryContent.charCodeAt(ByteIndex) !==
                ExpectedPngSignature[ByteIndex]
                )
                {
                    return false;
                }
            }

            const IhdrChunkLength =
                BinaryContent.charCodeAt(8) * 0x1000000 +
            BinaryContent.charCodeAt(9) * 0x10000 +
            BinaryContent.charCodeAt(10) * 0x100 +
            BinaryContent.charCodeAt(11);

            const IhdrChunkType = BinaryContent.slice(12, 16);

            return IhdrChunkLength === 13 && IhdrChunkType === "IHDR";
        }
        catch
        {
            return false;
        }
    };

    export/**
           * Create a base64-encoded `Png` (`string`), given an `IHDR` chunk.
           *
           * @since 1.0.0
           */
    const Png = (Chunk: string): Option.Option<Png> =>
    {
        if (IsIhdrChunk(Chunk))
        {
            return Option.some(Header + Chunk as Png);
        }
        else
        {
            return Option.none();
        }
    };

    export/**
           * The header (prefix) of a base64-encoded PNG.
           *
           * @since 1.0.0
           */
    const Header = "data:image/png;base64," as const;

    export/**
           * Determines whether a given `string` is a valid base64-encoded PNG.
           *
           * @since 1.0.0
           */
    const IsPng = (Value: unknown): Value is Png =>
    {
        if (!Predicate.isString(Value))
        {
            return false;
        }

        if (!String.startsWith(Header)(Value))
        {
            return false;
        }

        const Match = /^data:image\/png;base64,([A-Za-z0-9+/]+={0,2})$/i.exec(Value);

        if (Predicate.isNull(Match))
        {
            return false;
        }

        const Base64Content = Match[1];
        return IsIhdrChunk(Base64Content);
    };

    export/**
           * Cast a `string` to a `Png`.  This does *not* add the `data` prefix.
           *
           * @since 1.0.0
           */
    const PngUnsafe = Brand.nominal<Png>();
}
