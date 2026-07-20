/**
 * @file      List.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
// import { Array, Console, Effect, type FileSystem, type Path as PathService, pipe } from "effect";
import { Command, Flag } from "@sorrell/effect/unstable/cli";
import { Console, Effect, pipe } from "@sorrell/effect";
import { GetDependencies, GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { Code } from "@sorrell/cli-utilities/format";
import { CodeAuger } from "../../Shared/Utility.js";
import { LoadConfig } from "../Shared/index.js";
import { RootCommand } from "../../Shared/Master.Command.js";
import { Terminal } from "@sorrell/effect/Terminal";
// import { GetDependencies, GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
// import { LoadConfig } from "../Shared/index.js";
/* eslint-disable-next-line @typescript-eslint/typedef */
const ListConfig = {
    Rich: pipe(Flag.boolean("rich"), Flag.withDefault(true), Flag.withDescription(`Unless specified and is ${Code("false")}, ` +
        "the output will state whether a given installed provider" +
        `is currently listed in your ${Code(`${CodeAuger}.config`)} file, ` +
        "and whether it is enabled in your project."))
};
const InstalledProviders = Effect.gen(function* () {
    const { Cwd } = yield* RootCommand;
    const Dependencies = yield* GetDependencies(["dependencies", "devDependencies"], Cwd);
    yield* Console.log(`Deps are ${Dependencies.join(", ")}`);
    function HasProviderFile(Dependency) {
        return pipe(Effect.gen(function* () {
            const { Cwd } = yield* RootCommand;
            const NodeModulesDirectory = yield* GetNodeModulesDirectory(Cwd);
            yield* LoadConfig.Provider(Dependency, NodeModulesDirectory);
            return true;
        }), Effect.catch((_In) => {
            return Effect.succeed(false);
        }));
    }
    return yield* Effect.filter(Dependencies, HasProviderFile);
});
// function ToSymbol(Value: boolean): AnsiDoc.Doc<Color.Color>
// {
//     const Check: AnsiDoc.Doc<Color.Color> =
//         AnsiDoc.annotate(AnsiDoc.text("✓"), Color.green);
//     const Cross: AnsiDoc.Doc<Color.Color> =
//         AnsiDoc.annotate(AnsiDoc.text("✗"), Color.red);
//     return Value
//         ? Check
//         : Cross;
// }
// const TableOutput = new Table({
//     head: ["Feature", "Enabled", "Cached"],
//     colWidths: [32, 12, 12],
//     colAligns: ["left", "center", "center"],
//     style:
//     {
//         head: ["hex(#FFA500)", "bold"],
//         border: ["hex(#FFD700)"],
//         "padding-left": 1,
//         "padding-right": 1
//     },
//     chars:
//     {
//         top: "═",
//         "top-mid": "╤",
//         "top-left": "╔",
//         "top-right": "╗",
//         bottom: "═",
//         "bottom-mid": "╧",
//         "bottom-left": "╚",
//         "bottom-right": "╝",
//         left: "║",
//         "left-mid": "╟",
//         mid: "─",
//         "mid-mid": "┼",
//         right: "║",
//         "right-mid": "╢",
//         middle: "│"
//     }
// })
function PrintList(Options) {
    return Effect.gen(function* () {
        if (Options.Rich) {
            const Term = yield* Terminal;
            yield* pipe(InstalledProviders, Effect.flatMap(Effect.forEach(Term.display)));
            yield* Term.display("Foo");
            yield* pipe(InstalledProviders, Effect.flatMap(Effect.forEach(Console.log)));
            yield* Term.display("Foo\n\n");
            yield* Console.log("Foo\n\n");
            yield* InstalledProviders.pipe(Effect.flatMap(Effect.forEach((Element) => Term.display(Element))));
            // yield* Effect.map(yield* InstalledProviders, Term.display);
            // yield* Term.display(`InstalledProviders.length === ${ (yield* InstalledProviders).length }`);
        }
        else {
            // function ToLineItem(Provider: string): AnsiDoc.Doc<Ansi.Ansi>
            // {
            //     return AnsiDoc.hsep([
            //         AnsiDoc.annotate(AnsiDoc.text("●"), Ansi.blackBright),
            //         AnsiDoc.text(Provider)
            //     ]);
            // }
            // const ListDoc = AnsiDoc.vsep([
            //     AnsiDoc.annotate(AnsiDoc.text("Generation Plan"), Ansi.bold),
            //     AnsiDoc.text(""),
            //     ...InstalledProviders.map(ToLineItem)
            // ])
            // yield* Console.log(
            //     AnsiDoc.render(
            //         ListDoc,
            //         { style: "pretty" }
            //     )
            // );
            // for (const Row of Rows)
            // {
            //     TableOutput.push([
            //         Row.Name,
            //         ToSymbol(Row.Enabled),
            //         ToSymbol(Row.Cached)
            //     ])
            // }
        }
    });
}
function HandleList(Options) {
    return Effect.gen(function* () {
        const Patched = {
            ...Options,
            // @TODO
            Rich: true
            // Rich: Options.
        };
        yield* PrintList(Patched);
    });
}
export const ListCommand = Command.make("ls", ListConfig, HandleList);
//# sourceMappingURL=List.Command.js.map