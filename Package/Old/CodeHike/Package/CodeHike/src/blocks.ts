/**
 * @file      blocks.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { JSX, ReactNode } from "react";
import type { HighlightedCode } from "./code/types.js";
import type { MDXProps } from "mdx/types.js";
import { parse } from "./index.js";
import { z } from "zod";

type MDXContent = (Properties: MDXProps) => JSX.Element;

export function parseRoot(
    Content: MDXContent,
    Schema?: undefined,
    Properties?: MDXProps,
): unknown;

export function parseRoot<SchemaType extends z.ZodType>(
    Content: MDXContent,
    Schema: SchemaType,
    Properties?: MDXProps,
): z.output<SchemaType>;

export function parseRoot<SchemaType extends z.ZodType>(
    Content: MDXContent,
    Schema?: SchemaType,
    Properties: MDXProps = {},
): unknown
{
    const Data = parse(Content, Properties || {});

    if (Schema)
    {
        return parseProps(Data, Schema);
    }

    return Data;
}

export const Block = z.object({
    title: z.string().optional(),
    children: z.custom<ReactNode>(),
});

export const CodeBlock = z.object({
    meta: z.string(),
    value: z.string(),
    lang: z.string(),
});

export const HighlightedCodeBlock = CodeBlock.extend({
    code: z.string(),
    tokens: z.custom<HighlightedCode["tokens"]>(),
    annotations: z.custom<HighlightedCode["annotations"]>(),
    themeName: z.string(),
    style: z.custom<HighlightedCode["style"]>(),
});

export const ImageBlock = z.object({
    url: z.string(),
    alt: z.string(),
    title: z.string(),
});

export function parseProps<SchemaType extends z.ZodType>(
    Content: unknown,
    Schema: SchemaType,
): z.output<SchemaType>
{
    if ((Content as any)?.__hike)
    {
        throw new Error(
            "Code Hike Error: can't parse component content. Looks like you are missing CodeHike's recma plugin or the framework you are using doesn't support it.",
        );
    }

    const Result = Schema.safeParse(Content);

    if (Result.success)
    {
        return Result.data;
    }

    const Issue = Result.error.issues[0];

    if (!Issue)
    {
        throw new Error("Code Hike Error: failed to parse component content.");
    }

    const Path = Issue.path.slice();
    let Block = Content as any;
    let Location = "";

    while (Path.length)
    {
        const Key = Path.shift()!;
        Block = Block?.[Key];

        if (Block?._data?.header)
        {
            Location += `\n${Block._data.header}`;
        }
    }

    const { path, code, message, ...Rest } = Issue;
    const Name = path[path.length - 1];

    throw new Error(`at ${ Location || "root" }
Error for \`${ String(Name) }\`: ${ message }
${ JSON.stringify(Rest, null, 2) }
  `);
}
