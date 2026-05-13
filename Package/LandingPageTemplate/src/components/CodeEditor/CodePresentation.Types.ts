/**
 * @file      CodePresentation.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CodePresentation, EndIndex as EndIndexValue } from "./CodePresentation";

/**
 * If a cursor is present in line of the given {@link Id}, then this transformation will
 * move the cursor.
 *
 * @property {CursorArgument} Cursor - The {@link CursorArgument | cursor(s)} to move in
 * this transformation.
 *
 * @property {"MoveCursor"} Type - The `string` literal type that uniquely identifies this
 * type of transformation.
 *
 * @property {CursorTranslation} Translation - The translation to apply to the given cursor.
 */
export type MoveCursor =
    {
        Cursor: CursorArgument;

        Translation: CursorTranslation;

        Type: "MoveCursor";
    };

/**
 * Add a cursor to the presentation.
 *
 * @property {Id} Line - The line in which this cursor will reside.
 * @property {CursorPosition} Position - The position within the {@link Line | line}
 * in which the cursor will reside.
 */
export type AddCursor =
    {
        Line: Id;

        Position: CursorPosition;

        Type: "AddCursor";
    };

/**
 * Highlight code.
 *
 * @note If the text highlighted by this is modified or removed, then this highlight is also removed.
 *
 * @see {Select} To perform a similar transformation, but with a cursor, use {@link Select}.
 *
 * @property {IdPositionRange} Range - The range of code to be highlighted.
 * @property {string | undefined} Tag - If specified and is a `string`, then this may
 * be used to identify this highlight under a {@link RemoveHighlight} transformation.
 */
export type Highlight =
    {
        Range: IdPositionRange;

        Tag?: string | undefined;

        Type: "Highlight";
    };

/**
 * Remove a given {@link Highlight}.
 *
 * @property {string | undefined} Tag - If specified and is a `string`, then this is the tag
 * that identifies the {@link Highlight} to remove.  Similarly, multiple highlights can be
 * removed if this is specified as a {@link ReadonlyArray} of tags.  Otherwise, *all*
 * {@link Highlight | highlights} will be removed by this transformation.
 */
export type RemoveHighlight =
    {
        Tag?: string | ReadonlyArray<string> | undefined;

        Type: "RemoveHighlight";
    };

/**
 * Select code with a cursor.
 *
 * @note If the cursor of this selection moves or is removed, then this selection is also removed.
 *
 * @see {Highlight} To select code without a cursor, use {@link Highlight}.
 *
 * @property {CursorArgument} Cursor - If specified, then the given cursor will be
 * moved to the start position of the selection at the beginning of the transformation.
 * Otherwise, a cursor will be created at the start position.
 *
 * @property {IdPositionRange} Range - The range of code to be selected.
 */
export type Select =
    {
        Cursor?: CursorArgument;
        Range: IdPositionRange;

        Type: "Select";
    };

/**
 * Remove a cursor from the presentation.
 *
 * @property {CursorArgument} Cursor - The cursor to remove.
 */
export type RemoveCursor =
    {
        Cursor: CursorArgument;

        Type: "RemoveCursor";
    };

/**
 * This describes a position of a cursor within the line in which it resides.
 * If this is an integer, then it
 *
 * @property {number} Position - The quantity used to describe the cursor position *within
 * a line of code.*  Its meaning depends upon the values of the other properties within this type.
 * If unspecified, then it will treated as `0`.
 *
 * @property {Id} Line - If specified, this is the line to where the cursor will be moved.  Otherwise,
 * the cursor will remain within its current line.
 *
 * @property {boolean} Relative - If specified and `true`, then the given
 * {@link CursorTranslationArgument!Value | Value} will be added to the current position
 * of the cursor (if the cursor does not yet exist, then its "current" position is taken to be `0`).
 * Otherwise, the {@link CursorTranslationArgument!Value | Value} will be treated as an index within the line
 * of code in which the cursor resides.
 */
export type CursorTranslation =
    {
        Position?: number;

        Line?: Id;

        Relative?: boolean
    };

/** The position of a cursor, within some line of code. */
export type CursorPosition = Omit<CursorTranslation, "Line">;

/**
 * The position to where a cursor will be moved
 */
export type CursorTranslationArgument =
    | CursorTranslation
    | CursorTranslationGetter;

/**
 * Describe the position to where a cursor should be moved, within the line in
 * which it currently resides, as a function of the line's contents and the cursor's
 * current position.
 *
 * @param CurrentPosition - The current position of the cursor in the line in
 * which it resides.
 * @param Line - The content of the line of code in which the cursor resides.
 * @param LineId - The {@link Id | ID} of the line in which the cursor resides.
 * @param AllLines - All current lines of code.
 * @param AllIds - The {@link Id | IDs} of all lines of code.
 *
 * @returns {CursorPosition} The position to where the cursor will be moved.
 */
export type CursorTranslationGetter = (
    Line: string,
    CurrentPosition: number,
    LineId: Id,
    AllLines: ReadonlyArray<string>,
    AllIds: ReadonlyArray<Id>
) => CursorPosition;

