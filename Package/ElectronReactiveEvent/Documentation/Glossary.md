> <span style="font-size: 12px;">Documentation for `electron-reactive-event`.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../License.md).</span>

# Glossary

**Purpose.**&ensp;This article contains common definitions used throughout this documentation.

## Event Declaration

The *type* used to an event's shape is an **event declaration**.
All event declarations are defined using the generic type `EventDecl`.

## Event

Since this package is type-driven, the [event declarations](./Glossary.md#event-declaration) are the core focus.
Event declarations are the concrete and well-defined *types* that exist in one's codebase.

Still, it may be useful to refer to what *actually happens at runtime* with respect to this package and its usage, and so we provide a definition for an *event* that is distinct from event *declarations*.

Given an event declaration, an **event** (of that declaration) is the collection of function calls, arguments provided in the call, and the response (*i.e.*, return value) of the registered callback that receives the request, if a registered callback exists for the given declaration.

## Ownership

All [event declarations](./Glossary.md#event-declaration) define events that are either sent from `main` to the `renderer`, or from the `renderer` to `main`.
Every event declaration has exactly one **owner**, which is from *where* an event of that declaration type is sent.

That is, if an event is sent from `main` to the `renderer`, then its owner is `main`; similarly, if an event is sent from the `renderer` to `main`, then its owner is the `renderer`.
