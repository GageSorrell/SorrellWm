[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [RegisterFunction](../index.md) / ByRecord

# Type: ByRecord

```ts
type ByRecord<OuterRegistrar, OuterChannelType> = 
  | <ChannelType, Registrar>(Record) => void
  | <ChannelType>(Record) => void
  | <ChannelType>(Record) => void;
```

Register multiple callbacks for a given set of event declarations.
The keys are taken to be the `ChannelType`s, and the respective values are the
callbacks that will be registered for their respective `ChannelType`s.

## Type Parameters

### OuterRegistrar

`OuterRegistrar` *extends* [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md) = [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

### OuterChannelType

`OuterChannelType` *extends* [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`OuterRegistrar`\> = [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`OuterRegistrar`\>
