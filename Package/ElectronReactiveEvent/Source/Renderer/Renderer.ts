/* File:      Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace, jsdoc/require-jsdoc, react-hooks/exhaustive-deps */

import type { Callback as CallbackBase, SendResponse } from "../Callback/index.js";
import { type IpcRenderer, type IpcRendererEvent, ipcRenderer } from "electron/renderer";
import type { MainOwner, RendererOwner } from "../Decl.Types.js";
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Channel } from "../Channel.Types.js";
import { EmptyRequestParameter } from "../Callback/Callback.js";
import type { PackageKeys } from "../Internal/index.js";
import type { ReactiveEventHookOptions } from "./Hook.Types.ts.old";
import type { Request } from "../Callback/Callback.Types.js";
// import { getReactiveIpcRenderer } from "./Renderer.js";

// type GetReactiveIpcRendererOptions = Parameters<typeof getReactiveIpcRenderer>[0];

type MainChannelOuter<PackageKey extends PackageKeys> =
    Channel.Any<PackageKey, MainOwner>;

type RendererChannelOuter<PackageKey extends PackageKeys> =
    Channel.Any<PackageKey, RendererOwner>;

type RendererCallback<
    PackageKey extends PackageKeys,
    ChannelType extends MainChannelOuter<PackageKey>
> = CallbackBase<
    PackageKey,
    MainOwner,
    IpcRendererEvent,
    ChannelType
>;

type RendererResponse<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannelOuter<PackageKey>
> = SendResponse<PackageKey, RendererOwner, ChannelType>;

type RendererOn<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback: RendererCallback<PackageKey, ChannelType>
        ): void;
    };

type RendererOff<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback: RendererCallback<PackageKey, ChannelType>
        ): void;
    };

type RendererRemoveAllListeners<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannelOuter<PackageKey>>(
            Channel?: ChannelType
        ): void;
    };

type RendererHasListener<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannelOuter<PackageKey>>(
            Channel: ChannelType,
            Callback?: RendererCallback<PackageKey, ChannelType>
        ): boolean;
    };

type RendererSend<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
            Channel: ChannelType
        ): Promise<RendererResponse<PackageKey, ChannelType>>;

        <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
            Channel: ChannelType,
            RequestValue: Request<PackageKey, RendererOwner, ChannelType>
        ): Promise<RendererResponse<PackageKey, ChannelType>>;
    };

type RendererInvoke<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
            Channel: ChannelType
        ): Promise<RendererResponse<PackageKey, ChannelType>>;

        <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
            Channel: ChannelType,
            RequestValue: Request<PackageKey, RendererOwner, ChannelType>
        ): Promise<RendererResponse<PackageKey, ChannelType>>;
    };

type RendererFunctionCollection<PackageKey extends PackageKeys> =
    {
        addListener: RendererOn<PackageKey>;
        removeListener: RendererOff<PackageKey>;
        removeAllListeners: RendererRemoveAllListeners<PackageKey>;

        on: RendererOn<PackageKey>;
        once: RendererOn<PackageKey>;
        off: RendererOff<PackageKey>;

        hasListener: RendererHasListener<PackageKey>;

        send: RendererSend<PackageKey>;
        invoke: RendererInvoke<PackageKey>;
    };

type SuspenseResource<ResponseType> =
    | {
        Status: "pending";
        Promise: Promise<ResponseType>;
    }
    | {
        Status: "fulfilled";
        Value: ResponseType;
    }
    | {
        Status: "rejected";
        Error: unknown;
    };

function CreateSuspenseResource<ResponseType>(
    PromiseFactory: () => Promise<ResponseType>
): SuspenseResource<ResponseType>
{
    const Resource: SuspenseResource<ResponseType> =
        {
            Promise: Promise.resolve(undefined as ResponseType),
            Status: "pending"
        };

    const PromiseValue: Promise<ResponseType> = Promise.resolve()
        .then(PromiseFactory)
        .then((Value: ResponseType): ResponseType =>
        {
            Object.assign(Resource, {
                Status: "fulfilled",
                Value
            } as const);

            return Value;
        })
        .catch((Error: unknown): never =>
        {
            Object.assign(Resource, {
                Error,
                Status: "rejected"
            } as const);

            throw Error;
        });

    Resource.Promise = PromiseValue;

    return Resource;
}

