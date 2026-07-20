/**
 * The base for both multimap types.
 *
 * @module @sorrell/multimap/MultiMapBase
 * @internal
 */

/**
 * @file      MultiMapBase.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

// @TODO TEMPORARY
// eslint-disable-next-line @stylistic/max-len
/* eslint-disable jsdoc/check-access, jsdoc/check-alignment, jsdoc/check-indentation, jsdoc/check-line-alignment, jsdoc/check-param-names, jsdoc/check-property-names, jsdoc/check-syntax, jsdoc/check-tag-names, jsdoc/check-template-names, jsdoc/check-types, jsdoc/check-values, jsdoc/convert-to-jsdoc-comments, jsdoc/empty-tags, jsdoc/escape-inline-tags, jsdoc/implements-on-classes, jsdoc/imports-as-dependencies, jsdoc/informative-docs, jsdoc/lines-before-block, jsdoc/match-description, jsdoc/match-name, jsdoc/multiline-blocks, jsdoc/no-bad-blocks, jsdoc/no-blank-block-descriptions, jsdoc/no-blank-blocks, jsdoc/no-defaults, jsdoc/no-missing-syntax, jsdoc/no-multi-asterisks, jsdoc/no-restricted-syntax, jsdoc/no-types, jsdoc/no-undefined-types, jsdoc/prefer-import-tag, jsdoc/reject-any-type, jsdoc/reject-function-type, jsdoc/require-asterisk-prefix, jsdoc/require-description, jsdoc/require-description-complete-sentence, jsdoc/require-example, jsdoc/require-file-overview, jsdoc/require-hyphen-before-param-description, jsdoc/require-jsdoc, jsdoc/require-next-description, jsdoc/require-next-type, jsdoc/require-param, jsdoc/require-param-description, jsdoc/require-param-name, jsdoc/require-param-type, jsdoc/require-property, jsdoc/require-property-description, jsdoc/require-property-name, jsdoc/require-property-type, jsdoc/require-rejects, jsdoc/require-returns, jsdoc/require-returns-check, jsdoc/require-returns-description, jsdoc/require-returns-type, jsdoc/require-tags, jsdoc/require-template, jsdoc/require-template-description, jsdoc/require-throws, jsdoc/require-throws-description, jsdoc/require-throws-type, jsdoc/require-yields, jsdoc/require-yields-check, jsdoc/require-yields-description, jsdoc/require-yields-type, jsdoc/sort-tags, jsdoc/tag-lines, jsdoc/text-escaping, jsdoc/ts-method-signature-style, jsdoc/ts-no-empty-object-type, jsdoc/ts-no-unnecessary-template-expression, jsdoc/ts-prefer-function-type, jsdoc/type-formatting, jsdoc/valid-types */

import type { Equal, Hash, Pipeable } from "effect";

export interface MultiMapBase<in out KeyType, in out ValueType>
    extends Iterable<readonly [ KeyType, ValueType ]>, Equal.Equal, Hash.Hash, Pipeable.Pipeable
{
    /* eslint-disable @typescript-eslint/no-explicit-any */

    readonly Backing: unknown;
}
