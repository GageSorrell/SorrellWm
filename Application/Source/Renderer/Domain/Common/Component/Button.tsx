/**
 * @file      Button.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type ButtonProps, Button as FluentButton } from "@fluentui/react-components";
import type { ReactElement } from "react";

export const Button = (Props: ButtonProps): ReactElement<ButtonProps> =>
{
    const style: ButtonProps["style"] =
    {
        fontWeight: "normal",
        ...(Props.style || { })
    };

    const OutProps: ButtonProps =
    {
        ...Props,
        style
    };

    return <FluentButton { ...OutProps }/>;
};
