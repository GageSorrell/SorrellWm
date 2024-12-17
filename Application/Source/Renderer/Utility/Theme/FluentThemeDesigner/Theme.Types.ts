/* File:      Theme.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
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
    cacheArcLengths?: Array<number>;
    points: [Vec3, Vec3, Vec3];
};
export interface CurvePath
{
    cacheLengths?: Array<number>;
    curves: Array<Curve>;
}

export interface CurvedHelixPath extends CurvePath
{
    torsion?: number;
    torsionT0?: number;
}

