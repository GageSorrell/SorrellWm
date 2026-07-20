/**
 * @file      Intellisense.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import type { PropsWithChildren, ReactNode } from "react";
import GitHubDarkDefaultTheme from "@shikijs/themes/github-dark-default";
import GitHubLightDefaultTheme from "@shikijs/themes/github-light-default";
import type { PIntellisense } from "./Intellisense.Types";
import ReactMarkdown from "react-markdown";
import type { ThemeRegistration } from "shiki";
import { UseTheme } from "@sorrell/react/client";

export function Intellisense({ Markdown }: PIntellisense): ReactNode
{
    return (
        <div style={ { padding: 14 } }>
            <ReactMarkdown
                components={ {
                    strong: ({ children }: PropsWithChildren): ReactNode =>
                    {
                        const { Theme } = UseTheme();

                        const EditorTheme: ThemeRegistration = Theme ===  "Dark"
                            ? GitHubDarkDefaultTheme
                            : GitHubLightDefaultTheme;
                        return (
                            <b style={ { color: EditorTheme.colors?.["list.highlightForeground"]  } }>
                                { children }
                            </b>
                        );
                    }
                } }>
                { Markdown }
            </ReactMarkdown>
        </div>
    );
};
