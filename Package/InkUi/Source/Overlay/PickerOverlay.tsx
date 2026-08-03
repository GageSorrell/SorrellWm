/**
 * Ink UI component for picker overlay.
 *
 * @module @sorrell/ink-ui/Overlay/PickerOverlay
 *
 * @file      PickerOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Overlay } from "./Overlay.tsx";
import { ScrollArea } from "../ScrollArea.tsx";
import { useRoutedInput } from "../Interaction/Shortcut.ts";
import { useTheme } from "../Theme.tsx";

/**
 * An item in a `PickerOverlay`.
 *
 * @category Overlay
 * @since 1.0.0
 */
export interface PickerItem<A>
{
    readonly Description?: string;
    readonly Label: string;
    readonly Value: A;
}

/** {@inheritDoc PickerOverlay} */
export interface PickerOverlayProps<A>
{
    readonly EmptyMessage?: string;
    readonly Height?: number;
    readonly Items: ReadonlyArray<PickerItem<A>>;
    readonly OnCancel?: (() => void) | undefined;
    readonly OnHighlight?: ((Item: PickerItem<A> | undefined) => void) | undefined;
    readonly OnSelect: (Item: PickerItem<A>) => void;
    readonly RenderItem?: (
        Item: PickerItem<A>,
        Selected: boolean
    ) => React.ReactNode;
    readonly Searchable?: boolean;
    readonly Title: string;
}

export/**
       * Provides a searchable modal picker with keyboard navigation.
       *
       * @category Overlay
       * @since 1.0.0
       */
const PickerOverlay = <Value,>({
    EmptyMessage = "No matching items.",
    Height = 8,
    Items,
    OnCancel,
    OnHighlight,
    OnSelect,
    RenderItem,
    Searchable = true,
    Title
}: PickerOverlayProps<Value>): React.ReactNode =>
{
    const Theme = useTheme();
    const [ Query, SetQuery ] = React.useState("");
    const [ Selected, SetSelected ] = React.useState(0);
    const Filtered = React.useMemo(
        () => Items.filter((Item: PickerItem<Value>) =>
            !Searchable
            || Item.Label.toLocaleLowerCase().includes(Query.toLocaleLowerCase())
            || Item.Description?.toLocaleLowerCase().includes(Query.toLocaleLowerCase())
                === true
        ),
        [ Items, Query, Searchable ]
    );

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (Key.escape)
        {
            OnCancel?.();
            return true;
        }
        if (Key.backspace && Searchable)
        {
            SetQuery((Current: string) => Current.slice(0, -1));
            SetSelected(0);
            return true;
        }
        if (
            Searchable
            && Input.length > 0
            && !Key.ctrl
            && !Key.meta
            && !Key.return
        )
        {
            SetQuery((Current: string) => Current + Input);
            SetSelected(0);
            return true;
        }
        return false;
    });

    const SelectedItem = Filtered[Selected];
    React.useEffect(() =>
    {
        OnHighlight?.(SelectedItem);
    }, [ OnHighlight, SelectedItem ]);

    return (
        <Overlay Title={ Title }>
            { Searchable && (
                <Ink.Text color={ Theme.Text }>
                    Search: <Ink.Text color={ Theme.Primary }>{ Query }█</Ink.Text>
                </Ink.Text>
            ) }
            { Filtered.length === 0
                ? <Ink.Text color={ Theme.TextMuted }>{ EmptyMessage }</Ink.Text>
                : (
                    <ScrollArea
                        Height={ Height }
                        Items={ Filtered }
                        OnSelect={ OnSelect }
                        RenderItem={ (
                            Item: PickerItem<Value>,
                            _Index: number,
                            IsSelected: boolean
                        ) => RenderItem?.(Item, IsSelected) ?? (
                            <Ink.Text
                                color={ IsSelected ? Theme.Primary : Theme.Text }>
                                { IsSelected ? "› " : "  " }{ Item.Label }
                                { Item.Description === undefined
                                    ? ""
                                    : ` — ${ Item.Description }` }
                            </Ink.Text>
                        ) }
                        Index={ Selected }
                        OnChangeIndex={ SetSelected } />
                ) }
        </Overlay>
    );
};
