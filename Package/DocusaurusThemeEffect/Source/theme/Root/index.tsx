/**
 *
 *
 * @module @sorrell/docusaurus-theme-effect/theme/Root
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";

export const EffectRootTypeId = Symbol.for("@sorrell/docusaurus-theme-effect/Root");
export type EffectRootTypeId = typeof EffectRootTypeId;
interface RootProps { readonly children: React.ReactNode; }

/** @category Component @since 1.0.0 */
export default function Root({ children: Children }: RootProps): React.JSX.Element
{
    return <div className="sorrell-effect-docs">{ Children }</div>;
}
