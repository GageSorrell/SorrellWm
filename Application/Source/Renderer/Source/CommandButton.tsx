/**
 *
 *
 * @module @sorrell/wm/Renderer/Source/CommandButton
 *
 * @file      CommandButton.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Button, type ButtonProps } from "@fluentui/react-components";
import type { VK } from "@sorrell/windows";
import * as React from "react";

export interface CommandButtonProps
{
    readonly Icon: NonNullable<ButtonProps["icon"]>;
    readonly Label: string;
    readonly Keybind: Hotkey.Keybind;
}

export const CommandButton = (Props: CommandButtonProps): React.ReactNode =>
{
    return (
        <div style={ {
            alignItems: "baseline",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start"
        } }>
            <Button
                appearance="subtle"
                icon={ <div></div> }
                size="large">

            </Button>
        </div>
    );
};
