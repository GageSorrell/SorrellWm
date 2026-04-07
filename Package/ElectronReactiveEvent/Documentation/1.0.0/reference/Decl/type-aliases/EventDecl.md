[electron-reactive-event](../../index.md) / [Decl](../index.md) / EventDecl

# EventDecl Type

```ts
type EventDecl<OwnerType, RequestType, ResponseType, ErrorType, Options> =
	object;
```

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](EventOwner.md)

### RequestType

`RequestType` = [`EmptyEventParameter`](EmptyEventParameter.md)

### ResponseType

`ResponseType` = [`EmptyEventParameter`](EmptyEventParameter.md)

### ErrorType

`ErrorType` _extends_
\| [`EventErrorDecl`](EventErrorDecl.md)
\| [`EmptyEventParameter`](EmptyEventParameter.md) = [`EmptyEventParameter`](EmptyEventParameter.md)

### Options

`Options` _extends_ `EventDeclOptions` \| [`EmptyEventParameter`](EmptyEventParameter.md) = [`EmptyEventParameter`](EmptyEventParameter.md)

## Properties

### ErrorType

```ts
ErrorType: ErrorType;
```

---

### OwnerType

```ts
OwnerType: OwnerType;
```

---

### RequestType

```ts
RequestType: RequestType;
```

---

### ResponseType

```ts
ResponseType: ResponseType;
```
