/**
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Layer } from "effect";
import type { InkTheme } from "./Theme.Types.ts";

export const InkThemeService: Context.Service<InkTheme, InkTheme> =
    Context.Service<InkTheme>("@sorrell/effect-ink/Theme");

export const DefaultInkTheme: InkTheme =
{
    Name: "Default",

    Color:
    {
        Foreground:
        {
            Foreground: "white",

            Disabled: "gray",
            Muted: "gray",
            Subtle: "gray"
        },

        Background:
        {
            Background: "black",

            Raised: "black",
            Selected: "blue"
        },

        Border:
        {
            Border: "gray",
            Focused: "cyan",
            Muted: "gray"
        },

        Accent: "yellow",
        Primary: "cyan",
        Secondary: "magenta",

        Error: "red",
        Info: "blue",
        Success: "green",
        Warning: "yellow"
    },

    Space: {
        ExtraSmall: 1,
        Large: 3,
        Medium: 2,
        None: 0,
        Small: 1
    },

    Text:
    {
        Body: {
            color: "white"
        },
        Disabled: {
            color: "gray",
            dimColor: true
        },
        Muted: {
            color: "gray"
        },
        Subtle: {
            color: "gray",
            dimColor: true
        },

        Code: {
            color: "cyan"
        },
        Heading: {
            bold: true,
            color: "white"
        },
        Link: {
            color: "cyan",
            underline: true
        },
        Strong: {
            bold: true
        },

        Accent: {
            color: "yellow"
        },
        Primary: {
            color: "cyan"
        },
        Secondary: {
            color: "magenta"
        },

        Error: {
            color: "red"
        },
        Info: {
            color: "blue"
        },
        Success: {
            color: "green"
        },
        Warning: {
            color: "yellow"
        }
    },

    Box: {
        Column:
        {
            flexDirection: "column"
        },
        Panel: {
            borderColor: "gray",
            borderStyle: "round",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 0
        },
        PanelError: {
            borderColor: "red",
            borderStyle: "round",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 0
        },
        PanelFocused: {
            borderColor: "cyan",
            borderStyle: "round",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 0
        },
        PanelSuccess: {
            borderColor: "green",
            borderStyle: "round",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 0
        },
        PanelWarning: {
            borderColor: "yellow",
            borderStyle: "round",
            flexDirection: "column",
            paddingX: 1,
            paddingY: 0
        },
        Root: {
            flexDirection: "column"
        },
        Row: {
            flexDirection: "row"
        },
        Section: {
            flexDirection: "column",
            marginBottom: 1
        }
    },

    Icon:
    {
        Pointer: "❯",
        PointerSmall: "›",

        Error: "✗",
        Info: "i",
        Success: "✓",
        Warning: "!",

        Selected: "●",
        Unselected: "○",

        Checked: "☑",
        Unchecked: "☐",

        Collapsed: "▸",
        Expanded: "▾"
    },

    Spinner: {
        Frames: [ "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏" ],
        IntervalMilliseconds: 80,
        Style: {
            color: "cyan"
        }
    },

    Component:
    {
        Status:
        {
            ErrorIcon: {
                bold: true,
                color: "red"
            },
            ErrorText: {
                color: "red"
            },
            InfoIcon: {
                bold: true,
                color: "blue"
            },
            InfoText: {
                color: "blue"
            },

            SuccessIcon: {
                bold: true,
                color: "green"
            },
            SuccessText: {
                color: "green"
            },
            WarningIcon: {
                bold: true,
                color: "yellow"
            },
            WarningText: {
                color: "yellow"
            }
        },

        Prompt: {
            Container: {
                flexDirection: "column"
            },
            Hint: {
                color: "gray",
                dimColor: true
            },
            Label: {
                bold: true,
                color: "white"
            },
            Message: {
                color: "white"
            },
            Placeholder: {
                color: "gray",
                dimColor: true
            },
            RequiredMarker: {
                color: "red"
            },
            Separator: {
                color: "gray"
            },
            ValidationError: {
                color: "red"
            },
            Value: {
                color: "cyan"
            }
        },

        Input: {
            Container: {
                flexDirection: "row"
            },
            Cursor: {
                inverse: true
            },
            InvalidValue: {
                color: "red"
            },
            Placeholder: {
                color: "gray",
                dimColor: true
            },
            SubmittedValue: {
                color: "green"
            },
            Value: {
                color: "white"
            }
        },

        Select: {
            Container: {
                flexDirection: "column"
            },
            Option: {
                color: "white"
            },
            OptionCursor: {
                bold: true,
                color: "cyan"
            },
            OptionDescription: {
                color: "gray"
            },
            OptionDisabled: {
                color: "gray",
                dimColor: true
            },
            OptionFocused: {
                color: "cyan"
            },
            OptionSelected: {
                color: "green"
            },
            SearchMatch: {
                bold: true,
                color: "yellow"
            }
        },

        Error: {
            AnnotationKey:
            {
                color: "yellow"
            },
            AnnotationValue:
            {
                color: "white"
            },
            Cause:
            {
                color: "red"
            },
            Container: {
                borderColor: "red",
                borderStyle: "round",
                flexDirection: "column",
                paddingX: 1,
                paddingY: 0
            },
            Message: {
                color: "white"
            },
            Name: {
                bold: true,
                color: "red"
            },
            Stack: {
                color: "gray"
            }
        }
    }
} satisfies InkTheme;

export const InkThemeLayerDefault: Layer.Layer<InkTheme> = Layer.succeed(
    InkThemeService,
    DefaultInkTheme
);