function ReadSuspenseResource<ResponseType>(
    Resource: SuspenseResource<ResponseType>
): ResponseType
{
    switch (Resource.Status)
    {
        case "pending":
        {
            throw Resource.Promise;
        }

        case "rejected":
        {
            throw Resource.Error;
        }

        case "fulfilled":
        {
            return Resource.Value;
        }
    }
}

function useLatest<ValueType>(Value: ValueType): RefObject<ValueType>
{
    const ValueReference: RefObject<ValueType> = useRef<ValueType>(Value);

    ValueReference.current = Value;

    return ValueReference;
}

export namespace Hooks
{
    export type AsyncResult<ResponseType> = Readonly<[
        Value: ResponseType | undefined,
        IsPending: boolean,
        Error: unknown
    ]>;

    export type DeferredOn<PackageKey extends PackageKeys> = RendererOn<PackageKey>;
    export type DeferredAddListener<PackageKey extends PackageKeys> = RendererOn<PackageKey>;
    export type DeferredOnce<PackageKey extends PackageKeys> = RendererOn<PackageKey>;

    export type DeferredOff<PackageKey extends PackageKeys> = RendererOff<PackageKey>;
    export type DeferredRemoveListener<PackageKey extends PackageKeys> = RendererOff<PackageKey>;

    export type DeferredRemoveAllListeners<PackageKey extends PackageKeys> =
        RendererRemoveAllListeners<PackageKey>;

    export type DeferredHasListener<PackageKey extends PackageKeys> =
        RendererHasListener<PackageKey>;

    export type DeferredSend<PackageKey extends PackageKeys> = RendererSend<PackageKey>;
    export type DeferredInvoke<PackageKey extends PackageKeys> = RendererInvoke<PackageKey>;

    export type UseOn<PackageKey extends PackageKeys> =
        {
            <ChannelType extends MainChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Callback: RendererCallback<PackageKey, ChannelType>
            ): void;
        };

    export type UseAddListener<PackageKey extends PackageKeys> = UseOn<PackageKey>;
    export type UseOnce<PackageKey extends PackageKeys> = UseOn<PackageKey>;

    export type UseOff<PackageKey extends PackageKeys> =
        {
            <ChannelType extends MainChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Callback: RendererCallback<PackageKey, ChannelType>
            ): void;
        };

    export type UseRemoveListener<PackageKey extends PackageKeys> = UseOff<PackageKey>;

    export type UseRemoveAllListeners<PackageKey extends PackageKeys> =
        {
            <ChannelType extends MainChannelOuter<PackageKey>>(
                Channel?: ChannelType
            ): void;
        };

    export type UseHasListener<PackageKey extends PackageKeys> =
        {
            <ChannelType extends MainChannelOuter<PackageKey>>(
                Channel: ChannelType,
                Callback?: RendererCallback<PackageKey, ChannelType>
            ): boolean;
        };

    export type UseSend<PackageKey extends PackageKeys> =
        {
            <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                Suspends?: false | undefined
            ): AsyncResult<RendererResponse<PackageKey, ChannelType>>;

            <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                Suspends: true
            ): RendererResponse<PackageKey, ChannelType>;

            <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                RequestValue: Request<PackageKey, RendererOwner, ChannelType>,
                Suspends?: false | undefined
            ): AsyncResult<RendererResponse<PackageKey, ChannelType>>;

            <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                RequestValue: Request<PackageKey, RendererOwner, ChannelType>,
                Suspends: true
            ): RendererResponse<PackageKey, ChannelType>;
        };

    export type UseInvoke<PackageKey extends PackageKeys> =
        {
            <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                Suspends?: false | undefined
            ): AsyncResult<RendererResponse<PackageKey, ChannelType>>;

            <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                Suspends: true
            ): RendererResponse<PackageKey, ChannelType>;

            <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                RequestValue: Request<PackageKey, RendererOwner, ChannelType>,
                Suspends?: false | undefined
            ): AsyncResult<RendererResponse<PackageKey, ChannelType>>;

            <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
                Channel: ChannelType,
                RequestValue: Request<PackageKey, RendererOwner, ChannelType>,
                Suspends: true
            ): RendererResponse<PackageKey, ChannelType>;
        };

    export type ReactiveIpcRendererHooks<PackageKey extends PackageKeys> =
        {
            useAddListener: UseAddListener<PackageKey>;
            useDeferredAddListener: () => Readonly<[ DeferredAddListener<PackageKey> ]>;

            useOn: UseOn<PackageKey>;
            useDeferredOn: () => Readonly<[ DeferredOn<PackageKey> ]>;

            useOnce: UseOnce<PackageKey>;
            useDeferredOnce: () => Readonly<[ DeferredOnce<PackageKey> ]>;

            useOff: UseOff<PackageKey>;
            useDeferredOff: () => Readonly<[ DeferredOff<PackageKey> ]>;

            useRemoveListener: UseRemoveListener<PackageKey>;
            useDeferredRemoveListener: () => Readonly<[ DeferredRemoveListener<PackageKey> ]>;

            useRemoveAllListeners: UseRemoveAllListeners<PackageKey>;
            useDeferredRemoveAllListeners: () => Readonly<[ DeferredRemoveAllListeners<PackageKey> ]>;

            useHasListener: UseHasListener<PackageKey>;
            useDeferredHasListener: () => Readonly<[ DeferredHasListener<PackageKey> ]>;

            useSend: UseSend<PackageKey>;
            useDeferredSend: () => Readonly<[ DeferredSend<PackageKey> ]>;

            useInvoke: UseInvoke<PackageKey>;
            useDeferredInvoke: () => Readonly<[ DeferredInvoke<PackageKey> ]>;
        };
}

