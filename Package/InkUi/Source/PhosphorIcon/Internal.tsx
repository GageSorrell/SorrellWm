/**
 * Shared Phosphor icon adapter.
 *
 * @module @sorrell/ink-ui/PhosphorIcon/Internal
 * @internal
 *
 * @file      Internal.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Phosphor from "@phosphor-icons/react/ssr";
import * as React from "react";
import { Icon, type IconProps } from "../Icon/index.js";
import { renderToStaticMarkup } from "react-dom/server";

/** Props shared by every generated Phosphor icon component. */
export interface PhosphorIconProps extends
    Omit<React.SVGProps<SVGSVGElement>, "height" | "width">,
    Pick<IconProps, "fallback">
{
    readonly alt?: string;
    readonly mirrored?: boolean;
}

/** A generated, fixed-weight Phosphor icon component. */
export type PhosphorIconComponent = React.ComponentType<PhosphorIconProps>;

type PhosphorWeight =
    | "bold"
    | "duotone"
    | "fill"
    | "light"
    | "regular"
    | "thin";

type SourceComponent =
    React.ElementType<React.SVGProps<SVGSVGElement> &
    {
        readonly mirrored?: boolean;
        readonly size?: number | string;
        readonly weight?: PhosphorWeight;
    }>;

/** Creates a one-cell adapter for one Phosphor icon and weight. */
export function CreatePhosphorIcon(Name: string, Weight: PhosphorWeight): PhosphorIconComponent
{
    const Component = (Props: PhosphorIconProps): React.ReactElement =>
    {
        const { fallback, ...SvgProps } = Props;

        try
        {
            const Source: SourceComponent = GetSourceComponent(Name);
            const Markup: string = renderToStaticMarkup(
                React.createElement(
                    Source,
                    {
                        ...SvgProps,
                        size: 256,
                        weight: Weight
                    }
                )
            );

            return <Icon
                { ...(fallback === undefined ? { } : { fallback }) }
                src={ Markup } />;
        }
        catch
        {
            return <Icon
                { ...(fallback === undefined ? { } : { fallback }) }
                src="" />;
        }
    };

    Component.displayName = `${ Weight[0]?.toUpperCase() ?? "" }${ Weight.slice(1) }${ Name }`;
    return Component;
}

/**
 * Get the Phosphor component corresponding to a given icon's name.
 *
 * @throws {Error} When the name is not found in the icon catalog.
 */
function GetSourceComponent(Name: string): SourceComponent
{
    const Component: unknown = (Phosphor as Readonly<Record<string, unknown>>)[Name];

    if (Component === undefined)
    {
        throw new Error(`@phosphor-icons/react does not export ${ Name }.`);
    }

    return Component as SourceComponent;
}
