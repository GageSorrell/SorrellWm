/* File:      Initialize.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import type { FArguments } from "./Initialize.Types.js";

const GetArguments = async (): Promise<FArguments> =>
{
    const AsksForHelp: boolean = process.argv.some((Argument: string): boolean =>
    {
        return Argument.toLowerCase().includes("help") || Argument.includes("?");
    });

    if (AsksForHelp)
    {
        return undefined;
    }
    console.log("process.argv", process.argv);
    return { };
};

const ShowHelp = async (): Promise<void> =>
{
    const HelpMessage: string = `electron-react-event (c) 2026 Gage Sorrell <gage@sorrell.sh>.


`;
    console.log(HelpMessage);
};

const Main = async (): Promise<void> =>
{
    const Arguments: FArguments | undefined = await GetArguments();
    if (Arguments === undefined)
    {
        await ShowHelp();
        process.exit(1);
    }
};

Main();
