/**
 * Display-only items in prompts.
 *
 * @module @sorrell/effect-ink/Prompt/Prose
 */

/**
 * @file      Prose.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Impl from "./Impl.ts";
import * as Internal from "../Internal/Prose.tsx";
import type * as Runtime from "./Runtime.tsx";
import type { ComponentProps, ReactNode } from "react";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-ink/Prose");
export type TypeId = typeof TypeId;

export interface Props
{
    readonly State: Record<string, unknown>;
}

export type Component = (Props: Props) => ReactNode;

export type Argument =
    | Component
    | string;

const Prose = <PropsType extends Props,>(
    Component: (Props: PropsType) => ReactNode,
    Props: Omit<ComponentProps<typeof Component>, keyof Props>
): Runtime.Prompt<void> =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(Impl.Prototype);
    Out._tag = "Prose";
    Out.Component = (ProseProps: Props) => <Component { ...({ ...Props, ...ProseProps } as PropsType) } />;

    return Out as Runtime.Prompt<void>;
};

export const Header = (Title: Argument, Options: HeaderOptions): Runtime.Prompt<void> =>
{
    return Prose(Internal.Header, { ...Options, Title });
};

export interface HeaderOptions
{
    readonly Description?: Argument;
}

export const Exposition = (Body: Argument): Runtime.Prompt<void> =>
{
    return Prose(Internal.Exposition, { Body });
};
