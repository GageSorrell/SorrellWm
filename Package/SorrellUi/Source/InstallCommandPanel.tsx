/**
 * A package-manager-aware install command panel: a dropdown to pick bun/deno/npm/pnpm/yarn,
 * and click-to-copy with "Copied" feedback.
 *
 * @module @sorrell/ui/InstallCommandPanel
 *
 * @file      InstallCommandPanel.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Check, ChevronDown, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import type { ReactNode } from "react";

import { Cn } from "./ClassName.js";

const CopyResetTimeoutMs = 1500;

const PanelClassName = "relative block rounded-md bg-[#101012] p-1 ring-1 ring-inset ring-zinc-700";

const CopyRowClassName =
    "flex min-h-11 w-full cursor-pointer items-center gap-3 px-4 py-1 text-left font-mono text-sm " +
    "text-zinc-300 transition-colors hover:bg-[#17171A]";

const ChipClassName =
    "flex cursor-pointer items-center gap-1.5 rounded-sm border-r border-zinc-800 py-0.5 pr-3 pl-1 " +
    "text-xs text-zinc-300 transition-colors hover:text-white";

const DropdownClassName =
    "absolute top-full left-0 z-20 mt-2 w-36 overflow-hidden rounded-md border border-zinc-800 " +
    "bg-zinc-900 shadow-xl";

const OptionBaseClassName =
    "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors " +
    "hover:bg-zinc-800";

/** A supported package manager. */
export type PackageManager = "bun" | "deno" | "npm" | "pnpm" | "yarn";

/** All package managers, in display order. */
export const PackageManagers: ReadonlyArray<PackageManager> = [ "npm", "bun", "pnpm", "yarn", "deno" ];

const InstallCommand = (PackageManagerValue: PackageManager, PackageName: string): string =>
{
    switch (PackageManagerValue)
    {
        case "bun":
        {
            return `bun add ${ PackageName }`;
        }

        case "deno":
        {
            return `deno add npm:${ PackageName }`;
        }

        case "pnpm":
        {
            return `pnpm add ${ PackageName }`;
        }

        case "yarn":
        {
            return `yarn add ${ PackageName }`;
        }

        default:
        {
            return `npm install ${ PackageName }`;
        }
    }
};

