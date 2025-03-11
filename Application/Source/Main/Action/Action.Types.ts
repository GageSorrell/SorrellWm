/* File:      Action.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

export type TAction<TPayload extends Record<string, unknown>> =
{
    Callback: () => void;
    Name: string;
    Payload: TPayload;
};

export type FMoveActionPayload =
{

};

export type FMoveAction = TAction<FMoveActionPayload>;
