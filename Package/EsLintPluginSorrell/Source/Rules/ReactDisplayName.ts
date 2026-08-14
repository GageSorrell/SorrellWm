/**
 * Rule that requires React functional components to set their `displayName`
 * property via a module-level statement.
 *
 * @module @sorrell/eslint-plugin/Rules/ReactDisplayName
 *
 * @file      ReactDisplayName.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Estree from "estree";
import type { Rule } from "eslint";

/** The parameter type ESLint passes to a `Program` node listener. */
type ProgramListenerNode = Parameters<NonNullable<Rule.NodeListener["Program"]>>[0];

/** An element of `Program.body`: a directive, statement, or module declaration. */
type ProgramBodyElement = Estree.Program["body"][number];

/** The function forms this rule can recognize as a component's implementation. */
type ComponentFunction =
    | Estree.ArrowFunctionExpression
    | Estree.FunctionExpression
    | Estree.MaybeNamedFunctionDeclaration;

/** A function or `const` variable that this rule treats as a component. */
interface Candidate
{
    /** The candidate's index within `Program.body`, used to check adjacency. */
    Index: number;

    /** The component's name, as it must appear on the `displayName` assignment. */
    Name: string;

    /** The identifier reported against, and matched to a `displayName` assignment. */
    NameNode: Estree.Identifier;
}

/** A module-level statement of the form `Name.displayName = Value;`. */
interface DisplayNameAssignment
{
    /** The assignment statement's index within `Program.body`. */
    Index: number;

    /** The right-hand side of the assignment. */
    ValueNode: Estree.Expression;
}

/** This rule's options, exactly as authored in an ESLint config. */
interface OptionsShape
{
    "follows-immediately"?: boolean;
    matchExact?: boolean;
}

/** This rule's options, resolved against their documented defaults. */
interface ResolvedOptions
{
    FollowsImmediately: boolean;
    MatchExact: boolean;
}

/** Matches identifiers that follow the PascalCase convention used for components. */
const ComponentNameRegExp: RegExp = /^[A-Z]/;

/** Callee names, such as `forwardRef` or `React.memo`, that wrap a component. */
const WrapperCalleeNames: ReadonlySet<string> = new Set([ "forwardRef", "memo" ]);

/**
 * Determine whether `Name` follows the PascalCase convention used for React
 * components.
 *
 * @since 1.2.0
 */
const IsComponentName = (Name: string): boolean => ComponentNameRegExp.test(Name);

/**
 * Read the identifier a call expression's callee resolves to, unwrapping a
 * single member access so both `forwardRef(...)` and `React.forwardRef(...)`
 * are recognized.
 *
 * @since 1.2.0
 */
const CalleeIdentifierName = (Callee: Estree.Expression): string | null =>
{
    if (Callee.type === "Identifier")
    {
        return Callee.name;
    }

    if (Callee.type === "MemberExpression" && !Callee.computed && Callee.property.type === "Identifier")
    {
        return Callee.property.name;
    }

    return null;
};

/**
 * Resolve a variable's initializer to the function that implements it,
 * unwrapping any nesting of the wrapper calls named in `WrapperCalleeNames`
 * (`React.forwardRef`, `React.memo`, and their bare equivalents).  Returns
 * `null` when `Init` is not, and does not wrap, a function.
 *
 * @since 1.2.0
 */
const UnwrapComponentImplementation = (
    Init: Estree.Expression
): Estree.ArrowFunctionExpression | Estree.FunctionExpression | null =>
{
    if (Init.type === "ArrowFunctionExpression" || Init.type === "FunctionExpression")
    {
        return Init;
    }

    if (Init.type !== "CallExpression" || Init.callee.type === "Super")
    {
        return null;
    }

    const CalleeName: string | null = CalleeIdentifierName(Init.callee);
    const FirstArgument: Estree.Expression | Estree.SpreadElement | undefined = Init.arguments[0];

    if (
        CalleeName === null
        || !WrapperCalleeNames.has(CalleeName)
        || FirstArgument === undefined
        || FirstArgument.type === "SpreadElement"
    )
    {
        return null;
    }

    return UnwrapComponentImplementation(FirstArgument);
};

