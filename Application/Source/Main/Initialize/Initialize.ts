/**
 * @file      Initialize.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FInitializer, FInitializers } from "./Initialize.Types";
import type { FLogger, FRejectFunction, TPromiseThenFunction } from "../../Shared";
import { app as App } from "electron";
import { GetLogger } from "#/Development/Log/Log";

const InitializationFunctions: FInitializers = { };

let LoggedAppReady: boolean = false;

/**
 * For side effects `import`ed via `SideEffects.ts` that require `app.whenReady()` to be fulfilled.
 */
export async function RegisterInitializationFunction(
    Name: string,
    Initializer: (() => Promise<void>),
    DependencyArray: Array<string> = [ ]
): Promise<void>
{
    const Log: FLogger = GetLogger("Initialize");
    Log(`Going to register initializer with name ${ Name }.`);
    // process.stdout.write(`Going to register initializer with name ${ Name }.\n`);
    await App.whenReady();

    if (!LoggedAppReady)
    {
        LoggedAppReady = true;
        // Log("App is ready!");
        process.stdout.write("App is ready!");
    }

    const PartialInitializer: Partial<FInitializer> =
    {
        DependencyArray,
        IsFulfilled: false
    };

    const WrappedInitializer: Promise<void> = new Promise<void>((
        Resolve: TPromiseThenFunction<void>,
        Reject: FRejectFunction
    ): void =>
    {
        let TimerId: NodeJS.Timeout | undefined = undefined;
        const TimeStarted: number = new Date().getTime();
        const TimeBetweenChecks: number = 250;
        const MaxDuration: number = 60 * 1000;
        let TimeOfLastCheck: number = TimeStarted;

        const Check = (): void =>
        {
            const TimedOut: boolean = (TimeOfLastCheck - TimeStarted) >= MaxDuration;
            if (TimedOut && TimerId !== undefined)
            {
                /* eslint-disable @stylistic/max-len */
                // Log.Error(`Initializer ${ Name } could not be fulfilled.  Its dependencies are ${ DependencyArray.join(", ") }.`);
                clearInterval(TimerId);
                Reject(`Initializer ${ Name } could not be fulfilled.  Its dependencies are ${ DependencyArray.join(", ") }.`);
                /* eslint-enable @stylistic/max-len */
            }

            const AreDependenciesRegistered: boolean = DependencyArray.every(
                (DependencyName: string): boolean =>
                {
                    return DependencyName in InitializationFunctions;
                }
            );

            if (!AreDependenciesRegistered)
            {
                TimeOfLastCheck = new Date().getTime();
                return;
            }

            const AreDependenciesFulfilled: boolean = DependencyArray.every(
                (DependencyName: string): boolean =>
                {
                    if (InitializationFunctions[DependencyName])
                    {
                        const { IsFulfilled } = InitializationFunctions[DependencyName];
                        return IsFulfilled;
                    }
                    else
                    {
                        return false;
                    }
                }
            );

            if (AreDependenciesFulfilled)
            {
                if (TimerId !== undefined)
                {
                    clearInterval(TimerId);
                    Initializer().then((): void =>
                    {
                        PartialInitializer.IsFulfilled = true;
                        Resolve();
                    });
                }
            }

            TimeOfLastCheck = new Date().getTime();
        };

        TimerId = setInterval(Check, TimeBetweenChecks);
    });

    if (Name in InitializationFunctions)
    {
        throw new Error(`Two initializer functions were registered with the same name, "${ Name }".`);
    }

    PartialInitializer.Initializer = WrappedInitializer;

    InitializationFunctions[Name] = PartialInitializer as FInitializer;
}
