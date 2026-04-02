---
next: false
---
[electron-reactive-event](/docs) / [Articles](./) / Glossary

# Glossary

::: tip Purpose
This article contains common definitions used throughout this documentation.
:::

<div class="CustomTocContainer">
<p class="CustomTocTitle">In this article</p>

[[toc]]

</div>

## Event Declaration

The *type* used to define an event's shape is an **event declaration**.
All event declarations are defined using the generic type [`EventDecl`](/reference/API/type-aliases/EventDecl.html).

## Event

Since this package is type-driven, the [event declarations](./Glossary.html#event-declaration) are the core focus.
Event declarations are the concrete and well-defined *types* that exist in one's codebase.

Still, it may be useful to refer to what *actually happens at runtime* with respect to this package and its usage, and so we provide a definition for an *event* that is distinct from event *declarations*.

Given an event declaration, an **event** (of that declaration) is the collection of function calls, arguments provided in the call, and the response (*i.e.*, return value) of the registered callback that receives the request, if a registered callback exists for the given declaration.

## Registrar

An interface that contains event declarations.
A project using `electron-reactive-event` must define at least two registrars: one for `main` event declarations, and one for `renderer` event declarations.
These interfaces must extend [`IMainRegistrarBase`](../reference/Shared/namespaces/Registrar/interfaces/IMainRegistrarBase) or [`IRendererRegistrarBase`](../reference/Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase) respectively.

## Ownership

All [event declarations](./Glossary.html#event-declaration) define events that are either sent from `main` to the `renderer`, or from the `renderer` to `main`.
Every event declaration has exactly one **owner**, which is from *where* an event of that declaration type is sent.

That is, if an event is sent from `main` to the `renderer`, then its owner is `main`; similarly, if an event is sent from the `renderer` to `main`, then its owner is the `renderer`.
