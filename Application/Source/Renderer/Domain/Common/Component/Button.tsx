/* File:      Button.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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