/**
 * The type that identifies a cursor.
 *
 * @property {IdArgument} Id - The {@link IdArgument | ID} of the line in
 * which this cursor resides.
 *
 * @property {CursorPosition} Position - If specified, then this is the position within
 * the line identified by {@link CursorArgument!Id | Id}.  Otherwise, this type refers
 * to the cursor at position (index) `0` of the line given by {@link CursorArgument!Id | Id}.
 */
export type CursorArgument =
    {
        Id: IdArgument;

        Position?: CursorPosition;
    };

export type Insert =
    {
        /**
         * The {@link IdArgument | ID} describing the index at which the new lines will be inserted.
         * Negative indices count backward from the end.  For example, `Index === -1` will insert the
         * lines at the end, and no existing lines will have their positions modified.
         */
        Id: IdArgument;

        /**
         * If defined and `true`, then a cursor will be
         */
        Cursor?: CursorArgument;

        /**
         * If defined, then the added lines can be referenced in later transformations by this tag.
         * If {@link Insert!Code} is a (single) `string`, then if this property is specified, it
         * must be a `string`.  If {@link Insert!Code} is a {@link ReadonlyArray}, then if this
         * property is specified, it must be a {@link ReadonlyArray} of at most the same length as
         * {@link Insert!Code}.  If this is a {@link ReadonlyArray}, then inserted lines may *not*
         * be assigned a tag by using `undefined` at that line's index in this {@link ReadonlyArray}.
         */
        Tag?: string | ReadonlyArray<string | undefined> | undefined;

        /**
         * The content to insert.  Newlines will be used to split any `string`s containing them.
         */
        Code: string | ReadonlyArray<string>;

        /** The start/end animation used to add the {@link Insert!Code | code}. */
        Animation?: Animation | undefined;

        Type: "Insert";
    };

/** The type corresponding to the {@link EndIndexValue | EndIndex}. */
export type EndIndex = typeof EndIndexValue;

/**
 * A unique identifier for a line of code in a {@link CodePresentation}.
 * @property {number} Index - The index of the line described by this.
 * @property {string | undefined} Tag - If defined, then this is the unique `string` "tag"
 * that identifies the line described by this.
 *
 * This is the type of the IDs that are *given* to the user, so both values are required,
 * but {@link Tag} is `undefined` iff no tag was specified when the given line was inserted.
 */
export type Id =
    {
        Index: number;
        Tag: string | undefined;
    };

/**
 * This is the user-facing type for identifying lines of code.
 *
 * If it is a `number`, then it is treated as the index of a line, modulo the
 * current number of lines of code.  For example, `-2` refers to the penultimate line.
 *
 * If it is a `string`, then this is treated as the "tag" of some line of code.
 *
 * If it is {@link EndIndex}, then this refers to the index that follows the last *current*
 * line.  This value is only useful for describing lines that *will* exist after the transformation
 * in which an {@link IdArgument} of this type is used.
 *
 * @see {@link RelativeIdArgument} and {@link Id} may also be used.
 *
 * @note The uniqueness of {@link Tag | Tags} is enforced by {@link CodePresentation} when
 * {@link Insert} transformations are applied.
 */
export type IdArgument =
    | number
    | string
    | EndIndex
    | RelativeIdArgument
    | Id;

/**
 * The user-facing type that describes a range of lines, starting from the line identified by the zeroth
 * element in this, up to *but not including* the line identified by the first element in this.
 */
export type IdArgumentRange = readonly [ IdArgument, IdArgument ];

/**
 * The type that {@link CodePresentation} gives the user to describe a range of lines, starting from the
 * line identified by the zeroth element in this, up to *but not including* the line identified by the
 * first element in this.  A {@link ReadonlyArray} of tags of *all* lines within this range is also given
 * as an additional property.
 *
 * @property {ReadonlyArray<string | undefined>} Tags - A {@link ReadonlyArray} of the tags of *all* lines
 * in this range.  Its length is guaranteed to be the length of this range, even if no lines in this range
 * have tags (in which case this {@link ReadonlyArray} will only contain `undefined`).
 */
export type IdRange =
    (readonly [ Id, Id ]) &
    {
        Tags: ReadonlyArray<string | undefined>;
    };

export type IdPosition =
    {
        Line: IdArgument;
        Position:
            | number
            | PositionGetter;
    };

/**
 * Get a position within a given {@link Line} as a function of that {@link Line | Line's} contents
 * and {@link Id | ID}.
 *
 * @param Line - The contents of the given line of code.
 * @param LineId - The {@link Id | ID} of the given line of code.
 * @param AllLines - All lines of code.
 * @param AllLineIds - The {@link Id | IDs} of all lines of code.
 *
 * @returns {number} The position (index) within the given line.
 */
export type PositionGetter = (
    Line: string,
    LineId: Id,
    AllLines: ReadonlyArray<string>,
    AllLineIds: ReadonlyArray<Id>
) => number;

