/**
 * Testing module.
 *
 * @module @sorrell/effect-ink/Playground
 * @internal
 */

/**
 * @file      Playground.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Cli from "effect/unstable/cli";
import * as Prompt from "../Prompt.ts";
import { Console, Effect, pipe } from "effect";
import { NodeRuntime, NodeServices } from "@effect/platform-node";
// import { Prompt } from "effect/unstable/cli";
import { Event } from "./index.ts";
import { Prose } from "../index.ts";
import type { Redacted } from "effect";

const username: Prompt.Prompt<string> = Prompt.text({
    Message: "Enter your username: "
});

const password: Prompt.Prompt<Redacted.Redacted<string>> = Prompt.Password({
    Message: "Enter your password: ",
    Validate: (value: string) =>
        value.length === 0
            ? Effect.fail("Password cannot be empty")
            : Effect.succeed(value)
});

const All: Prompt.Prompt<{
    username: string;
    password: Redacted.Redacted<string>;
}> = Prose.WithHeader(Prose.Text.Plain("Foo"), Prompt.all({ password, username }));

/* eslint-disable-next-line @typescript-eslint/typedef */
const command =
    Cli.Command.make("hello-world", { }, () => Effect.gen(function* ()
    {
        // yield* Runtime.defaultValue().Run(Component.);
        yield* Console.log(yield* All);
    }));

// const cli: Effect.Effect<void> = Cli.Command.run({
//     version: `v${ PackageJson.default.version }`
// })(command);

// const Program: Effect.Effect<unknown, unknown, unknown> = command.pipe(
//     Cli.Command.run({
//         version: "1.0.0"
//     }),
//     Effect.provide(NodeServices.layer)
// );

// NodeRuntime.runMain(Cli.Command.run({ version }));
/* eslint-disable-next-line @typescript-eslint/typedef */
const Program = pipe(
    Cli.Command.run(command, { version: "1.0.0" }),
    Effect.provide(Event.EventBridgePubSub.layer),
    Effect.provide(NodeServices.layer)
);

NodeRuntime.runMain(pipe(Effect.gen(function* () { return yield* Program; }), Effect.scoped));
