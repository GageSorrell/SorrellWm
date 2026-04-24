/**
 * @file      renderer.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type
{
    DefaultRenderer,
    SilentRenderer,
    SimpleRenderer,
    TestRenderer,
    VerboseRenderer } from "@renderer/index.js";
import type { ListrEventManager, Task } from "@lib/index.js";
import type { ListrRendererSelection } from "@constants/index.js";

/** Name of the default renderer. */
export type ListrDefaultRendererValue = "default";
/** Type of default renderer. */
export type ListrDefaultRenderer = typeof DefaultRenderer;
/** Name of simple renderer. */
export type ListrSimpleRendererValue = "simple";
/** Type of simple renderer. */
export type ListrSimpleRenderer = typeof SimpleRenderer;
/** Name of verbose renderer. */
export type ListrVerboseRendererValue = "verbose";
/** Type of verbose renderer. */
export type ListrVerboseRenderer = typeof VerboseRenderer;
/** Name of test renderer. */
export type ListrTestRendererValue = "test";
/** Type of test renderer. */
export type ListrTestRenderer = typeof TestRenderer;
/** Name of silent renderer. */
export type ListrSilentRendererValue = "silent";
/** Type of silent renderer. */
export type ListrSilentRenderer = typeof SilentRenderer;

/** The default preferred renderer. */
export type ListrPrimaryRendererValue = ListrDefaultRendererValue;
/** The default fallback renderer. */
export type ListrSecondaryRendererValue = ListrSimpleRendererValue;

/**
 * Listr2 can process either the integrated renderers as string aliases,
 * or utilize a compatible style renderer that extends the ListrRenderer abstract class.
 */
export type ListrRendererValue =
  | ListrSilentRendererValue
  | ListrDefaultRendererValue
  | ListrSimpleRendererValue
  | ListrVerboseRendererValue
  | ListrTestRendererValue
  | ListrRendererFactory;

export type ListrRendererSubclass =
    | ListrSilentRenderer
    | ListrDefaultRenderer
    | ListrSimpleRenderer
    | ListrVerboseRenderer
    | ListrTestRenderer;

/**
 * Returns the class type from friendly names of the renderers.
 */
export type ListrGetRendererClassFromValue<T extends Exclude<ListrRendererValue, ListrRendererFactory>> =
    T extends ListrDefaultRendererValue
        ? ListrDefaultRenderer
        : T extends ListrSimpleRendererValue
            ? ListrSimpleRenderer
            : T extends ListrVerboseRendererValue
                ? ListrVerboseRenderer
                : T extends ListrTestRendererValue
                    ? ListrTestRenderer
                    : T extends ListrSilentRenderer
                        ? ListrSilentRenderer
                        : T extends ListrRendererFactory
                            ? T
                            : never;

/**
 * Returns the friendly names from the type of renderer classes.
 */
export type ListrGetRendererValueFromClass<T extends ListrRendererFactory> = T extends DefaultRenderer
    ? ListrDefaultRendererValue
    : T extends SimpleRenderer
        ? ListrSimpleRendererValue
        : T extends VerboseRenderer
            ? ListrVerboseRendererValue
            : T extends TestRenderer
                ? ListrTestRendererValue
                : T extends SilentRenderer
                    ? ListrSilentRenderer
                    : T extends ListrRendererFactory
                        ? T
                        : never;

/**
 * Returns renderer global options depending on the renderer type.
 */
export type ListrGetRendererOptions<RendererType extends ListrRendererSubclass> =
    RendererType extends ListrRendererValue
        ? RendererType["RendererOptions"]
        : never;

// export type ListrGetRendererOptions = ListrGetRendererClassFromValue<"default">["rendererOptions"];

/**
 * Returns renderer per-task options depending on the renderer type.
 */
export type ListrGetRendererTaskOptions<RendererType extends ListrRendererSubclass> =
    RendererType extends ListrRendererValue
        ? RendererType["RendererTaskOptions"]
        : never;

// export type ListrGetRendererTaskOptions =
//     ListrGetRendererClassFromValue<"default">["rendererTaskOptions"];

// export type ListrGetRendererTaskOptions<T extends ListrRendererValue> =
//     T extends ListrRendererValue ? ListrGetRendererClassFromValue<T>['rendererTaskOptions'] : never

/** Selection and options of the primary preferred renderer. */
export interface ListrPrimaryRendererSelection<T extends ListrRendererSubclass> extends
    ListrPrimaryRendererOptions<T>
{
    /** Default renderer preferred. */
    Renderer?: T;
}

/** Options of the primary preferred renderer. */
export interface ListrPrimaryRendererOptions<T extends ListrRendererSubclass>
{
    /** Renderer options depending on the current renderer. */
    RendererOptions?: ListrGetRendererOptions<T>;
}

/** Task options of the primary preferred renderer. */
export interface ListrPrimaryRendererTaskOptions<T extends ListrRendererSubclass>
{
    /** Renderer options depending on the current renderer. */
    RendererOptions?: ListrGetRendererTaskOptions<T>;
}

/** Selection and options of the preferred fallback renderer. */
export interface ListrSecondaryRendererSelection<Type extends ListrRendererSubclass> extends
    ListrSecondaryRendererOptions<Type>
{
    /** Fallback renderer preferred. */
    FallbackRenderer?: Type;
}

/** Options of the fallback renderer. */
export interface ListrSecondaryRendererOptions<Type extends ListrRendererSubclass>
{
    /** Renderer options depending on the fallback renderer. */
    FallbackRendererOptions?: ListrGetRendererOptions<Type>;
}

/** Task options of the fallback renderer. */
export interface ListrSecondaryRendererTaskOptions<T extends ListrRendererSubclass>
{
    /** Renderer options depending on the fallback renderer. */
    FallbackRendererOptions?: ListrGetRendererTaskOptions<T>;
}

/**
 * Renderer options for the parent Listr class, including setup for selecting default and fallback renderers.
 */
export type ListrRendererOptions<T extends ListrRendererSubclass> =
    ListrPrimaryRendererSelection<T> &
    ListrSecondaryRendererSelection<T>;

/**
 * The definition of a ListrRenderer.
 *
 * @see {@link https://listr2.kilic.dev/renderer/renderer.html}
 */
export declare class ListrRenderer
{
    // /** designate renderer global options that is specific to the current renderer */
    // public static RendererOptions: Record<PropertyKey, unknown>;
    // /** designate renderer per task options that is specific to the current renderer  */
    // public static RendererTaskOptions: Record<PropertyKey, unknown>;
    /** designate whether this renderer can work in non-tty environments */
    public static NonTty: boolean;
    /** A function to what to do on render */
    public Render: () => void | Promise<void>;
    /** A function to what to do on end of the render */
    public End: (err?: unknown) => void;
    /** create a new renderer */
    constructor(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        Tasks: Array<Task<any, any, any, any, any>>,
        // Options: typeof ListrRenderer.RendererOptions,
        Options: unknown,
        Events?: ListrEventManager
    );
}

/** Factory of compatible Listr renderers. */
// export type ListrRendererFactory = typeof ListrRenderer;
export type ListrRendererFactory = typeof ListrRenderer;

/** Renderer selection for current Listr. */
export interface SupportedRenderer<Renderer extends ListrRendererSubclass>
{
    Renderer: Renderer;
    Options?: ListrGetRendererOptions<Renderer>;
    Selection: ListrRendererSelection;
}

/**
 * Description.
 */
export type ListrRendererCacheMap<T> = Map<Task<unknown, unknown, unknown>["Id"], T>;
