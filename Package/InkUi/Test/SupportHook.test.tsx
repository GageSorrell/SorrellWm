/**
 * Shared terminal support hook tests.
 *
 * @module @sorrell/ink-ui/Test/SupportHook
 *
 * @file      SupportHook.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { useTerminalFont, useTerminalSupport } from "../Source/Support/Hook.js";

const { QueryTerminalFont, QueryTerminalSupport } = vi.hoisted(() => ({
    QueryTerminalFont: vi.fn(async () => ({
        Family: "Cascadia Mono",
        Source: { _tag: "Configuration" }
    })),
    QueryTerminalSupport: vi.fn(async () => ({
        Sixel: true,
        Terminal: { Kind: "windows-terminal", Name: "Windows Terminal" }
    }))
}));

vi.mock("../Source/Support/Font.js", () => ({ QueryTerminalFont }));
vi.mock("../Source/Support/Query.js", () => ({ QueryTerminalSupport }));

const Probe = (): React.ReactElement =>
{
    const Font = useTerminalFont();
    return <Ink.Text>{ Font?.Family ?? "pending" }</Ink.Text>;
};

const SupportProbe = (): React.ReactElement =>
{
    const Support = useTerminalSupport();
    return <Ink.Text>{ Support?.Sixel === true ? "ready" : "pending" }</Ink.Text>;
};

const Flush = async (): Promise<void> =>
{
    for (let Index: number = 0; Index < 6; Index += 1)
    {
        await new Promise<void>((Resolve) => setImmediate(Resolve));
    }
};

describe("terminal support hooks", () =>
{
    it("publishes support readiness to every consumer in one commit", async () =>
    {
        QueryTerminalSupport.mockClear();
        const App = render(
            <Ink.Box flexDirection="column">
                <SupportProbe />
                <SupportProbe />
                <SupportProbe />
            </Ink.Box>
        );

        await Flush();

        expect(QueryTerminalSupport).toHaveBeenCalledTimes(1);
        expect(App.frames.some((Frame: string) =>
            Frame.includes("ready") && Frame.includes("pending"))).toBe(false);
        expect(App.lastFrame()).toBe("ready\nready\nready");
    });

    it("shares one font query across all Sixel text consumers", async () =>
    {
        QueryTerminalFont.mockClear();
        const App = render(
            <Ink.Box flexDirection="column">
                <Probe />
                <Probe />
                <Probe />
            </Ink.Box>
        );

        await Flush();

        expect(QueryTerminalFont).toHaveBeenCalledTimes(1);
        expect(App.frames.some((Frame: string) =>
            Frame.includes("Cascadia Mono") && Frame.includes("pending"))).toBe(false);
        expect(App.lastFrame()).toBe("Cascadia Mono\nCascadia Mono\nCascadia Mono");
    });
});
