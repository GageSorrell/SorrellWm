* Replace titlebar buttons (min/max/close) to make them slightly smaller (the same size as those in the PowerToys Settings window) and to have no background (so that the acrylic background shows)
    * The max button should still show the hover menu if the titlebar overlay setting is enabled

* Review the settings UI components (the components for individual settings, and the keyboard/keybind components as well), and implement the settings UI for the current `AppSettings` settings

* For floating windows, make move screen use home/end to move to left/right of screen, or if holding Ctrl, top/bottom

---

<!-- Done -->
<!-- Please modify the DirectionalPad component to optionally take, for each caret's respective props, a `ReactNode` prop named `Label` that is displayed immediately below the caret.  The horizontal alignment of this label, when present, should be centered for the top and bottom carets, and aligned flush left/right for the left/right carets respectively.

Additionally, the four caret props should be made optional, and if not present, then that caret should not be displayed.  The presence of the titles, if any are present, should not affect the position of any part of the directional pad component. -->

---

<!-- Done -->
<!-- Please modify the press-and-hold behavior of the Move overlay screen so that when the step size is not 1 pixel, releasing the key continues the animated movement until the window has moved a distance that is the nearest multiple of the step size from its position when the movement key was released by the user.  This means that the movement will continue after the user releases the movement key unless the window had already moved an integer multiple of the current step size.  This also means that when the user releases the movement key, the window will move in the *opposite* direction if the distance traveled is closer to a multiple of the step size that is less than the distance traveled (that is, rounding to the nearest multiple of the step size means rounding up or down). -->

---

<!-- Done -->
<!-- Please implement the resize overlay screen for floating windows.  The resize screen should prompt the user whether to grow or shrink the window, by using the Directional Pad component, such that the left caret is labeled "Shrink", and the Right arrow is (two choices, each represented by one one button).  The "grow" button should be bound to the SelectLeft keybind, and the "shrink" button should be bound to the SelectRight button (use the new `Label` prop for the two carets).  Choosing at this screen should take the user to a screen "owned by" the initial resize screen, which prompts the user with the DirectionalPad component.  This should use a prop of the DirectionalPad component which will need to be added to it: a `boolean` prop that flips the direction of the arrows, so that they point toward the center of the component.  Pressing a button on the DirectionalPad should cause the respective edge of the window to move inward or outward (depending upon the choice from the first resize screen).  Resizing, via this second resize screen, should use step sizes, which should be identical to the step size functionality that the move overlay screen has. -->

---

<!-- Done -->
<!-- Please create a new "action type" (that is, an action like Focus, Move, Resize, or Insert) named "Tile", and replace "Insert" in the floating window overlay (but don't remove the Insert ID *et al.*, we'll use it later).  This should navigate to a screen with a placeholder message, with no functionality yet. -->

---

<!-- Done -->
<!-- Currently, the overlay window has actions for floating windows, but not for tiled windows.  Please refactor the current logic for the overlay screen to reflect that this logic is for floating windows, and implement a Home screen for tiled windows.  The Home screen for tiled windows should look identical, but the "Tile" action should instead be "Insert" like it was before for floating windows.  There should also be a fifth action "Float" that is bound to Shift + SelectUp.  For now, just refactor and implement the tiled window Home overlay screen, but don't implement screens for the actions accessible via the tiled window Home overlay screen. -->

---

<!-- Done -->
<!-- Please modify the tiling logic so that panels can hold any number of children, instead of being strictly binary. -->

---

<!-- Done -->
<!-- Please modify the focus behavior for floating windows so that if a window that can be focused is not visible (because it is underneath another window), a window is rendered under the overlay, but on top of all other windows.  This window should have the same size and position of the focusable window that can't be seen.  This window should be the muted color sampled for the directional pad and compact buttons on the Focus screen.  The window should not have any titlebar, caption buttons, etc., and shouldn't appear in the Alt+Tab menu or the taskbar.  The window color should be slightly translucent, and this opacity should be configurable as an app setting (the UI to modify this setting should be in the Overlay page of the settings window) and the default opacity should be 75%.  Centered in the window, with no transparency, should be the app icon for the focusable window that it represents.  The window should have a one-pixel border that is the sampled color, but with full opacity.  The app icon centered in the window should be big enough to easily see at a glance.  These windows should be electron windows. -->

