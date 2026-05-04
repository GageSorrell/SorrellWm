/**
 * @file      navigation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import React, { type FC, type ReactNode } from "react";
import { Icon } from "../icons";
import Link from "next/link";
import { Logo } from "../atoms/logo";
import { LogoDark } from "../atoms/logo-dark";
import { MobileMenu } from "./mobile-menu";
import { ThemeSwitcher } from "../atoms/theme-switcher";
import { usePathname } from "next/navigation";

export interface NavigationLink
{
    readonly name: string
    readonly href: string
    readonly reload?: boolean
    readonly blank?: boolean
}

const links: Array<NavigationLink> =
    [
        {
            href: "/docs/latest/article/introduction",
            name: "Docs"
        },
        {
            href: "/docs/latest/article/getting-started",
            name: "Get Started"
        },
        {
            href: "https://github.com/GageSorrell/ReactiveEvent/tree/Master/Sample#ReadMe",
            name: "Sample",
            reload: true
        }
    ];

type FSocial = Record<"href" | "icon" | "name", string>;

const Socials: Array<FSocial> =
    [
        {
            href: "https://github.com/GageSorrell/ReactiveEvent",
            icon: "github",
            name: "GitHub"
        }
    ];
export type PNavigation =
    Partial<{
        IsInline: boolean;
        IsWide: boolean;
        UsesThemeSwitcher: boolean;
    }>;

export function Navigation({
    IsInline = false,
    UsesThemeSwitcher,
    IsWide
}: PNavigation): ReactNode
{
    const PathName: string = usePathname();

    return (
        <div className={ PathName === "/" ? "dark" : "" }>
            <header
                className={`${ IsInline ? "relative" : "fixed top-0 inset-x-0"
                } backdrop-blur z-30 bg-white/70 dark:bg-[#09090B]/70 text-zinc-700 dark:text-zinc-400`}
            >
                <div
                    className={
                        `w-full ${ IsInline
                            ? "border-b dark:border-neutral-700"
                            : IsWide
                                ? "max-w-screen-2xl"
                                : "max-w-screen-xl"
                        } mx-auto px-4 sm:px-8 lg:px-16 h-16 sm:h-24 flex justify-between items-center`
                    }
                >
                    <Link
                        className="z-50"
                        href="/">
                        <Logo className="hidden dark:block h-7 sm:h-8" />
                        <LogoDark className="dark:hidden h-7 sm:h-8" />
                    </Link>
                    <MobileMenu
                        menu={ links }
                        socials={ Socials }
                    />
                    <div className="hidden md:flex items-center gap-8">
                        <NavigationMenu />
                        { UsesThemeSwitcher && <ThemeSwitcher /> }
                        { PathName === "/" ? null : <ThemeSwitcher /> }
                        <div className="flex items-center gap-4">
                            {Socials.map(({ name, icon, href }, index) => (
                                <Link key={ index } href={ href } className="generic-hover">
                                    <span className="sr-only">{ name }</span>
                                    <Icon
                                        className="h-5 text-zinc-700 dark:text-zinc-400"
                                        name={ icon as Icon.Name }
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export function NavigationMenu()
{
    return <NavigationLinks links={ links } />;
}

const NavigationLinks: React.FC<{ links: ReadonlyArray<NavigationLink> }> = (
    props
) => {
    const pathname = usePathname();

    const shouldReload = props.links.some(
        (link) => link.href === pathname && link.reload
    );
    const links = shouldReload
        ? props.links.map((link) => ({ ...link, reload: true }))
        : props.links;

    return (
        <>
            {links.map((link, index) => (
                <NavigationLink key={ index } { ...link } />
            ))}
        </>
    );
};

function NavigationLink({ name, href, reload, blank }: NavigationLink)
{
    const pathname = usePathname();
    const Component = reload ? "a" : Link;
    return (
        <Component
            href={ href }
            className={ `flex items-start ${pathname?.startsWith(href)
                ? "text-black font-normal dark:text-white dark:font-light"
                : "button-hover"
            }` }
            target={ blank ? "_blank" : undefined }
        >
            <span>{name}</span>
            {href.startsWith("http") && (
                <Icon name="arrow-up-right-light" className="h-3.5 mt-0.5 ml-0.5" />
            )}
        </Component>
    );
}
