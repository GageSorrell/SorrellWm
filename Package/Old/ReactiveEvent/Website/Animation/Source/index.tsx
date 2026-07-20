/**
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ReactiveEventIntro } from "./ReactiveEventIntro";
import { registerRoot } from "remotion";

function Animations(): ReactNode
{
    return (
        <>
            <ReactiveEventIntro />
        </>
    );
}

registerRoot(Animations);
