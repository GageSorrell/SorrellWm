/**
 * @file      React.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Dispatch, ReactElement, ReactNode, SetStateAction, useState } from "react";
import type { TMaybeArray } from "@sorrell/utilities/array";

/**
 * A `props` type with {@link children} of type {@link ChildType}.
 *
 * @template ChildType - The type of the {@link children} of type defined by this.
 */
export type TPropsWithChildren<ChildType extends ReactNode = TMaybeArray<ReactNode>> =
    {
        children: ChildType;
    };

/**
 * Define a `props` type with {@link children}, such that the {@link children} are
 * {@link ReactElement | ReactElement(s)} that are created from a
 * {@link FC | functional component} whose `props` type is the given {@link PropsType}.
 *
 * @template PropsType - The `props` type of the {@link FC | functional component} from
 * which the {@link children} of this type are created.
 */
export type TPropsWithChildrenByProps<PropsType extends object> =
    {
        children: ReactElement<PropsType> | Array<ReactElement<PropsType>>;
    };

/**
 * The value of the setter returned by {@link useState} for a given {@link Type}.
 *
 * @template Type - The type of the value handled by {@link useState}.
 */
export type TSetState<Type> = Dispatch<SetStateAction<Type>>;

/**
 * A simple function for updating controlled values that are owned by other components.
 *
 * @template Type - The type of the controlled value.
 */
export type THandler<Type> = (NewValue: Type) => void;

/**
 * A {@link Record} of a controlled value and a {@link THandler} to update that value.
 *
 * @template NameType - The name of the controlled value.
 * @template ValueType - The type of the controlled value.
 */
export type TControlled<NameType extends string, ValueType> =
{
    [ Key in NameType ]: ValueType;
} &
{
    [ Key in `OnChange${ NameType }` ]: THandler<ValueType>;
};
