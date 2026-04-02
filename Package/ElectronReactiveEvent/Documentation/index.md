---
layout: home

hero:
  name: "Electron Reactive Event"
  tagline: "Type-safe Electron IPC functions, including modern React hooks."
  image:
    src: "./hero.png"
    alt: "Electron Reactive Event Logo, Hero-Sized."
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: Browse the Documentation
      link: /articles/introduction

features:
  - title: "Type-safe event handling"
    # icon: "🦺"
    details: "Everything is typed: callbacks, request arguments, response values, and errors.  Define your event types, and everything in <code>electron-reactive-event</code> will follow."
  - title: "Modern React hooks"
    # icon: "🪝"
    details: "Hooks use modern React features like <code>use</code> and transitions.  All functionality is wrapped with common hook idioms, including <code>Deferred</code> variants for most hooks."
  - title: "Familiar API"
    # icon: "🧘"
    details: "The functions to send and receive functions are nearly identical to the IPC functions in <code>electron</code>, with added type-safety across the entire API surface.<div class=\"card-footer-container\"><div style=\"min-height: 1px; flex: 1\"></div><div class=\"card-footer-links\"><a href=\"/articles/glossary.html\">Read the setup guide&nbsp;<span class=\"FluentIcon\">&#xE76C;</span></a><br style=\"min-height: 100%\"/></div></div>"
  - title: "Optional, simple CLI"
    # icon: "⛏️"
    details: "Register your event declarations as a part of your build step.  Simpler projects can register their event declarations manually with ease.  Opt-in by installing the CLI and running the interactive setup wizard.<div class=\"card-footer-container\"><div style=\"min-height: 1px; flex: 1\"></div><div class=\"card-footer-links\"><a href=\"/articles/glossary.html\">Read the setup guide&nbsp;<span class=\"FluentIcon\">&#xE76C;</span></a><br style=\"min-height: 100%\"/><a href=\"/cli/introduction.html\">Browse the CLI documentation&nbsp;<span class=\"FluentIcon\">&#xE76C;</span></a></div></div>"
---
<div class="feature-demo-container">

<div class="feature-demo">
<div class="feature-description">

## Say goodbye to `...args: any[]`

Once you create an event declaration type, the functions to send and receive your events will conform to the argument, response, and error types in your declaration.

[Learn more about defining events <FluentIcon Icon="ChevronRight" />](./)

</div>
<div class="feature-code">
<div class="intellisense">

<p class="intellisense-label">Intellisense</p>

```typescript
//[!code word:Request\: Box]
function send(Channel: "GetBoxData", Request: Box): Promise<BoxData>;
```

<div class="intellisense-divider"></div>

```typescript
//[!code word:X\: number;]
type Box = { X: number; Y: number; ... };
```

</div>


<div class="code-example">

```typescript
// [!code word:▌]
const Result: BoxData = await send("GetBoxData", { X: ▌
```

</div>
</div>
</div>

<div class="feature-demo">
<div class="feature-description">

## Flexible event types

When you define your events as types, you are free to include or omit types for request data, response data, and error payload data.

Don't need to send data with your request?
No `Request` argument needed.

Don't need to respond with data?
No `return` statement needed.

[See how to register callbacks <FluentIcon Icon="ChevronRight" />](./)

</div>
<div class="feature-code">
<div class="intellisense">

<p class="intellisense-label">Intellisense</p>

```typescript
//[!code word:Callback\: ...]
function On(Channel: "GetPlayerIDs", Callback: ...): Promise<void>;
```

<div class="intellisense-divider"></div>

```typescript
//[!code word:=> Promise<Array<number>>;]
type Callback = () => Promise<Array<number>>;
```

</div>


<div class="code-example">

```typescript
// [!code word:▌]
On("GetPlayerIDs", async () =>
{
    const PlayerIDs: Array<number> = // ...

    if (PlayerIDs.length > 0)
    {
        return PlayerIDs▌
    }
    else
    {
        throw new ReactiveError("NoPlayersFound");
    }
});
```

</div>
</div>
</div>

<div class="feature-demo">
<div class="feature-description">

## Works seamlessly with React

The hooks provided by `electron-reactive-event` support modern features, including suspending and transitions.

Most hooks have `Deferred` counterparts, which are `async` and open up more options for interacting with `main`.

[Browse the React hooks <FluentIcon Icon="ChevronRight" />](./)

</div>
<div class="feature-code">
<div class="intellisense">

<p class="intellisense-label">Intellisense</p>

```typescript
//[!code word:Suspend\: boolean = false]
function useSend(Channel: "SetPlayerName", Request: string, Suspend: boolean = false): ...;
```

</div>

<div class="code-example">

```typescript
// [!code word:▌]
const { Error, IsPending } = useSend("SetPlayerName", "f1ux", true▌
```

</div>
</div>
</div>
<div class="feature-demo">
<div class="feature-description">

## Fine-grained error types

For simple events, define your event's errors as `string` types to convey a simple message.

For events that need it, you can define your events as having an error *payload* type, to convey deeper information about erroneous state.

[Browse examples of errors with payload types <FluentIcon Icon="ChevronRight" />](./)

</div>
<div class="feature-code">
<div class="intellisense">

<p class="intellisense-label">Intellisense</p>

```typescript
//[!code word:Callback\: Callback<"UploadSubmission">]
function On(..., Callback: Callback<"UploadSubmission">): Promise<void>;
```

<div class="intellisense-divider"></div>

```typescript
//[!code word:=> Promise<...>;]
type Callback = (Request: Setting) => Promise<...>;
```

</div>


<div class="code-example">

```typescript
// [!code word:▌]
On("Resubmit", async () =>
{
    try
    {
        const Api = await GetSubmissionApi();
        const Recent = Api.GetRecent();

        await Api.Submit(Recent);
    }
    catch (SubmitError: unknown)
    {
        if (SubmitError instanceof SubmissionError)
        {
            throw new ReactiveError(
                "SubmitApiFailed",
                SubmitError.Reason▌
            );
        }

        throw new ReactiveError("Unspecified");
    }
});
```

</div>
</div>
</div>

<div class="feature-demo">
<div class="feature-description">

## Let the CLI do the boilerplate for you

Still not convinced?
Even the boilerplate is handled for you, with our (optional) CLI tool.
Call it when you create new event types, or include it in your build step.

[Read the CLI setup guide <FluentIcon Icon="ChevronRight" />](./)

</div>
<div class="feature-code">
<div class="cli-example">

```ts {12}
// [!code word:▌]
$ npx electron-reactive-event-cli register

> electron-reactive-event (version 1.1.0)
> register

✓ Found configuration file in default location!
✓ Found 49 event declarations across 30 modules!
✓ Generated declaration module from your events!
✓ Saved new module at ./src/registrars.types.ts!

✓ The CLI updated your event registrars successfully!

$ ▌
```

</div>
</div>
</div>

</div>
