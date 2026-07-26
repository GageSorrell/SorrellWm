/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Story
 *
 * @file      Story.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import { InspectProps, type PropDocumentation } from "./Documentation/PropInspector.js";

export interface StoryExample
{
    readonly Code: string;
    readonly Description?: string;
    readonly Preview: React.ComponentType;
    readonly Title: string;
}

export interface StorySource
{
    readonly Component: string;
    readonly Path: string;
    readonly Props: string;
}

export interface ComponentStory
{
    readonly Basic: StoryExample;
    readonly Description: string;
    readonly Examples: ReadonlyArray<StoryExample>;
    readonly Name: string;
    readonly Props: ReadonlyArray<PropDocumentation>;
}

export function DefineStory(Story: Omit<ComponentStory, "Props"> & {
    readonly Source: StorySource;
}): ComponentStory
{
    return {
        Basic: Story.Basic,
        Description: Story.Description,
        Examples: Story.Examples,
        Name: Story.Name,
        Props: InspectProps(Story.Source)
    };
}
