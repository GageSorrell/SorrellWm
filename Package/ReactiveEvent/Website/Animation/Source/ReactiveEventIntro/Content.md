## !!steps One

!Duration 1000
!Delay 1000

```typescript !
ipcMain.handle("GetPlayerData", async (event, ...args) =>
{

});
```

## !!steps Two

!Duration 100
!Delay 50

```typescript !
ipcMain.handle("GetPlayerData", async (event, ...args) =>
{
    const Player = args.length > 0;
});
```

## !!steps Three

```typescript !
ipcMain.handle("GetPlayerData", async (event, ...args) =>
{
    const Player = args.length > 0;
});
```
