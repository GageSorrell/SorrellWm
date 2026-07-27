/**
 * The page that displays Storybook-like details for a component.
 *
 * @module @sorrell/ink-ui/Showcase/Documentation/Page
 *
 * @file      Page.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import type { ComponentStory, StoryExample } from "../Story.js";
import { Box } from "../../Source/Box/index.js";
import { Example } from "./Example.js";
import { H2 } from "../../Source/Header/index.js";
import { PropsTable } from "./PropsTable.js";
import { ScrollView } from "../../Source/ScrollView.js";
import { useTheme } from "../../Source/Theme.js";
import { Display } from "../../Source/index.js";

/** {@inheritDoc ComponentPage} */
export interface ComponentPageProps
{
    readonly AvailableWidth: number;
    readonly BasicExample: ComponentStory["Basic"];
    readonly Description: React.ReactNode;
    readonly Examples: ComponentStory["Examples"];
    readonly Height?: Ink.BoxProps["height"];
    readonly Id?: string;
    readonly Name: string;
    readonly Order?: number;
    readonly Props: ComponentStory["Props"];
}

const SplitWords = (Value: string): string =>
{
    if (Value.length <= 1)
    {
        return Value;
    }

    return Value[0] + Value.slice(1).replace(/[A-Z]/g, " $&");
};

export/**
       * The page that displays Storybook-like details for a component.
       *
       * @category Documentation
       * @since 1.0.0
       */
const ComponentPage = ({
    AvailableWidth,
    BasicExample,
    Description,
    Examples,
    Height,
    Id,
    Name,
    Order,
    Props
}: ComponentPageProps): React.ReactElement =>
{
    const Theme = useTheme();
    return (
        <ScrollView
            FocusableWhenNotScrollable
            flexDirection="column"
            flexWrap="nowrap"
            gap={ 1 }
            { ...(Height === undefined ? { } : { height: Height }) }
            { ...(Id === undefined ? { } : { Id }) }
            { ...(Order === undefined ? { } : { Order }) }
            overflowX="clip"
            paddingX={ 2 }>
            <Display>
                { SplitWords(Name) }
            </Display>
            {/* <Ink.Text
                bold
                color={ Theme.Primary }>
                { Name }
            </Ink.Text> */}
            <Section Title="Description">
                <Ink.Text color={ Theme.Text }>{ Description }</Ink.Text>
            </Section>
            <Section Title="Basic example">
                <Example AvailableWidth={ AvailableWidth }
                    Example={ BasicExample } />
            </Section>
            <Section Title="Props">
                <PropsTable Props={ Props } />
            </Section>
            <Section Title="Examples">
                { Examples.map((Item: StoryExample) => (
                    <Example AvailableWidth={ AvailableWidth }
                        Example={ Item }
                        key={ Item.Title } />
                )) }
            </Section>
        </ScrollView>
    );
};

const Section = ({ children, Title }: React.PropsWithChildren<{
    readonly Title: string;
}>): React.ReactElement =>
{
    return (
        <Box
            flexDirection="column"
            flexWrap="nowrap">
            <H2>{ Title }</H2>
            <Ink.Box minHeight={ 1 } />
            <Ink.Box
                flexDirection="column"
                marginLeft={ 1 }>
                { children }
            </Ink.Box>
        </Box>
    );
};
