#pragma once

#include <Windows.h>

class FMessageLoop;
class FWinEvent;
class FIpc;
class FHook;

class GGlobals
{
public:
    inline static FMessageLoop* MessageLoop = nullptr;
    inline static FWinEvent* WinEvent = nullptr;
    inline static FIpc* Ipc = nullptr;
    inline static FHook* Hook = nullptr;
    inline static ULONG_PTR GdiPlus = NULL;
    inline static HINSTANCE Instance = nullptr;
};
