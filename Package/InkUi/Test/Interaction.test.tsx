/**
 * Focus and command infrastructure tests.
 *
 * @module @sorrell/ink-ui/Test/Interaction
 *
 * @file      Interaction.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Text } from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import {
    Command,
    CommandScope,
    Focusable,
    FocusScope,
    GetKeyChord,
    InteractionProvider,
    NormalizeKeyChord,
    Shortcut,
    useCommandManager,
    useRoutedInput
} from "../Source/Interaction.js";

const FocusTarget = ({
    Id,
    Label
}: {
    readonly Id: string;
    readonly Label: string;
}): React.ReactNode => (
    <Focusable Id={ Id }>
        { ({ Focused }) => (
            <Text>{ Focused ? ">" : " " }{ Label }</Text>
        ) }
    </Focusable>
);

describe("focus registry", () =>
{
    it("focuses the first target and traverses in render order", async () =>
    {
        const App = render(
            <InteractionProvider>
                <FocusTarget Id="one"
                    Label="One" />
                <FocusTarget Id="two"
                    Label="Two" />
            </InteractionProvider>
        );

        expect(App.lastFrame()).toContain(">One");
        App.stdin.write("\t");
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">Two"));
        App.stdin.write("\u001B[Z");
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">One"));
    });

    it("traps traversal in the nearest trapping scope", async () =>
    {
        const App = render(
            <InteractionProvider>
                <FocusTarget Id="outside"
                    Label="Outside" />
                <FocusScope AutoFocus
                    Id="dialog"
                    Trap>
                    <FocusTarget Id="accept"
                        Label="Accept" />
                    <FocusTarget Id="cancel"
                        Label="Cancel" />
                </FocusScope>
            </InteractionProvider>
        );

        expect(App.lastFrame()).toContain(">Accept");
        App.stdin.write("\t");
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">Cancel"));
        App.stdin.write("\t");
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">Accept"));
    });

    it("restores focus when an auto-focused scope unmounts", async () =>
    {
        const Tree = (ShowDialog: boolean): React.ReactElement => (
            <InteractionProvider>
                <FocusTarget Id="outside"
                    Label="Outside" />
                { ShowDialog && (
                    <FocusScope AutoFocus
                        Id="dialog"
                        RestoreFocus
                        Trap>
                        <FocusTarget Id="inside"
                            Label="Inside" />
                    </FocusScope>
                ) }
            </InteractionProvider>
        );
        const App = render(Tree(false));
        expect(App.lastFrame()).toContain(">Outside");

        App.rerender(Tree(true));
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">Inside"));

        App.rerender(Tree(false));
        await vi.waitFor(() => expect(App.lastFrame()).toContain(">Outside"));
    });
});

describe("command and shortcut registry", () =>
{
    it("executes a command through a normalized shortcut", () =>
    {
        const Handler = vi.fn();
        const App = render(
            <InteractionProvider>
                <Command Handler={ Handler }
                    Id="save" />
                <Shortcut Command="save"
                    Keys="Ctrl+S" />
                <Text>Editor</Text>
            </InteractionProvider>
        );

        App.stdin.write("\u0013");
        expect(Handler).toHaveBeenCalledOnce();
    });

    it("bubbles an unhandled command from the focus target to its parent", () =>
    {
        const Calls: Array<string> = [];
        const App = render(
            <InteractionProvider>
                <CommandScope Id="editor">
                    <Command
                        Handler={ () =>
                        {
                            Calls.push("parent");
                        } }
                        Id="copy" />
                    <Focusable Id="field">
                        { () => (
                            <>
                                <Command
                                    Handler={ () =>
                                    {
                                        Calls.push("child");
                                        return false;
                                    } }
                                    Id="copy" />
                                <Shortcut Command="copy"
                                    Keys="c" />
                                <Text>Field</Text>
                            </>
                        ) }
                    </Focusable>
                </CommandScope>
            </InteractionProvider>
        );

        App.stdin.write("c");
        expect(Calls).toEqual([ "child", "parent" ]);
    });

    it("exposes only context-relevant, non-shadowed shortcuts", () =>
    {
        const ShortcutList = (): React.ReactNode =>
        {
            const Manager = useCommandManager();
            return (
                <Text>
                    { Manager.Shortcuts.map((Item) =>
                        `${ Item.Label }:${ Item.Keys.join("|") }`
                    ).join(",") }
                </Text>
            );
        };

        const App = render(
            <InteractionProvider>
                <Command Handler={ () => undefined }
                    Id="save" />
                <Shortcut Command="save"
                    Keys={ [ "Ctrl+S", "Escape" ] }
                    Label="Save" />
                <Shortcut Command="hidden"
                    Hidden
                    Keys="h"
                    Label="Hidden" />
                <ShortcutList />
            </InteractionProvider>
        );

        expect(App.lastFrame()).toContain("Save:ctrl+s|escape");
        expect(App.lastFrame()).not.toContain("Hidden");
    });

    it("lets focused routed input consume Tab before focus traversal", async () =>
    {
        const InputConsumer = (): React.ReactNode =>
        {
            useRoutedInput((_Input, Key) => Key.tab);
            return <Text>Consumes Tab</Text>;
        };
        const App = render(
            <InteractionProvider>
                <Focusable Id="consumer">
                    { ({ Focused }) => (
                        <Text>{ Focused ? ">" : " " }<InputConsumer /></Text>
                    ) }
                </Focusable>
                <FocusTarget Id="other"
                    Label="Other" />
            </InteractionProvider>
        );

        App.stdin.write("\t");
        await vi.waitFor(() =>
            expect(App.lastFrame()).toContain(">Consumes Tab")
        );
        expect(App.lastFrame()).not.toContain(">Other");
    });
});

describe("key chords", () =>
{
    it("normalizes aliases and modifier order", () =>
    {
        expect(NormalizeKeyChord("Shift + Control + S"))
            .toBe("ctrl+shift+s");
        expect(NormalizeKeyChord("Esc")).toBe("escape");
    });

    it("converts Ink control input to a chord", () =>
    {
        expect(GetKeyChord("\u0013", {
            backspace: false,
            capsLock: false,
            ctrl: true,
            delete: false,
            downArrow: false,
            end: false,
            escape: false,
            home: false,
            hyper: false,
            leftArrow: false,
            meta: false,
            numLock: false,
            pageDown: false,
            pageUp: false,
            return: false,
            rightArrow: false,
            shift: false,
            super: false,
            tab: false,
            upArrow: false
        })).toBe("ctrl+s");
    });
});
