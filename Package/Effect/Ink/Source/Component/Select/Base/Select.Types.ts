/**
 * @file      Select.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IndicatorProps, ItemProps } from "./Select.Internal.Types.ts";
import type { FC } from "react";
import type { SelectChoice } from "effect/unstable/cli/Prompt";

export type SelectProps =
    {
        /**
         * Items to display in a list. Each item must be an object and have `label` and `value` props,
         * it may also optionally have a `key` prop.  If no `key` prop is provided, `value` will be
         * used as the item key.
         */
        readonly items?: Array<Choice>;

        /**
         * Listen to user's input. Useful in case there are multiple input components at the
         * same time and input must be "routed" to a specific component.
         *
         * @default true
         */
        readonly isFocused?: boolean;

        /**
         * Index of initially-selected item in `items` array.
         *
         * @default 0
         */
        readonly initialIndex?: number;

        /**
         * Number of items to display.
         */
        readonly limit?: number;

        /**
         * Custom component to override the default indicator component.
         */
        readonly indicatorComponent?: FC<IndicatorProps>;

        /**
         * Custom component to override the default item component.
         */
        readonly itemComponent?: FC<ItemProps>;

        /**
         * Function to call when user selects an item. Item object is passed to that function as an argument.
         */
        readonly onSelect?: (item: Choice) => void;

        /**
         * Function to call when user highlights an item. Item object is passed to that function as
         * an argument.
         */
        readonly onHighlight?: (item: Choice) => void;
    };

export interface Choice extends Omit<SelectChoice<unknown>, "">
{
    /** The `string` that uniquely identifies this item. */
    readonly key: string;

    /**
     * The name of the select option that is displayed to the user.
     */
    readonly title: string;

    /**
     * An optional description for the select option which will be displayed
     * to the user.
     */
    readonly description?: string;

    /**
     * An optional description for the select option which will be displayed
     * to the user.
     */
    readonly shortDescription?: string;

    /**
     * Whether or not this select option is disabled.
     */
    readonly disabled?: boolean;
}
