/**
 * @file      Path.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { join } from "path";
import { Operator } from "tsover-runtime";

export class FPath
{
    public readonly Raw: string;

    public toString(): string
    {
        return this.Raw;
    }

    public constructor(String: string);
    public constructor(Other: FPath);
    public constructor(Argument: string | FPath)
    {
        if (typeof Argument === "string")
        {
            this.Raw = Argument;
        }
        else
        {
            this.Raw = Argument.Raw;
        }
    }

    [Operator.slash](A: FPath, B: FPath): FPath;
    [Operator.slash](A: string, B: FPath): FPath;
    [Operator.slash](A: FPath, B: string): FPath;
    [Operator.slash](A: FPath | string, B: FPath | string): FPath
    {
        if (typeof A === "string")
        {
            return new FPath(join(A, (B as FPath).Raw));
        }
        else if (typeof B === "string")
        {
            return new FPath(join((A as FPath).Raw, B));
        }
        else
        {
            return new FPath(join((A as FPath).Raw, (B as FPath).Raw));
        }
    }
}
