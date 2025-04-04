/* File:      Miscellaneous.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#include "Miscellaneous.h"
#include "../Core/Utility.h"
#include <cstdint>
#include <tlhelp32.h>
#include <tchar.h>

struct EnumData
{
    DWORD ProcessIdentifier;
    HWND MainWindowHandle;
};

BOOL CALLBACK EnumWindowsCallback(HWND windowHandle, LPARAM lParam)
{
    EnumData *data = reinterpret_cast<EnumData*>(lParam);
    DWORD windowProcessIdentifier = 0;
    GetWindowThreadProcessId(windowHandle, &windowProcessIdentifier);

    if(windowProcessIdentifier == data->ProcessIdentifier
       && GetParent(windowHandle) == nullptr
       && IsWindowVisible(windowHandle))
    {
        data->MainWindowHandle = windowHandle;
        return FALSE;
    }
    return TRUE;
}

HWND FindMainWindowHandle(DWORD processIdentifier)
{
    EnumData data;
    data.ProcessIdentifier = processIdentifier;
    data.MainWindowHandle = nullptr;

    EnumWindows(EnumWindowsCallback, reinterpret_cast<LPARAM>(&data));
    return data.MainWindowHandle;
}

Napi::Value KillNotepadInstances(const Napi::CallbackInfo& CallbackInfo)
{
    // HANDLE ProcessSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    // if(ProcessSnapshot == INVALID_HANDLE_VALUE)
    // {
    //     return CallbackInfo.Env().Undefined();
    // }

    // PROCESSENTRY32W ProcessEntry;
    // ProcessEntry.dwSize = sizeof(ProcessEntry);

    // if(!Process32FirstW(ProcessSnapshot, &ProcessEntry))
    // {
    //     CloseHandle(ProcessSnapshot);
    //     return CallbackInfo.Env().Undefined();
    // }

    // do
    // {
    //     if(_wcsicmp(ProcessEntry.szExeFile, L"notepad.exe") == 0)
    //     {
    //         HANDLE processHandle = OpenProcess(PROCESS_TERMINATE, FALSE, ProcessEntry.th32ProcessID);
    //         if(processHandle != nullptr)
    //         {
    //             TerminateProcess(processHandle, 0);
    //             CloseHandle(processHandle);
    //         }
    //     }
    // }
    // while(Process32NextW(ProcessSnapshot, &ProcessEntry));

    // CloseHandle(ProcessSnapshot);

    // return CallbackInfo.Env().Undefined();

    HANDLE SnapshotHandle = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (SnapshotHandle == INVALID_HANDLE_VALUE)
    {
        return CallbackInfo.Env().Undefined();
    }

    PROCESSENTRY32 ProcessEntry = { 0 };
    ProcessEntry.dwSize = sizeof(PROCESSENTRY32);

    if (Process32First(SnapshotHandle, &ProcessEntry))
    {
        do
        {
            if (_tcsicmp(ProcessEntry.szExeFile, _T("notepad.exe")) == 0)
            {
                HANDLE ProcessHandle = OpenProcess(PROCESS_TERMINATE, FALSE, ProcessEntry.th32ProcessID);
                if (ProcessHandle != NULL)
                {
                    TerminateProcess(ProcessHandle, 0);
                    CloseHandle(ProcessHandle);
                }
            }
        } while (Process32Next(SnapshotHandle, &ProcessEntry));
    }

    CloseHandle(SnapshotHandle);

    return CallbackInfo.Env().Undefined();
}

BOOL CALLBACK EnumerationCallback(HWND WindowHandle, LPARAM lParam)
{
    char ClassName[256] = { 0 };
    GetClassNameA(WindowHandle, ClassName, 256);

    if (std::string(ClassName) == "Notepad")
    {
        std::vector<HWND> *Handles =
            reinterpret_cast<std::vector<HWND>*>(lParam);
        Handles->push_back(WindowHandle);
    }

    return TRUE;
}

Napi::Value GetNotepadHandles(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    std::vector<HWND> WindowHandles;
    EnumWindows(EnumerationCallback, reinterpret_cast<LPARAM>(&WindowHandles));

    std::function<Napi::Object(const Napi::Env &, HWND)> MapFunction([](const Napi::Env& InEnvironment, HWND Handle) -> Napi::Object
    {
        return EncodeHandle(InEnvironment, (HWND) Handle);
    });

    return EncodeArray(Environment, WindowHandles, MapFunction);
}
