[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Event](../index.md) / IsEventDecl

# IsEventDecl Type

```ts
type IsEventDecl<Type> = RequestDeclKey extends keyof Type
	? ResponseDeclKey extends keyof Type
		? ErrorMessageDeclKey extends keyof Type
			? ErrorPayloadDeclKey extends keyof Type
				? AreArgumentsSerializable<
						Type[RequestDeclKey],
						Type[ResponseDeclKey],
						Type[ErrorMessageDeclKey],
						Type[ErrorPayloadDeclKey]
					> extends true
					? true
					: false
				: false
			: false
		: false
	: false;
```

## Type Parameters

### Type

`Type`
