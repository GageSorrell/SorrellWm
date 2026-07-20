/**
 * @file      Tag.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Registrar } from "../Registrar/Registrar.Types.ts";

/**
 * The union representing all tags declared by the dependent package.
 *
 * In the case that the dependent package has not yet declared any tags,
 * then this falls back to `string` (rather than `never`).
 *
 * @note If your package has dependencies that *also* use `ts-tag`, then
 * their tags will not pollute the `Tag` type for your package.
 */
export type Tag =
    [ keyof Registrar ] extends [ never ]
        ? string
        : keyof Registrar;
