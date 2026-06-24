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
import { Console, Effect } from "effect";
import { NodeRuntime, NodeServices } from "@effect/platform-node";
// import { Prompt } from "effect/unstable/cli";
import type { Redacted } from "effect";

const username: Prompt.Prompt<string> = Prompt.text({
    message: "Enter your username: "
});

const password: Prompt.Prompt<Redacted.Redacted<string>> = Prompt.password({
    message: "Enter your password: ",
    validate: (value: string) =>
        value.length === 0
            ? Effect.fail("Password cannot be empty")
            : Effect.succeed(value)
});

const All: Prompt.Prompt<{
    username: string;
    password: Redacted.Redacted<string>;
}> = Prompt.all({ password, username });

/* eslint-disable-next-line @typescript-eslint/typedef */
const command =
    Cli.Command.make("hello-world", { }, () => Effect.gen(function* ()
    {
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
const Program = Cli.Command.run(command, {
    version: "1.0.0"
}).pipe(
    Effect.provide(NodeServices.layer)
);

NodeRuntime.runMain(Program);
