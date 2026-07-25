/**
 * Pure terminal renderer for projecting ThreeJS scenes into text frames.
 *
 * @module @sorrell/ink-three/Terminal/Renderer
 *
 * @file      Renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as THREE from "three";
import {
    AddCoverage,
    type CoverageBuffer,
    DrawCoverageLine,
    MakeCoverageBuffer
} from "../CoverageBuffer.js";
import { type CharacterEncoder, GetCharacterEncoder } from "./CharacterEncoder.js";
import {
    type Color,
    ColorFromThreeColor,
    DefaultColor as DefaultRenderColor,
    ParseColor
} from "./Color.js";
import { type Frame, ToString } from "./Frame.js";
import { ExtractEdges } from "../Geometry/Edge.js";
import { ExtractTriangles } from "../Geometry/Triangle.js";
import type { RenderMode } from "./RenderMode.js";
import { Struct } from "effect";

/**
 * Options for rendering a ThreeJS scene into terminal output.
 *
 * @category Rendering
 * @since 1.0.0
 */
export interface Options
{
    readonly Width: number;
    readonly Height: number;
    readonly Character?: string | undefined;
    readonly CharacterRamp?: string | undefined;
    readonly RenderMode?: RenderMode | undefined;
    readonly RenderFaces?: boolean | undefined;
    readonly RenderWireframe?: boolean | undefined;
    readonly Lighting?: LightingOptions | undefined;
    readonly Color?: string | undefined;
    readonly ColorOptions?: ColorOptions | undefined;
    readonly AspectRatioCorrection?: number | undefined;
}

/**
 * Options for some (fixed) height and width, which have already been handled.
 *
 * @category Rendering
 * @since 1.0.0
 */
export interface FixedOptions extends Omit<Options, "Height" | "Width"> { }

/**
 * Options for simple flat lighting during face rendering.
 *
 * @category Rendering
 * @since 1.0.0
 */
export interface LightingOptions
{
    readonly Enabled?: boolean;
    readonly Direction?: THREE.Vector3;
    readonly AmbientIntensity?: number;
    readonly DiffuseIntensity?: number;
}

/**
 * Options for selecting terminal colors from objects and materials.
 *
 * @category Color
 * @since 1.0.0
 */
export interface ColorOptions
{
    readonly Enabled?: boolean;
    readonly DefaultColor?: string;
    readonly UseMaterialColor?: boolean;
}

interface RasterPoint
{
    readonly X: number;
    readonly Y: number;
    readonly Z: number;
}

interface WorldTriangle
{
    readonly A: THREE.Vector3;
    readonly B: THREE.Vector3;
    readonly C: THREE.Vector3;
}

const WireframeDepthBias: 0.0005 = 0.0005 as const;

/**
 * Renders a ThreeJS scene and camera into a plain terminal string.
 *
 * @category Rendering
 * @since 1.0.0
 */
export function SceneToString(
    Scene: THREE.Scene,
    Camera: THREE.Camera,
    Options: Options
): string
{
    return ToString(SceneToFrame(Scene, Camera, Options));
}

/**
 * Renders a ThreeJS scene and camera into a terminal frame model.
 *
 * @category Rendering
 * @since 1.0.0
 */
