/**
 * @file      List.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as Platform from "@effect/platform";
import { Ansi, AnsiDoc, Color } from "@effect/printer-ansi";
import { Command, Options } from "@sorrell/effect/unstable/cli";
import { ConfigFileError, load, supportedFileExtensions } from "@sorrell/effect/unstable/cli/ConfigFile";
import { Code } from "@sorrell/cli-utilities/format";
import { CodeAuger } from "../../Shared/Utility.js";
import { Array, Console, Effect, Option, pipe } from "effect";
import { MakeConfig } from "../../Shared/SubCommand.js";
import { GetDependencies, GetNodeModulesDirectory } from "@sorrell/utilities/npm/effect";
import { LoadConfig } from "../Shared/index.js";
import Table from "cli-table3";
/* eslint-disable-next-line @typescript-eslint/typedef */
const ListConfig = MakeConfig({
    Rich: pipe(Options.boolean("rich"), Options.withDefault(true), Options.withDescription(`Unless specified and is ${Code("false")}, ` +
        "the output will state whether a given installed provider" +
        `is currently listed in your ${Code(`${CodeAuger}.config`)} file, ` +
        "and whether it is enabled in your project."))
});
function GetInstalledProviders(Options) {
    return Effect.gen(function* () {
        const Dependencies = yield* GetDependencies();
        function HasProviderFile(Dependency) {
            return Effect.gen(function* () {
                const NodeModulesDirectory = yield* GetNodeModulesDirectory(Options.Cwd);
                const Path = yield* Platform.Path.Path;
                const Fs = yield* Platform.FileSystem.FileSystem;
                const DependencyPath = Path.resolve(NodeModulesDirectory, Dependency);
                const CandidateConfigNames = Array.map(supportedFileExtensions, (Extension) => `${CodeAuger}.provider.${Extension}`);
                const Files = yield* Fs.readDirectory(DependencyPath);
                return pipe(Files, Array.map((Value, _Index) => Path.basename(Value)), Array.findFirst(CandidateConfigNames.includes), Option.isSome);
            });
        }
        return yield* Effect.filter(Dependencies, HasProviderFile);
    });
}
function IsRich(Options) {
    return Effect.gen(function* () {
        if (Options.Rich) {
            const ConsumerHasConfig = (yield* pipe(LoadConfig.Consumer(Options.Cwd), Effect.catchAll((_Error) => {
                return Effect.succeed(false);
            }))) !== false;
            if (ConsumerHasConfig) {
                return true;
            }
        }
        return false;
    });
}
function ToSymbol(Value) {
    const Check = AnsiDoc.annotate(AnsiDoc.text("✓"), Color.green);
    const Cross = AnsiDoc.annotate(AnsiDoc.text("✗"), Color.red);
    return Value
        ? Check
        : Cross;
}
const TableOutput = new Table({
    head: ["Feature", "Enabled", "Cached"],
    colWidths: [32, 12, 12],
    colAligns: ["left", "center", "center"],
    style: {
        head: ["hex(#FFA500)", "bold"],
        border: ["hex(#FFD700)"],
        "padding-left": 1,
        "padding-right": 1
    },
    chars: {
        top: "═",
        "top-mid": "╤",
        "top-left": "╔",
        "top-right": "╗",
        bottom: "═",
        "bottom-mid": "╧",
        "bottom-left": "╚",
        "bottom-right": "╝",
        left: "║",
        "left-mid": "╟",
        mid: "─",
        "mid-mid": "┼",
        right: "║",
        "right-mid": "╢",
        middle: "│"
    }
});
function PrintList(Options) {
    return Effect.gen(function* () {
        const InstalledProviders = yield* GetInstalledProviders(Options);
        if (Options.Rich) {
        }
        else {
            function ToLineItem(Provider) {
                return AnsiDoc.hsep([
                    AnsiDoc.annotate(AnsiDoc.text("●"), Ansi.blackBright),
                    AnsiDoc.text(Provider)
                ]);
            }
            const ListDoc = AnsiDoc.vsep([
                AnsiDoc.annotate(AnsiDoc.text("Generation Plan"), Ansi.bold),
                AnsiDoc.text(""),
                ...InstalledProviders.map(ToLineItem)
            ]);
            yield* Console.log(AnsiDoc.render(ListDoc, { style: "pretty" }));
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
            Rich: yield* IsRich(Options)
        };
        yield* PrintList(Patched);
    });
}
export const ListCommand = Command.make("ls", ListConfig, HandleList);
//# sourceMappingURL=List.Command.js.map