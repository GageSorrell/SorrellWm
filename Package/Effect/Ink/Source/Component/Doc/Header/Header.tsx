/**
 *
 *
 * @module @sorrell/effect-ink/Component/Doc/Header
 * @internal
 *
 * @file      Header.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// import Chalk from "chalk";
// import * as Color from "../../../Color.ts";
import * as Ink from "ink";
import * as React from "react";
// import { Grid, Text } from "../../Primitive/index.ts";
import { Grid } from "../../Primitive/index.ts";
import type { HeaderProps } from "./Header.Types.ts";
// import Markdown from "@inkkit/ink-markdown";
import { Theme } from "../../index.ts";
// import { pipe } from "effect";

export const Header: React.FC<HeaderProps> = ({ Content }: HeaderProps): React.ReactNode =>
{
    const UserTheme: Theme.Theme = Theme.UseTheme();
    // const MarkedUp: React.FC = React.useMemo((): React.FC =>
    // {
    //     const TransformMarkdownColor = (children: string, _index: number) =>
    //         Color.ApplyBackground(UserTheme.ColorPalette.Primary);

    //     return typeof Content.Text === "string"
    //         ? () => <Ink.Transform transform={ TransformMarkdownColor }>
    //             <Markdown>
    //                 { Content.Text as string }
    //             </Markdown>
    //         </Ink.Transform>
    //         : () => <Text>{ pipe(
    //             Content.Text,
    //             Color.Apply(UserTheme.ColorPalette.Primary)
    //         ) }</Text>;
    // }, [ Content.Text, UserTheme.ColorPalette.Primary ]);

    return (
        <Grid.Row
            // backgroundColor={ UserTheme.ColorPalette.Primary }
            alignSelf="flex-start"
            backgroundColor={ UserTheme.ColorPalette.Primary }
            marginBottom={ 1 }
            marginLeft={ -1 }
            maxHeight={ 1 }
            paddingX={ 1 }>
            <Ink.Text
                bold
                color="#FFFFFF">
                { Content.Text.Value }
            </Ink.Text>
            {/* <MarkedUp /> */}
        </Grid.Row>
    );
};
