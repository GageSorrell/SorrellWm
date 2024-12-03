#pragma once

#include "Core.h"
#include <vector>

class FHook
{
public:
    std::vector<HHOOK> GetHooks() const
    {
        return Hooks;
    }

    void OnExit()
    {
        for(HHOOK Hook : Hooks)
        {
            UnhookWindowsHookEx(Hook);
        }
    }

    HHOOK Register(int idHook, HOOKPROC lpfn, HINSTANCE hmod, DWORD dwThreadId)
    {
        HHOOK Hook = SetWindowsHookEx(idHook, lpfn, hmod, dwThreadId);

        if (Hook)
        {
            Hooks.push_back(Hook);
        }

        return Hook;
    }

    void Unregister(HHOOK Hook)
    {
        Hooks.erase(std::remove(Hooks.begin(), Hooks.end(), Hook), Hooks.end());
    }
private:
    std::vector<HHOOK> Hooks;
};
