/**
 * @file      Toast.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CToast, FDispatchFunction, FDispatchOptions } from "./Toast.Types";
import {
    type Context,
    type FC,
    type PropsWithChildren,
    type ReactNode,
    createContext,
    useCallback,
    useContext,
    useId } from "react";
import { Toaster, useToastController } from "@fluentui/react-components";
import { Identity } from "@sorrell/utilities/functional";

const EmptyContext: CToast =
    {
        INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
        {
            Dispatch: Identity
        }
    };

const ToastContext: Context<CToast> = createContext<CToast>(EmptyContext);

export const UseToaster = (ToastComponent: FC): Readonly<[ Dispatch: FDispatchFunction ]> =>
{
    const { Dispatch } = useContext<CToast>(ToastContext).INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    const OutDispatch: FDispatchFunction = useCallback((Options?: FDispatchOptions): void =>
    {
        const OutOptions: FDispatchOptions =
        {
            ...(Options || { }),
            position: "bottom",
            timeout: 3000
        };

        Dispatch(<ToastComponent/>, OutOptions);
    }, [ ToastComponent, Dispatch ]);

    return [ OutDispatch ] as const;
};

export const ToastProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const ToasterId: string = useId();
    const { dispatchToast: Dispatch } = useToastController(ToasterId);

    const value: CToast =
    {
        INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
        {
            Dispatch
        }
    };

    return (
        <ToastContext.Provider { ...{ value } }>
            { children }
            <Toaster toasterId={ ToasterId } />
        </ToastContext.Provider>
    );
};
