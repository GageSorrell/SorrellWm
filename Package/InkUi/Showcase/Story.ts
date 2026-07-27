/**
 * A story is rich documentation of a component, collection of components,
 * or design patterns and recommendations.  Stories contain descriptions,
 * examples, and long-form writing.
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

/**
 * An example shown on showcase page.  Examples contain content, and the code
 * responsible for generating the content.
 *
 * @category Documentation
 * @since 1.0.0
 */
export interface StoryExample
{
    readonly Code: string;
    readonly Description?: string;
    readonly Preview: React.ComponentType;
    readonly Title: string;
}

/**
 * The identifying props for a component in the showcase.
 *
 * @category Documentation
 * @since 1.0.0
 */
export interface StorySource
{
    readonly Component: string;
    readonly Path: string;
    readonly Props: string;
}

/**
 * The content in a showcase page.
 *
 * @category Documentation
 * @since 1.0.0
 */
export interface ComponentStory
{
    readonly Basic: StoryExample;
    readonly Description: string;
    readonly Examples: ReadonlyArray<StoryExample>;
    readonly Name: string;
    readonly Props: ReadonlyArray<PropDocumentation>;
}

export/**
       * Create a story for a given component.
       *
       * @category Constructor
       * @since 1.0.0
       */
const DefineStory = (Story: Omit<ComponentStory, "Props"> & {
    readonly Source: StorySource;
}): ComponentStory =>
{
    return {
        Basic: Story.Basic,
        Description: Story.Description,
        Examples: Story.Examples,
        Name: Story.Name,
        Props: InspectProps(Story.Source)
    };
};
