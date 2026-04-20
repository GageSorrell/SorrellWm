/**
 * @file      Confirm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type KeypressEvent,
    type Status,
    type Theme,
    createPrompt,
    isEnterKey,
    makeTheme,
    useKeypress,
    usePrefix,
    useState } from "@inquirer/core";
import type { FConfirmConfig } from "./Confirm.Types.js";
import type { Prompt } from "@inquirer/type";

/**
 * @param Value - The answer.
 * @returns The string to display for the given answer.
 */
function GetAnswerString(Value: boolean): string
{
    return Value ? "Yes" : "No";
}

/* eslint-disable jsdoc/require-jsdoc */

/**
 * An `inquirer` prompt identical to `confirm`, but with more natural handling of keypresses.
 *
 * @param config - The configuration for this prompt.
 *
 * @returns The `boolean` corresponding to the user's choice.
 */
export const Confirm: Prompt<boolean, FConfirmConfig> = createPrompt<boolean, FConfirmConfig>(
    (Configuration: FConfirmConfig, Done: ((Value: boolean) => void)) =>
    {
        const [ status, SetStatus ] = useState<Status>("idle");
        const [ DisplayValue, SetDisplayValue ] = useState("");
        const theme: Theme = makeTheme(Configuration.theme);
        const Prefix: string = usePrefix({ status, theme });

        useKeypress((Key: KeypressEvent) =>
        {
            if (status !== "idle")
            {
                return;
            }

            const KeyName: string = Key.name?.toLowerCase();

            if (KeyName === "y")
            {
                SetDisplayValue(theme.style.answer("Yes"));
                SetStatus("done");
                Done(true);
                return;
            }

            if (KeyName === "n")
            {
                SetDisplayValue(theme.style.answer("No"));
                SetStatus("done");
                Done(false);
                return;
            }

            if (isEnterKey(Key))
            {
                const Answer: boolean = Configuration.default ?? true;
                SetDisplayValue(theme.style.answer(GetAnswerString(Answer)));
                SetStatus("done");
                Done(Answer);
            }
        });

        const DefaultHint: string =
            status === "idle"
                ? ` ${theme.style.defaultAnswer(Configuration.default === false ? "y/N" : "Y/n")}`
                : "";

        return [
            Prefix,
            " ",
            theme.style.message(Configuration.message, status),
            DefaultHint,
            " ",
            DisplayValue
        ].join("");
    }
);

/* eslint-enable jsdoc/require-jsdoc */
