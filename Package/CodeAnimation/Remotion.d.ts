/**
 * @file      Remotion.d.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { CodeHikeConfig } from "codehike/mdx";
import type { WebpackConfiguration } from "@remotion/cli/config";

export const DefaultCodeHikeConfig: CodeHikeConfig;
export function EnableMdx(CurrentConfiguration: WebpackConfiguration): Promise<WebpackConfiguration>;

export function ApplyBaseConfig(): void;
export function ApplyDefaultConfig(EntryPoint?: string): void;
