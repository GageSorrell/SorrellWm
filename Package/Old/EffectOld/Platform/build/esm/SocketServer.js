/**
 * @since 1.0.0
 */
import * as Context from "effect/Context";
import * as Data from "effect/Data";
/**
 * @since 1.0.0
 * @category tags
 */
export class SocketServer extends Context.Tag("@effect/platform/SocketServer")() {
}
/**
 * @since 1.0.0
 * @category errors
 */
export const ErrorTypeId = Symbol.for("@effect/platform/SocketServer/SocketServerError");
/**
 * @since 1.0.0
 * @category errors
 */
export class SocketServerError extends Data.TaggedError("SocketServerError") {
    /**
     * @since 1.0.0
     */
    [ErrorTypeId] = ErrorTypeId;
    /**
     * @since 1.0.0
     */
    get message() {
        return this.reason;
    }
}
//# sourceMappingURL=SocketServer.js.map