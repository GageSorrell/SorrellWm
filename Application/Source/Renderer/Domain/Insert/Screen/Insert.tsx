/* File:      Insert.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Action } from "@/Action";
import { type ReactElement } from "react";
import { Command } from "@/Domain/Common";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import type { FInsertSizingMethod } from "?/Transaction.Types";

export const Insert = (): ReactElement =>
{
    const Navigator: NavigateFunction = useNavigate();

    const OnSelectSizingMethod = (SizingMethod: FInsertSizingMethod): (() => void) =>
    {
        return (): void =>
        {
            Navigator("/Insert/Direction", { state: SizingMethod });
        };
    };

    return (
        <Action>
            <Command
                Action={ OnSelectSizingMethod("Bisection") }
                Key="C"
                Title="Insert by Bisection"
            />
            <Command
                Action={ OnSelectSizingMethod("UniformResize") }
                Key="G"
                Title="Insert by Uniform Resize"
            />
        </Action>
    );
};
