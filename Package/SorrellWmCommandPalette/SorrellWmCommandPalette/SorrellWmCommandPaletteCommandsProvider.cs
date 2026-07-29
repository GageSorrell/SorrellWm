// Copyright (c) Gage Sorrell
// Licensed under the MIT license.

using Microsoft.CommandPalette.Extensions;
using Microsoft.CommandPalette.Extensions.Toolkit;

namespace SorrellWmCommandPalette;

public partial class SorrellWmCommandPaletteCommandsProvider : CommandProvider
{
    private readonly ICommandItem[] _commands;

    public SorrellWmCommandPaletteCommandsProvider()
    {
        DisplayName = "SorrellWm";
        Icon = IconHelpers.FromRelativePath("Assets\\StoreLogo.png");
        _commands = [
            new CommandItem(new SorrellWmCommandPalettePage())
            {
                Title = DisplayName,
                Subtitle = "The tiling window manager for everyone",
            },
        ];
    }

    public override ICommandItem[] TopLevelCommands()
    {
        return _commands;
    }
}
