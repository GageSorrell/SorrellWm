[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseIndeterminate

# ResponseIndeterminate Type

```ts
type ResponseIndeterminate = object;
```

The type of the value returned by UseInvokeEvent when InvokeOptions.suspend
is passed and before a [Handler](Handler.md) registered in `main` has returned a [Response](Response.md).

## Properties

### data

```ts
data: undefined;
```

---

### error

```ts
error: undefined;
```

---

### isPending

```ts
isPending: true;
```
