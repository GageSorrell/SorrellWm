/**
 * Storybook preview configuration for `@sorrell/storybook-theme-fluent`.
 *
 * @module @sorrell/storybook-theme-fluent/preview
 *
 * @file      preview.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import type { Decorator, Preview } from "@storybook/react";
import type * as React from "react";
import "../Source/Style.css";

export const FluentPreviewTypeId = Symbol.for("@sorrell/storybook-theme-fluent/Preview");
export type FluentPreviewTypeId = typeof FluentPreviewTypeId;

const WithFluentTheme: Decorator = (Story, Context): React.JSX.Element =>
{
    const IsDark = Context.globals.backgrounds?.value === "dark" || Context.globals.theme === "dark";
    return <FluentProvider className="sorrell-storybook-preview" theme={ IsDark ? webDarkTheme : webLightTheme }><Story /></FluentProvider>;
};

const PreviewConfiguration: Preview = {
    decorators: [ WithFluentTheme ],
    globalTypes: { theme: { defaultValue: "light", toolbar: { items: [ "light", "dark" ], title: "Theme" } } },
    parameters: {
        a11y: { test: "todo" },
        backgrounds: { options: { dark: { name: "Dark", value: "#1f1f1f" }, light: { name: "Light", value: "#ffffff" } } },
        controls: { expanded: true },
        docs: { source: { state: "open" } },
        viewport: { options: { desktop: { name: "Desktop", styles: { height: "900px", width: "1440px" } }, mobile: { name: "Mobile", styles: { height: "844px", width: "390px" } } } }
    }
};

export default PreviewConfiguration;
