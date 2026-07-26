Please overhaul the showcase app to be more like a Storybook website.  There should be a collapsible left-pane for navigation, which includes a search bar and list of all components.  Each component should correspond to a page that is rendered to the right of the navigation pane.  The "pages" should be a single component with content slots, such that the values passed to these slots depends upon the selected component in the navigation pane.

Each page should have the following shared layout:

* the component's name as the title
* a Description section
* a basic Example section having just one simple example
* a table containing the props for the component, which for each prop, states its name, its JS Doc description, its type, and default value (if one exists)
* an "Examples" section, with a subsection for each major use case

The content for each component should be in its own module.
Each example should show a side-by-side layout of the example itself, and the code corresponding to that example.  If the terminal screen is too narrow, then this should instead be a tab layout, where the default tab is the one containing the example.

---

Please add a `HelpProvider` component in a new module `Help` (a directory named `Help`).  This component should provide context to enable the follow features and components.  There should be a `Tooltip` component wraps a single child.  The component should return its child (wrapping with `Box`  if necessary), such that when the item is hovered over, after a `delay` (provided by the context), a tooltip is rendered next to the child.  The size and position of the child should be identical to what it would be if it weren't wrapped in a tooltip.  There should also be an optional prop `position`, which if specified, is the position where the tooltip should appear relative to its child.  The tooltip should use a compact border with a corner style, customizable via an optional context prop.  The exact position of the tooltip should be computed such that the tooltip will be entirely on screen if possible.  If a position is specified, but rendering it at that position will cause it to be partially offscreen, then it should choose the next-closest position and attempt to use that position.  If this exhausts all positions, then use the position that keeps most of the tooltip onscreen.

Additionally, the context should also allow for, along with the interaction provider, an application-wide "Help Mode", which when active, wraps every element with a tooltip in a `Box` with a compact border, and focus changes so that the user may cycle through all of the visible components that have tooltips.  An element having "focus" here means that its tooltip is shown, and the compact border is highlighted.  Besides this "help mode", the only other way to show a tooltip is with the mouse.  When a tooltip exists in the application, a keybind should always be available to enter Help Mode.  The context should also accept an optional `icon` prop, which is an optional `ReactNode`.  The default value of the `icon` prop should be the appropriate phosphor icon (you will have to determine which icon to use as the default).

---

Please add LaTeX support via MathJax or similar.  Use the `Svg` component if it will help, otherwise use sixel.  Accept a fallback prop if sixel rendering (or any other necessary features) aren't supported.

---

Please add a `BackdropProvider` component.  This component should make the screen's background color (assume, but don't verify that this provider takes up the entire screen).  It should accept an optional `backgroundColor` prop to use as the color, but the default color (it's expected that a custom `backgroundColor` won't be specified most of the time) should be a darker form of the terminal's background color.  The percentage should be the same for most terminal background colors, but if the terminal's background color is *very* dark, then the percentage of darkness should be higher, to try to have sufficient contrast.  The default background color of the `Box` component should be the terminal's background color.  If the terminal's background color cannot be determined, then this component should not do anything, and the `Box` component should not set its `backgroundColor` when a value isn't provided to it.

---

Please add an `elevation` prop to the `Box` component, which can be an integer from zero to 5.  A value of zero is a no-op.  Positive values should render a shadow around the box by using sixel.  Larger values correspond to shadows that make the item appear as if it is further (higher up) from the background.  Shadows should cast slightly downward, so the shadow of the top edge extends outward less far compared to the bottom edge's shadow.  Shadows should not spill onto the component that it is cast from.  A `zOrder` prop should be specified to handle shadows that spill over into the bounds of other components.  An optional `shadowColor` should be used for the shadow color (this should be treated as a *base* color, since the color at each pixel will depend upon the initial pixel color, and the position of that pixel relative to the component from which the shadow is cast).  An optional  `ShadowProvider` component should allow for specifying default props for shadows, including an optional record that gives per-elevation defaults.  The elevation prop and ShadowProvider should not do anything if sixel rendering is not supported.  An optional `lofi` `boolean` prop on ShadowProvider should, if specified and `true`, cause shadows to be rendered in a style that is more "splotchy", somewhat resembling shadows achieved with the shaded characters used in older applications.