/**
 * Determine whether an arbitrary AST node is, or may evaluate to, JSX.  This
 * reads `Node` structurally rather than through the base `estree` types
 * because JSX nodes fall outside them.
 *
 * @since 1.2.0
 */
const IsJsxLike = (Node: unknown): boolean =>
{
    if (typeof Node !== "object" || Node === null)
    {
        return false;
    }

    const NodeType: unknown = (Node as { type?: unknown }).type;

    if (NodeType === "JSXElement" || NodeType === "JSXFragment")
    {
        return true;
    }

    if (NodeType === "ConditionalExpression")
    {
        const Conditional: { alternate: unknown; consequent: unknown } =
            Node as { alternate: unknown; consequent: unknown };

        return IsJsxLike(Conditional.consequent) || IsJsxLike(Conditional.alternate);
    }

    if (NodeType === "LogicalExpression")
    {
        const Logical: { left: unknown; right: unknown } = Node as { left: unknown; right: unknown };

        return IsJsxLike(Logical.left) || IsJsxLike(Logical.right);
    }

    return false;
};

/**
 * Determine whether `Statement` returns JSX, either directly or through one
 * of its nested branches.  The search does not cross into a nested function,
 * since that would belong to a different component (if any).
 *
 * @since 1.2.0
 */
const StatementReturnsJsx = (Statement: Estree.Statement): boolean =>
{
    switch (Statement.type)
    {
        case "BlockStatement":
            return Statement.body.some(StatementReturnsJsx);
        case "IfStatement":
            return StatementReturnsJsx(Statement.consequent)
                || (Statement.alternate !== null
                    && Statement.alternate !== undefined
                    && StatementReturnsJsx(Statement.alternate));
        case "ForStatement":
        case "ForInStatement":
        case "ForOfStatement":
        case "WhileStatement":
        case "DoWhileStatement":
        case "LabeledStatement":
            return StatementReturnsJsx(Statement.body);
        case "SwitchStatement":
            return Statement.cases.some(SwitchCaseReturnsJsx);
        case "TryStatement":
            return StatementReturnsJsx(Statement.block)
                || (Statement.handler !== null
                    && Statement.handler !== undefined
                    && StatementReturnsJsx(Statement.handler.body))
                || (Statement.finalizer !== null
                    && Statement.finalizer !== undefined
                    && StatementReturnsJsx(Statement.finalizer));
        case "ReturnStatement":
            return Statement.argument !== null
                && Statement.argument !== undefined
                && IsJsxLike(Statement.argument);
        default:
            return false;
    }
};

/**
 * Determine whether any statement in a `switch` case returns JSX.
 *
 * @since 1.2.0
 */
const SwitchCaseReturnsJsx = (Case: Estree.SwitchCase): boolean => Case.consequent.some(StatementReturnsJsx);

/**
 * Determine whether `FunctionNode` returns JSX from at least one of its
 * possible code paths.
 *
 * @since 1.2.0
 */
const FunctionReturnsJsx = (FunctionNode: ComponentFunction): boolean =>
{
    if (FunctionNode.body.type !== "BlockStatement")
    {
        /* Only an arrow function may have a concise, expression-only body. */
        return IsJsxLike(FunctionNode.body);
    }

    return StatementReturnsJsx(FunctionNode.body);
};

/**
 * Narrow a declaration to the `function` and `const` variable declarations
 * this rule considers; `class` declarations are out of scope.
 *
 * @since 1.2.0
 */
const IsConsiderableDeclaration = (
    Declaration: Estree.Declaration
): Declaration is Estree.FunctionDeclaration | Estree.VariableDeclaration =>
    Declaration.type === "FunctionDeclaration" || Declaration.type === "VariableDeclaration";

