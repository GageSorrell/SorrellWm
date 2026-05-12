/**
 * @file      Button.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
import type { ButtonVariants } from "./Button";
import type { Slot } from "radix-ui";
import type { VariantProps } from "class-variance-authority";

export type PButton =
    ComponentProps<"button"> &
    VariantProps<typeof ButtonVariants> &
    {
        AsChild?: boolean
    };

export type FComponent =
    | "button"
    | ForwardRefExoticComponent<
        Slot.SlotProps & RefAttributes<HTMLElement>
    >;
