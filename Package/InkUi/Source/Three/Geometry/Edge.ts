/**
 * Edge extraction helpers for supported ThreeJS line and mesh objects.
 *
 * @module @sorrell/ink-three/Geometry/Edge
 *
 * @file      Edge.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as THREE from "three";
import { Array, pipe } from "effect";

/**
 * Local-space line segment extracted from supported ThreeJS geometry.
 *
 * @category Model
 * @since 1.0.0
 */
export interface Edge
{
    readonly Start: THREE.Vector3;
    readonly End: THREE.Vector3;
}

interface MeshEdgeRecord
{
    Start: THREE.Vector3;
    End: THREE.Vector3;
    Normals: Array<THREE.Vector3>;
}

const FeatureEdgeNormalDotThreshold: number = 0.999;

/**
 * Extracts local-space wireframe edges from supported ThreeJS objects.
 *
 * @category Rendering
 * @since 1.0.0
 */
export function ExtractEdges(Object: THREE.Object3D): Array<Edge>
{
    if (Object instanceof THREE.LineSegments)
    {
        return ExtractLineSegmentEdges(Object.geometry);
    }

    if (Object instanceof THREE.Line)
    {
        return ExtractLineEdges(Object.geometry);
    }

    if (Object instanceof THREE.Mesh)
    {
        return ExtractMeshEdges(Object.geometry);
    }

    return [ ];
}

/**
 * Supported ThreeJS position attribute shape used by edge extraction.
 *
 * @category Utility Type
 * @since 1.0.0
 */
export type Positions =
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute;

/**
 * Extracts independent segment pairs from line segment geometry.
 * @since 1.0.0
 */
function ExtractLineSegmentEdges(Geometry: THREE.BufferGeometry): Array<Edge>
{
    const Positions: Positions | undefined = Geometry.getAttribute("position");

    if (!IsPositionsAttribute(Positions))
    {
        return [ ];
    }

    const Edges: Array<Edge> = [ ];

    for (let VertexIndex: number = 0; VertexIndex + 1 < Positions.count; VertexIndex += 2)
    {
        Edges.push({
            End: ReadPosition(Positions, VertexIndex + 1),
            Start: ReadPosition(Positions, VertexIndex)
        });
    }

    return Edges;
}

/**
 * Extracts connected segment pairs from continuous line geometry.
 * @since 1.0.0
 */
function ExtractLineEdges(Geometry: THREE.BufferGeometry): Array<Edge>
{
    const Positions: Positions | undefined =
        Geometry.getAttribute("position");

    if (!IsPositionsAttribute(Positions))
    {
        return [ ];
    }

    const Edges: Array<Edge> = [ ];

    for (let VertexIndex: number = 0; VertexIndex + 1 < Positions.count; VertexIndex += 1)
    {
        Edges.push({
            End: ReadPosition(Positions, VertexIndex + 1),
            Start: ReadPosition(Positions, VertexIndex)
        });
    }

    return Edges;
}

/**
 * Extracts feature edges from indexed or non-indexed mesh geometry.
 * @since 1.0.0
 */
function ExtractMeshEdges(Geometry: THREE.BufferGeometry): Array<Edge>
{
    const Positions: Positions | undefined =
        Geometry.getAttribute("position");

    if (!IsPositionsAttribute(Positions))
    {
        return [ ];
    }

    if (Geometry.index !== null)
    {
        return ExtractIndexedMeshEdges(Positions, Geometry.index);
    }

    return ExtractNonIndexedMeshEdges(Positions);
}

/**
 * Extracts feature edges from indexed triangle mesh geometry.
 * @since 1.0.0
 */
function ExtractIndexedMeshEdges(
    Positions: Positions,
    Index: THREE.BufferAttribute
): Array<Edge>
{
    const EdgeRecords: Map<string, MeshEdgeRecord> = new Map<string, MeshEdgeRecord>();

    for (let IndexOffset: number = 0; IndexOffset + 2 < Index.count; IndexOffset += 3)
    {
        const A: THREE.Vector3 = ReadPosition(Positions, Index.getX(IndexOffset));
        const B: THREE.Vector3 = ReadPosition(Positions, Index.getX(IndexOffset + 1));
        const C: THREE.Vector3 = ReadPosition(Positions, Index.getX(IndexOffset + 2));
        const Normal: THREE.Vector3 = CalculateTriangleNormal(A, B, C);

        AddMeshTriangleEdges(EdgeRecords, A, B, C, Normal);
    }

    return ExtractFeatureEdges(EdgeRecords);
}

/**
 * Extracts feature edges from non-indexed triangle mesh geometry.
 * @since 1.0.0
 */
