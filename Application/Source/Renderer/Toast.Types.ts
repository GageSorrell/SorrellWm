/**
 * @file      Toast.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { useToastController } from "@fluentui/react-components";

export type FDispatchOptions =
    NonNullable<Parameters<ReturnType<typeof useToastController>["dispatchToast"]>[1]>;

export type FDispatchFunction = (Options?: FDispatchOptions) => void;

export type CToast =
{
    INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
    {
        Dispatch: ReturnType<typeof useToastController>["dispatchToast"];
    };
};
