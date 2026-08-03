/**
 * Factories for composing Ink UI showcase stories.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Factory
 *
 * @file      Factory.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type ComponentStory, DefineStory, type StoryExample, type StorySource } from "../Story.js";

export interface SimpleStoryOptions
{
    readonly Basic: Omit<StoryExample, "Title">;
    readonly Description: string;
    readonly Examples: ReadonlyArray<StoryExample>;
    readonly Name: string;
    readonly Source: StorySource;
}

export function SimpleStory(Options: SimpleStoryOptions): ComponentStory
{
    return DefineStory({
        Basic: { ...Options.Basic, Title: "Basic" },
        Description: Options.Description,
        Examples: Options.Examples,
        Name: Options.Name,
        Source: Options.Source
    });
}
