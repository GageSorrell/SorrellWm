/**
 * @file      event-manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventData } from "@interfaces/index.js";
import { EventEmitter } from "eventemitter3";

export class EventManager<
    Event extends string = string,
    Map extends Partial<Record<Event, unknown>> = Partial<Record<Event, unknown>>
>
{
    private readonly emitter: EventEmitter = new EventEmitter();

    public emit<E extends Event = Event>(dispatch: E, args?: EventData<E, Map>): void
    {
        this.emitter.emit(dispatch, args);
    }

    public on<E extends Event = Event>(dispatch: E, handler: (data: EventData<E, Map>) => void): void
    {
        this.emitter.addListener(dispatch, handler);
    }

    public once<E extends Event = Event>(dispatch: E, handler: (data: EventData<E, Map>) => void): void
    {
        this.emitter.once(dispatch, handler);
    }

    public off<E extends Event = Event>(dispatch: E, handler?: (data: EventData<E, Map>) => void): void
    {
        this.emitter.off(dispatch, handler);
    }

    public complete(): void
    {
        this.emitter.removeAllListeners();
    }
}
