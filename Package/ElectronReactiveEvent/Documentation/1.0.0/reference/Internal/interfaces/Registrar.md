[electron-reactive-event](../../index.md) / [Internal](../index.md) / Registrar

# Registrar Interface

## Properties

### \_\_Internal\_\_

```ts
__Internal__: object;
```

#### BingBong

```ts
BingBong: EventDecl<
	typeof RendererOwnerValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	[string, number]
>;
```

#### GetLitFam

```ts
GetLitFam: EventDecl<
	typeof RendererOwnerValue,
	boolean,
	typeof EmptyEventParameterValue,
	string
>;
```

#### MainEmptyEvent

```ts
MainEmptyEvent: EventDecl<
	typeof MainOwnerValue,
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

#### MainEmptyEventNoRequest

```ts
MainEmptyEventNoRequest: EventDecl<
	typeof MainOwnerValue,
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

#### MainEmptyEventNoRequestNoResponse

```ts
MainEmptyEventNoRequestNoResponse: EventDecl<
	typeof MainOwnerValue,
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

#### MainEmptyEventNoRequestNoResponseNoError

```ts
MainEmptyEventNoRequestNoResponseNoError: EventDecl<
	typeof MainOwnerValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue
>;
```

#### MainEmptyEventNoRequestNoResponseNoErrorPayload

```ts
MainEmptyEventNoRequestNoResponseNoErrorPayload: EventDecl<
	typeof MainOwnerValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	string
>;
```

#### RendererEmptyEvent

```ts
RendererEmptyEvent: EventDecl<
	typeof RendererOwnerValue,
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
RendererEmptyEventNoRequest: EventDecl<
	typeof RendererOwnerValue,
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
RendererEmptyEventNoRequestNoResponse: EventDecl<
	typeof RendererOwnerValue,
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
RendererEmptyEventNoRequestNoResponseNoError: EventDecl<
	typeof RendererOwnerValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue
>;
```

#### RendererEmptyEventNoRequestNoResponseNoErrorPayload

```ts
RendererEmptyEventNoRequestNoResponseNoErrorPayload: EventDecl<
	typeof RendererOwnerValue,
	typeof EmptyEventParameterValue,
	typeof EmptyEventParameterValue,
	string
>;
```

#### ResponsefulMainEvent

```ts
ResponsefulMainEvent: EventDecl<
	typeof MainOwnerValue,
	number,
	{
		foo: string;
	},
	string
>;
```

#### ShowLitFam

```ts
ShowLitFam: EventDecl<
	typeof MainOwnerValue,
	number,
	typeof EmptyEventParameterValue,
	string
>;
```
