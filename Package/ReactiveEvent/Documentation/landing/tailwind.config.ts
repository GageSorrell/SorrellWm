/**
 * @file      tailwind.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-require-imports */

import type { Config } from "tailwindcss";

const config: Config =
    {
        content: [ "./src/**/*.{tsx,mdx}" ],
        darkMode: "class",
        plugins:
        [
            require("@tailwindcss/typography"),
            require("tailwindcss-animate")
        ],
        theme:
        {
            container:
            {

                center: true,
                padding: "2rem",
                screens:
                {
                    "2xl": "1400px"
                }
            },
            extend:
            {
                animation:
                {
                    "accordion-down": "accordion-down 0.2s ease-out",
                    "accordion-up": "accordion-up 0.2s ease-out",
                    "subtle-ping": "subtle-ping 3s cubic-bezier(0, 0, 0.2, 1) infinite"
                },
                borderRadius:
                {
                    lg: "var(--radius)",
                    md: "calc(var(--radius) - 2px)",
                    sm: "calc(var(--radius) - 4px)"
                },
                colors:
                {
                    accent:
                    {
                        DEFAULT: "hsl(var(--accent))",
                        foreground: "hsl(var(--accent-foreground))"
                    },
                    background: "hsl(var(--background))",
                    border: "hsl(var(--border))",
                    card:
                    {
                        DEFAULT: "hsl(var(--card))",
                        foreground: "hsl(var(--card-foreground))"
                    },
                    destructive:
                    {
                        DEFAULT: "hsl(var(--destructive))",
                        foreground: "hsl(var(--destructive-foreground))"
                    },
                    foreground: "hsl(var(--foreground))",
                    input: "hsl(var(--input))",
                    muted:
                    {
                        DEFAULT: "hsl(var(--muted))",
                        foreground: "hsl(var(--muted-foreground))"
                    },
                    popover:
                    {
                        DEFAULT: "hsl(var(--popover))",
                        foreground: "hsl(var(--popover-foreground))"
                    },
                    primary:
                    {
                        DEFAULT: "hsl(var(--primary))",
                        foreground: "hsl(var(--primary-foreground))"
                    },
                    ring: "hsl(var(--ring))",
                    secondary:
                    {
                        DEFAULT: "hsl(var(--secondary))",
                        foreground: "hsl(var(--secondary-foreground))"
                    }
                },
                fontFamily:
                {
                    display: [ "var(--font-cal-sans)", "sans-serif" ],
                    sans: [ "Segoe UI", "var(--font-inter)", "sans-serif" ]
                },
                keyframes:
                {
                    "accordion-down":
                    {
                        from: { height: "0" },
                        to: { height: "var(--radix-accordion-content-height)" }
                    },
                    "accordion-up":
                    {
                        from: { height: "var(--radix-accordion-content-height)" },
                        to: { height: "0" }
                    },
                    "subtle-ping":
                    {
                        "75%, 100%":
                        {
                            opacity: "0",
                            transform: "scale(1.5)"
                        }
                    }
                },
                minWidth:
                {
                    "1/2": "50%"
                }
            }
        }
    };

export default config;
