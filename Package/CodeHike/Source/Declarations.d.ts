/**
 * @file      Declarations.d.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { JSX } from "react";
import type { MDXProps } from "mdx/types.js";

declare module "**/*.md"
{
    const Content: (Props: MDXProps) => JSX.Element;
    export default Content;
}

declare module "**/*.mdx"
{
    const Content: (Props: MDXProps) => JSX.Element;
    export default Content;
}
