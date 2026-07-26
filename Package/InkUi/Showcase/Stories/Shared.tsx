/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/Shared
 *
 * @file      Shared.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    CodeEditor,
    ScrollArea,
    Select,
    Tabs,
    TextArea,
    TextInput,
    VarInput
} from "../../Source/index.js";

export const StatefulTextInput = (): React.ReactElement =>
{
    const [ Value, SetValue ] = React.useState("Editable text");
    return <TextInput Focused={ false }
        OnChange={ SetValue }
        Value={ Value } />;
};

export const StatefulTextArea = (): React.ReactElement =>
{
    const [ Value, SetValue ] = React.useState("First line\nSecond line");
    return <TextArea Focused={ false }
        OnChange={ SetValue }
        Value={ Value } />;
};

export const StatefulSelect = (): React.ReactElement =>
{
    const [ Value, SetValue ] = React.useState("one");
    return <Select Focused={ false }
        Items={ [ { Label: "First", Value: "one" }, { Label: "Second", Value: "two" } ] }
        OnChange={ SetValue }
        Value={ Value } />;
};

export const StatefulTabs = (): React.ReactElement =>
{
    const [ Value, SetValue ] = React.useState("preview");
    return <Tabs Active={ false }
        Items={ [ { Id: "preview", Label: "Preview" }, { Id: "code", Label: "Code" } ] }
        OnChange={ SetValue }
        Value={ Value } />;
};

export const StatefulCodeEditor = (): React.ReactElement =>
{
    const [ Value, SetValue ] = React.useState("{\n  \"ready\": true\n}");
    return <CodeEditor Language="json"
        OnChange={ SetValue }
        Value={ Value } />;
};

export const StatefulVarInput = (): React.ReactElement =>
{
    const [ Value, SetValue ] = React.useState("$HO");
    return <VarInput OnChange={ SetValue }
        Value={ Value }
        Values={ { HOME: "/home/user", HOST: "localhost" } } />;
};

export const StatefulScrollArea = (): React.ReactElement =>
{
    const [ Index, SetIndex ] = React.useState(0);
    return <ScrollArea Active={ false }
        Height={ 3 }
        Index={ Index }
        Items={ [ "Alpha", "Bravo", "Charlie", "Delta" ] }
        OnChangeIndex={ SetIndex }
        RenderItem={ (Item, _Index, Selected) => (
            <Ink.Text>{ Selected ? "› " : "  " }{ Item }</Ink.Text>
        ) } />;
};
