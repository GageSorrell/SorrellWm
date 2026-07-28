* Replace titlebar buttons (min/max/close) to make them slightly smaller (the same size as those in the PowerToys Settings window) and to have no background (so that the acrylic background shows)
    * The max button should still show the hover menu if the titlebar overlay setting is enabled

* Make a component for the header of each page in the settings window, to match the title, rounded image, and description at the top of each settings page in the PowerToys settings window

* Review the settings UI components (the components for individual settings, and the keyboard/keybind components as well), and implement the settings UI for the current `AppSettings` settings

* TODO: Holding PrimaryModifier key on focus screen causes "flashbang" to draw over window instead of shifting focus

* For floating windows, make move screen use home/end to move to left/right of screen, or if holding Ctrl, top/bottom

---

Please modify the DirectionalPad component to optionally take, for each caret's respective props, a `ReactNode` prop named `Label` that is displayed immediately below the caret.  The horizontal alignment of this label, when present, should be centered for the top and bottom carets, and aligned flush left/right for the left/right carets respectively.
Additionally, the four caret props should be made optional, and if not present, then that caret should not be displayed.  The presence of the titles, if any are present, should not affect the position of any part of the directional pad component.

---

Please implement the resize overlay screen for floating windows.  The resize screen should prompt the user whether to grow or shrink the window, by using the Directional Pad component, such that the left caret is labeled "Shrink", and the Right arrow is (two choices, each represented by one one button).  The "grow" button should be bound to the SelectLeft keybind, and the "shrink" button should be bound to the SelectRight button.  Choosing at this screen should take the user to a screen "owned by" the initial resize screen, which prompts the user with the DirectionalPad component.  This should use a prop of the DirectionalPad component which will need to be added to it: a `boolean` prop that flips the direction of the arrows, so that they point toward the center of the component.  Pressing a button on the DirectionalPad should cause the
   <!-- The resize screen should prompt the user to select the edge to move (thus resizing the window).  This should use the new directional pad component.  Hovering over a directional pad button with the cursor should cause a thick border to be drawn over the focused window, using the system theme's accent color.  Selecting an edge should take the user to an overlay screen that "branches" from this initial resize screen,  -->
