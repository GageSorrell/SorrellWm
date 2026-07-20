/**
 * @file      Animation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as React from "react";
export interface ImpulseBackgroundBoxProps extends React.PropsWithChildren {
    readonly ImpulseKey: number;
    readonly Duration?: number;
    readonly FrameDuration?: number;
}
export declare function ImpulseBackgroundBox({ ImpulseKey, Duration, FrameDuration, children }: ImpulseBackgroundBoxProps): React.ReactElement;
//# sourceMappingURL=Animation.d.ts.map