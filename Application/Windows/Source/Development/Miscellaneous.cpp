/* File:      Miscellaneous.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#include "Miscellaneous.h"
#include "../Core/Utility.h"
#include <cstdint>
#include <tlhelp32.h>

// #include <windows.h>
// #include <tlhelp32.h>
// #include <tchar.h>
// #include <iostream>

// void KillAllNotepadInstances()
// {
//     HANDLE ProcessSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
//     if (ProcessSnapshot == INVALID_HANDLE_VALUE)
//     {
//         std::cerr << "Failed to create process snapshot." << std::endl;
//         return;
//     }

//     PROCESSENTRY32 ProcessEntry = {0};
//     ProcessEntry.dwSize = sizeof(ProcessEntry);

//     if (Process32First(ProcessSnapshot, &ProcessEntry))
//     {
//         do
//         {
//             if (_tcsicmp(ProcessEntry.szExeFile, TEXT("notepad.exe")) == 0)
//             {
//                 HANDLE ProcessHandle = OpenProcess(PROCESS_TERMINATE, FALSE, ProcessEntry.th32ProcessID);
//                 if (ProcessHandle != NULL)
//                 {
//                     if (!TerminateProcess(ProcessHandle, 0))
//                     {
//                         std::cerr << "Failed to terminate process ID " << ProcessEntry.th32ProcessID << std::endl;
//                     }
//                     CloseHandle(ProcessHandle);
//                 }
//                 else
//                 {
//                     std::cerr << "Failed to open process ID " << ProcessEntry.th32ProcessID << std::endl;
//                 }
//             }
//         }
//         while (Process32Next(ProcessSnapshot, &ProcessEntry));
//     }
//     else
//     {
//         std::cerr << "Failed to retrieve process information." << std::endl;
//     }

//     CloseHandle(ProcessSnapshot);
// }

// Napi::Value SpawnNotepadInstances(const Napi::CallbackInfo& CallbackInfo)
// {
//     Napi::Env Environment = CallbackInfo.Env();
//     int32_t NumWindows = CallbackInfo[0].As<Napi::Number>().Int32Value();

//     KillAllNotepadInstances();

//     std::vector<HWND> WindowHandles;
//     std::vector<PROCESS_INFORMATION> ProcessInfos;

//     for (uint32_t Index = 0; Index < NumWindows; ++Index)
//     {
//         STARTUPINFO StartupInfo = { 0 };
//         StartupInfo.cb = sizeof(StartupInfo);
//         PROCESS_INFORMATION ProcessInformation = { 0 };

//         BOOL CreationResult = CreateProcess(
//             NULL,
//             "notepad.exe",
//             NULL,
//             NULL,
//             FALSE,
//             0,
//             NULL,
//             NULL,
//             &StartupInfo,
//             &ProcessInformation
//         );

//         if (!CreationResult)
//         {
//             continue;
//         }

//         ProcessInfos.push_back(ProcessInformation);
//     }

//     auto GetWindowForProcess = [](DWORD ProcessId) -> HWND
//     {
//         struct CallbackData
//         {
//             DWORD TargetProcessId;
//             HWND FoundWindow;
//         } Data = { ProcessId, NULL };

//         auto EnumCallback = [](HWND WindowHandle, LPARAM LParam) -> BOOL
//         {
//             CallbackData* DataPointer = reinterpret_cast<CallbackData*>(LParam);
//             DWORD CurrentProcessId = 0;
//             GetWindowThreadProcessId(WindowHandle, &CurrentProcessId);
//             if (CurrentProcessId == DataPointer->TargetProcessId)
//             {
//                 // Check if the window is visible and has a title.
//                 if (IsWindowVisible(WindowHandle) && (GetWindowTextLength(WindowHandle) > 0))
//                 {
//                     DataPointer->FoundWindow = WindowHandle;
//                     return FALSE; // Stop enumeration once a matching window is found.
//                 }
//             }
//             return TRUE;
//         };

//         EnumWindows(EnumCallback, reinterpret_cast<LPARAM>(&Data));
//         return Data.FoundWindow;
//     };

//     for (const auto& ProcessInfo : ProcessInfos)
//     {
//         HWND NotepadWindow = NULL;
//         const DWORD TimeoutMilliseconds = 10000;
//         DWORD ElapsedTime = 0;
//         const DWORD SleepInterval = 100;
//         while (ElapsedTime < TimeoutMilliseconds)
//         {
//             NotepadWindow = GetWindowForProcess(ProcessInfo.dwProcessId);
//             if (NotepadWindow != NULL)
//             {
//                 break;
//             }
//             Sleep(SleepInterval);
//             ElapsedTime += SleepInterval;
//         }

//         if (NotepadWindow != NULL)
//         {
//             WindowHandles.push_back(NotepadWindow);
//         }
//         else
//         {
//             std::cerr << "Window not found for process " << ProcessInfo.dwProcessId << std::endl;
//         }

//         // Close the process and thread handles.
//         CloseHandle(ProcessInfo.hProcess);
//         CloseHandle(ProcessInfo.hThread);
//     }

//     std::function<Napi::Object(const Napi::Env &, HWND)> MapFunction([](const Napi::Env& InEnvironment, HWND Handle) -> Napi::Object
//     {
//         return EncodeHandle(InEnvironment, (HWND) Handle);
//     });

//     return EncodeArray(Environment, WindowHandles, MapFunction);
// }

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
        // Returning FALSE stops the enumeration
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
    HANDLE ProcessSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if(ProcessSnapshot == INVALID_HANDLE_VALUE)
    {
        return CallbackInfo.Env().Undefined();
    }

    PROCESSENTRY32W ProcessEntry;
    ProcessEntry.dwSize = sizeof(ProcessEntry);

    if(!Process32FirstW(ProcessSnapshot, &ProcessEntry))
    {
        CloseHandle(ProcessSnapshot);
        return CallbackInfo.Env().Undefined();
    }

    do
    {
        if(_wcsicmp(ProcessEntry.szExeFile, L"notepad.exe") == 0)
        {
            HANDLE processHandle = OpenProcess(PROCESS_TERMINATE, FALSE, ProcessEntry.th32ProcessID);
            if(processHandle != nullptr)
            {
                TerminateProcess(processHandle, 0);
                CloseHandle(processHandle);
            }
        }
    }
    while(Process32NextW(ProcessSnapshot, &ProcessEntry));

    CloseHandle(ProcessSnapshot);

    return CallbackInfo.Env().Undefined();
}

// Napi::Value SpawnNotepadInstances(const Napi::CallbackInfo& CallbackInfo)
// {
//     Napi::Env Environment = CallbackInfo.Env();

//     if(CallbackInfo.Length() < 1 || !CallbackInfo[0].IsNumber())
//     {
//         Napi::TypeError::New(Environment, "Expected one numeric argument").ThrowAsJavaScriptException();
//         return Environment.Null();
//     }

//     int32_t NumWindows = CallbackInfo[0].As<Napi::Number>().Int32Value();
//     if(NumWindows <= 0)
//     {
//         Napi::TypeError::New(Environment, "Number of windows must be positive").ThrowAsJavaScriptException();
//         return Environment.Null();
//     }

//     KillAllNotepadProcesses();

//     std::vector<HWND> WindowHandles;
//     WindowHandles.reserve(NumWindows);

//     for(int index = 0; index < NumWindows; index++)
//     {
//         STARTUPINFOW StartupInformation;
//         PROCESS_INFORMATION ProcessInformation;
//         ZeroMemory(&StartupInformation, sizeof(StartupInformation));
//         ZeroMemory(&ProcessInformation, sizeof(ProcessInformation));

//         StartupInformation.cb = sizeof(StartupInformation);

//         BOOL Success = CreateProcessW(
//             L"C:\\Windows\\System32\\notepad.exe",
//             nullptr,
//             nullptr,
//             nullptr,
//             FALSE,
//             0,
//             nullptr,
//             nullptr,
//             &StartupInformation,
//             &ProcessInformation
//         );

//         if(Success)
//         {
//             WaitForInputIdle(ProcessInformation.hProcess, INFINITE);

//             DWORD processIdentifier = ProcessInformation.dwProcessId;
//             HWND mainWindowHandle = FindMainWindowHandle(processIdentifier);
//             if(mainWindowHandle != nullptr)
//             {
//                 WindowHandles.push_back(mainWindowHandle);
//             }

//             CloseHandle(ProcessInformation.hProcess);
//             CloseHandle(ProcessInformation.hThread);
//         }
//     }

//     std::function<Napi::Object(const Napi::Env &, HWND)> MapFunction([](const Napi::Env& InEnvironment, HWND Handle) -> Napi::Object
//     {
//         return EncodeHandle(InEnvironment, (HWND) Handle);
//     });

//     return EncodeArray(Environment, WindowHandles, MapFunction);
// }

BOOL CALLBACK EnumerationCallback(HWND WindowHandle, LPARAM lParam)
{
    // Retrieve the class name of this window
    char ClassName[256] = {0};
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
