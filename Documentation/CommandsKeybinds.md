# Commands and Keybinds

> [!DEFINITION]
> A **keybind** is a nonempty array having up to four `FKeyId`s that is associated with some action that can be performed by the user.
> If the array has more than one `FKeyId`, then the associated action is not executed unless all keys are held down, and are pressed down in the given order.

> [!DEFINITION]
> A **keybind action** is a categorical representation of an associated keybind--that is, it is a name that has a keybind associated with it.

> [!DEFINITION]
> A **command** is an action that is performed by the user via a keybind or mouse click.


Commands can be *simple* or *compound*.
A simple command has exactly one keybind action associated with it.
Compound commands are sets of commands such that the individual commands do not make sense on their own.
For example, a command that allows the user to navigate *up* or *down* is a compound command that contains a command for each direction.