function useMountedPromise<ResponseType>(
    PromiseFactory: () => Promise<ResponseType>,
    Suspends?: false | undefined
): Hooks.AsyncResult<ResponseType>;
function useMountedPromise<ResponseType>(
    PromiseFactory: () => Promise<ResponseType>,
    Suspends: true
): ResponseType;
function useMountedPromise<ResponseType>(
    PromiseFactory: () => Promise<ResponseType>,
    Suspends: boolean = false
): ResponseType | Hooks.AsyncResult<ResponseType>
{
    const [ State, SetState ] = useState<{
        Value: ResponseType | undefined;
        IsPending: boolean;
        Error: unknown;
    }>(() =>
    {
        return {
            Error: undefined,
            IsPending: Suspends !== true,
            Value: undefined
        };
    });

    const SuspenseResource: SuspenseResource<ResponseType> | undefined = useMemo(
        (): SuspenseResource<ResponseType> | undefined =>
        {
            return Suspends
                ? CreateSuspenseResource(PromiseFactory)
                : undefined;
        },
        [ PromiseFactory, Suspends ]
    );

    useEffect((): (() => void) | void =>
    {
        if (Suspends)
        {
            return;
        }

        let IsCancelled: boolean = false;

        SetState({
            Error: undefined,
            IsPending: true,
            Value: undefined
        });

        void PromiseFactory()
            .then((Value: ResponseType): void =>
            {
                if (IsCancelled)
                {
                    return;
                }

                SetState({
                    Error: undefined,
                    IsPending: false,
                    Value
                });
            })
            .catch((Error: unknown): void =>
            {
                if (IsCancelled)
                {
                    return;
                }

                SetState({
                    Error,
                    IsPending: false,
                    Value: undefined
                });
            });

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ PromiseFactory, Suspends ]);

    if (Suspends)
    {
        return ReadSuspenseResource(SuspenseResource as SuspenseResource<ResponseType>);
    }

    return [
        State.Value,
        State.IsPending,
        State.Error
    ] as const;
}

function GetRequestValueAndSuspends(
    ArgumentVector: ReadonlyArray<unknown>
): Readonly<{
    RequestValue: unknown;
    Suspends: boolean;
}>
{
    if (ArgumentVector.length === 0)
    {
        return {
            RequestValue: EmptyRequestParameter,
            Suspends: false
        } as const;
    }

    if (ArgumentVector.length === 1)
    {
        return typeof ArgumentVector[0] === "boolean"
            ? {
                RequestValue: EmptyRequestParameter,
                Suspends: ArgumentVector[0] === true
            } as const
            : {
                RequestValue: ArgumentVector[0],
                Suspends: false
            } as const;
    }

    return {
        RequestValue: ArgumentVector[0],
        Suspends: ArgumentVector[1] === true
    } as const;
}

