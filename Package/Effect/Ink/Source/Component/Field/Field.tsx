/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field
 *
 * @file      Field.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Atom from "../Atom.tsx";
import * as Clack from "../Clack.tsx";
import * as Color from "../../Color.ts";
import * as Ink from "ink";
import * as Option from "effect/Option";
import type * as Prompt from "../../Prompt.ts";
import * as React from "react";
import type { FC, ReactNode } from "react";
import CliBoxes from "cli-boxes";
import { Grid } from "../Primitive/index.ts";
import { Spinner } from "../Primitive/Spinner.tsx";
import { Text } from "../Primitive/Text.tsx";
import { Theme } from "../index.ts";

/**
 * The frontend model of a field--that is, a prompt atom that accepts
 * input from the user.
 */
export interface Field
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    readonly Component: FC<any>;
    readonly Keybinds: Prompt.Keybinds | undefined;
    readonly Options: unknown;
    readonly State: Option.Option<unknown>;
    readonly ErrorMessage: Option.Option<ReactNode>;
    readonly IsSubmitted: boolean;
    readonly IsValidating: boolean;
}

export interface FieldProps
{
    /* eslint-disable @typescript-eslint/no-explicit-any */
    readonly Component: FC<any>;
    readonly Props: Omit<Props<any, any>, "Options"> & { readonly Options: any; };
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

interface MessageProps extends React.PropsWithChildren, Pick<Props<never, never>, "IsSubmitted"> { }

const Message = ({ IsSubmitted, children }: MessageProps): React.ReactNode =>
{
    return <Ink.Text dimColor={ IsSubmitted }>{ children }</Ink.Text>;
};

export type Component<StateType, OptionsType> = FC<Props<StateType, OptionsType>>;

/**
 * The base type for props given to the components `export`ed by this module.
 *
 * @template StateType - The type of the state given to a component in this module.
 * This is expected to change across most rerenders.
 *
 * @template OptionsType - The type of the options given to a component in this module.
 * This is expected to *not* change across rerenders.
 */
export interface Props<in out StateType, in out OptionsType>
    extends Pick<Field, "IsValidating" | "ErrorMessage">
{
    IsSubmitted: boolean;
    Options: Required<OptionsType>;
    State: StateType;
}

export const Field = ({ Component, Props }: FieldProps): ReactNode =>
{
    const { IsSubmitted, IsValidating } = Props;

    const { ColorPalette: { Error } } = Theme.UseTheme();

    const ErrorMessage: ReactNode = (
        <Text
            bold
            color={ Error }>
            { Props.ErrorMessage.valueOrUndefined ?? " " }
        </Text>
    );

    const UserTheme: Theme.Theme = Theme.UseTheme();

    const GetCharacter = (RowKind: Clack.RowKind): React.ReactNode => RowKind === "Top"
        ? IsValidating
            ? <Spinner />
            : IsSubmitted
                ? Clack.Shape.Diamond.Medium.White
                : Clack.Shape.Diamond.Medium.Black
        : RowKind !== "Bottom" || IsSubmitted
            ? CliBoxes.single.left
            : CliBoxes.single.bottomLeft;

    const GetColor = (RowKind: Clack.RowKind): Color.Color =>
        RowKind === "Top" || !IsSubmitted
            ? Option.isSome(Props.ErrorMessage)
                ? UserTheme.ColorPalette.Error
                : UserTheme.ColorPalette.Primary
            : Color.Chalk[Color.Undefined];

    const GetDimColor = (RowKind: Clack.RowKind) => RowKind !== "Top" && IsSubmitted;

    return (
        <Atom.Atom { ...{ GetCharacter, GetColor, GetDimColor } }>
            <Grid.Row marginBottom={ 1 }>
                <Message { ...{ IsSubmitted } }>{ Props.Options.Message }</Message>
            </Grid.Row>
            <Component { ...Props } />
            { ErrorMessage }
        </Atom.Atom>
    );

    // return (
    //     <Grid.Row gap={ 1 }>
    //         <Grid.Column
    //             height="100%"
    //             marginRight={ 1 }
    //             width={ 1 }>
    //             <Clack.ClackArm
    //                 { ...{ Height, IsSubmitted, IsValidating } }
    //             />
    //         </Grid.Column>
    //         <Grid.Column>
    //             <Grid.Column
    //                 gap={ 1 }
    //                 ref={ BarBoxRef }>
    //                 <Message
    //                     IsSubmitted={ Props.IsSubmitted }
    //                     Message={ Props.Options.Message }
    //                 />
    //                 <Component { ...Props } />
    //             </Grid.Column>
    //             { ErrorMessage }
    //         </Grid.Column>
    //     </Grid.Row>
    // );
};