export function SceneToFrame(
    Scene: THREE.Scene,
    Camera: THREE.Camera,
    Options: Options
): Frame
{
    const Width: number = Math.max(1, Math.floor(Options.Width));
    const Height: number = Math.max(1, Math.floor(Options.Height));
    const AspectRatioCorrection: number = Options.AspectRatioCorrection ?? 2;
    const Encoder: CharacterEncoder =
        GetCharacterEncoder(Options.RenderMode);
    const RasterWidth: number = Width * Encoder.SubcellWidth;
    const RasterHeight: number = Height * Encoder.SubcellHeight;
    const Buffer: CoverageBuffer = MakeCoverageBuffer(RasterWidth, RasterHeight);
    const RenderFaces: boolean = Options.RenderFaces ?? false;
    const RenderWireframe: boolean = Options.RenderWireframe ?? !RenderFaces;
    const Lighting: Required<LightingOptions> = ResolveLightingOptions(Options.Lighting);
    const ColorOptions: Required<ColorOptions> = ResolveColorOptions(Options);

    const GetRasterPoint = (In: THREE.Vector3) =>
        ConvertProjectedPointToRasterPoint(In, RasterWidth, RasterHeight, AspectRatioCorrection);

    Scene.updateMatrixWorld(true);
    Camera.updateMatrixWorld(true);

    Scene.traverseVisible((Object: THREE.Object3D<THREE.Object3DEventMap>) =>
    {
        const ObjectColor: Color = ResolveObjectColor(Object, ColorOptions);

        if (RenderFaces)
        {
            const Triangles: ReturnType<typeof ExtractTriangles> = ExtractTriangles(Object);

            for (const Triangle of Triangles)
            {
                const WorldTriangle: WorldTriangle =
                    {
                        A: Triangle.A.clone().applyMatrix4(Object.matrixWorld),
                        B: Triangle.B.clone().applyMatrix4(Object.matrixWorld),
                        C: Triangle.C.clone().applyMatrix4(Object.matrixWorld)
                    };

                const ProjectedA: THREE.Vector3 = WorldTriangle.A.clone().project(Camera);
                const ProjectedB: THREE.Vector3 = WorldTriangle.B.clone().project(Camera);
                const ProjectedC: THREE.Vector3 = WorldTriangle.C.clone().project(Camera);

                if (!IsFiniteVector(ProjectedA) || !IsFiniteVector(ProjectedB) || !IsFiniteVector(ProjectedC))
                {
                    continue;
                }

                const IsFarOutside: boolean =
                    IsFarOutsideClipRange(ProjectedA) &&
                    IsFarOutsideClipRange(ProjectedB) &&
                    IsFarOutsideClipRange(ProjectedC);

                if (IsFarOutside)
                {
                    continue;
                }

                const A: RasterPoint = GetRasterPoint(ProjectedA);
                const B: RasterPoint = GetRasterPoint(ProjectedB);
                const C: RasterPoint = GetRasterPoint(ProjectedC);
                const Intensity: number = CalculateFlatShadingIntensity(WorldTriangle, Lighting);

                FillTriangle(Buffer, A, B, C, Intensity, ObjectColor);
            }
        }

        if (!RenderWireframe)
        {
            return;
        }

        const Edges: ReturnType<typeof ExtractEdges> = ExtractEdges(Object);

        for (const Edge of Edges)
        {
            const ProjectedStart: THREE.Vector3 =
                Edge.Start.clone().applyMatrix4(Object.matrixWorld).project(Camera);

            const ProjectedEnd: THREE.Vector3 =
                Edge.End.clone().applyMatrix4(Object.matrixWorld).project(Camera);

            if (!IsFiniteVector(ProjectedStart) || !IsFiniteVector(ProjectedEnd))
            {
                continue;
            }

            if (IsFarOutsideClipRange(ProjectedStart) && IsFarOutsideClipRange(ProjectedEnd))
            {
                continue;
            }

            const Start: RasterPoint = GetRasterPoint(ProjectedStart);
            const End: RasterPoint = GetRasterPoint(ProjectedEnd);

            DrawCoverageLine(
                Buffer,
                Start.X,
                Start.Y,
                End.X,
                End.Y,
                1,
                1,
                Start.Z - WireframeDepthBias,
                End.Z - WireframeDepthBias,
                ObjectColor
            );
        }
    });

    return Encoder.EncodeFrame(
        Buffer,
        Struct.assign(
            Struct.pick(Options, [ "Character", "CharacterRamp" ]),
            { Height, Width }
        )
    );
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ConvertProjectedPointToRasterPoint(
    ProjectedPoint: THREE.Vector3,
    RasterWidth: number,
    RasterHeight: number,
    AspectRatioCorrection: number
): RasterPoint
{
    const CorrectedX: number = ProjectedPoint.x / AspectRatioCorrection;
    const X: number = Math.round((CorrectedX + 1) * 0.5 * (RasterWidth - 1));
    const Y: number = Math.round((1 - (ProjectedPoint.y + 1) * 0.5) * (RasterHeight - 1));
    const Z: number = ProjectedPoint.z;

    return { X, Y, Z };
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function FillTriangle(
    Buffer: CoverageBuffer,
    A: RasterPoint,
    B: RasterPoint,
    C: RasterPoint,
    Intensity: number,
    Color: Color
): void
{
    const Area: number = EdgeFunction(A, B, C);

    if (Area === 0)
    {
        return;
    }

    const MinimumX: number = Math.max(0, Math.floor(Math.min(A.X, B.X, C.X)));
    const MaximumX: number = Math.min(Buffer.Width - 1, Math.ceil(Math.max(A.X, B.X, C.X)));
    const MinimumY: number = Math.max(0, Math.floor(Math.min(A.Y, B.Y, C.Y)));
    const MaximumY: number = Math.min(Buffer.Height - 1, Math.ceil(Math.max(A.Y, B.Y, C.Y)));
    const Epsilon: number = 0.000001;

    for (let Y: number = MinimumY; Y <= MaximumY; Y += 1)
    {
        for (let X: number = MinimumX; X <= MaximumX; X += 1)
        {
            const SamplePoint: RasterPoint = { X, Y, Z: 0 };
            const WeightA: number = EdgeFunction(B, C, SamplePoint) / Area;
            const WeightB: number = EdgeFunction(C, A, SamplePoint) / Area;
            const WeightC: number = EdgeFunction(A, B, SamplePoint) / Area;

            if (WeightA < -Epsilon || WeightB < -Epsilon || WeightC < -Epsilon)
            {
                continue;
            }

            const Depth: number = WeightA * A.Z + WeightB * B.Z + WeightC * C.Z;
            AddCoverage(Buffer, X, Y, 1, Intensity, Depth, Color);
        }
    }
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function EdgeFunction(A: RasterPoint, B: RasterPoint, C: RasterPoint): number
{
    return (C.X - A.X) * (B.Y - A.Y) - (C.Y - A.Y) * (B.X - A.X);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function CalculateFlatShadingIntensity(
    Triangle: WorldTriangle,
    Lighting: Required<LightingOptions>
): number
{
    const EdgeA: THREE.Vector3 = Triangle.B.clone().sub(Triangle.A);
    const EdgeB: THREE.Vector3 = Triangle.C.clone().sub(Triangle.A);
    const Normal: THREE.Vector3 = EdgeA.cross(EdgeB);

    if (Normal.lengthSq() === 0)
    {
        return 0.35;
    }

    Normal.normalize();

    if (!Lighting.Enabled)
    {
        return 1;
    }

    const Facing: number = Math.max(0, Normal.dot(Lighting.Direction));

    return Clamp01(Lighting.AmbientIntensity + Facing * Lighting.DiffuseIntensity);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ResolveLightingOptions(Lighting?: LightingOptions): Required<LightingOptions>
{
    const Direction: THREE.Vector3 = Lighting?.Direction?.clone() ?? new THREE.Vector3(0.35, 0.6, 1);

    if (Direction.lengthSq() === 0)
    {
        Direction.set(0.35, 0.6, 1);
    }

    Direction.normalize();

    return {
        AmbientIntensity: Clamp01(Lighting?.AmbientIntensity ?? 0.25),
        DiffuseIntensity: Clamp01(Lighting?.DiffuseIntensity ?? 0.75),
        Direction,
        Enabled: Lighting?.Enabled ?? true
    };
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ResolveColorOptions(Options: Options): Required<ColorOptions>
{
    const DefaultColor: Color = ParseColor(Options.ColorOptions?.DefaultColor)
        ?? ParseColor(Options.Color)
        ?? DefaultRenderColor;

    return {
        DefaultColor: ColorToString(DefaultColor),
        Enabled: Options.ColorOptions?.Enabled ?? true,
        UseMaterialColor: Options.ColorOptions?.UseMaterialColor ?? true
    };
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ResolveObjectColor(
    Object: THREE.Object3D,
    ColorOptions: Required<ColorOptions>
): Color
{
    const DefaultColor: Color = ParseColor(ColorOptions.DefaultColor) ?? DefaultRenderColor;

    if (!ColorOptions.Enabled)
    {
        return DefaultColor;
    }

    const UserDataColor: Color | undefined = ResolveUserDataColor(Object);

    if (UserDataColor !== undefined)
    {
        return UserDataColor;
    }

    if (ColorOptions.UseMaterialColor && Object instanceof THREE.Mesh)
    {
        const MaterialColor: Color | undefined = ResolveMaterialColor(Object.material);

        if (MaterialColor !== undefined)
        {
            return MaterialColor;
        }
    }

    return DefaultColor;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ResolveUserDataColor(Object: THREE.Object3D): Color | undefined
{
    const UserData: { Color?: unknown } = Object.userData as { Color?: unknown };

    if (typeof UserData.Color !== "string")
    {
        return undefined;
    }

    return ParseColor(UserData.Color);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ResolveMaterialColor(Material: THREE.Material | Array<THREE.Material>): Color | undefined
{
    const FirstMaterial: THREE.Material | undefined = Array.isArray(Material) ? Material[0] : Material;

    if (FirstMaterial === undefined)
    {
        return undefined;
    }

    if (!("color" in FirstMaterial))
    {
        return undefined;
    }

    const Color: unknown = FirstMaterial.color;

    if (!(Color instanceof THREE.Color))
    {
        return undefined;
    }

    return ColorFromThreeColor(Color);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ColorToString(Color: Color): string
{
    return `#${ToHexPair(Color.Red)}${ToHexPair(Color.Green)}${ToHexPair(Color.Blue)}`;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ToHexPair(Value: number): string
{
    return Math.max(0, Math.min(255, Value)).toString(16).padStart(2, "0");
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function Clamp01(Value: number): number
{
    if (Value <= 0)
    {
        return 0;
    }

    if (Value >= 1)
    {
        return 1;
    }

    return Value;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function IsFiniteVector(Vector: THREE.Vector3): boolean
{
    return Number.isFinite(Vector.x) && Number.isFinite(Vector.y) && Number.isFinite(Vector.z);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function IsFarOutsideClipRange(Vector: THREE.Vector3): boolean
{
    const Limit: number = 4;

    return Math.abs(Vector.x) > Limit || Math.abs(Vector.y) > Limit || Math.abs(Vector.z) > Limit;
}

