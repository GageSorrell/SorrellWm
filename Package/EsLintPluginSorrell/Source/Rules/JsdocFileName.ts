/**
 * Rule that enforces that a module's `@file` JSDoc tag matches its file name.
 *
 * @module @sorrell/eslint-plugin/Rules/JsdocFileName
 *
 * @file      JsdocFileName.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Path from "node:path";
import type { Rule } from "eslint";

/** Captures the first whitespace-delimited token that follows a `@file` tag. */
const FileTagRegExp: RegExp = /@file[ \t]+(\S+)/g;

/** File names that ESLint supplies for virtual inputs, such as standard input. */
const VirtualFileNames: ReadonlyArray<string> = [ "", "<input>", "<text>" ];

export/**
       * ESLint rule that reports when a module's `@file` JSDoc tag does not
       * match the name of the file that contains it.  The offending value is
       * fixable.
       *
       * @since 1.0.0
       */
const JsdocFileName: Rule.RuleModule = {
    create(Context: Rule.RuleContext): Rule.RuleListener
    {
        const FilePath: string = Context.filename;

        /* Nothing can be enforced when the file has no real name. */
        if (VirtualFileNames.includes(FilePath))
        {
            return { };
        }

        const Source: Rule.RuleContext["sourceCode"] = Context.sourceCode;
        const FileName: string = Path.basename(FilePath);

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

                    FileTagRegExp.lastIndex = 0;

                    let Match: RegExpExecArray | null = FileTagRegExp.exec(Comment.value);

                    while (Match !== null)
                    {
                        const FullMatch: string | undefined = Match[0];
                        const TagValue: string | undefined = Match[1];

                        if (FullMatch !== undefined && TagValue !== undefined && TagValue !== FileName)
                        {
                            /*
                             * `Comment.range[0]` points at the leading slash of
                             * the opening `/*`, so two characters are skipped to
                             * reach the text held by `Comment.value`.
                             */
                            const ValueStart: number =
                                Comment.range[0] + 2 + Match.index + FullMatch.indexOf(TagValue);
                            const ValueEnd: number = ValueStart + TagValue.length;

                            Context.report({
                                data:
                                {
                                    fileName: FileName,
                                    tagValue: TagValue
                                },
                                fix(Fixer: Rule.RuleFixer): Rule.Fix
                                {
                                    return Fixer.replaceTextRange([ ValueStart, ValueEnd ], FileName);
                                },
                                loc:
                                {
                                    end: Source.getLocFromIndex(ValueEnd),
                                    start: Source.getLocFromIndex(ValueStart)
                                },
                                messageId: "mismatch"
                            });
                        }

                        Match = FileTagRegExp.exec(Comment.value);
                    }
                }
            }
        };
    },
    meta:
    {
        docs:
        {
            description: "Enforce that a module's `@file` JSDoc tag matches its file name.",
            recommended: false
        },
        fixable: "code",
        messages:
        {
            mismatch: "The `@file` tag \"{{ tagValue }}\" does not match file name \"{{ fileName }}\"."
        },
        schema: [],
        type: "problem"
    }
};

export default JsdocFileName;
