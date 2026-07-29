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

Please modify the focus behavior for floating windows so that if a window that can be focused is not visible (because it is underneath another window), a window is rendered under the overlay, but on top of all other windows.  This window should have the same size and position of the focusable window that can't be seen.  This window should be the muted color sampled for the directional pad and compact buttons on the Focus screen.  The window should not have any titlebar, caption buttons, etc., and shouldn't appear in the Alt+Tab menu or the taskbar.  The window color should be slightly translucent, and this opacity should be configurable as an app setting (the UI to modify this setting should be in the Overlay page of the settings window) and the default opacity should be 75%.  Centered in the window, with no transparency, should be the app icon for the focusable window that it represents.  The window should have a one-pixel border that is the sampled color, but with full opacity.  The app icon centered in the window should be big enough to easily see at a glance.  These windows should be electron windows.

---

@TODO Write prompt for animation setting similar to FL Studio animation preference.

---

"Check for updates"/Install update functionality in Settings window, and in tray (tray icon should have a badge, and tray menu should have a button to update)
