#pragma once

#include "../MessageLoop/MessageLoop.h"
#include "InterProcessCommunication.h"
#include "Hook.h"

class GGlobals
{
public:
    inline static FMessageLoop* MessageLoop = nullptr;
    inline static FIpc* Ipc = nullptr;
    inline static FHook* Hook = nullptr;
    inline static ULONG_PTR GdiPlus = NULL;
};
