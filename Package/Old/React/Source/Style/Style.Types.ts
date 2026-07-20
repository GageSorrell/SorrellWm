/**
 * @file      Style.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties } from "react";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { GetFlexStyle } from "./Style.js";
import type { TRecordNonNullable } from "@sorrell/utilities/misc";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { makeStyles } from "@fluentui/react-components";

/**
 * The keys of the `flex` properties of {@link CSSProperties} that are enforced
 * and specified via {@link GetFlexStyle}.
 */
type FFlexKey =
    | "alignItems"
    | "display"
    | "flexDirection"
    | "justifyContent";

/** The CSS flex properties that can be used with {@link GetFlexStyle}. */
export type FFlexStyle =
    TRecordNonNullable<Pick<
        CSSProperties,
        FFlexKey
    >> &
    Omit<CSSProperties, FFlexKey>;

/** The type of a component that accepts a CSS {@link style} object. */
export type PStyledComponent =
    {
        style?: CSSProperties;
    };

/**
 * For a given union of {@link NameType | NameType(s)}, this gives
 * the union of style names.  This is intended to be used with the
 * other generic types in this module.
 *
 * @template NameType - The names of the given styles.
 */
export type TStyleClass<NameType extends string = string> = `${ NameType }Style`;

/**
 * A {@link Record} of styles returned by a hook returned by {@link makeStyles}.
 *
 * @template ClassesType - The names of the classes whose styles are the values
 * of the properties in a {@link Record} of this type.
 */
export type TClasses<ClassesType extends TStyleClass> = Record<ClassesType, string>;

/**
 * The type of the hook returned by {@link makeStyles}.
 *
 * @template ClassesType - The names of the classes whose styles are the values
 * of the properties in a {@link Record} of this type.
 */
export type TUseClasses<ClassesType extends TStyleClass> = () => TClasses<ClassesType>;

/**
 * Extract the {@link StyleClass | StyleClasses} from a given {UseClassesType}.
 *
 * @template UseClassesType - The type of a hook returned by {@link makeStyles}.
 * @template StyleClass - The style classes that are inferred by this type.
 */
export type TClassesFrom<
    UseClassesType extends TUseClasses<StyleClass>,
    StyleClass extends TStyleClass = TStyleClass
> =
    ReturnType<UseClassesType>;
