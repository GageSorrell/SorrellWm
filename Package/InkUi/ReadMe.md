# `@sorrell/ink-ui`

Reusable, themed terminal UI components for [Ink](https://github.com/vadimdemedes/ink).
The package is an Ink-native port of the reusable parts of Noodle's OpenTUI
interface. Application-specific HTTP, request, collection, folder, and
environment screens are intentionally excluded; its generalized timeline
views are included.

## Installation

```sh
npm install @sorrell/ink-ui ink react
```

`ink` and `react` are required peer dependencies.

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
- `CenterText`
- `Checkbox`
- `GradientBadge`
- `HeaderBar`
- `HeaderTable`
- `JumpBadge`
- `StatusBar`
- `Tips`
- `Toast`
- `ValidationNotice`

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

The showcase is not part of the main package build. Build it separately:

```sh
npm run build:showcase --workspace @sorrell/ink-ui
```

The generated files are written under `Intermediate/`, which is ignored by
Git and npm. Run the interactive showcase with:

```sh
npm run showcase --workspace @sorrell/ink-ui
```

Use the arrow keys and Enter to open a component example. Press Escape to
return to the menu.
