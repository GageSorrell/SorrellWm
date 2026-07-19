/**
 * @file      Event.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

type FPoorBackendEvents = any;
type FPoorResponseAsSuccess = any;
type TEventCallback<Type = unknown> = (...Arguments: Array<unknown>) => Promise<any>;
type TPoorResponseAsFailure<Type> = any;
type FIpcFrontendChannel = string;

export type TIpcCallback<ChannelType extends FIpcFrontendChannel = FIpcFrontendChannel> =
    {
        Channel: ChannelType;
        Callback: TEventCallback<ChannelType>;
    };

export type TPoorEventResponse<Type extends keyof FPoorBackendEvents> =
    | FPoorResponseAsSuccess
    | TPoorResponseAsFailure<Type>;
