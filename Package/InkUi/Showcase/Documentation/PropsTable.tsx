/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Documentation/PropsTable
 *
 * @file      PropsTable.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "../../Source/Theme.js";
import type { PropDocumentation } from "./PropInspector.js";

export function PropsTable({ Props }: {
    readonly Props: ReadonlyArray<PropDocumentation>;
}): React.ReactElement
{
    const Theme = useTheme();
    if (Props.length === 0)
    {
        return <Ink.Text color={ Theme.TextMuted }>No public props were found.</Ink.Text>;
    }
    return (
        <Ink.Box
            borderColor={ Theme.Border }
            borderStyle="single"
            flexDirection="column"
            maxWidth="100%">
            <Row
                Description="Description"
                Name="Prop"
                Type="Type"
                Value="Default"
                bold />
            { Props.map((Prop: PropDocumentation) => (
                <Row
                    Description={ Prop.Description }
                    Name={ `${ Prop.Name }${ Prop.Required ? " *" : "" }` }
                    Type={ Prop.Type }
                    Value={ Prop.DefaultValue ?? "—" }
                    key={ Prop.Name } />
            )) }
        </Ink.Box>
    );
}

function Row({
    Description,
    Name,
    Type,
    Value,
    bold = false
}: {
    readonly Description: string;
    readonly Name: string;
    readonly Type: string;
    readonly Value: string;
    readonly bold?: boolean;
}): React.ReactElement
{
    const Theme = useTheme();
    return (
        <Ink.Box borderBottom
            borderBottomColor={ Theme.Border }>
            <Ink.Box paddingX={ 1 }
                width={ 18 }><Ink.Text bold={ bold }
                    color={ Theme.Primary }>{ Name }</Ink.Text></Ink.Box>
            <Ink.Box paddingX={ 1 }
                width={ 30 }><Ink.Text bold={ bold }
                    color={ Theme.Secondary }
                    wrap="truncate-end">{ Type }</Ink.Text></Ink.Box>
            <Ink.Box paddingX={ 1 }
                width={ 16 }><Ink.Text bold={ bold }
                    color={ Theme.Warning }
                    wrap="truncate-end">{ Value }</Ink.Text></Ink.Box>
            <Ink.Box flexGrow={ 1 }
                paddingX={ 1 }><Ink.Text bold={ bold }
                    color={ Theme.Text }>{ Description }</Ink.Text></Ink.Box>
        </Ink.Box>
    );
}