/** {@inheritDoc InstallCommandPanel} */
export interface InstallCommandPanelProps
{
    readonly className?: string;
    readonly defaultPackageManager?: PackageManager;
    /** An icon per package manager, shown in the chip and dropdown. Omit for a text-only chip. */
    readonly icons?: Partial<Record<PackageManager, ReactNode>>;
    readonly packageName: string;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const InstallCommandPanel = (
    {
        className: ClassName,
        defaultPackageManager: DefaultPackageManager = "npm",
        icons: Icons = {},
        packageName: PackageName
    }: InstallCommandPanelProps
): React.JSX.Element =>
{
    const [ ActivePackageManager, SetActivePackageManager ] = useState<PackageManager>(DefaultPackageManager);
    const [ IsDropdownOpen, SetIsDropdownOpen ] = useState(false);
    const [ CopyState, SetCopyState ] = useState<"copied" | "error" | "idle">("idle");
    const DropdownRef = useRef<HTMLDivElement>(null);
    const CopyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() =>
    {
        if (!IsDropdownOpen)
        {
            return;
        }

        const OnOutsideClick = (Event: MouseEvent): void =>
        {
            if (DropdownRef.current !== null && !DropdownRef.current.contains(Event.target as Node))
            {
                SetIsDropdownOpen(false);
            }
        };

        const OnEscape = (Event: KeyboardEvent): void =>
        {
            if (Event.key === "Escape")
            {
                SetIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", OnOutsideClick);
        document.addEventListener("keydown", OnEscape);

        return () =>
        {
            document.removeEventListener("mousedown", OnOutsideClick);
            document.removeEventListener("keydown", OnEscape);
        };
    }, [ IsDropdownOpen ]);

    useEffect(() =>
    {
        return () =>
        {
            if (CopyResetTimeoutRef.current !== undefined)
            {
                clearTimeout(CopyResetTimeoutRef.current);
            }
        };
    }, []);

    const OnCopy = async (): Promise<void> =>
    {
        const Clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
        const NextState = Clipboard === undefined ?
            "error" :
            await Clipboard.writeText(InstallCommand(ActivePackageManager, PackageName))
                .then(() => "copied" as const)
                .catch(() => "error" as const);

        SetCopyState(NextState);

        if (CopyResetTimeoutRef.current !== undefined)
        {
            clearTimeout(CopyResetTimeoutRef.current);
        }

        CopyResetTimeoutRef.current = setTimeout(() =>
        {
            SetCopyState("idle");
            CopyResetTimeoutRef.current = undefined;
        }, CopyResetTimeoutMs);
    };

    const OnCopyKeyDown = (Event: React.KeyboardEvent<HTMLDivElement>): void =>
    {
        if (Event.key === "Enter" || Event.key === " ")
        {
            Event.preventDefault();
            void OnCopy();
        }
    };

    return (
        <div className={ Cn(PanelClassName, ClassName) }>
            <div aria-label="Copy install command"
                className={ CopyRowClassName }
                onClick={ OnCopy }
                onKeyDown={ OnCopyKeyDown }
                role="button"
                tabIndex={ 0 }>
                <div className="relative shrink-0"
                    ref={ DropdownRef }>
                    <button aria-expanded={ IsDropdownOpen }
                        aria-haspopup="listbox"
                        aria-label={ `Package manager: ${ ActivePackageManager }` }
                        className={ ChipClassName }
                        onClick={ (Event) =>
                        {
                            Event.stopPropagation();
                            SetIsDropdownOpen((Open) => !Open);
                        } }
                        type="button">
                        <span aria-hidden="true">{ Icons[ActivePackageManager] }</span>
                        <span>{ ActivePackageManager }</span>
                        <ChevronDown aria-hidden="true"
                            className={ Cn(
                                "size-4 text-zinc-500 transition-transform",
                                IsDropdownOpen ? "rotate-180" : undefined
                            ) } />
                    </button>

                    {
                        IsDropdownOpen ?
                            <ul className={ DropdownClassName }
                                role="listbox">
                                {
                                    PackageManagers.map((PackageManagerOption) =>
                                    {
                                        const IsActive = PackageManagerOption === ActivePackageManager;

                                        return (
                                            <li key={ PackageManagerOption }>
                                                <button aria-selected={ IsActive }
                                                    className={ Cn(
                                                        OptionBaseClassName,
                                                        IsActive ? "text-white" : "text-zinc-400"
                                                    ) }
                                                    onClick={ (Event) =>
                                                    {
                                                        Event.stopPropagation();
                                                        SetActivePackageManager(PackageManagerOption);
                                                        SetIsDropdownOpen(false);
                                                    } }
                                                    role="option"
                                                    type="button">
                                                    { Icons[PackageManagerOption] }
                                                    <span className="flex-1">{ PackageManagerOption }</span>
                                                    {
                                                        IsActive ?
                                                            <Check aria-hidden="true"
                                                                className="shrink-0 text-zinc-500"
                                                                size={ 16 } /> :
                                                            undefined
                                                    }
                                                </button>
                                            </li>
                                        );
                                    })
                                }
                            </ul> :
                            undefined
                    }
                </div>

                <span className="flex-1 truncate">
                    { InstallCommand(ActivePackageManager, PackageName) }
                </span>

                {
                    CopyState === "copied" ?
                        <Check aria-hidden="true"
                            className="shrink-0 text-zinc-200"
                            size={ 16 } /> :
                        <Copy aria-hidden="true"
                            className="shrink-0 text-zinc-400"
                            size={ 16 } />
                }
            </div>

            <p aria-live="polite"
                className="sr-only"
                role="status">
                { CopyState === "copied" ? "Copied" : CopyState === "error" ? "Could not copy" : "" }
            </p>
        </div>
    );
};
