[electron-reactive-event](../../index.md) / [Decl](../index.md) / EventDecl

# EventDecl Type

```ts
type EventDecl<OwnerType, RequestType, ResponseType, ErrorType> = object;
```

All events in `electron-reactive-event` are modeled with this type.

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](EventOwner.md)

From whom an event of this type is sent.

### RequestType

`RequestType` = [`EmptyEventParameter`](EmptyEventParameter.md)

The type of the request object that is sent when an event occurs.

### ResponseType

`ResponseType` = [`EmptyEventParameter`](EmptyEventParameter.md)

The type of the response object that is sent when an event succeeds.

### ErrorType

`ErrorType` _extends_
\| [`EventErrorDecl`](EventErrorDecl.md)
\| [`EmptyEventParameter`](EmptyEventParameter.md) = [`EmptyEventParameter`](EmptyEventParameter.md)

The type of the response object that is sent when an event fails.

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
