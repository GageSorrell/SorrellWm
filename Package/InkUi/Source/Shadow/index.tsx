/**
 * Defaults for Sixel-backed Box shadows.
 *
 * @module @sorrell/ink-ui/Shadow
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import type { BoxElevation } from "../Box/Shadow.js";

/** Props which can be inherited by shadow-casting Boxes. */
export interface ShadowDefaults
{
    readonly elevation?: BoxElevation | undefined;
    readonly shadowColor?: string | undefined;
    readonly zOrder?: number | undefined;
}

/** Per-elevation defaults; elevation itself is supplied by the record key. */
export type ElevationShadowDefaults = Partial<Record<
    Exclude<BoxElevation, 0>,
    Omit<ShadowDefaults, "elevation">
>>;

/** {@inheritDoc ShadowProvider} */
export interface ShadowProviderProps extends React.PropsWithChildren, ShadowDefaults
{
    /** General defaults, overridden by direct provider props. */
    readonly defaults?: ShadowDefaults | undefined;
    /** Defaults selected after a Box's elevation has been resolved. */
    readonly elevationDefaults?: ElevationShadowDefaults | undefined;
    /** Use deterministic ordered dithering for a shaded-character-like appearance. */
    readonly lofi?: boolean | undefined;
}

/** Resolved shadow configuration inherited by Box. */
export interface ShadowContextValue
{
    readonly Defaults: ShadowDefaults;
    readonly ElevationDefaults: ElevationShadowDefaults;
    readonly Lofi: boolean;
}

const DefaultContext: ShadowContextValue =
    {
        Defaults: { },
        ElevationDefaults: { },
        Lofi: false
    };

const Context = React.createContext<ShadowContextValue>(DefaultContext);

/** Supplies general and per-elevation defaults to descendant Box shadows. */
export function ShadowProvider(Props: ShadowProviderProps): React.ReactElement
{
    const Parent: ShadowContextValue = React.useContext(Context);
    const {
        children,
        defaults,
        elevation,
        elevationDefaults,
        lofi,
        shadowColor,
        zOrder
    } = Props;
    const Value: ShadowContextValue = React.useMemo(() =>
    {
        const Defaults: ShadowDefaults =
            {
                ...Parent.Defaults,
                ...defaults,
                ...(elevation === undefined ? { } : { elevation }),
                ...(shadowColor === undefined ? { } : { shadowColor }),
                ...(zOrder === undefined ? { } : { zOrder })
            };

        const ElevationDefaults: ElevationShadowDefaults = MergeElevationDefaults(
            Parent.ElevationDefaults,
            elevationDefaults
        );
        return {
            Defaults,
            ElevationDefaults,
            Lofi: lofi ?? Parent.Lofi
        };
    }, [ Parent, defaults, elevation, elevationDefaults, lofi, shadowColor, zOrder ]);

    return <Context.Provider value={ Value }>{ children }</Context.Provider>;
}

export/**
       * Read the nearest shadow defaults.
       *
       * @internal
       * @since 1.0.0
       */
const useShadowDefaults = (): ShadowContextValue => React.useContext(Context);

const MergeElevationDefaults = (
    Parent: ElevationShadowDefaults,
    Current: ElevationShadowDefaults | undefined
): ElevationShadowDefaults =>
{
    if (Current === undefined) {return Parent;}
    const Result: Partial<Record<Exclude<BoxElevation, 0>, Omit<ShadowDefaults, "elevation">>> = {
        ...Parent
    };

    for (const Elevation of [ 1, 2, 3, 4, 5 ] as const)
    {
        if (Current[Elevation] !== undefined)
        {
            Result[Elevation] =
                {
                    ...Parent[Elevation],
                    ...Current[Elevation]
                };
        }
    }
    return Result;
};