---

@TODO Write prompt for animation setting similar to FL Studio animation preference.

---

"Check for updates"/Install update functionality in Settings window, and in tray (tray icon should have a badge, and tray menu should have a button to update)

---

<!-- Done -->
<!-- Please create the foundation for having per-application settings for the window manager.  The app settings should have a new property `PerAppSettings`, which is a record of `string` executable paths to a new Schema record also named `PerAppSettings`.  This new `PerAppSettings` schema should have a single property `NewWindowBehavior` which should correspond to a `string` literal of strings `"InsertBeforeCurrent"`, `"InsertAfterCurrent"`, `"FloatCenter"`, `"FloatCurrent"`, and `"RPC"`.  The default value of `NewWindowBehavior` should be `"FloatCenter"`.  The `PerAppSettings` schema should also have a `boolean` property `IgnoreModal` whose default value should be `true`. -->

---

<!-- Done -->
<!-- Please create, in the Per-App Settings page of the settings window, a button, flush right on the page, that says "Add Application" with a plus (Fluent UI) icon.  Pressing this button should open a file dialog to choose an executable.  When an executable has been selected, this should append the current app settings's `PerAppSettings` with a property whose key is the selected executable path, and whose value is instantiated from the defaults for the `PerAppSettings` schema.  A UI entry should appear on the page as a collapsed (accordion) whose persistent element is titled with the executable's friendly name, and that executable's icon.  Expanding the accordion for an application entry should show the settings UI elements corresponding to each property in its `PerAppSettings` settings. -->

---

@TODO Write prompt for new window type that represents an empty panel; can have a floating window dragged over it to tile that floating window in the empty panel.  The appearance of the panel should change when a floating window is currently being dragged by the user.

---

<!-- Done -->
<!-- Please implement the focus overlay screen for tiled windows.  One construct that will be necessary here that the floating focus overlay doesn't have is the ability to "focus" panels, which doesn't actually change the native window manager state, but allows for ultimately moving focus to a window belonging to another panel.  It should look identical to the focus overlay screen for floating windows.  The left/right controls should allow for moving focus within a horizontal panel, and the up/down controls should move focus within a vertical panel.  If the current panel is a child of another panel, then pressing Ctrl plus the SelectUp control should move the focus to the panel where the focus just was.  If the current focus is a panel, then pressing the Commit hotkey should move focus to the 0th node of that panel. -->

---

<!-- Done -->
<!-- Please modify the tiled focus overlay behavior such that pressing "Home" or "End" moves focus to the 0th or last child of the current panel.  Pressing Control plus Home should move focus to the root (monitor) panel that contains the current focus. -->

---

<!-- Done -->
<!-- Please modify the tiled focus overlay behavior so that when a root (monitor) panel has focus, the options to move focus are the other root panels, such that the directions correspond to monitors based on their relative positions to each other.  The buttons that appear below the directional pad should be the usual compact command buttons with the arrow icons, *and* below those there should be a list of *all* monitors, with a keybind that corresponds to the numeric ID that Windows assigned to it (the positive integer that is used in the Windows Settings app for managing the layout of displays).  Pressing the digit that corresponds to a monitor's ID should move focus to the root panel of that monitor.  In this list that contains the keybinds of the monitor IDs, exclude monitors whose ID number is greater than 9. -->

---

Please modify the tiled move overlay behavior so that if the current focus is a panel that is not a root (monitor) panel, there is an option, using the Delete key, to remove the current panel, and append its children to the parent panel, inserting at the position that the now-deleted panel had.

---

@TODO Write prompt for allowing root panels to be "moved" by moving the children to somewhere on another monitor, but in a way that works properly (preserves the root panel of the children that are moved).

---