/**
 * Inspect a single top-level declaration — a `function` declaration or a
 * `const` variable declaration — and record it in `Candidates` when it looks
 * like a React functional component: a PascalCase name bound to a function
 * (optionally wrapped in `forwardRef` and/or `memo`) that returns JSX.  The
 * declaration's `id` may be `null` because a default-exported function
 * declaration can be anonymous; such a declaration is skipped.
 *
 * @since 1.2.0
 */
const ConsiderDeclaration = (
    Declaration: Estree.MaybeNamedFunctionDeclaration | Estree.VariableDeclaration,
    Index: number,
    Candidates: Array<Candidate>
): void =>
{
    if (Declaration.type === "FunctionDeclaration")
    {
        if (
            Declaration.id !== null
            && IsComponentName(Declaration.id.name)
            && FunctionReturnsJsx(Declaration)
        )
        {
            Candidates.push({ Index, Name: Declaration.id.name, NameNode: Declaration.id });
        }

        return;
    }

    if (Declaration.kind !== "const")
    {
        return;
    }

    for (const Declarator of Declaration.declarations)
    {
        if (Declarator.id.type !== "Identifier" || !IsComponentName(Declarator.id.name))
        {
            continue;
        }

        if (Declarator.init === null || Declarator.init === undefined)
        {
            continue;
        }

        const Implementation: Estree.ArrowFunctionExpression | Estree.FunctionExpression | null =
            UnwrapComponentImplementation(Declarator.init);

        if (Implementation !== null && FunctionReturnsJsx(Implementation))
        {
            Candidates.push({ Index, Name: Declarator.id.name, NameNode: Declarator.id });
        }
    }
};

/**
 * Collect every likely React functional component declared at the top level
 * of `Program`, unwrapping `export` and `export default` so exported
 * components are recognized too.
 *
 * @since 1.2.0
 */
const CollectCandidates = (Program: Estree.Program): ReadonlyArray<Candidate> =>
{
    const Candidates: Array<Candidate> = [];

    Program.body.forEach((Statement: ProgramBodyElement, Index: number) =>
    {
        if (Statement.type === "FunctionDeclaration" || Statement.type === "VariableDeclaration")
        {
            ConsiderDeclaration(Statement, Index, Candidates);
            return;
        }

        if (Statement.type === "ExportNamedDeclaration")
        {
            if (
                Statement.declaration !== null
                && Statement.declaration !== undefined
                && IsConsiderableDeclaration(Statement.declaration)
            )
            {
                ConsiderDeclaration(Statement.declaration, Index, Candidates);
            }

            return;
        }

        if (
            Statement.type === "ExportDefaultDeclaration"
            && Statement.declaration.type === "FunctionDeclaration"
        )
        {
            ConsiderDeclaration(Statement.declaration, Index, Candidates);
        }
    });

    return Candidates;
};

/**
 * Collect every module-level `Name.displayName = Value;` statement in
 * `Program`, keyed by `Name`.  When more than one statement targets the same
 * name, the first one wins.
 *
 * @since 1.2.0
 */
const CollectDisplayNameAssignments = (Program: Estree.Program): Map<string, DisplayNameAssignment> =>
{
    const Assignments: Map<string, DisplayNameAssignment> = new Map();

    Program.body.forEach((Statement: ProgramBodyElement, Index: number) =>
    {
        if (Statement.type !== "ExpressionStatement" || Statement.expression.type !== "AssignmentExpression")
        {
            return;
        }

        const Assignment: Estree.AssignmentExpression = Statement.expression;

        if (Assignment.operator !== "=" || Assignment.left.type !== "MemberExpression")
        {
            return;
        }

        const Target: Estree.MemberExpression = Assignment.left;

        if (
            Target.computed
            || Target.property.type !== "Identifier"
            || Target.property.name !== "displayName"
            || Target.object.type !== "Identifier"
        )
        {
            return;
        }

        if (!Assignments.has(Target.object.name))
        {
            Assignments.set(Target.object.name, { Index, ValueNode: Assignment.right });
        }
    });

    return Assignments;
};

/**
 * Unwrap a `Value as const` assertion — or any nesting thereof — down to the
 * expression it asserts the type of.
 *
 * @since 1.2.0
 */
