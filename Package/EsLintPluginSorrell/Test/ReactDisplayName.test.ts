/**
 * Tests for the `react-displayname` rule.
 *
 * @module @sorrell/eslint-plugin/Test/ReactDisplayName
 *
 * @file      ReactDisplayName.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, it } from "vitest";
import ReactDisplayName from "../Source/Rules/ReactDisplayName.js";
import { RuleTester } from "eslint";
import TypeScriptParser from "@typescript-eslint/parser";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const Tester: RuleTester = new RuleTester({
    languageOptions:
    {
        ecmaVersion: 2022,
        parser: TypeScriptParser,
        parserOptions:
        {
            ecmaFeatures:
            {
                jsx: true
            }
        },
        sourceType: "module"
    }
});

Tester.run("react-displayname", ReactDisplayName, {
    invalid:
    [
        {
            code:
            [
                "function Widget() { return <div />; }",
                ""
            ].join("\n"),
            errors: [ { messageId: "missingDisplayName" } ],
            filename: "Widget.tsx",
            name: "reports a component with no displayName assignment at all"
        },
        {
            code:
            [
                "function Widget() { return <div />; }",
                "function OtherWidget() { return <span />; }",
                "OtherWidget.displayName = \"OtherWidget\";",
                ""
            ].join("\n"),
            errors: [ { messageId: "missingDisplayName" } ],
            filename: "Widget.tsx",
            name: "reports only the component that is missing its displayName"
        },
        {
            code:
            [
                "function Widget() { return <div />; }",
                "const Other = 1;",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            errors: [ { messageId: "displayNameNotImmediate" } ],
            filename: "Widget.tsx",
            name: "reports a displayName assignment that does not immediately follow (default options)"
        },
        {
            code:
            [
                "function Widget() { return <div />; }",
                "Widget.displayName = \"NotWidget\";",
                ""
            ].join("\n"),
            errors: [ { messageId: "displayNameMismatch" } ],
            filename: "Widget.tsx",
            name: "reports a displayName that does not match the component's name (matchExact)",
            options: [ { matchExact: true } ]
        },
        {
            code:
            [
                "const Label = \"Widget\";",
                "function Widget() { return <div />; }",
                "Widget.displayName = Label;",
                ""
            ].join("\n"),
            errors: [ { messageId: "displayNameMismatch" } ],
            filename: "Widget.tsx",
            name: "reports a displayName that is not a string literal (matchExact)",
            options: [ { matchExact: true } ]
        }
    ],
    valid:
    [
        {
            code:
            [
                "function Widget() { return <div />; }",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a function declaration component with an immediate displayName"
        },
        {
            code:
            [
                "const Widget = () => { return <div />; };",
                "Widget.displayName = \"Anything\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a block-bodied const arrow component (value is unchecked by default)"
        },
        {
            code:
            [
                "const Widget = () => <div />;",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a concise-bodied const arrow component"
        },
        {
            code:
            [
                "const Widget = React.forwardRef((Props, Ref) => {",
                "    return <div ref={ Ref } />;",
                "});",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a forwardRef-wrapped component"
        },
        {
            code:
            [
                "const Widget = React.memo(React.forwardRef((Props, Ref) => {",
                "    return <div ref={ Ref } />;",
                "}));",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a memo(forwardRef(...))-wrapped component"
        },
        {
            code:
            [
                "export default function Widget() { return <div />; }",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a default-exported function declaration component"
        },
        {
            code:
            [
                "export const Widget = () => <div />;",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a named-exported const component"
        },
        {
            code:
            [
                "function Widget(Props: { Show: boolean }) {",
                "    if (!Props.Show) { return null; }",
                "    return <div />;",
                "}",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a component that only returns JSX on one code path"
        },
        {
            code:
            [
                "function useThing() { return <div />; }",
                "let Widget = () => <div />;",
                "const NotAComponent = () => 1;",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "ignores functions that are not likely components"
        },
        {
            code:
            [
                "function Widget() { return <div />; }",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts an exact displayName match (matchExact)",
            options: [ { matchExact: true } ]
        },
        {
            code:
            [
                "function Widget() { return <div />; }",
                "Widget.displayName = \"Widget\" as const;",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a displayName asserted `as const` (matchExact)",
            options: [ { matchExact: true } ]
        },
        {
            code:
            [
                "function Widget() { return <div />; }",
                "const Other = 1;",
                "Widget.displayName = \"Widget\";",
                ""
            ].join("\n"),
            filename: "Widget.tsx",
            name: "accepts a non-adjacent displayName when follows-immediately is disabled",
            options: [ { "follows-immediately": false } ]
        }
    ]
});
