[electron-reactive-event](../../index.md) / [Internal](../index.md) / Registrar

# Registrar Interface

The `Registrar` interface is used internally to store all [event declarations](../../Decl/type-aliases/EventDecl.md)
used in a given project. Event declarations are scoped to the package in which they are declared,
and this scope is resolved via the `PackageKey` type parameter that is had by almost all generic types
in this package.

Event declarations are added to the `Registrar` via
[module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).
Writing these `declare module` blocks is automated by the `electron-reactive-event-cli`,
although using this is optional.

## Properties

### \_\_Internal\_\_

```ts
__Internal__: object;
```

#### BingBong

```ts
BingBong: EventDeclHandler<
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	[string, number]
>;
```

#### GetLitFam

```ts
GetLitFam: EventDeclHandler<boolean, typeof EmptyEventParameterValue, string>;
```

#### MainEmptyEvent

```ts
MainEmptyEvent: EventDeclListener<typeof MainOwnerValue, number>;
```

#### MainEmptyEventNoRequest

```ts
MainEmptyEventNoRequest: EventDeclListener<
	typeof MainOwnerValue,
	typeof EmptyEventParameterValue
>;
```

#### MainEmptyEventNoRequestNoResponse

```ts
MainEmptyEventNoRequestNoResponse: EventDeclListener<
	typeof MainOwnerValue,
	typeof EmptyEventParameterValue
>;
```

#### MainEmptyEventNoRequestNoResponseNoError

```ts
MainEmptyEventNoRequestNoResponseNoError: EventDeclListener<
	typeof MainOwnerValue,
	typeof EmptyEventParameterValue
>;
```

#### MainEmptyEventNoRequestNoResponseNoErrorPayload

```ts
MainEmptyEventNoRequestNoResponseNoErrorPayload: EventDeclListener<
	typeof MainOwnerValue,
	typeof EmptyEventParameterValue
>;
```

#### RendererEmptyEvent

```ts
RendererEmptyEvent: EventDeclHandler<
	number,
	{
		Foo: string;
	},
	[
		string,
		{
			Foo: string;
		},
	]
>;
```

#### RendererEmptyEventNoRequest

```ts
RendererEmptyEventNoRequest: EventDeclHandler<
	typeof EmptyEventParameterValue,
	{
		Foo: string;
	},
	[
		string,
		{
			Foo: string;
		},
	]
>;
```

#### RendererEmptyEventNoRequestNoResponse

```ts
RendererEmptyEventNoRequestNoResponse: EventDeclHandler<
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	[
		string,
		{
			foo: string;
		},
	]
>;
```

#### RendererEmptyEventNoRequestNoResponseNoError

```ts
RendererEmptyEventNoRequestNoResponseNoError: EventDeclListener<
	typeof RendererOwnerValue,
	typeof EmptyEventParameterValue
>;
```

#### RendererEmptyEventNoRequestNoResponseNoErrorPayload

```ts
RendererEmptyEventNoRequestNoResponseNoErrorPayload: EventDeclHandler<
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	string
>;
```

#### ResponsefulMainEvent

```ts
ResponsefulMainEvent: EventDeclListener<typeof MainOwnerValue, number>;
```

#### ShowLitFam

```ts
ShowLitFam: EventDeclListener<typeof MainOwnerValue, number>;
```
