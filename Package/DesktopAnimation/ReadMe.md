# `@sorrell/desktop-animation`

Declarative Windows 11-style desktop animations for React.  The package renders responsive
window boxes with rounded corners, Fluent shadows, title bars, and optional animated cursors.

## Defining an animation

Timeline steps run sequentially.  A zero-duration move is instantaneous; supplying a positive
duration animates it.  `CursorStep.Drag` moves the cursor and window together and temporarily
uses the grabbing cursor.

```tsx
import {
    CursorStep,
    DefineAnimation,
    DesktopAnimation,
    Wait,
    WindowStep
} from "@sorrell/desktop-animation";

const Animation = DefineAnimation({
    Canvas: { Height: 180, Width: 320 },
    Cursor: {
        Position: { X: 45, Y: 28 },
        Type: "Pointer"
    },
    Label: "A window being dragged and resized",
    Steps: [
        Wait(250),
        CursorStep.Drag("settings", { X: 120, Y: 52 }, 500),
        WindowStep.Resize("settings", { Height: 105, Width: 165 }, 350),
        WindowStep.Move("settings", { X: 72, Y: 40 }),
        Wait(400),
        WindowStep.Destroy("settings")
    ],
    Windows: [
        {
            Frame: { Height: 85, Width: 140, X: 30, Y: 20 },
            Id: "settings",
            Title: "Settings"
        }
    ]
});

export const Example = () => <DesktopAnimation Animation={ Animation } />;
```

Windows may also enter during the timeline with `WindowStep.Create`.  Cursors may be omitted
entirely, or shown and hidden during the timeline with `CursorStep.Show` and `CursorStep.Hide`.

## Fluent UI teaching popover

`AnimationTeachingPopover` accepts exactly three props.  `Animation` becomes the media of its
`TeachingPopoverBody`, `Title` becomes the child of `TeachingPopoverTitle`, and `SurfaceChild`
is inserted last in `TeachingPopoverSurface`.

```tsx
<AnimationTeachingPopover
    Animation={ Animation }
    Title="Arrange a window"
    SurfaceChild={ <TeachingPopoverFooter>Try it now</TeachingPopoverFooter> }
/>
```
