// Copyright (c) Gage Sorrell
// Licensed under the MIT license.

using Microsoft.CommandPalette.Extensions;
using Microsoft.CommandPalette.Extensions.Toolkit;

namespace SorrellWmCommandPalette;

internal sealed partial class SorrellWmCommandPalettePage : ListPage
{
    public SorrellWmCommandPalettePage()
    {
        Icon = IconHelpers.FromRelativePath("Assets\\StoreLogo.png");
        Title = "SorrellWm";
        Name = "Open";
    }

    public override IListItem[] GetItems()
    {
        return [
            new ListItem(new NoOpCommand())
            {
                Title = "SorrellWm command palette extension",
                Subtitle = "Window management commands are not implemented yet",
            }
        ];
    }
}