export function getReactiveIpcRendererHooks<PackageKey extends PackageKeys>(
    _Options?: ReactiveEventHookOptions
): Hooks.ReactiveIpcRendererHooks<PackageKey>
{
    type MainChannel = MainChannelOuter<PackageKey>;
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    type RendererChannel = RendererChannelOuter<PackageKey>;

    // const ReactiveIpcRenderer: RendererFunctionCollection<PackageKey> =
    //     getReactiveIpcRenderer<PackageKey>(Options as never) as RendererFunctionCollection<PackageKey>;
    const ReactiveIpcRenderer: IpcRenderer = ipcRenderer;

    function useDeferredOn(): Readonly<[ Hooks.DeferredOn<PackageKey> ]>
    {
        const DeferredOn: Hooks.DeferredOn<PackageKey> = useCallback(((
            Channel: MainChannel,
            Callback: unknown
        ): void =>
        {
            (ReactiveIpcRenderer.on as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                Callback
            );
        }) as Hooks.DeferredOn<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredOn<PackageKey> ]> =>
            {
                return [ DeferredOn ] as const;
            },
            [ DeferredOn ]
        );
    }

    function useDeferredAddListener(): Readonly<[ Hooks.DeferredAddListener<PackageKey> ]>
    {
        const DeferredAddListener: Hooks.DeferredAddListener<PackageKey> = useCallback(((
            Channel: unknown,
            Callback: unknown
        ): void =>
        {
            (ReactiveIpcRenderer.addListener as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                Callback
            );
        }) as Hooks.DeferredAddListener<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredAddListener<PackageKey> ]> =>
            {
                return [ DeferredAddListener ] as const;
            },
            [ DeferredAddListener ]
        );
    }

    function useDeferredOnce(): Readonly<[ Hooks.DeferredOnce<PackageKey> ]>
    {
        const DeferredOnce: Hooks.DeferredOnce<PackageKey> = useCallback(((
            Channel: unknown,
            Callback: unknown
        ): void =>
        {
            (ReactiveIpcRenderer.once as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                Callback
            );
        }) as Hooks.DeferredOnce<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredOnce<PackageKey> ]> =>
            {
                return [ DeferredOnce ] as const;
            },
            [ DeferredOnce ]
        );
    }

    function useDeferredOff(): Readonly<[ Hooks.DeferredOff<PackageKey> ]>
    {
        const DeferredOff: Hooks.DeferredOff<PackageKey> = useCallback(((
            Channel: MainChannelOuter,
            Callback: unknown
        ): void =>
        {
            ReactiveIpcRenderer.off(
                Channel,
                Callback
            );
        }) as Hooks.DeferredOff<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredOff<PackageKey> ]> =>
            {
                return [ DeferredOff ] as const;
            },
            [ DeferredOff ]
        );
    }

    function useDeferredRemoveListener(): Readonly<[ Hooks.DeferredRemoveListener<PackageKey> ]>
    {
        const DeferredRemoveListener: Hooks.DeferredRemoveListener<PackageKey> =
            useCallback((<ChannelType extends MainChannel>(
                Channel: ChannelType,
                Callback: RendererCallback<PackageKey, typeof Channel>
            ): void =>
            {
                ReactiveIpcRenderer.removeListener(Channel, Callback);
            }) as Hooks.DeferredRemoveListener<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredRemoveListener<PackageKey> ]> =>
            {
                return [ DeferredRemoveListener ] as const;
            },
            [ DeferredRemoveListener ]
        );
    }

    function useDeferredRemoveAllListeners(): Readonly<[ Hooks.DeferredRemoveAllListeners<PackageKey> ]>
    {
        const DeferredRemoveAllListeners: Hooks.DeferredRemoveAllListeners<PackageKey> =
            useCallback((<ChannelType extends MainChannel>(
                Channel?: ChannelType
            ): void =>
            {
                ReactiveIpcRenderer.removeAllListeners(Channel);
            }) as Hooks.DeferredRemoveAllListeners<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredRemoveAllListeners<PackageKey> ]> =>
            {
                return [ DeferredRemoveAllListeners ] as const;
            },
            [ DeferredRemoveAllListeners ]
        );
    }

    function useDeferredHasListener(): Readonly<[ Hooks.DeferredHasListener<PackageKey> ]>
    {
        const DeferredHasListener = useCallback(((
            Channel: unknown,
            Callback?: unknown
        ): boolean =>
        {
            return (ReactiveIpcRenderer.hasListener as (...ArgumentVector: Array<unknown>) => boolean)(
                Channel,
                Callback
            );
        }) as Hooks.DeferredHasListener<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredHasListener<PackageKey> ]> =>
            {
                return [ DeferredHasListener ] as const;
            },
            [ DeferredHasListener ]
        );
    }

    function useDeferredSend(): Readonly<[ Hooks.DeferredSend<PackageKey> ]>
    {
        const DeferredSend = useCallback(((
            Channel: unknown,
            RequestValue: unknown = EmptyRequestParameter
        ): Promise<unknown> =>
        {
            return RequestValue === EmptyRequestParameter
                ? (ReactiveIpcRenderer.send as (Channel: unknown) => Promise<unknown>)(Channel)
                : (ReactiveIpcRenderer.send as (
                    Channel: unknown,
                    RequestValue: unknown
                ) => Promise<unknown>)(Channel, RequestValue);
        }) as Hooks.DeferredSend<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredSend<PackageKey> ]> =>
            {
                return [ DeferredSend ] as const;
            },
            [ DeferredSend ]
        );
    }

    function useDeferredInvoke(): Readonly<[ Hooks.DeferredInvoke<PackageKey> ]>
    {
        const DeferredInvoke = useCallback(((
            Channel: unknown,
            RequestValue: unknown = EmptyRequestParameter
        ): Promise<unknown> =>
        {
            return RequestValue === EmptyRequestParameter
                ? (ReactiveIpcRenderer.invoke as (Channel: unknown) => Promise<unknown>)(Channel)
                : (ReactiveIpcRenderer.invoke as (
                    Channel: unknown,
                    RequestValue: unknown
                ) => Promise<unknown>)(Channel, RequestValue);
        }) as Hooks.DeferredInvoke<PackageKey>, [ ReactiveIpcRenderer ]);

        return useMemo(
            (): Readonly<[ Hooks.DeferredInvoke<PackageKey> ]> =>
            {
                return [ DeferredInvoke ] as const;
            },
            [ DeferredInvoke ]
        );
    }

    const useOn: Hooks.UseOn<PackageKey> = ((
        Channel: unknown,
        Callback: unknown
    ): void =>
    {
        const CallbackReference = useLatest(Callback);

        useEffect((): (() => void) =>
        {
            const InternalCallback = ((...ArgumentVector: Array<unknown>): unknown =>
            {
                return (CallbackReference.current as (...ArgumentVector: Array<unknown>) => unknown)(
                    ...ArgumentVector
                );
            }) as RendererCallback<PackageKey, MainChannelOuter<PackageKey>>;

            (ReactiveIpcRenderer.on as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                InternalCallback
            );

            return (): void =>
            {
                (ReactiveIpcRenderer.off as (...ArgumentVector: Array<unknown>) => void)(
                    Channel,
                    InternalCallback
                );
            };
        }, [ Channel, CallbackReference ]);
    }) as Hooks.UseOn<PackageKey>;

    const useAddListener: Hooks.UseAddListener<PackageKey> = ((
        Channel: unknown,
        Callback: unknown
    ): void =>
    {
        const CallbackReference = useLatest(Callback);

        useEffect((): (() => void) =>
        {
            const InternalCallback = ((...ArgumentVector: Array<unknown>): unknown =>
            {
                return (CallbackReference.current as (...ArgumentVector: Array<unknown>) => unknown)(
                    ...ArgumentVector
                );
            }) as RendererCallback<PackageKey, MainChannelOuter<PackageKey>>;

            (ReactiveIpcRenderer.addListener as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                InternalCallback
            );

            return (): void =>
            {
                (ReactiveIpcRenderer.removeListener as (...ArgumentVector: Array<unknown>) => void)(
                    Channel,
                    InternalCallback
                );
            };
        }, [ Channel, CallbackReference ]);
    }) as Hooks.UseAddListener<PackageKey>;

    const useOnce: Hooks.UseOnce<PackageKey> = ((
        Channel: unknown,
        Callback: unknown
    ): void =>
    {
        const CallbackReference = useLatest(Callback);

        useEffect((): (() => void) =>
        {
            const InternalCallback = ((...ArgumentVector: Array<unknown>): unknown =>
            {
                return (CallbackReference.current as (...ArgumentVector: Array<unknown>) => unknown)(
                    ...ArgumentVector
                );
            }) as RendererCallback<PackageKey, MainChannelOuter<PackageKey>>;

            (ReactiveIpcRenderer.once as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                InternalCallback
            );

            return (): void =>
            {
                (ReactiveIpcRenderer.off as (...ArgumentVector: Array<unknown>) => void)(
                    Channel,
                    InternalCallback
                );
            };
        }, [ Channel, CallbackReference ]);
    }) as Hooks.UseOnce<PackageKey>;

    const useOff: Hooks.UseOff<PackageKey> = ((
        Channel: unknown,
        Callback: unknown
    ): void =>
    {
        useEffect((): void =>
        {
            (ReactiveIpcRenderer.off as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                Callback
            );
        }, [ Channel, Callback ]);
    }) as Hooks.UseOff<PackageKey>;

    const useRemoveListener: Hooks.UseRemoveListener<PackageKey> = ((
        Channel: unknown,
        Callback: unknown
    ): void =>
    {
        useEffect((): void =>
        {
            (ReactiveIpcRenderer.removeListener as (...ArgumentVector: Array<unknown>) => void)(
                Channel,
                Callback
            );
        }, [ Channel, Callback ]);
    }) as Hooks.UseRemoveListener<PackageKey>;

    const useRemoveAllListeners: Hooks.UseRemoveAllListeners<PackageKey> = ((
        Channel?: unknown
    ): void =>
    {
        useEffect((): void =>
        {
            (ReactiveIpcRenderer.removeAllListeners as (...ArgumentVector: Array<unknown>) => void)(
                Channel
            );
        }, [ Channel ]);
    }) as Hooks.UseRemoveAllListeners<PackageKey>;

    const useHasListener: Hooks.UseHasListener<PackageKey> = ((
        Channel: unknown,
        Callback?: unknown
    ): boolean =>
    {
        return useMemo((): boolean =>
        {
            return (ReactiveIpcRenderer.hasListener as (...ArgumentVector: Array<unknown>) => boolean)(
                Channel,
                Callback
            );
        }, [ Channel, Callback ]);
    }) as Hooks.UseHasListener<PackageKey>;

    /*
     * Runtime note:
     * With the requested signature shape, a two-argument call is ambiguous when a request
     * payload itself is a boolean.  This implementation treats a single boolean second
     * argument as `Suspends` rather than as the request payload.
     */
    const useSend: Hooks.UseSend<PackageKey> = ((
        Channel: unknown,
        ...ArgumentVector: Array<unknown>
    ): unknown =>
    {
        const {
            RequestValue,
            Suspends
        } = GetRequestValueAndSuspends(ArgumentVector);

        const PromiseFactory = useCallback(async (): Promise<unknown> =>
        {
            return RequestValue === EmptyRequestParameter
                ? await (ReactiveIpcRenderer.send as (Channel: unknown) => Promise<unknown>)(Channel)
                : await (ReactiveIpcRenderer.send as (
                    Channel: unknown,
                    RequestValue: unknown
                ) => Promise<unknown>)(Channel, RequestValue);
        }, [ Channel, RequestValue ]);

        return useMountedPromise(PromiseFactory, Suspends);
    }) as Hooks.UseSend<PackageKey>;

    const useInvoke: Hooks.UseInvoke<PackageKey> = ((
        Channel: unknown,
        ...ArgumentVector: Array<unknown>
    ): unknown =>
    {
        const {
            RequestValue,
            Suspends
        } = GetRequestValueAndSuspends(ArgumentVector);

        const PromiseFactory = useCallback(async (): Promise<unknown> =>
        {
            return RequestValue === EmptyRequestParameter
                ? await (ReactiveIpcRenderer.invoke as (Channel: unknown) => Promise<unknown>)(Channel)
                : await (ReactiveIpcRenderer.invoke as (
                    Channel: unknown,
                    RequestValue: unknown
                ) => Promise<unknown>)(Channel, RequestValue);
        }, [ Channel, RequestValue ]);

        return useMountedPromise(PromiseFactory, Suspends);
    }) as Hooks.UseInvoke<PackageKey>;

    const HooksCollection: Hooks.ReactiveIpcRendererHooks<PackageKey> =
        {
            useAddListener,
            useDeferredAddListener,

            useOn,
            useDeferredOn,

            useOnce,
            useDeferredOnce,

            useOff,
            useDeferredOff,

            useRemoveListener,
            useDeferredRemoveListener,

            useRemoveAllListeners,
            useDeferredRemoveAllListeners,

            useHasListener,
            useDeferredHasListener,

            useSend,
            useDeferredSend,

            useInvoke,
            useDeferredInvoke
        };

    return HooksCollection;
}
