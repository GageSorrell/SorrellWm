/* File:      Hook.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include <vector>

class FHook
{
public:
    std::vector<HHOOK> GetExHooks() const
    {
        return ExHooks;
    }

    void OnExit()
    {
        for(HHOOK Hook : ExHooks)
        {
            UnhookWindowsHookEx(Hook);
        }

        for(HWINEVENTHOOK Hook : WinEventHooks)
        {
            UnhookWinEvent(Hook);
        }
    }

    HWINEVENTHOOK RegisterWinEventHook(
        DWORD EventMin,
        DWORD EventMax,
        HMODULE Module,
        WINEVENTPROC WinEventProc,
        DWORD IdProcess,
        DWORD IdThread,
        DWORD Flags
    )
    {
        HWINEVENTHOOK Hook = SetWinEventHook(
            EventMin,
            EventMax,
            Module,
            WinEventProc,
            IdProcess,
            IdThread,
            Flags
        );

        if (Hook)
        {
            WinEventHooks.push_back(Hook);
        }

        return Hook;
    }

    HHOOK RegisterEx(int IdHook, HOOKPROC HookProc, HINSTANCE Module, DWORD ThreadId)
    {
        HHOOK Hook = SetWindowsHookEx(IdHook, HookProc, Module, ThreadId);

        if (Hook)
        {
            ExHooks.push_back(Hook);
        }

        return Hook;
    }

    void UnregisterEx(HHOOK Hook)
    {
        UnhookWindowsHookEx(Hook);
        ExHooks.erase(std::remove(ExHooks.begin(), ExHooks.end(), Hook), ExHooks.end());
    }

    void UnregisterWinEvent(HWINEVENTHOOK Hook)
    {
        UnhookWinEvent(Hook);
        WinEventHooks.erase(std::remove(WinEventHooks.begin(), WinEventHooks.end(), Hook), WinEventHooks.end());
    }
private:
    std::vector<HHOOK> ExHooks;
    std::vector<HWINEVENTHOOK> WinEventHooks;
};
