/* File:      Panel.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Body1, Skeleton, SkeletonItem, Title3, makeStyles, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactElement, useMemo } from "react";
import type { FAnnotatedPanel } from "#/Tree.Types";
import { Fade } from "@fluentui/react-motion-components-preview";
import { Log } from "@/Api";
import type { PPanel } from "./Panel.Types";

type YStyles =
    | "Root"
    | "Selected";

const UseStyles: () => Record<YStyles, string> = makeStyles({
    Root:
    {
    },
    Selected:
    {
        backgroundColor: tokens.colorSubtleBackgroundInvertedHover
    }
});

export const GetPanelKey = (AnnotatedPanel: FAnnotatedPanel): string =>
{
    return JSON.stringify(AnnotatedPanel.Size);
};

export const Panel = ({
    ApplicationNames,
    IsRoot: _IsRoot,
    IsSelected,
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

    const SIZES: Array<number> = useMemo<Array<number>>((): Array<number> =>
    {
        return [ 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128 ];
    }, [ ]);

    const ImageStyle: CSSProperties = useMemo<CSSProperties>((): CSSProperties =>
    {
        const MaxWidth: number = 128;
        const MaxHeight: number = 96;
        const WidthRatio: number = MaxWidth / Size.Width;
        const HeightRatio: number = MaxHeight / Size.Height;
        const Scale: number = Math.min(WidthRatio, HeightRatio);

        // Scaled dimensions before snapping
        const ScaledWidth: number = Math.floor(Size.Width * Scale);
        const ScaledHeight: number = Math.floor(Size.Height * Scale);

        return {
            borderRadius: tokens.borderRadiusMedium,
            display: "block",
            height: "auto",
            left: -0.5 * ScaledWidth,
            maxHeight: 96,
            maxWidth: 128,
            position: "absolute",
            top: -0.5 * ScaledHeight,
            width: "auto"
        };
    }, [ Size ]);

    const SkeletonStyle: CSSProperties = useMemo<CSSProperties>((): CSSProperties =>
    {
        const MaxWidth: number = 128;
        const MaxHeight: number = 96;

        const BaseStyle: CSSProperties =
        {
            borderRadius: tokens.borderRadiusMedium,
            display: "block",
            maxHeight: MaxHeight,
            maxWidth: MaxWidth,
            position: "absolute"
        };

        // If image is already within the max constraints, no further scaling is needed
        if (Size.Width <= MaxWidth && Size.Height <= MaxHeight)
        {
            Log(`Skeleton Width and Height are ${Size.Width} and ${Size.Height}.`);
            return {
                ...BaseStyle,
                height: Size.Height,
                width: Size.Width,
                top: 0.5 * Size.Height,
                left: 0.5 * Size.Width
            };
        }

        // Compute scaling factors
        const WidthRatio: number = MaxWidth / Size.Width;
        const HeightRatio: number = MaxHeight / Size.Height;
        const Scale: number = Math.min(WidthRatio, HeightRatio);

        // Scaled dimensions before snapping
        const ScaledWidth: number = Math.floor(Size.Width * Scale);
        const ScaledHeight: number = Math.floor(Size.Height * Scale);

        // Choose the height from SIZES that is closest to ScaledHeight
        const NearestHeight: number = SIZES.reduce((previous, current) =>
        {
            return Math.abs(current - ScaledHeight) < Math.abs(previous - ScaledHeight)
                ? current
                : previous;
        }, SIZES[0]);

        // Adjust width to preserve the approximate aspect ratio after snapping the height
        const AspectRatio: number = NearestHeight / ScaledHeight;
        const FinalWidth: number = Math.floor(ScaledWidth * AspectRatio);

        Log(`Skeleton Width and Height are ${FinalWidth} and ${NearestHeight}.`);

        return {
            ...BaseStyle,
            height: NearestHeight,
            width: FinalWidth,
            top: -0.5 * NearestHeight,
            left: -0.5 * FinalWidth
        };
    }, [ SIZES, Size ]);

    // const SkeletonStyle: CSSProperties = useMemo<CSSProperties>((): CSSProperties =>
    // {
    //     const MaxWidth: number = 128;
    //     const MaxHeight: number = 96;
    //     const BaseStyle: CSSProperties =
    //     {
    //         borderRadius: tokens.borderRadiusMedium,
    //         display: "block",
    //         maxHeight: 96,
    //         maxWidth: 128
    //     };

    //     if (Size.Width <= MaxWidth && Size.Height <= MaxHeight)
    //     {
    //         Log(`Skeleton Width and Height are ${ Size.Width } and ${ Size.Height }.`);
    //         return {
    //             ...BaseStyle,
    //             height: Size.Height,
    //             width: Size.Width
    //         };
    //     }

    //     const WidthRatio: number = MaxWidth / Size.Width;
    //     const HeightRatio: number = MaxHeight / Size.Height;
    //     const Scale: number = Math.min(WidthRatio, HeightRatio);

    //     Log(`Skeleton Width and Height are ${ Math.floor(Size.Width * Scale) } and ${ Math.floor(Size.Height * Scale) }.`);

    //     return {
    //         ...BaseStyle,
    //         height: Math.floor(Size.Height * Scale),
    //         width: Math.floor(Size.Width * Scale)
    //     };
    // }, [ Size ]);

    const FluentStyles: Record<string, string> = UseStyles();

    return (
        <div
            className={ IsSelected ? FluentStyles.Selected : undefined }
            style={ RootStyle }>
            <div style={ InnerRootStyle }>
                <div style={{ position: "relative" }}>
                    <img
                        height={ 0.1 * Size.Height }
                        src={ Screenshot }
                        style={ ImageStyle }
                        width={ 0.1 * Size.Width }
                    />
                    <Fade visible={ Screenshot === undefined }>
                        <Skeleton
                            animation="pulse"
                            appearance="opaque"
                            style={ SkeletonStyle }>
                            <SkeletonItem
                                size={ SkeletonStyle.height as undefined }
                            />
                        </Skeleton>
                    </Fade>
                </div>
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
