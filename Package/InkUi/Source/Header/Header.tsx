/**
 * Sixel-rendered headers with font sizes taken from typical CSS defaults.
 *
 * @module @sorrell/ink-ui/Header/Header
 *
 * @file      Header.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { Text, type TextProps } from "../Text/Text.tsx";
import { Struct } from "effect";

export/**
       * A primary header.  Defaults are applied to be consistent with the web `h1` element.
       *
       * @category Component
       * @since 1.0.0
       */
const H1: {
    (Props: TextProps): React.ReactNode;
} = ({ children, ...Tail }: TextProps) =>
{
    const Defaults: TextProps =
        {
            fontSize: "2em",
            fontWeight: "bold",
            marginBottom: 1,
            marginTop: 1
        } as const;

    const Props: TextProps = Struct.assign(Defaults, Tail);

    return  <Text { ...Props }>{ children }</Text>;
};

export/**
       * A secondary header.  Defaults are applied to be consistent with the web `h2` element.
       *
       * @category Component
       * @since 1.0.0
       */
const H2: {
    (Props: TextProps): React.ReactNode;
} = ({ children, ...Tail }: TextProps) =>
{
    const Defaults: TextProps =
        {
            fontSize: "1.5em",
            fontWeight: "bold",
            marginBottom: 1,
            marginTop: 1
        } as const;

    const Props: TextProps = Struct.assign(Defaults, Tail);

    return <Text { ...Props }>{ children }</Text>;
};

export/**
       * A tertiary header.  Defaults are applied to be consistent with the web `h3` element.
       *
       * @category Component
       * @since 1.0.0
       */
const H3: {
    (Props: TextProps): React.ReactNode;
} = ({ children, ...Tail }: TextProps) =>
{
    const Defaults: TextProps =
        {
            fontSize: "1.17em",
            fontWeight: "bold",
            marginBottom: 1,
            marginTop: 1
        } as const;

    const Props: TextProps = Struct.assign(Defaults, Tail);

    return  <Text { ...Props }>{ children }</Text>;
};

export/**
       * A quaternary header.  Defaults are applied to be consistent with the web `h4` element.
       *
       * @category Component
       * @since 1.0.0
       */
const H4: {
    (Props: TextProps): React.ReactNode;
} = ({ children, ...Tail }: TextProps) =>
{
    const Defaults: TextProps =
        {
            fontSize: "1.17em",
            fontWeight: "bold",
            marginBottom: 1,
            marginTop: 2
        } as const;

    const Props: TextProps = Struct.assign(Defaults, Tail);

    return  <Text { ...Props }>{ children }</Text>;
};

export/**
       * A quinary header.  Defaults are applied to be consistent with the web `h5` element.
       *
       * @category Component
       * @since 1.0.0
       */
const H5: {
    (Props: TextProps): React.ReactNode;
} = ({ children, ...Tail }: TextProps) =>
{
    const Defaults: TextProps =
        {
            fontSize: "0.83em",
            fontWeight: "bold",
            marginBottom: 1,
            marginTop: 2
        } as const;

    const Props: TextProps = Struct.assign(Defaults, Tail);

    return  <Text { ...Props }>{ children }</Text>;
};

export/**
       * A senary header.  Defaults are applied to be consistent with the web `h6` element.
       *
       * @category Component
       * @since 1.0.0
       */
const H6: {
    (Props: TextProps): React.ReactNode;
} = ({ children, ...Tail }: TextProps) =>
{
    const Defaults: TextProps =
        {
            fontSize: "0.67em",
            fontWeight: "bold",
            marginBottom: 2,
            marginTop: 2
        } as const;

    const Props: TextProps = Struct.assign(Defaults, Tail);

    return  <Text { ...Props }>{ children }</Text>;
};
