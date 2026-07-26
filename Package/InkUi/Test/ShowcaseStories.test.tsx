/**
 * Showcase story isolation tests.
 *
 * @module @sorrell/ink-ui/Test/ShowcaseStories
 *
 * @file      ShowcaseStories.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { ComponentPage } from "../Showcase/Documentation/Page.js";
import { Example } from "../Showcase/Documentation/Example.js";
import BadgeStory from "../Showcase/Stories/Badge.js";
import ButtonStory from "../Showcase/Stories/Button.js";
import type { ComponentStory, StoryExample } from "../Showcase/Story.js";
import { InteractionProvider } from "../Source/Interaction/index.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import { ThemeProvider } from "../Source/Theme.js";

const Flush = (): Promise<void> => new Promise((Resolve) => setImmediate(Resolve));

function Providers({ children }: React.PropsWithChildren): React.ReactElement
{
    return (
        <ThemeProvider>
            <InteractionProvider ShowFooter={ false }>
                <MouseProvider IsEnabled={ false }>{ children }</MouseProvider>
            </InteractionProvider>
        </ThemeProvider>
    );
}

function StoryPage(Story: ComponentStory): React.ReactElement
{
    return (
        <Providers>
            <ComponentPage
                AvailableWidth={ 66 }
                BasicExample={ Story.Basic }
                Description={ Story.Description }
                Examples={ Story.Examples }
                Name={ Story.Name }
                Props={ Story.Props } />
        </Providers>
    );
}

describe("showcase stories", () =>
{
    it.each([ BadgeStory, ButtonStory ])("renders $Name without unmounting the app", async (Story) =>
    {
        const App = render(StoryPage(Story));
        await Flush();

        expect(App.lastFrame()).toContain(Story.Name);
        expect(App.lastFrame()).not.toContain("Example failed:");
    });

    it("contains a broken preview and resets when another story is selected", async () =>
    {
        const Broken = (): React.ReactElement => <>{ "invalid Ink text" }</>;
        const Working = (): React.ReactElement => <Ink.Text>working preview</Ink.Text>;
        const BrokenExample: StoryExample = {
            Code: "invalid Ink text",
            Preview: Broken,
            Title: "Broken"
        };
        const WorkingExample: StoryExample = {
            Code: "<Text>working preview</Text>",
            Preview: Working,
            Title: "Working"
        };
        const App = render(
            <Providers>
                <Example AvailableWidth={ 66 }
                    Example={ BrokenExample } />
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("Example failed:"));

        App.rerender(
            <Providers>
                <Example AvailableWidth={ 66 }
                    Example={ WorkingExample } />
            </Providers>
        );
        await vi.waitFor(() => expect(App.lastFrame()).toContain("working preview"));
    });
});
