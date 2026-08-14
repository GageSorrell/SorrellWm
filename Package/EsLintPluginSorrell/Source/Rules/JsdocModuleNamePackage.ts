/**
 * Rule that enforces that a module's `@module` tag begins with its package name.
 *
 * @module @sorrell/eslint-plugin/Rules/JsdocModuleNamePackage
 *
 * @file      JsdocModuleNamePackage.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Fs from "node:fs";
import * as Path from "node:path";
import type { Rule } from "eslint";

/** Captures the first whitespace-delimited token that follows a `@module` tag. */
const ModuleTagRegExp: RegExp = /@module[ \t]+(\S+)/g;

/** File names that ESLint supplies for virtual inputs, such as standard input. */
const VirtualFileNames: ReadonlyArray<string> = [ "", "<input>", "<text>" ];

/** Memoized lookups of a starting directory to its nearest package name. */
const PackageNameCache: Map<string, string | null> = new Map();

/**
 * Read the `name` field from the `package.json` at `PackagePath`, returning
 * `null` when the file is absent, unreadable, malformed, or has no string name.
 *
 * @since 1.0.0
 */
const ReadPackageName = (PackagePath: string): string | null =>
{
    try
    {
        const Parsed: { name?: unknown } | null =
            JSON.parse(Fs.readFileSync(PackagePath, "utf8")) as { name?: unknown } | null;

        if (Parsed !== null && typeof Parsed.name === "string")
        {
            return Parsed.name;
        }
    }
    catch
    {
        /* An absent or malformed package.json simply yields no name. */
    }

    return null;
};

/**
 * Walk upward from `StartDirectory` to the nearest `package.json` and return
 * its `name`, or `null` when none is found or the nearest one has no name.
 *
 * @since 1.0.0
 */
const ResolvePackageName = (StartDirectory: string): string | null =>
{
    const Cached: string | null | undefined = PackageNameCache.get(StartDirectory);

    if (Cached !== undefined)
    {
        return Cached;
    }

    let Result: string | null = null;
    let Directory: string = StartDirectory;
    let Parent: string = Path.dirname(Directory);

    while (Directory !== Parent)
    {
        const PackagePath: string = Path.join(Directory, "package.json");

        /* Stop at the nearest package.json — that is the owning package. */
        if (Fs.existsSync(PackagePath))
        {
            Result = ReadPackageName(PackagePath);
            break;
        }

        Directory = Parent;
        Parent = Path.dirname(Directory);
    }

    PackageNameCache.set(StartDirectory, Result);

    return Result;
};

export/**
       * ESLint rule that reports when a module's `@module` tag is neither the
       * name of its owning package nor a path beneath that name.
       *
       * @since 1.0.0
       */
const JsdocModuleNamePackage: Rule.RuleModule = {
    create(Context: Rule.RuleContext): Rule.RuleListener
    {
        const FilePath: string = Context.filename;

        if (VirtualFileNames.includes(FilePath))
        {
            return { };
        }

        const PackageName: string | null = ResolvePackageName(Path.dirname(FilePath));

        /* Without a named package.json there is nothing to compare against. */
        if (PackageName === null)
        {
            return { };
        }

        const Source: Rule.RuleContext["sourceCode"] = Context.sourceCode;

        return {
            Program(): void
            {
                for (const Comment of Source.getAllComments())
                {
                    /* Only JSDoc block comments, which begin with an asterisk. */
                    const IsJsdoc: boolean =
                        Comment.type === "Block" && Comment.value.startsWith("*");

                    if (!IsJsdoc || Comment.range === undefined)
                    {
                        continue;
                    }

                    ModuleTagRegExp.lastIndex = 0;

                    let Match: RegExpExecArray | null = ModuleTagRegExp.exec(Comment.value);

                    while (Match !== null)
                    {
                        const FullMatch: string | undefined = Match[0];
                        const ModuleValue: string | undefined = Match[1];
                        const IsOwned: boolean =
                            ModuleValue === PackageName
                            || (ModuleValue?.startsWith(PackageName + "/") ?? false);

                        if (FullMatch !== undefined && ModuleValue !== undefined && !IsOwned)
                        {
                            const ValueStart: number =
                                Comment.range[0] + 2 + Match.index + FullMatch.indexOf(ModuleValue);
                            const ValueEnd: number = ValueStart + ModuleValue.length;

                            Context.report({
                                data:
                                {
                                    moduleValue: ModuleValue,
                                    packageName: PackageName
                                },
                                loc:
                                {
                                    end: Source.getLocFromIndex(ValueEnd),
                                    start: Source.getLocFromIndex(ValueStart)
                                },
                                messageId: "mismatch"
                            });
                        }

                        Match = ModuleTagRegExp.exec(Comment.value);
                    }
                }
            }
        };
    },
    meta:
    {
        docs:
        {
            description: "Enforce that a module's `@module` tag begins with its package name.",
            recommended: false
        },
        messages:
        {
            mismatch:
                "`@module` \"{{ moduleValue }}\" must begin with the package name \"{{ packageName }}\"."
        },
        schema: [],
        type: "problem"
    }
};

export default JsdocModuleNamePackage;
