/* File:      Insert.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type NavigateFunction, useNavigate } from "react-router-dom";
import { Action } from "@/Action";
import { Command } from "@/Domain/Common";
import type { FInsertSizingMethod } from "../../../../Shared/Event/Insert.Types";
import { type ReactElement } from "react";

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
                Callback={ OnSelectSizingMethod("Bisection") }
                Description="@TODO"
                Action={ [ "Primary[1]" ] }
                Name="Insert by Bisection"
            />
            <Command
                Callback={ OnSelectSizingMethod("UniformResize") }
                Description="@TODO"
                Action={ [ "Primary[0]" ] }
                Name="Insert by Uniform Resize"
            />
        </Action>
    );
};
