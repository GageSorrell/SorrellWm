/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, Dispatch, FC, ReactElement, ReactNode, SetStateAction } from "react";
import type { TRecordNonNullable } from "../../Shared/Utility";

export type TInternal<Type> =
{
    INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Type;
};

export type TPredicate<Type> = (In: Type) => boolean;

export type TPropsWithChildren<ChildType extends ReactNode = ReactNode | Array<ReactNode>> =
{
    children: ChildType;
};

export type TPropsWithChildrenByProps<PropsType extends object> =
{
    children: ReactElement<PropsType> | Array<ReactElement<PropsType>>;
};

export type TSetState<Type> = Dispatch<SetStateAction<Type>>;
export type THandler<Type> = (NewValue: Type) => void;

export type TControlled<NameType extends string, VariableType> =
{
    [ Key in NameType ]: VariableType;
} &
{
    [ Key in `OnChange${ NameType }` ]: THandler<VariableType>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type FFunctionComponentTypeMask = { _: "_" };
export type TFunctionalComponent<PropsType extends object = FFunctionComponentTypeMask> = FC<
    PropsType extends FFunctionComponentTypeMask
        ? any
        : PropsType
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type FFlexStyle = TRecordNonNullable<Pick<
    CSSProperties,
    | "alignItems"
    | "display"
    | "flexDirection"
    | "justifyContent"
>>;

export type PStyledComponent =
{
    style?: CSSProperties;
};

export type TStyleClass<NameType extends string = string> = `${ NameType }Style`;
export type TClasses<ClassesType extends TStyleClass> = Record<ClassesType, string>;
export type TUseClasses<ClassesType extends TStyleClass> = () => TClasses<ClassesType>;
export type TClassesFrom<
    UseClassesType extends TUseClasses<StyleClass>,
    StyleClass extends TStyleClass = TStyleClass> =
    ReturnType<UseClassesType>;
