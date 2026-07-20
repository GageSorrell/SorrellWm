/**
 * @file      Platform.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "@sorrell/effect";
import type { Kind } from "../../FileSystem/FileSystem.Types.ts";

/**
 * An error in which a given {@link Kind | filesystem object} was expected to exist
 * at a given {@link Path}, but the object was not found.
 *
 * @property {string} Path - The path where an object of the given {@link Kind} was expected,
 * but was not found.
 *
 * @property {Kind} Kind - The kind of object that was expected at the given {@link Path},
 * but was not found.
 */
export class PathNotFoundError extends Data.TaggedError("PathNotFoundError")<Readonly<{
    Path: string;
    Kind: Kind;
}>> { }

/**
 * An error in which a {@link Kind | filesystem object} meeting a given
 * {@link Criteria | set of criteria} could not be found.
 *
 * @property {string} LastSearchResult - The last path that was tested when searching for
 * a {@link Kind | filesystem object} of a given {@link Criteria | set of criteria}.
 * but was not found.
 *
 * @property {string} Criteria - A human-readable description of the criteria defining the search
 * from which an error of this type originated.
 *
 * @property {Kind} Kind - The kind of object that was expected at the given {@link Path},
 * but was not found.
 */
export class SearchExhaustedError extends Data.TaggedError("SearchExhaustedError")<Readonly<{
    LastSearchResult?: string;
    Criteria: string;
    Kind: Kind;
}>> { }
