/**
 *
 *
 * @module @sorrell/docusaurus-theme-fluent/theme/Root
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import type * as React from "react";

export const FluentRootTypeId = Symbol.for("@sorrell/docusaurus-theme-fluent/Root");
export type FluentRootTypeId = typeof FluentRootTypeId;

interface RootProps { readonly children: React.ReactNode; }

/** @category Component @since 1.0.0 */
export default function Root({ children: Children }: RootProps): React.JSX.Element
{
    const [ IsDark, SetIsDark ] = useState(false);

    useEffect(() =>
    {
        const RootElement = document.documentElement;
        const Update = (): void => SetIsDark(RootElement.dataset.theme === "dark");
        const Observer = new MutationObserver(Update);
        Update();
        Observer.observe(RootElement, { attributeFilter: [ "data-theme" ], attributes: true });
        return () => Observer.disconnect();
    }, []);

    return <FluentProvider theme={ IsDark ? webDarkTheme : webLightTheme }>{ Children }</FluentProvider>;
}