<!-- Done -->
<!-- Please implement the tiled move overlay screen.  The UI should be roughly the same as the tiled focus overlay screen: SelectLeft/SelectRight should move a window left/right if it belongs to a horizontal panel, and SelectUp/SelectDown should move a window up/down if it belongs to a vertical panel.  Pressing Home or End should move the window to the 0th or last position in the panel.  Holding Control and pressing SelectUp, if the window does not belong to the root panel, should move the window to the panel that contains the initial panel to which the window belonged, at the position after that original owning panel.

If a direction key is pressed such that the next node in the panel is itself a panel, then the window should not take on that position, instead, a translucent window (of the system's accent color, like elsewhere in the app) should be drawn over that panel, and the overlay screen should (staying centered over the same window it has been centered over) convey that the options are to either (1) move the window within its current panel in the opposite direction (if the window's current position is not the 0th position in its panel) or (2) via the Commit keybind, move that window into the panel that is next to it (the panel that is highlighted via the translucent window) which will make the window the 0th child of that panel. -->

---

<!-- Done -->
<!-- Please add stack panels as a panel type.  Stack panels should place all of its children such that they have the same position, such that the tiling service manages their z-order.  When the tiling focus overlay screen is shown and a stack panel is selected, instead of showing a directional pad, the compact buttons should display for all windows in the stack, without the directional arrow icons that are typically on the button.  The top button should correspond to the window that is at the top of the stack when focusing on the visible window of the panel.  Using the SelectUp/SelectDown keys should change the "active" compact button, and the active compact button's corresponding window should move to the top of the stack when it becomes active.  The relative z-orders of the windows in a stack panel should be preserved whenever windows in a stack panel change focus. -->

---

