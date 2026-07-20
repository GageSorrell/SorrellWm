/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { JSX } from "react";
import { MDXProps } from "mdx/types.js";

type MDXContent = (props: MDXProps) => JSX.Element;

export function parse(Content: MDXContent, props: MDXProps = {}) {
  return Content({ _returnBlocks: true, ...props }) as any;
}
