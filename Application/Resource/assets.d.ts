/* File:      assets.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-require-imports */

type TStyles = Record<string, string>;

declare module "*.svg"
{
    import React = require("react");

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

    const content: string;
    export default content;
}

declare module "*.png"
{
    const content: string;
    export default content;
}

declare module "*.jpg"
{
    const content: string;
    export default content;
}

declare module "*.scss"
{
    const content: TStyles;
    export default content;
}

declare module "*.sass"
{
    const content: TStyles;
    export default content;
}

declare module "*.css"
{
    const content: TStyles;
    export default content;
}
