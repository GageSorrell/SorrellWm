/**
 * @file      Theme.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

/**
 * This file lifts some type definitions from
 * https://github.com/microsoft/fluentui/blob/master/packages/react-components/theme-designer/
 */

/* eslint-disable @typescript-eslint/naming-convention */

export type Vec2 = [ number, number ];
export type Vec3 = [ number, number, number ];
export type Vec4 = [ number, number, number, number ];
export type Palette =
{
    keyColor: Vec3;
    darkCp: number;
    lightCp: number;
    hueTorsion: number;
};

export type Curve =
{
    cacheArcLengths?: TArray<number>;
    points: [Vec3, Vec3, Vec3];
};
export interface CurvePath
{
    cacheLengths?: TArray<number>;
    curves: TArray<Curve>;
}

export interface CurvedHelixPath extends CurvePath
{
    torsion?: number;
    torsionT0?: number;
}

