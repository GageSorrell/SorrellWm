/* File:      Panel.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Body1, Title3, makeStyles, tokens } from "@fluentui/react-components";
import type { CSSProperties, ReactElement } from "react";
import type { PPanel } from "./Panel.Types";

const UseStyles: () => Record<string, string> = makeStyles({
    Root:
    {
        ":hover":
        {
            backgroundColor: tokens.colorSubtleBackgroundInvertedHover
        }
    }
});

export const GetPanelKey = (AnnotatedPanel: PPanel): string =>
{
    return AnnotatedPanel.Screenshot.slice(32, 64);
};

export const Panel = ({
    ApplicationNames,
    IsRoot: _IsRoot,
    Monitor,
    Screenshot,
    Size
}: PPanel): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        alignSelf: "flex-start",
        borderRadius: tokens.borderRadiusLarge,
        display: "flex",
        flexDirection: "row",
        gap: tokens.spacingHorizontalXL,
        justifyContent: "flex-start",
        padding: tokens.spacingHorizontalM,
        width: "100%"
    };

    const InnerRootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        height: 96,
        justifyContent: "center",
        width: 128
    };

    const ImageStyle: CSSProperties =
    {
        borderRadius: tokens.borderRadiusMedium,
        display: "block",
        height: "auto",
        maxHeight: 96,
        maxWidth: 128,
        width: "auto"
    };

    const FluentStyles: Record<string, string> = UseStyles();

    return (
        <div
            className={ FluentStyles.Root }
            style={ RootStyle }>
            <div style={ InnerRootStyle }>
                <img
                    height={ 0.1 * Size.Height }
                    src={ Screenshot }
                    style={ ImageStyle }
                    width={ 0.1 * Size.Width }
                />
            </div>
            <Title3>
                { Monitor }
            </Title3>
            {
                ApplicationNames.length > 0 &&
                <Body1>
                    ({ ApplicationNames.join(", ") })
                </Body1>
            }
        </div>
    );
};
