/**
 * Storybook preview configuration for `@sorrell/storybook-theme-effect`.
 *
 * @module @sorrell/storybook-theme-effect/preview
 *
 * @file      preview.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Decorator, Preview } from "@storybook/react";
import type * as React from "react";
import "../Source/Style.css";

export const EffectPreviewTypeId = Symbol.for("@sorrell/storybook-theme-effect/Preview");
export type EffectPreviewTypeId = typeof EffectPreviewTypeId;

const WithEffectTheme: Decorator = (Story, Context): React.JSX.Element =>
    <div className={ `sorrell-effect-preview sorrell-effect-preview--${ String(Context.globals.theme ?? "dark") }` }><Story /></div>;

const PreviewConfiguration: Preview = {
    decorators: [ WithEffectTheme ],
    globalTypes: { theme: { defaultValue: "dark", toolbar: { items: [ "light", "dark" ], title: "Theme" } } },
    parameters: {
        a11y: { test: "todo" },
        backgrounds: { options: { dark: { name: "Dark", value: "#09090b" }, light: { name: "Light", value: "#fafafa" } } },
        controls: { expanded: true }, docs: { source: { state: "open" } },
        viewport: { options: { desktop: { name: "Desktop", styles: { height: "900px", width: "1440px" } }, mobile: { name: "Mobile", styles: { height: "844px", width: "390px" } } } }
    }
};
export default PreviewConfiguration;
