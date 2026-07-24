# `@sorrell/wm-script`

Local Windows configuration commands for the SorrellWm workspace.

```powershell
npm run snap:on --workspace @sorrell/wm-script
npm run snap:off --workspace @sorrell/wm-script
```

Both commands update the current user's built-in Windows **Snap windows**
preference immediately and persist it to the user profile. The setting does not
require administrator access, so the commands intentionally do not request UAC
elevation.
