# `@sorrell/ink-ui`

Reusable, themed terminal UI components for [Ink](https://github.com/vadimdemedes/ink).
The package is an Ink-native port of the reusable parts of Noodle's OpenTUI
interface. Application-specific HTTP, request, collection, folder, and
environment screens are intentionally excluded; its generalized timeline
views are included.

## Installation

```sh
npm install @sorrell/ink-ui ink react react-dom
```

`ink`, `react`, and `react-dom` are required peer dependencies.

## Example

```tsx
import { render } from "ink";
import {
    Frame,
    Select,
    ThemeProvider
} from "@sorrell/ink-ui";

const App = () => (
    <ThemeProvider>
        <Frame Active Title="Choose">
            <Select
                Items={[
                    { Label: "Alpha", Value: "alpha" },
                    { Label: "Bravo", Value: "bravo" }
                ]}
                Value="alpha"
            />
        </Frame>
    </ThemeProvider>
);

render(<App />, { alternateScreen: true });
```

## Components

### Theme

- `ThemeProvider`
- `ThemePickerOverlay`

### Display

- `Badge`
- `BackdropProvider`
- `Box`
- `Button`
- `CenterText`
- `Checkbox`
- `GradientBadge`
- `HeaderBar`
- `HeaderTable`
- `JumpBadge`
- `LaTeX`
- `ShadowProvider`
- `StatusBar`
- `Tips`
- `Toast`
- `ValidationNotice`

`BackdropProvider` paints its assumed full-screen region with a darker form of
the detected terminal background:

```tsx
import { BackdropProvider } from "@sorrell/ink-ui/Backdrop";
import { Box } from "@sorrell/ink-ui/Box";

<BackdropProvider>
    <Box>Content uses the original terminal background.</Box>
</BackdropProvider>
```

Most terminal backgrounds are darkened by a consistent percentage; very dark
colors use a stronger reduction to preserve as much visible separation as
possible. Pass `backgroundColor` to override the generated backdrop color.
The terminal's original color becomes the default background for every `Box`,
while an explicit `Box.backgroundColor` still takes precedence. If the
terminal background cannot be determined, the provider introduces no layout
or color and an otherwise unstyled `Box` leaves `backgroundColor` unset.

`Box` accepts every Ink `Box` prop and adds a Sixel-backed `compact` border.
The border still reserves Ink's normal border cells, but its one-pixel line is
drawn at their content-facing edges:

```tsx
import { Box } from "@sorrell/ink-ui/Box";

<Box
    backgroundColor="#161b22"
    borderRadius="0.5em"
    borderColor="#58a6ff"
    borderStyle="compact"
    cornerShape="superellipse(1.5)">
    Content
</Box>
```

`Box.elevation` accepts the integer levels 0 through 5. Positive levels draw
a Sixel shadow without changing layout; larger values increase its reach and
downward offset. `shadowColor` is the base color blended with the underlying
terminal or ancestor background, and `zOrder` orders overlapping pixel
effects from low to high:

```tsx
import { ShadowProvider } from "@sorrell/ink-ui/Shadow";

<ShadowProvider
    defaults={{ shadowColor: "#05070a", zOrder: 0 }}
    elevationDefaults={{
        2: { zOrder: 2 },
        4: { shadowColor: "#101828", zOrder: 4 },
    }}>
    <Box elevation={4}>Floating panel</Box>
</ShadowProvider>
```

The provider also accepts `elevation`, `shadowColor`, and `zOrder` directly as
defaults. Set `lofi` to use stable ordered dithering for a splotchy,
shaded-character-like shadow. Elevation zero is a no-op, and all shadow props
silently do nothing when Sixel support or terminal cell pixel dimensions are
unavailable. Shadow pixels never cover the Box that casts them.

`cornerShape` accepts the CSS `<corner-shape-value>` keywords `round`,
`squircle`, `square`, `bevel`, `scoop`, and `notch`, or a string such as
`superellipse(-0.75)`. Use `cornerTopLeftShape`, `cornerTopRightShape`,
`cornerBottomRightShape`, and `cornerBottomLeftShape` to override individual
corners.

Numeric `borderRadius` values are pixels. String values accept CSS length
quantities, including `px`, font/cell-relative units such as `em` and `ch`,
percentages, viewport units, and physical units. The per-corner overrides are
`borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius`, and
`borderBottomLeftRadius`.

For shaped corners, pixels outside the border retain the nearest ancestor
background, or the terminal's OSC 11 background when there is no ancestor
background. If Sixel or the terminal cell pixel size cannot be determined,
the component keeps its layout and silently omits the pixel border.

`Button` combines themed appearance variants with the Interaction and Mouse
providers:

```tsx
import { Button } from "@sorrell/ink-ui/Button";

<InteractionProvider ShowFooter={false}>
    <MouseProvider>
        <Button
            Appearance="primary"
            Icon={<SaveIcon />}
            Id="save"
            OnPress={() => save()}>
            Save
        </Button>
    </MouseProvider>
</InteractionProvider>
```

The `primary`, `secondary`, `subtle`, `transparent`, and `outline`
appearances each have default, focused, hovered, pressed, and disabled theme
states. A theme can replace any state without having to provide all of them:

```tsx
const CustomTheme = {
    ...DefaultTheme,
    Button: {
        ...DefaultTheme.Button,
        primary: {
            ...DefaultTheme.Button?.primary,
            Pressed: {
                BackgroundColor: "magenta",
                Color: "white",
            },
        },
    },
} satisfies Theme;
```

With Ink's Kitty keyboard `reportEventTypes` flag enabled, a focused button
stays pressed for the full duration that Enter or Space is held. On terminals
that only report completed keypresses, it commits immediately and briefly
flashes the pressed style. Mouse presses remain active until release.

`Text` wraps Ink's `Text` for terminal-sized content and switches to an
SVG/Sixel rendering when the requested font metrics cannot be represented by
the terminal's native text cells:

```tsx
import { Text } from "@sorrell/ink-ui/Text";

<Text
    fontFamily="Georgia, serif"
    fontSize="1.5em"
    letterSpacing="0.04em"
    lineHeight={1.4}
    maxWidth={40}
    overflowWrap="anywhere"
    textAlign="center">
    Text is measured and wrapped to the available terminal cells.
</Text>
```

CSS font-size keywords, unitless line heights, relative and absolute lengths,
font fallback lists, whitespace modes, word-breaking modes, text indentation,
word spacing, and per-line alignment are supported. If no family is supplied,
the detected terminal font is preferred, followed by Cascadia Mono/Consolas
on Windows, Menlo/Monaco on macOS, and DejaVu Sans Mono/Liberation Mono on
other platforms. A non-Sixel terminal receives ordinary Ink text as a
readable fallback.

`Display` renders a string with any of the 125 bitmap fonts bundled by
[`bit`](https://github.com/superstarryeyes/bit):

```tsx
import { Display } from "@sorrell/ink-ui/Display";

<Display
    color="cyan"
    fontFamily="ithaca"
    fontScale={2}
    maxWidth={60}
    overflowX="hidden"
    shadow
    shadowHorizontalOffset={2}
    shadowStyle="medium"
    shadowVerticalOffset={1}>
    Sorrell
</Display>
```

`fontFamily` is a literal union containing every font name offered by `bit`;
`DisplayFontFamilies` exposes the same catalog at runtime. `fontScale` accepts
`0.5`, `1`, `2`, or `4`. Shadows accept offsets from -5 through 5 and the
`light`, `medium`, or `dark` shade styles (or `bit`'s numeric 0–2 values).

The rendered art supplies the component's intrinsic width and height. Ink
width, height, min/max, flex, padding, margin, position, alignment, and
overflow props apply to an outer layout box. Like preformatted content in a
browser, an explicit box size does not silently rewrite the font scale:
content overflows by default and is clipped when the corresponding overflow
prop is `hidden`.

### SVG

`Svg` rasterizes an SVG string or React SVG element with `@resvg/resvg-js`
and renders it through Sixel. Its sizing props have the same terminal-cell
units as Ink's `Box`:

```tsx
import { Text } from "ink";
import { Svg } from "@sorrell/ink-ui/Svg";

<Svg
    fallback={<Text>Image unavailable</Text>}
    width={20}>
    <svg height="32" viewBox="0 0 64 32" width="64">
        <circle cx="32" cy="16" fill="cyan" r="14" />
    </svg>
</Svg>
```

When no width or height is supplied, `Svg` converts the SVG's intrinsic pixel
dimensions to cells and centers the image in those cells. It emits nothing if
the terminal cannot report its pixel cell size or does not support Sixel,
unless a `fallback` was supplied.

`LaTeX` converts raw TeX to SVG with MathJax and passes the result through
`Svg`:

```tsx
import { Text } from "ink";
import { LaTeX } from "@sorrell/ink-ui/LaTeX";

<LaTeX
    color="cyan"
    fallback={<Text>Math unavailable</Text>}
    width={24}>
    {String.raw`\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}`}
</LaTeX>
```

The child is raw TeX without `$` delimiters. Display layout is enabled by
default; set `display={false}` for inline math metrics. `color` defaults to
the active theme's text color, and all `Svg` sizing props are accepted.
Malformed TeX, unavailable Sixel support, missing cell pixel dimensions, and
rasterization failures are passed to the element or error-component supplied
through `fallback`. Without a fallback these cases render nothing.

`Icon` is the one-cell form of `Svg`:

```tsx
import { Icon } from "@sorrell/ink-ui/Icon";

<Icon src="<svg width=\"16\" height=\"16\">…</svg>" />
```

Install the optional `@phosphor-icons/react` peer to use the generated
Phosphor catalog. All 1,512 icons are available in each fixed-weight style:

```tsx
import { Regular, Duotone } from "@sorrell/ink-ui/PhosphorIcon";

<Regular.HouseIcon color="cyan" />
<Duotone.GearIcon color="yellow" />
```

The available style modules are `Bold`, `Duotone`, `Fill`, `Light`, `Regular`,
and `Thin`.

### Terminal support

The `Support` module combines passive environment detection with terminal
protocol queries. Capabilities that cannot be verified remain `undefined`
rather than being reported as unsupported:

```tsx
import { Support } from "@sorrell/ink-ui";

const terminal = Support.DetectTerminal();
const support = await Support.QueryTerminalSupport();
const font = await Support.QueryTerminalFont();

console.log(terminal.Name, support.Sixel, support.Mouse.Granularity._tag, font?.Family);
```

It identifies Windows Terminal, iTerm2, kitty, Konsole, WezTerm, Ghostty,
Alacritty, Warp, VS Code, Rio, foot, mintty, GNOME Terminal, Apple Terminal,
Hyper, xterm, and tmux/screen multiplexers. Active probes cover terminal and
cell pixel dimensions, the terminal foreground and background colors, Sixel, Kitty graphics,
truecolor, mouse cell/pixel
granularity, focus events, bracketed paste, synchronized output, and the Kitty
keyboard protocol. Passive hints also cover hyperlinks, clipboard access,
alternate-screen support, Unicode, and iTerm image support.

`QueryTerminalFont` and `useTerminalFont` include the discovery source and
configuration path; `QueryTerminalFontFamily` and `useTerminalFontFamily`
return only the family. Font lookup currently understands Windows Terminal
JSONC settings, Kitty includes, Konsole profiles, Ghostty, Alacritty and
WezTerm configuration, and iTerm2 preferences on macOS.

### Layout and navigation

- `Frame`
- `ScrollArea`
- `Tabs`
- `View`
- `ViewPane`

`View` composes `ViewPane` children on explicit interior column and row
tracks. Pane edges occupy shared terminal coordinates, so adjacent borders use
one row or column and intersections render with joined box-drawing characters:

```tsx
<View Columns={[12, 12]} Rows={[3, 3]}>
    <ViewPane Column={0} Row={0} RowSpan={2}>
        <Text>Navigation</Text>
    </ViewPane>
    <ViewPane Column={1} Row={0}>
        <Text>Inspector</Text>
    </ViewPane>
    <ViewPane Column={1} Row={1}>
        <Text>Logs</Text>
    </ViewPane>
</View>
```

Column and row sizes describe the panes' interior space. `ColumnSpan` and
`RowSpan` may be used for Terminal.Gui-style arrangements; the border renderer
automatically resolves corners, T-junctions, and four-way intersections.

### Focus, commands, and shortcuts

- `InteractionProvider`
- `FocusScope`
- `Focusable`
- `CommandScope`
- `Command`
- `Shortcut`
- `useFocusable`
- `useFocusManager`
- `useCommand`
- `useCommandManager`
- `useShortcut`
- `useRoutedInput`

`InteractionProvider` owns one input dispatcher. Focused controls receive input
first, commands bubble from their focus target through parent command scopes,
and unhandled Tab or Shift+Tab moves focus:

```tsx
<InteractionProvider InitialFocus="name">
    <Command
        Handler={() => save()}
        Id="save"
    />
    <Shortcut
        Command="save"
        Description="Save the document"
        Keys="Ctrl+S"
        Label="Save"
    />
    <Focusable Id="name">
        {({ Focused }) => (
            <TextInput Focused={Focused} Value={name} />
        )}
    </Focusable>
    <Focusable Id="format">
        {({ Focused }) => (
            <Select Focused={Focused} Items={formats} />
        )}
    </Focusable>
</InteractionProvider>
```

Use a trapping `FocusScope` for a modal surface. With `AutoFocus` and
`RestoreFocus`, focus enters the scope when it appears and returns to the prior
control when it unmounts:

```tsx
<FocusScope AutoFocus RestoreFocus Trap>
    {/* Dialog controls */}
</FocusScope>
```

Key chords are case-insensitive and normalize common names, so
`"Shift+Control+S"` and `"ctrl+shift+s"` are equivalent. A command handler
handles the command by returning `true` or `void`; return `false` to let the
same command bubble to the parent scope.

### Mouse input

- `MouseProvider`
- `useMouse`
- `useMouseEvent`
- `useTerminalMouseTracking`
- `ParseTerminalMouseInput`

`MouseProvider` enables SGR mouse and focus reporting and owns a single input
listener for its descendants. Gesture recognition is terminal-native and does
not load platform adapters. Double-click timing, allowable click drift, and
drag activation distance are configured directly:

```tsx
<MouseProvider
    DoubleClickTimeMs={500}
    DoubleClickMaxDistance={1}
    DragActivationDistance={{ X: 1, Y: 2 }}>
    <App />
</MouseProvider>
```

`Box` instances inside a provider are mouse regions when they receive a mouse
callback:

```tsx
<MouseProvider>
    <Box
        onClick={(event) => select(event.LocalPosition)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onWheel={(event) => scroll(event.ScrollDirection)}>
        Select me
    </Box>
</MouseProvider>
```

Supported callbacks are `onMouseEnter`, `onMouseLeave`, `onMouseOver`,
`onMouseOut`, `onMouseMove`, `onMouseDrag`, `onMouseDown`, `onMouseUp`,
`onClick`, `onDoubleClick`, `onAuxClick`, `onContextMenu`, and `onWheel`.
Each callback receives the original tagged Mouse event plus `CurrentTarget`
and a zero-based `LocalPosition`. Hit testing accounts for nested Box offsets,
terminal edges, and ancestors whose overflow is hidden.

Distances are measured in terminal cells. A number applies to both axes.
Defaults are 500 milliseconds and one cell. Subscribe inside the provider with
`useMouseEvent`; use `useTerminalMouseTracking` only for a standalone listener.

### Input

- `CompletionMenu`
- `Select`
- `TextArea`
- `TextInput`
- `VarInput`
- `VarText`

### Overlays

- `ConfirmOverlay`
- `HelpOverlay`
- `Overlay`
- `PickerOverlay`

### Editors

- `CodeEditor`
- `JsonBodyViewer`
- `YamlEditorOverlay`

### Timeline

- `TimelineDetailOverlay`
- `TimelineEntry`
- `TimelineTab`

## Showcase

The showcase is not part of the main package build. Build it separately,

```sh
npm run build:showcase --workspace @sorrell/ink-ui
```

The generated files are written under `Intermediate/`, which is ignored by
Git and npm. Run the interactive showcase with

```sh
npm run showcase --workspace @sorrell/ink-ui
```

Use the arrow keys and Enter to open a component example. Press Escape to
return to the menu.