function ExtractNonIndexedMeshEdges(
    Positions: Positions
): Array<Edge>
{
    const EdgeRecords: Map<string, MeshEdgeRecord> = new Map<string, MeshEdgeRecord>();

    for (let VertexIndex: number = 0; VertexIndex + 2 < Positions.count; VertexIndex += 3)
    {
        const A: THREE.Vector3 = ReadPosition(Positions, VertexIndex);
        const B: THREE.Vector3 = ReadPosition(Positions, VertexIndex + 1);
        const C: THREE.Vector3 = ReadPosition(Positions, VertexIndex + 2);
        const Normal: THREE.Vector3 = CalculateTriangleNormal(A, B, C);

        AddMeshTriangleEdges(EdgeRecords, A, B, C, Normal);
    }

    return ExtractFeatureEdges(EdgeRecords);
}

/**
 * Adds all three triangle edges to a feature edge accumulator.
 * @since 1.0.0
 */
function AddMeshTriangleEdges(
    EdgeRecords: Map<string, MeshEdgeRecord>,
    A: THREE.Vector3,
    B: THREE.Vector3,
    C: THREE.Vector3,
    Normal: THREE.Vector3
): void
{
    AddMeshEdge(EdgeRecords, A, B, Normal);
    AddMeshEdge(EdgeRecords, B, C, Normal);
    AddMeshEdge(EdgeRecords, C, A, Normal);
}

/**
 * Adds or updates one mesh edge record.
 * @since 1.0.0
 */
function AddMeshEdge(
    EdgeRecords: Map<string, MeshEdgeRecord>,
    Start: THREE.Vector3,
    End: THREE.Vector3,
    Normal: THREE.Vector3
): void
{
    const Key: string = CreatePositionEdgeKey(Start, End);
    const ExistingRecord: MeshEdgeRecord | undefined = EdgeRecords.get(Key);

    if (ExistingRecord !== undefined)
    {
        ExistingRecord.Normals.push(Normal);
        return;
    }

    EdgeRecords.set(Key, {
        End: End.clone(),
        Normals: [ Normal ],
        Start: Start.clone()
    });
}

/**
 * Converts accumulated mesh edge records into visible feature edges.
 * @since 1.0.0
 */
function ExtractFeatureEdges(EdgeRecords: Map<string, MeshEdgeRecord>): Array<Edge>
{
    const Edges: Array<Edge> = [ ];

    for (const EdgeRecord of EdgeRecords.values())
    {
        if (IsFeatureEdge(EdgeRecord))
        {
            Edges.push({
                End: EdgeRecord.End.clone(),
                Start: EdgeRecord.Start.clone()
            });
        }
    }

    return Edges;
}

/**
 * Checks whether an edge should be visible in wireframe output.
 * @since 1.0.0
 */
function IsFeatureEdge(EdgeRecord: MeshEdgeRecord): boolean
{
    if (EdgeRecord.Normals.length <= 1)
    {
        return true;
    }

    for (let A: number = 0; A < EdgeRecord.Normals.length; A += 1)
    {
        for (let B: number = A + 1; B < EdgeRecord.Normals.length; B += 1)
        {
            if (EdgeRecord.Normals[A]!.dot(EdgeRecord.Normals[B]!) < FeatureEdgeNormalDotThreshold)
            {
                return true;
            }
        }
    }

    return false;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function CalculateTriangleNormal(A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3): THREE.Vector3
{
    const Normal: THREE.Vector3 = B.clone().sub(A).cross(C.clone().sub(A));

    if (Normal.lengthSq() === 0)
    {
        return Normal;
    }

    return Normal.normalize();
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function CreatePositionEdgeKey(Start: THREE.Vector3, End: THREE.Vector3): string
{
    const StartKey: string = CreatePositionKey(Start);
    const EndKey: string = CreatePositionKey(End);

    return StartKey < EndKey ? `${StartKey}:${EndKey}` : `${EndKey}:${StartKey}`;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function CreatePositionKey(Position: THREE.Vector3): string
{
    return pipe(
        [ Position.x, Position.y, Position.z ],
        Array.map(QuantizePosition),
        Array.join(",")
    );
}

/**
 * Converts a coordinate into a stable key fragment.
 * @since 1.0.0
 */
function QuantizePosition(Value: number): string
{
    return Value.toFixed(6);
}

/**
 * Checks whether a geometry attribute can be read as 3D positions.
 * @since 1.0.0
 */
function IsPositionsAttribute(Attribute: Positions | undefined): Attribute is Positions
{
    return Attribute !== undefined && Attribute.itemSize >= 3 && Attribute.count > 0;
}

/**
 * Reads one vector from a position attribute.
 * @since 1.0.0
 */
function ReadPosition(Positions: Positions, Index: number): THREE.Vector3
{
    return new THREE.Vector3(
        Positions.getX(Index),
        Positions.getY(Index),
        Positions.getZ(Index)
    );
}

