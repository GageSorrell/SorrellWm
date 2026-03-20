/* File:      Playground.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IPlaygroundMainRegistrar, IPlaygroundRendererRegistrar } from "./Playground.Types";
import type { PropsWithChildren, ReactNode } from "react";
import { GetRendererFunctions } from "./Factory";
import type { TRendererFactoryReactReturnType } from "./Factory.Types";
import { ipcRenderer } from "electron";
import type { TChannelsNoRequest, TChannelsWithRequest } from "./Internal";

const { invoke, off, on, once, send }: Parameters<typeof GetRendererFunctions>[0] = ipcRenderer;

// const MainFunctions: TMainEventFactoryReturnType<IPlaygroundMainRegistrar, IPlaygroundRendererRegistrar> =
//     GetMainFunctions<IPlaygroundMainRegistrar, IPlaygroundRendererRegistrar>();

const {
    UseSendEvent
}: TRendererFactoryReactReturnType<IPlaygroundMainRegistrar, IPlaygroundRendererRegistrar> =
    GetRendererFunctions<IPlaygroundMainRegistrar, IPlaygroundRendererRegistrar>(
        { invoke, off, on, once, send }
    );

const FourSquare = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ Data, Error, IsPending ] = UseSendEvent("Toss", { Initiator: 0, IntendedReceiver: 0 });

    type FTestType = TChannelsWithRequest<IPlaygroundRendererRegistrar>;
    type FOtherTestType = TChannelsNoRequest<IPlaygroundRendererRegistrar>;

    return children;
};

