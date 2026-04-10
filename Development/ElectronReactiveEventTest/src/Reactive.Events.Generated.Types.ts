/**
 * File:   Reactive.Events.Generated.Types.ts
 * Author: `electron-reactive-event-cli`
 *
 * ********************************************
 *
 * Generated with the declare-events command.
 * Regenerate this file by running,
 *
 *    `npm exec electron-reactive-event declare-events`
 *
 * in this directory.
 *
 */

/* eslint-disable */

import type { Notify, GetData, GetDataPayload, GetDataFoo, SetData } from "./shared/Registrar.Types.ts";

declare module "electron-reactive-event/registrar"
{
    interface Registrar
    {
        electronreactiveeventtest:
        {
            Notify: Notify;
            GetData: GetData;
            GetDataPayload: GetDataPayload;
            GetDataFoo: GetDataFoo;
            SetData: SetData;
        };
    }
};