<!-- Done -->
<!-- Please implement resizing in the tiling overlay menu.  This should work identically to how it works for floating windows, but with appropriate behavior to resize the surrounding windows as well.  Resizing a window in a direction parallel to its panel's type (horizontal or vertical, if one of these two) should only affect windows in that panel.  Resizing a window in a direction that is perpendicular to its panel's type should result in *all* windows in that panel being resized, and adjacent panels should be resized to accommodate this resizing.  The step size behavior from other screens should apply here.  By default, resizing a window should cause all other windows in the panel to resize such that the relative ratios of the lengths (the distance along their panel's direction type) of the other windows remain the same.  Pressing Tab should cycle between this behavior of resizing the other windows, and the alternative behavior, which is to resize only the adjacent window, either growing by the same length that the focused window shrinks, or shrinking by the same length that the focused window grows.  The initial resize behavior (preserve ratios or just resize the adjacent window) when the resize screen is opened should be configurable via an app setting. -->

---

<!-- Done -->
<!-- Please implement the "Insert" screen for the tiling overlay.  The first screen in the tiling Insert flow should display the directional pad to choose where the new window should be inserted into the tiled tree.  If the panel that the focused window is in is a horizontal or vertical panel, then the selected direction determines the region that is the half of the window corresponding to that direction.  For example, if the user presses SelectUp, then the top half of the focused window should be where the new window will go.  The focused window should simultaneously be resized to occupy the other half of the area that was originally occupied by the window.  If the selected half is in a direction of the panel type (left/right for a horizontal panel, or up/down for a vertical panel), then the new window should be inserted in the same panel as the focused window.  If the selected half is in a direction that is perpendicular to the panel's type, then a new panel should be created, containing the originally-focused window, and the new window, such that the "direction" of this new panel is opposite of the panel that the initially-focused window initially resided in (that is, this new panel should have exactly two children).

When proceeding to the second screen in the tiling Insert flow, the overlay window should move to occupy the area where the new window will go.  This second screen in the flow should use the compact buttons to list all floating windows (but do not use the directional icons in these buttons like they appear in other use cases).  The top button should be active (selected), and SelectUp/SelectDown should allow the user to cycle through selected buttons.  Pressing Commit should tile the selected window, placing it where the overlay window was.

Pressing Tab should replace the overlay window with a new window, with the same acrylic background, and should not appear in the taskbar.  The window should have a message that explains that the user can drag a floating window over this window to tile the dragged window where this temporary window is.  Dragging a floating window such that the cursor is released while the cursor is in the boundary of this temporary window should cause the dragged window to be tiled where the temporary window was, and the temporary window should disappear.  While a floating window is being dragged, thick dashed lines should appear around the inside edges of the temporary window, and these dashed lines should gently pulse wrt their opacity.  When a window is not being dragged by the user, there should be two buttons beneath the message explaining the dragging behavior: a button that, when pressed, displays the list of floating windows from the last overlay Insert screen and allows the user to select a window to tile from there.

The other button should be a "cancel" button, which if pressed, destroys the temporary window, and resizes the remaining windows accordingly.  Pressing Escape when the temporary window is focused should also cancel the flow.  Above these two buttons should be a checkbox, which if checked, should cause the next eligible window that is created to be tiled and to occupy the spot that is occupied by the temporary window.  The screen from which the user can press Tab to create this temporary window should also accept Ctrl + Tab, which should do the same thing that pressing Tab does, but the checkbox to tile the next window created should be checked. -->

---

<!-- Done -->
<!-- Please implement an overlay window that appears when the minimize button is hovered.  This should be enabled/disabled via an app setting (enabled by default).  This overlay should be like the overlay that appears when hovering over the maximize button, but it only appears when the window belongs to a stack panel.  The overlay should show a list of windows in the stack panel with the compact window buttons used elsewhere in the app, such that clicking one of the buttons focuses the corresponding window and brings it to the top of the stack. -->

---

Please create a `boolean` app setting which if enabled (disabled by default), causes a temporary window to be created in place of a tiled window when it closes.  If this setting is enabled, the temporary window should be created and take up the space of the closed window, rather than causing the surrounding windows to resize and take up the freed space (the default behavior).  This temporary window should be identical to the one that is created via the tiled Insert flow.

---

<!-- Please implement the ability in SorrellWm to accept client connections from applications like the PowerToys Command Palette extension (in `/Package/SorrellWmCommandPalette/`) and NodeJS via the `@sorrell/wm-api` package.  Clients should be able to perform every action that the user can via the overlay windows.  The only app settings that clients should be able to modify are the numeric settings, like the gap size and step sizes.  You will have to decide upon the best way to facilitate this communication, such as a named pipe. -->

---

<!-- Done -->
<!-- Please add the `boolean` app setting "IgnoreActivationKeybindInFullscreen" to `@sorrell/wm`, which is `true` by default.  When `true`, if the current focused window is in fullscreen (for example, if it's a game window or fullscreen video playing from the browser), then the activation keybind to show the overlay window should be ignored. -->

---

@TODO Implement "Allow breakthrough with rapid shortcut presses" setting from the Command Palette

---

Please handle tiled window minimizing and maximizing by remembering where the window was before it was minimized.  When restored, the window should be put back where it was originally, unless the panel to which it belongs has changed state.  If the tiling tree state does not allow for a straightforward restoration, then the window should be placed in the tree at the position that most closely resembles where it was on the screen before it was minimized or maximized.

---

Please add a tray icon to `@sorrell/wm`.  Its bottom button of its context menu should say "Close", and should cause the application to exit.  The button above that should say "Settings", and clicking it should open the settings window.  Double-clicking the tray icon should also launch the settings window.  If the user tries to open the settings window via the tray, and the settings window is already open, then the existing settings window should be focused.  By default, the tray icon should be the same `BoardColor` icon used by the Command Palette extension in `/Package/SorrellWmCommandPalette`, but there should also be a new app setting `UseSimplifiedTrayIcon`, which should be `false` by default.  If `true`, then the tray icon should be the ◱ character, rendered with stroke color `#151515` or white, depending upon whether the system dark mode is enabled.  Hovering over the tray icon should give the tooltip text `SorrellWm v${app.getVersion()}`.  Please place these tray images in the `/Application/Resource` directory.  Please also set the taskbar icon for the settings window to be the same icon used for the tray, however this should be an `.ico` of the appropriate icon, which should contain the icon at all resolutions recommended for Windows applications (the tray icon will likely need to be a separate file, such as a `.png` or whatever Electron recommends).

---

@TODO Modify the "per-app settings" bottom command button to use the new "navigate to and focus setting" feature when opening the settings window to view the per-app settings.  Also, if the app does not have an entry in the per-app settings, then an entry should be created upon pressing this button.

---
