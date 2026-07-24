/**
 *
 *
 * @module @sorrell/ink-ui/Checkbox
 *
 * @file      Checkbox.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { Function } from "effect";
import { useTheme } from "./Theme.tsx";

/** {@inheritDoc Checkbox} */
export interface CheckboxProps
{
    readonly Checked: boolean;
    readonly Label?: string;
}

interface CheckboxState extends Required<Pick<CheckboxProps, "Label"> & Pick<Ink.TextProps, "color">>
{
    readonly CheckmarkPart: string;
}

const UseCheckboxState = ({ Checked, Label }: CheckboxProps): CheckboxState =>
{
    const Theme = useTheme();

    const CheckmarkPart: string = Checked ? "x" : " ";

    const color: string = Checked ? Theme.Primary : Theme.TextMuted;

    return {
        CheckmarkPart,
        Label: Label ?? "",
        color
    } as const;
};

const RenderCheckbox = ({ CheckmarkPart, Label, color }: CheckboxState): React.ReactNode =>
{
    return (
        <Ink.Text { ...{ color } }>
            [{ CheckmarkPart }]{ Label.length === 0 ? "" : ` ${ Label }` }
        </Ink.Text>
    );
};

export/**
       * Displays a checked or unchecked terminal checkbox.
       *
       * @category Input
       * @since 1.0.0
       */
const Checkbox: { (Props: CheckboxProps): React.ReactNode; } =
    Function.flow(UseCheckboxState, RenderCheckbox);