export type IdPositionRange = readonly [ IdPosition, IdPosition ];

/**
 * This type identifies a line relative to some other line, which is specified by its {@link Tag}.
 *
 * @property {string} Tag - The unique `string` "tag" of the line, from whose index the {@link Translation}
 * is applied.
 * @property {number} Translation - The integral offset from the index of the line given by the {@link Tag}.
 * If negative, then the translation is applied by counting backward.
 */
export type RelativeIdArgument =
    {
        Tag: string;
        Translation: number;
    };

export type Remove =
    {
        /**
         * The {@link IdArgument | ID} (or {@link IdArgumentRange | ID range}) of the lines to remove.
         * Negative indices count backward from the end.  For example, `Id === -1` will remove the
         * last line, and no remaining lines will have their positions modified.
         */
        Id:
            | IdArgument
            | IdArgumentRange;

        /**
         * A positive integer that is the number of lines to remove.  If `Index + Length` is more than
         * the number of lines minus one, then this transformation will "wrap around" to the zeroth line.
         */
        Length: number;

        /** The start/end animation used to add the {@link Insert!Code | code}. */
        Animation?: Animation | undefined;

        Type: "Remove";
    };

export type Modify =
    {
        Transformations: ModifyFunction | ReadonlyArray<ModifyFunction>;

        /**
         * Exactly one of,
         * - the index of the line to modify
         * - the indices of the lines to modify
         * - the range of lines to modify, such that the end is *exclusive*.
         */
        Indices: number | ReadonlyArray<number> | readonly [ number, number ];

        /**
         * If specified and `true`, then the {@link Modify!Transformations | transformations} will
         * be applied in reverse order.
         */
        Reverse?: boolean;

        Type: "Modify";
    };

/**
 * The function that modifies a given line of code in the presentation.
 *
 * @param Previous - The line of code that this modifies.
 * @param Id - The {@link Id} of the line of code that this modifies.
 * @param Tag - If one was specified, then this is the tag of the line being modified.
 * @param AllPrevious - All lines as they were before the transformation containing
 * this function.
 * @param AllTags - For each line in {@link AllPrevious}, the respective tag of a line,
 * if one was specified for that line, and `undefined` otherwise.  This will always have
 * the same length as {@link AllPrevious}.
 * @param Current - All lines of code, with all changes from any other
 * {@link ModifyFunction | ModifyFunctions} in the same transformation as this function.
 *
 * @returns {string} The line of code at the given {@link Id} after the transformation
 * containing this function is applied.
 */
export type ModifyFunction = (
    Previous: string,
    Id: Id,
    Tag: string | undefined,
    AllPrevious: ReadonlyArray<string>,
    AllTags: ReadonlyArray<string>,
    Current: ReadonlyArray<string>
) => string;

export type Animation =
    | SimpleAnimation
    | ComplexAnimation;

/**
 * For transformations that apply to multiple objects (principally, multiple lines of code),
 * this describes an animation that will be applied to each object, in sequence.
 */
export type Piecewise =
    {
        /**
         * A fractional number less than one such that, if specified, is the proportion of the
         * duration of this animation that will pass for a given object before the next object
         * is animated.
         *
         * For example, `DelayProportion === 0.5` will cause *half* of the duration to pass for an
         * object before the next object will be animated.
         */
        DelayProportion?: number;

        /** If specified and `true`, then the animation will be applied in reverse order. */
        Reverse?: boolean;
    };

export type ComplexAnimation =
    | {
        Animation: AnimationPart;
    }
    | {
        Start: AnimationPart;
        End?: AnimationPart;
    }
    | {
        Start?: AnimationPart;
        End: AnimationPart;
    }
    | {
        Start: AnimationPart;
        End: AnimationPart;
    };

export type AnimationPart =
    {
        Animation: SimpleAnimation;
        Duration: number;
        Piecewise?: Piecewise;
    };

export type Pause =
    {
        Duration: number;

        Type: "Pause";
    };

/**
 * Set the subtitles currently displayed in the presentation.
 *
 * @property {string | undefined} Content - If specified and is a `string`, then this
 * is the content that will be displayed as subtitles.  Basic markdown formatting is supported
 * (bold and italicized text).
 */
export type Subtitle =
    {
        Content?: string | undefined;
        Type: "Subtitle";
    };

/**
 * Split the code into two sections, such that the code is made slightly smaller, and spaced out
 * to convey two different snippets, such as two different modules, or of two different solutions
 * to a given problem.
 *
 * @param {IdArgument} Id - If specified and is an {@link IdArgument | ID}, then this is the line
 * at which the split will occur (that is, this line will be the *last* line of the original section,
 * and all lines after this line will become the new section.  Otherwise, an empty line of code will be
 * appended, and this new line will be the new section.
 */
export type Split =
    {
        Id?: IdArgument | undefined;

        Type: "Split";
    };

export type SimpleAnimation =
    | "Linear"
    | "Cubic"
    | "Exp"
    | "Ease"
    | "Sin"
    /* ... */;
