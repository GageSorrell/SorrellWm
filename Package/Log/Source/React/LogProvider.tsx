/**
 *
 *
 * @module @sorrell/log/React/LogProvider
 *
 * @file      LogProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { LogContext, type LogContextValue } from "./LogContext.js";
import * as React from "react";
import type { ReactNode } from "react";
import type { CategoryInput } from "../Category.js";
import type { UnsafePublisher } from "../Logger.js";
import * as Category from "../Category.js";

/** Props for a composable logging context provider. */
export interface LogProviderProps
{
    readonly Runtime?: UnsafePublisher;
    readonly Category?: CategoryInput;
    readonly Annotations?: Readonly<Record<string, unknown>>;
    readonly children?: ReactNode;
}

/**
 * Provide a runtime and compose nested categories and annotations.
 *
 * @category Context
 * @since 1.0.0
 */
export function LogProvider(Props: LogProviderProps): React.ReactNode
{
    const Parent = React.useContext(LogContext);
    const Runtime = Props.Runtime ?? Parent?.Runtime;

    if (Runtime === undefined)
    {
        throw new Error("LogProvider requires Runtime at the root provider.");
    }

    const ParentCategory = Parent?.Category;
    const CategoryValue = Props.Category === undefined
        ? ParentCategory ?? Category.Make("Application")
        : ParentCategory === undefined
            ? Category.Make(Props.Category)
            : Category.Child(ParentCategory, Props.Category);
    const ParentAnnotations = Parent?.Annotations;
    const Value = React.useMemo<LogContextValue>(() => ({
        Annotations: {
            ...ParentAnnotations,
            ...Props.Annotations
        },
        Category: CategoryValue,
        Runtime
    }), [ ParentAnnotations, Props.Annotations, CategoryValue, Runtime ]);

    return (
        <LogContext.Provider value={ Value }>
            {Props.children}
        </LogContext.Provider>
    );
}
