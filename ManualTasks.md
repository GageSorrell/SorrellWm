* Replace titlebar buttons (min/max/close) to make them slightly smaller (the same size as those in the PowerToys Settings window) and to have no background (so that the acrylic background shows)
    * The max button should still show the hover menu if the titlebar overlay setting is enabled

* Make a component for the header of each page in the settings window, to match the title, rounded image, and description at the top of each settings page in the PowerToys settings window

* Review the settings UI components (the components for individual settings, and the keyboard/keybind components as well), and implement the settings UI for the current `AppSettings` settings

* TODO: Holding PrimaryModifier key on focus screen causes "flashbang" to draw over window instead of shifting focus

* For floating windows, make move screen use home/end to move to left/right of screen, or if holding Ctrl, top/bottom

---

Resize floating windows:

Please implement the resize overlay screen for floating windows.  The resize screen should prompt the user whether to grow or shrink the window (two choices, each represented by one one button).  The "grow" button should be bound to the SelectLeft keybind, and the "shrink" button should be bound to the SelectRight button.  Choosing at this screen should take the user to a screen "owned by" the initial resize screen, which prompts the user with the DirectionalPad component.  This should use a prop of the DirectionalPad component which will need to be added to it: a `boolean` prop that flips the direction of the arrows, so that they point toward the center of the component.  Pressing a button on the DirectionalPad should cause the
   <!-- The resize screen should prompt the user to select the edge to move (thus resizing the window).  This should use the new directional pad component.  Hovering over a directional pad button with the cursor should cause a thick border to be drawn over the focused window, using the system theme's accent color.  Selecting an edge should take the user to an overlay screen that "branches" from this initial resize screen,  -->
