/**
 * Recursively delete all `node_modules` directories, `package-lock.json` files, `*.tsbuildinfo` files")} files, and distribution directories (`dist` and `Distribution`).
 *
 * @module @sorrell/cli/Clean
 *
 * @file      Clean.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, Console, Effect, FileSystem, Path as PathEffect, Record, String, pipe } from "effect";
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli";
import { Listr, type ListrTask } from "listr2";
import { Code } from "@sorrell/cli-utility/Format";

const Target =
    [
        "node_modules",
        "package-lock.json",
        "*.tsbuildinfo",
        "Distribution",
        "dist"
    ] as const;

type Target = typeof Target[number];

const CleanConfig =
    {
        Confirm: pipe(
            Flag.boolean("safe"),
            Flag.withDefault(false),
            Flag.withDescription("Whether to list what will be deleted before doing so, requiring confirmation from the user.  This flag is a no-op if --dry is specified.")
        ),
        Dry: pipe(
            Flag.boolean("dry"),
            Flag.withDefault(false),
            Flag.withDescription("If specified, then the command will list what would be deleted, but will not delete anything.")
        ),
        Path: pipe(
            Argument.path(
                "path",
                {
                    pathType: "directory",
                    mustExist: true
                }
            ),
            Argument.withDefault("."),
            Argument.withDescription(`The root path from which the given ${ Code("targets") } will be found.`)
        ),
        Targets: pipe(
            Argument.choiceWithValue(
                "targets",
                [
                    [ "node_modules", "node_modules" ],
                    [ "package-lock", "package-lock.json" ],
                    [ "tsbuildinfo", "*.tsbuildinfo" ],
                    [ "Distribution", "Distribution" ],
                    [ "dist", "dist"]
                ]),
            Argument.variadic({ min: 0 }),
            Argument.withDefault([ "node_modules", "package-lock.json", "*.tsbuildinfo", "Distribution", "dist" ]),
            Argument.withDescription("The content to recursively delete.")
        )
    } as const;

const MakeFind = (Root: string) => (Leaf: string) => Effect.gen(function* ()
{
    const Path = yield* PathEffect.Path;
    const Fs = yield* FileSystem.FileSystem;

    const RelativePaths = yield* Fs.glob(`**/${ Leaf }`, { root: Root });

    const ResolveByRoot = (RelativePath: string) => Path.resolve(Root, RelativePath);

    return RelativePaths.map(ResolveByRoot);
});

const FindAll = (FindFn: ReturnType<typeof MakeFind>, Targets: ReadonlyArray<Target>) =>
    Effect.all(Record.fromIterableWith(Targets, (Target: Target) => [ Target, FindFn(Target) ]));

const ConcatList = (Indent: number) => <A extends string = string>(Self: ReadonlyArray<A>) => pipe(
    Array.map(Self, (In) => String.repeat(Indent)(" ") + In),
    Array.join(",\n")
);

const FormatList = (Results: Record.ReadonlyRecord<string, ReadonlyArray<string>>): string =>
{
    const FormatListEntry = ([ Target, List ]: readonly [ string, ReadonlyArray<string> ]): string =>
        `${ Code(Target) }:\n` + ConcatList(4)(List);

    return pipe(
        Results,
        Record.toEntries,
        Array.filter(([ , List ]) => List.length > 0),
        Array.map(FormatListEntry),
        Array.join("\n\n")
    );
};

/**
 * The flattened total of every path discovered across all targets, used to
 * short-circuit the command when there is nothing to clean.
 */
const CountResults = (Results: Record.ReadonlyRecord<string, ReadonlyArray<string>>): number =>
    pipe(
        Results,
        Record.values,
        Array.reduce(0, (Total, List) => Total + List.length)
    );

const HandleClean = ({ Confirm, Dry, Path, Targets }: Command.Command.Config.Infer<typeof CleanConfig>) => Effect.gen(function* ()
{
    const Fs = yield* FileSystem.FileSystem;
    const Find = MakeFind(Path);

    /* A variadic argument with `min: 0` yields `[]` rather than falling back to
     * its default when the user supplies no targets, so clean everything then. */
    const Chosen = Targets.length === 0 ? Target : Targets;

    const Results = yield* FindAll(Find, Chosen);

    if (CountResults(Results) === 0)
    {
        yield* Console.log("Nothing to clean.");

        return;
    }

    /* `--dry` wins over everything:  report what would be removed and stop. */
    if (Dry)
    {
        yield* Console.log(FormatList(Results));

        return;
    }

    /* `--safe` shows the same report, then requires an explicit confirmation. */
    if (Confirm)
    {
        yield* Console.log(FormatList(Results));

        const Proceed = yield* Prompt.confirm(
            {
                message: "Delete everything listed above?",
                initial: false
            });

        if (!Proceed)
        {
            yield* Console.log("Aborted.");

            return;
        }
    }

    const Remove = (Item: string): Promise<void> =>
        Effect.runPromise(Fs.remove(Item, { recursive: true, force: true }));

    const Tasks = pipe(
        Results,
        Record.toEntries,
        Array.filter(([ , List ]) => List.length > 0),
        Array.map(([ Name, List ]): ListrTask =>
            ({
                title: `${ Name } (${ List.length })`,
                task: async (_Context, Task): Promise<void> =>
                {
                    for (const Item of List)
                    {
                        Task.output = Item;

                        await Remove(Item);
                    }
                }
            }))
    );

    yield* Effect.tryPromise(
        {
            try: () => new Listr(Tasks, { concurrent: false }).run(),
            catch: (Cause) => Cause instanceof Error ? Cause : new Error(String.isString(Cause) ? Cause : "Failed to clean.")
        });
});

const Description = `Recursively delete all ${ Code("node_modules") } directories, ${ Code("package-lock.json")  }, ${Code("*.tsbuildinfo")} files, and distribution directories (${ Code("dist") } and ${ Code("Distribution") }).`;

export const CleanCommand = pipe(
    Command.make("clean", CleanConfig, HandleClean),
    Command.withDescription(Description),
    Command.withShortDescription(Description)
);
