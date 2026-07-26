/**
 * Tagged enum utility tests.
 *
 * @module @sorrell/utility/Test/Data
 *
 * @file      Data.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type TaggedEnum,
    taggedEnum
} from "../Source/Data.js";
import { describe, expect, expectTypeOf, it } from "vitest";

const ShapeTypeId: unique symbol = Symbol.for("@sorrell/utility/Test/Shape");

type Shape = TaggedEnum<{
    readonly Circle: { readonly Radius: number };
    readonly Origin: { };
    readonly Rectangle: { readonly Height: number; readonly Width: number };
}, typeof ShapeTypeId>;

const Shape = taggedEnum<Shape>(ShapeTypeId);

describe("taggedEnum", () =>
{
    it("constructs symbol-identified enum members", () =>
    {
        const Circle = Shape.Circle({ Radius: 4 });
        const Origin = Shape.Origin();

        expect(Circle).toEqual({
            Radius: 4,
            [ShapeTypeId]: ShapeTypeId,
            _tag: "Circle"
        });
        expect(Origin).toEqual({ [ShapeTypeId]: ShapeTypeId, _tag: "Origin" });
        expectTypeOf(Circle[ShapeTypeId]).toEqualTypeOf<typeof ShapeTypeId>();
    });

    it("retains Effect's tag guards and exhaustive matcher", () =>
    {
        const Value: Shape = Shape.Rectangle({ Height: 3, Width: 5 });

        expect(Shape.$is("Rectangle")(Value)).toBe(true);
        expect(Shape.$is("Circle")(Value)).toBe(false);
        expect(Shape.$match(Value, {
            Circle: (Circle: TaggedEnum.Value<Shape, "Circle">) => Circle.Radius,
            Origin: () => 0,
            Rectangle: (Rectangle: TaggedEnum.Value<Shape, "Rectangle">) =>
                Rectangle.Height * Rectangle.Width
        })).toBe(15);
    });

    it("uses TypeId property presence for $isA", () =>
    {
        const Value: unknown = Shape.Circle({ Radius: 1 });

        expect(Shape.$isA(Value)).toBe(true);
        expect(Shape.$isA({ Radius: 1, _tag: "Circle" })).toBe(false);
        expect(Shape.$isA({ [ShapeTypeId]: undefined })).toBe(true);

        if (Shape.$isA(Value))
        {
            expectTypeOf(Value).toEqualTypeOf<Shape>();
        }
    });

    it("supports string TypeIds", () =>
    {
        const TypeId = "@sorrell/utility/Test/StringEnum" as const;
        type StringEnum = TaggedEnum<{
            readonly Empty: { };
            readonly Value: { readonly Value: number };
        }, typeof TypeId>;
        const StringEnum = taggedEnum<StringEnum>(TypeId);

        expect(StringEnum.Value({ Value: 42 })).toEqual({
            [TypeId]: TypeId,
            Value: 42,
            _tag: "Value"
        });
    });

    it("supports Effect-style generic tagged enum definitions", () =>
    {
        const TypeId: unique symbol = Symbol.for("@sorrell/utility/Test/Option");
        type Option<A> = TaggedEnum<{
            readonly None: { };
            readonly Some: { readonly Value: A };
        }, typeof TypeId>;
        interface OptionDefinition extends TaggedEnum.WithGenerics<1, typeof TypeId>
        {
            readonly taggedEnum: Option<this["A"]>;
        }
        const Option = taggedEnum<OptionDefinition>(TypeId);
        const Some = Option.Some({ Value: 42 });

        expect(Some).toEqual({ [TypeId]: TypeId, Value: 42, _tag: "Some" });
        expectTypeOf(Some.Value).toEqualTypeOf<number>();
        expect(Option.$isA(Some)).toBe(true);
    });
});
