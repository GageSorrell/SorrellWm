/**
 * @file      footer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { Divider } from "./divider";
import { Icon } from "../icons";
import Link from "next/link";
import { Logo } from "../atoms/logo";
import { LogoDark } from "../atoms/logo-dark";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type FMenuItem =
    {
        items: Array<Record<"href" | "name", string> & Partial<{ blank: boolean; }>>;
        name: string;
    };

const Menus: Array<FMenuItem> =
    [
        {
            items: [
                {
                    href: "/docs/getting-started/introduction/",
                    name: "Docs"
                },
                {
                    href: "/docs/latest/reference",
                    name: "Reference"
                }
            ],
            name: "Community"
        },
        {
            items:
            [
                {
                    blank: true,
                    href: "https://blog.sorrell.sh",
                    name: "blog.sorrell.sh"
                }
            ],
            name: "Other"
        },
        {
            items: [
                {
                    blank: true,
                    href: "/terms-conditions",
                    name: "Terms & Conditions"
                },
                {
                    blank: true,
                    href: "/privacy-policy",
                    name: "Privacy Policy"
                },
                {
                    href: "mailto:gage@sorrell.sh",
                    name: "Contact Us"
                }
            ],
            name: "Legal"
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

export function Footer()
{
    const PathName: string = usePathname();
    const IsWide: boolean = PathName?.startsWith("/docs");

    function SocialLink({ href, icon, name }: FSocial): ReactNode
    {
        return (
            <Link
                className="generic-hover"
                { ...{ href } }>
                <span className="sr-only">{name}</span>
                <Icon
                    className="h-5 text-zinc-700 dark:text-zinc-400"
                    name={ icon as Icon.Name }
                />
            </Link>
        );
    }

    return (
        <div className={ PathName === "/" ? "dark" : "" }>
            <footer className="bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-400 text-sm">
                <Divider />
                <div
                    className={
                        `w-full ${ IsWide ? "max-w-screen-2xl" : "max-w-screen-xl" } mx-auto px-4 ` +
                        "sm:px-8 lg:px-16 py-24 flex flex-col sm:flex-row gap-10 justify-between"
                    }>
                    <div>
                        <Logo className="hidden dark:block h-7 sm:h-8" />
                        <LogoDark className="dark:hidden h-7 sm:h-8" />
                        <p className="leading-relaxed my-6">
                            MIT Licensed
                            <br />
                            Copyright © { new Date().getFullYear() } Gage Sorrell.
                        </p>
                        <div className="flex items-center gap-4">
                            {
                                Socials.map((Social: FSocial, Index: number) => (
                                    <SocialLink
                                        key={ Index }
                                        { ...Social }
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-wrap sm:gap-x-12 gap-y-6 sm:mt-0">
                        {Menus.map(({ name, items }, index) => (
                            <div key={ index } className="w-1/2 sm:w-auto">
                                <h3 className="text-white mb-4">{name}</h3>
                                <ul className="space-y-2">
                                    {items.map(({ name, href, blank }, index) => (
                                        <li key={ index }>
                                            <Link
                                                href={ href }
                                                className={ `flex items-start ${PathName?.startsWith(href) ? "" : "button-hover"}` }
                                                target={ blank === true ? "_blank" : "_self" }
                                            >
                                                <span>{name}</span>
                                                {href.startsWith("http") && (
                                                    <Icon
                                                        name="arrow-up-right-light"
                                                        className="h-3 mt-0.5 ml-0.5"
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
