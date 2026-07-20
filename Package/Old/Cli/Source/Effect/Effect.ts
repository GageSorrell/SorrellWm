/**
 * @file      Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Console, Context, Effect } from "effect";
import type { FGlobalOptions } from "../Options/Options.Types.js";
import type { TFunction } from "@sorrell/utilities/functional";

/* eslint-disable @typescript-eslint/no-namespace */

export class FStepService extends Context.Tag("LogService")<
    FStepService,
    {
        readonly Log: TFunction<string>;
    }
>() { }

export function ProvideServices<A, E, R>(
    silent: FGlobalOptions["silent"],
    InEffect: Effect.Effect<A, E, R | FStepService>
): Effect.Effect<A, E, R | FStepService>
{
    return Effect.provideService(InEffect, FStepService, { Log: GetWithStep(silent) });
}

export function GetWithStep(silent: FGlobalOptions["silent"]): TFunction<string>
{
    return silent
        ? function(_: string) { }
        : function(Message: string) { Console.log(Message); };
}
