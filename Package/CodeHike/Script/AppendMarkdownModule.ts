/**
 * @file      AppendMarkdownModule.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-console */

import { promises as Fs } from "fs";
import { resolve } from "path";

const DeclarationsPath: string = resolve("./Distribution/index.d.ts");
const Declaration: string = `
declare module "*.md"
{
    const Content: unknown;
    export default Content;
}\n`;

const Contents: Array<string> = (await Fs.readFile(DeclarationsPath, { encoding: "utf-8" })).split("\n");
const Tail: string = Contents.pop() || "";
const Out: string =
    Contents.join("\n") +
    Declaration +
    Tail;

await Fs.writeFile(DeclarationsPath, Out, { encoding: "utf-8" });
console.log("✓ Patched index.d.ts!");
