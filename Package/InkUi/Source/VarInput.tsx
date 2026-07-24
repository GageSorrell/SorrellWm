/**
 *
 *
 * @module @sorrell/ink-ui/VarInput
 *
 * @file      VarInput.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { CompletionMenu } from "./CompletionMenu.tsx";
import { TextInput } from "./TextInput.js";
import { useRoutedInput } from "./Interaction/Shortcut.ts";

/** {@inheritDoc VarInput} */
export interface VarInputProps
{
    readonly Focused?: boolean;
    readonly OnChange?: ((Value: string) => void) | undefined;
    readonly Placeholder?: string | undefined;
    readonly Value: string;
    readonly Values: Readonly<Record<string, string | undefined>>;
}

export/**
       * Combines text entry with dollar-variable completion suggestions.
       *
       * @category Input
       * @since 1.0.0
       */
const VarInput = ({
    Focused = true,
    OnChange,
    Placeholder,
    Value,
    Values
}: VarInputProps): React.ReactNode =>
{
    const [ Selected, SetSelected ] = React.useState(0);
    const Token = /\$([A-Za-z_][A-Za-z0-9_]*)?$/u.exec(Value);
    const Prefix = Token?.[1] ?? "";
    const Suggestions = React.useMemo(
        () => Token === null
            ? [ ]
            : Object.keys(Values)
                .filter((Name: string) => Name.startsWith(Prefix))
                .slice(0, 6),
        [ Prefix, Token, Values ]
    );

    React.useEffect(() => SetSelected(0), [ Prefix ]);

    const Accept = (): void =>
    {
        const Suggestion = Suggestions[Selected];
        if (Suggestion !== undefined && Token !== null)
        {
            OnChange?.(`${ Value.slice(0, Token.index) }$${ Suggestion }`);
        }
    };

    useRoutedInput((_Input: string, Key: Ink.Key) =>
    {
        if (Suggestions.length === 0)
        {
            return false;
        }
        if (Key.upArrow)
        {
            SetSelected((Current: number) => Math.max(0, Current - 1));
            return true;
        }
        else if (Key.downArrow)
        {
            SetSelected((Current: number) =>
                Math.min(Suggestions.length - 1, Current + 1)
            );
            return true;
        }
        else if (Key.tab)
        {
            Accept();
            return true;
        }
        return false;
    }, { Active: Focused });

    return (
        <Ink.Box flexDirection="column">
            <TextInput
                Focused={ Focused }
                OnChange={ OnChange }
                OnSubmit={ Suggestions.length === 0 ? undefined : Accept }
                Placeholder={ Placeholder }
                Value={ Value } />
            { Suggestions.length > 0 && (
                <CompletionMenu
                    Items={ Suggestions }
                    SelectedIndex={ Selected }
                />
            ) }
        </Ink.Box>
    );
};
