# <CodePresentation />

## Motivation & Purpose

This is an animated component that allows for showing annotated snippets of code to give a top-level explanation of a concept or specific code, such as a library or something within a library.  Voiceovers, optionally subtitled, are also supported.

## Features

### Summary

The animation is modelled as a sequence of mutations of an initial state.
State, at a given point in time, consists of displayed code, and this point in time also describes the position of playback in the voiceover and subtitles, if these are provided.

#### Transformations

```typescript
type Insert =
    {
        /**
         * The index at which the new lines will be inserted.  Negative indices count backward
         * from the end.  For example, `Index === -1` will insert the lines at the end, and no
         * existing lines will have their positions modified.
         */
        Index: number;

        /**
         * The content to insert.  Newlines will be used to split any `string`s containing them.
         */
        Code: string | ReadonlyArray<string>;

        /** The start/end animation used to add the {@link Insert!Code | code}. */
        Animation?: Animation | Piecewise<Animation> | undefined;

        Type: "Insert";
    };
```

```typescript
type Remove =
    {
        /**
         * The index at which lines will be removed.  Negative indices count backward
         * from the end.  For example, `Index === -1` will remove the last line, and no
         * remaining lines will have their positions modified.
         */
        Index: number;

        /**
         * A positive integer that is the number of lines to remove.  If `Index + Length` is more than
         * the number of lines minus one, then this transformation will "wrap around" to the zeroth line.
         */
        Length: number;

        /** The start/end animation used to add the {@link Insert!Code | code}. */
        Animation?: Animation | Piecewise<Animation> | undefined;

        Type: "Remove";
    };
```

```typescript
type Modify =
    {
        Transformations: ModifyFunction | ReadonlyArray<ModifyFunction>;

        /**
         * Exactly one of,
         *
         * *i.* the index of the line to modify
         * *ii.* the indices of the lines to modify
         * *iii.* the range of lines to modify, such that the end is *exclusive*.
         */
        Indices: number | ReadonlyArray<number> | readonly [ number, number ];

        /**
         * If specified and `true`, then the {@link Modify!Transformations | transformations} will
         * be applied in reverse order.
         */
        Reverse?: boolean;

        Type: "Modify";
    };

type ModifyPart
    {
        /** The objects des */
        Parts: ModifyPart | ReadonlyArray<ModifyPart>;

        /**
         * The index at which lines will be removed.  Negative indices count backward
         * from the end.  For example, `Index === -1` will remove the last line, and no
         * remaining lines will have their positions modified.
         */
        Index: number;

        /**
         * A positive integer that is the number of lines to remove.  If `Index + Length` is more than
         * the number of lines minus one, then this transformation will "wrap around" to the zeroth line.
         */
        Length: number;

        /** The start/end animation used to add the {@link Insert!Code | code}. */
        Animation?: Animation | Piecewise<Animation> | undefined;

        Type: "Modify";
    };

type ModifyPart =
    {

        Type: "ModifyPart";
    };
```

##### Animation

```typescript
type Animation =
    | SimpleAnimation
    | ComplexAnimation;

/**
 * For transformations that apply to multiple objects (principally, multiple lines of code),
 * this describes an animation that will be applied to each object, in sequence.
 */
type Piecewise<AnimationType extends Animation> =
    AnimationType &
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

type ComplexAnimation =
    {
        Start?: AnimationPart | SimpleAnimation;
        End?: AnimationPart | SimpleAnimation | "Start";
    };

type AnimationPart =
    {
        Duration?: number;
        Type: SimpleAnimation;
    };

type SimpleAnimation =
    | "Exp"
    | "Ease"
    | "Cubic"
    | "Sin"
    | /* ... */;
```

#### Interludes

These "transformations"

### Itemized List of Features

*

## API

### `PCodePresentation`

