/**
 *
 *
 * @module @sorrell/site-core/Twoslash
 *
 * @file      Twoslash.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Shared Shiki and Twoslash configuration for Docusaurus MDX.
 *
 * @module @sorrell/site-core/Twoslash
 */

import rehypeShiki from "@shikijs/rehype";
import { transformerTwoslash } from "@shikijs/twoslash";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/site-core/Twoslash" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Rehype plugin tuple that enables Shiki and opt-in Twoslash blocks.
 *
 * @category Configuration
 * @since 1.0.0
 */
export const TwoslashRehypePlugin = [
    rehypeShiki,
    {
        themes: {
            dark: "github-dark",
            light: "github-light"
        },
        transformers: [ transformerTwoslash({ explicitTrigger: true }) ]
    }
] as const;
