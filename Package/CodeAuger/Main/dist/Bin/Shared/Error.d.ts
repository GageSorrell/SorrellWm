/**
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Effect } from "effect";
declare const TaskError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "TaskError";
} & Readonly<A>;
export declare class TaskError extends TaskError_base<{
    readonly Message: string;
}> {
}
export declare function CatchTaskErrors<A, E, R>(Self: Effect.Effect<A, E | TaskError, R>): Effect.Effect<A, unknown, unknown>;
export {};
//# sourceMappingURL=Error.d.ts.map