const UnwrapAsConst = (Node: unknown): unknown =>
{
    if (typeof Node !== "object" || Node === null || (Node as { type?: unknown }).type !== "TSAsExpression")
    {
        return Node;
    }

    return UnwrapAsConst((Node as { expression: unknown }).expression);
};

/**
 * Determine whether `Node` is a string literal equal to `Value`.
 *
 * @since 1.2.0
 */
const IsStringLiteralWithValue = (Node: unknown, Value: string): boolean =>
{
    if (typeof Node !== "object" || Node === null)
    {
        return false;
    }

    const Loose: { type?: unknown; value?: unknown } = Node as { type?: unknown; value?: unknown };

    return Loose.type === "Literal" && Loose.value === Value;
};

/**
 * Read this rule's options, applying the documented defaults: `matchExact`
 * is `false` and `follows-immediately` is `true`.
 *
 * @since 1.2.0
 */
const ResolveOptions = (Context: Rule.RuleContext): ResolvedOptions =>
{
    const Raw: OptionsShape | undefined = Context.options[0] as OptionsShape | undefined;

    return {
        FollowsImmediately: Raw?.["follows-immediately"] ?? true,
        MatchExact: Raw?.matchExact ?? false
    };
};

export/**
       * ESLint rule that requires a React functional component — a
       * function declaration or `const`-bound (arrow or plain) function
       * whose name is PascalCase and that returns JSX, optionally wrapped in
       * `forwardRef` and/or `memo` — to have its `displayName` property set
       * by a module-level `Name.displayName = ...;` statement.
       *
       * @since 1.2.0
       */
const ReactDisplayName: Rule.RuleModule = {
    create(Context: Rule.RuleContext): Rule.RuleListener
    {
        const Options: ResolvedOptions = ResolveOptions(Context);

        return {
            Program(ProgramNode: ProgramListenerNode): void
            {
                const Candidates: ReadonlyArray<Candidate> = CollectCandidates(ProgramNode);

                if (Candidates.length === 0)
                {
                    return;
                }

                const Assignments: Map<string, DisplayNameAssignment> =
                    CollectDisplayNameAssignments(ProgramNode);

                for (const Candidate of Candidates)
                {
                    const Assignment: DisplayNameAssignment | undefined = Assignments.get(Candidate.Name);

                    if (Assignment === undefined)
                    {
                        Context.report({
                            data: { name: Candidate.Name },
                            messageId: "missingDisplayName",
                            node: Candidate.NameNode
                        });
                        continue;
                    }

                    if (Options.FollowsImmediately && Assignment.Index !== Candidate.Index + 1)
                    {
                        Context.report({
                            data: { name: Candidate.Name },
                            messageId: "displayNameNotImmediate",
                            node: Candidate.NameNode
                        });
                        continue;
                    }

                    if (!Options.MatchExact)
                    {
                        continue;
                    }

                    const Value: unknown = UnwrapAsConst(Assignment.ValueNode);

                    if (!IsStringLiteralWithValue(Value, Candidate.Name))
                    {
                        Context.report({
                            data: { name: Candidate.Name },
                            messageId: "displayNameMismatch",
                            node: Candidate.NameNode
                        });
                    }
                }
            }
        };
    },
    meta:
    {
        docs:
        {
            description:
                "Require React functional components to set their `displayName` "
                + "via a module-level statement.",
            recommended: false
        },
        messages:
        {
            displayNameMismatch:
                "The `displayName` for \"{{ name }}\" must be the string literal \"{{ name }}\".",
            displayNameNotImmediate:
                "The `displayName` assignment for \"{{ name }}\" must immediately follow its definition.",
            missingDisplayName: "Component \"{{ name }}\" does not set its `displayName` property."
        },
        schema:
        [
            {
                additionalProperties: false,
                properties:
                {
                    "follows-immediately": { type: "boolean" },
                    matchExact: { type: "boolean" }
                },
                type: "object"
            }
        ],
        type: "problem"
    }
};

export default ReactDisplayName;
