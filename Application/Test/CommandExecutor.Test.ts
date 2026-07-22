/**
 *
 *
 * @module @sorrell/wm/Test/CommandExecutor
 *
 * @file      CommandExecutor.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as BrowserWindow from "../Source/Main/BrowserWindow.js";
import * as CommandResolver from "../Source/Main/CommandResolver.js";
import * as Ui from "../Source/Main/Command/Ui.js";
import * as Wm from "../Source/Main/Command/Wm.js";
import {
    CommandExecutor,
    Live,
    UnsupportedCommandError
} from "../Source/Main/CommandExecutor.js";
import { Deferred, Effect, Layer, Option, Queue, Result, Stream, pipe } from "effect";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sorrell/windows", () => ({
    Keyboard:
    {
        Subscribe: (): void => undefined,
        Unsubscribe: (): void => undefined
    },
    MessageLoop:
    {
        Start: (): void => undefined,
        Stop: (): void => undefined
    },
    VK:
    {
        A: 0x41,
        CONTROL: 0x11,
        F20: 0x83,
        LCONTROL: 0xA2,
        LMENU: 0xA4,
        LSHIFT: 0xA0,
        LWIN: 0x5B,
        MENU: 0x12,
        RCONTROL: 0xA3,
        RMENU: 0xA5,
        RSHIFT: 0xA1,
        RWIN: 0x5C,
        SHIFT: 0x10,
        VK: [ 0x41, 0x83 ]
    }
}));

const UiCommands = Ui.UiCommand();
const WmCommands = Wm.WmCommand();

describe("CommandExecutor.Execute", () =>
{
    it("executes UI visibility commands and rejects unsupported commands", async() =>
    {
        const Operations = new Array<string>();
        const Unsupported = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;

                yield* Executor.Execute(UiCommands.Activate());
                yield* Executor.Execute(UiCommands.Deactivate());

                return yield* pipe(
                    Executor.Execute(WmCommands.Isolate()),
                    Effect.result
                );
            }),
            Effect.provide(Live),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Show:Main",
            "Focus:Main",
            "Hide:Main",
            "Hide:Main"
        ]);
        expect(Result.isFailure(Unsupported)).toBe(true);
        if (Result.isFailure(Unsupported))
        {
            expect(Unsupported.failure).toBeInstanceOf(UnsupportedCommandError);
            if (Unsupported.failure._tag === "UnsupportedCommandError")
            {
                expect(Unsupported.failure.Command._tag).toBe("Isolate");
            }
        }
    });
});

describe("CommandExecutor.Live", () =>
{
    it("consumes resolved commands sequentially without an explicit Execute call", async() =>
    {
        const Operations = new Array<string>();
        const Completed = await Effect.runPromise(Effect.gen(function*()
        {
            const Commands = yield* Queue.unbounded<CommandResolver.Resolved>();
            const Hidden = yield* Deferred.make<void>();
            const ResolverLive = Layer.succeed(CommandResolver.CommandResolver, {
                Commands: Stream.fromQueue(Commands),
                Resolve: () => Option.none()
            });

            return yield* pipe(
                Effect.gen(function*()
                {
                    yield* CommandExecutor;
                    yield* Queue.offer(Commands, UiCommands.Activate());
                    yield* Queue.offer(Commands, UiCommands.Deactivate());
                    yield* Deferred.await(Hidden);

                    return Operations;
                }),
                Effect.provide(Live),
                Effect.provide(FakeBrowserWindow(
                    Operations,
                    Deferred.succeed(Hidden, undefined)
                )),
                Effect.provide(ResolverLive)
            );
        }));

        expect(Completed).toEqual([ "Show:Main", "Focus:Main", "Hide:Main" ]);
    });
});

const IdleResolver = Layer.succeed(CommandResolver.CommandResolver, {
    Commands: Stream.never,
    Resolve: () => Option.none()
});

const FakeBrowserWindow = (
    Operations: Array<string>,
    OnHide: Effect.Effect<void> = Effect.void
): Layer.Layer<BrowserWindow.BrowserWindow> =>
{
    const Record = (Operation: string): Effect.Effect<void> => Effect.sync(() =>
    {
        Operations.push(Operation);
    });
    const Service: BrowserWindow.BrowserWindowImpl = {
        Ensure: (Specification: BrowserWindow.Spec) => Effect.succeed({
            ElectronWindowId: 1,
            Key: Specification.Key
        }),
        Events: Stream.empty,
        Focus: (Key: BrowserWindow.Key) => Record(`Focus:${ Key }`),
        ForceClose: (_Key: BrowserWindow.Key) => Effect.void,
        Hide: (Key: BrowserWindow.Key) => pipe(Record(`Hide:${ Key }`), Effect.andThen(OnHide)),
        Open: (Specification: BrowserWindow.Spec) => Effect.succeed({
            ElectronWindowId: 1,
            Key: Specification.Key
        }),
        RequestClose: (_Key: BrowserWindow.Key) => Effect.void,
        Send: (_Key: BrowserWindow.Key, _Channel: string, _Payload: unknown) => Effect.void,
        Show: (Key: BrowserWindow.Key) => Record(`Show:${ Key }`)
    };

    return Layer.succeed(BrowserWindow.BrowserWindow, Service);
};
