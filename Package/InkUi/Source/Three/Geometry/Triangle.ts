/**
 * Triangle extraction helpers for supported ThreeJS mesh geometry.
 *
 * @module @sorrell/ink-three/Geometry/Triangle
 *
 * @file      Triangle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as THREE from "three";

/**
 * Local-space triangle extracted from supported ThreeJS mesh geometry.
 *
 * @category Model
 * @since 1.0.0
 */
export interface Triangle
{
    readonly A: THREE.Vector3;
    readonly B: THREE.Vector3;
    readonly C: THREE.Vector3;
}

/**
 * Extracts local-space triangles from supported ThreeJS mesh objects.
 *
 * @category Rendering
 * @since 1.0.0
 */
export function ExtractTriangles(Object: THREE.Object3D): Array<Triangle>
{
    if (!(Object instanceof THREE.Mesh))
    {
        return [ ];
    }

    return ExtractMeshTriangles(Object.geometry);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ExtractMeshTriangles(Geometry: THREE.BufferGeometry): Array<Triangle>
{
    const Positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined =
        Geometry.getAttribute("position");

    if (!IsUsablePositionAttribute(Positions))
    {
        return [ ];
    }

    if (Geometry.index !== null)
    {
        return ExtractIndexedMeshTriangles(Positions, Geometry.index);
    }

    return ExtractNonIndexedMeshTriangles(Positions);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ExtractIndexedMeshTriangles(
    Positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
    Index: THREE.BufferAttribute
): Array<Triangle>
{
    const Triangles: Array<Triangle> = [ ];

    for (let IndexOffset: number = 0; IndexOffset + 2 < Index.count; IndexOffset += 3)
    {
        Triangles.push({
            A: ReadPosition(Positions, Index.getX(IndexOffset)),
            B: ReadPosition(Positions, Index.getX(IndexOffset + 1)),
            C: ReadPosition(Positions, Index.getX(IndexOffset + 2))
        });
    }

    return Triangles;
}

/**
 * Extracts triangles from non-indexed position attributes.
 * @since 1.0.0
 */
function ExtractNonIndexedMeshTriangles(
    Positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute
): Array<Triangle>
{
    const Triangles: Array<Triangle> = [ ];

    for (let VertexIndex: number = 0; VertexIndex + 2 < Positions.count; VertexIndex += 3)
    {
        Triangles.push({
            A: ReadPosition(Positions, VertexIndex),
            B: ReadPosition(Positions, VertexIndex + 1),
            C: ReadPosition(Positions, VertexIndex + 2)
        });
    }

    return Triangles;
}

/**
 * Checks whether a geometry attribute can be read as triangle positions.
 * @since 1.0.0
 */
function IsUsablePositionAttribute(
    Attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined
): Attribute is THREE.BufferAttribute | THREE.InterleavedBufferAttribute
{
    return Attribute !== undefined && Attribute.itemSize >= 3 && Attribute.count > 0;
}

/**
 * Reads one vector from a triangle position attribute.
 * @since 1.0.0
 */
function ReadPosition(
    Positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
    Index: number
): THREE.Vector3
{
    return new THREE.Vector3(
        Positions.getX(Index),
        Positions.getY(Index),
        Positions.getZ(Index)
    );
}

