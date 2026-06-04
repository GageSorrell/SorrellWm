/**
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Console, Data, Effect, pipe } from "effect";
export class TaskError extends Data.TaggedError("TaskError") {
}
export function CatchTaskErrors(Self) {
    function LogError(In) {
        if ("Message" in In) {
            return Console.error(In.Message);
        }
        else {
            return Effect.dieMessage("Could not parse error.");
        }
    }
    return pipe(Self, Effect.tapErrorTag("TaskError", LogError));
}
;
//# sourceMappingURL=Error.js.map