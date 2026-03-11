/* File:      Initialization.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "Border.h"
#include "Core/Core.h"
#include "Core/Globals.h"
#include "Core/InterProcessCommunication.h"
#include "Core/WinEvent.h"
#include "Core/Hook.h"
#include "Core/WindowUtilities.h"
#include "Core/MonitorUtilities.h"
#include "Development/Miscellaneous.h"
#include "Keyboard.h"
#include "Lifetime.h"
#include "MessageLoop/MessageLoop.h"
#include "WindowTracker.h"
#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <dwmapi.h>
#include <codecvt>
#include <map>
#include <variant>

#include "BlurBackground.h"
#include "Screenshot.h"
#include "Core/WindowUtilities.h"

/* BEGIN AUTO-GENERATED REGION: INCLUDES. */
/* END AUTO-GENERATED REGION.             */

// Napi::Value InitializeIpc(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     Napi::Function Callback = Information[0].As<Napi::Function>();

//     GGlobals::Ipc = new FIpc(Environment, Callback);

//     return;
// }

void HooksExitCleanup(void* _)
{
    GGlobals::Hook->OnExit();
}

void ShutdownGdiPlus(void* _)
{
    Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
}

/**
 * When other things need to be initialized by a callback (with no data needed),
 * their initializations should be added here, and the function should be renamed
 * to be more generic.
 */
void InitializeHooks(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();
    GGlobals::Hook = new FHook();

    napi_add_env_cleanup_hook(Environment, HooksExitCleanup, nullptr);
    napi_add_env_cleanup_hook(Environment, ShutdownGdiPlus, nullptr);

    GGlobals::WinEvent = new FWinEvent();

    // return Environment.Undefined();

    /* @TODO Find better place to register listeners */
    try
    {
        RegisterActivationKey();
        return;
    }
    catch (const Napi::Error& Error)
    {
        std::cout << "Napi Error" << std::endl;
        OutputDebugStringW(L"MyFunction: caught Napi::Error\n");
        Error.ThrowAsJavaScriptException();
    }
    catch (const std::exception& Exception)
    {
        std::cout << "Regular Exception" << std::endl;
        OutputDebugStringW(L"MyFunction: caught std::exception\n");
        Napi::Error::New(Environment, Exception.what()).ThrowAsJavaScriptException();
    }
    catch (...)
    {
        std::cout << "Something else" << std::endl;
        OutputDebugStringW(L"MyFunction: caught unknown exception\n");
        Napi::Error::New(Environment, "Unknown native exception").ThrowAsJavaScriptException();
    }
    // RegisterActivationKey();
}

void InitializeMessageLoop(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();

    /** We have to pass a callback function to the AsyncWorker. */
    const Napi::Function EmptyCallback = Information[0].As<Napi::Function>();

    GGlobals::MessageLoop = new FMessageLoop(EmptyCallback);
    GGlobals::MessageLoop->Queue();
}

void InitializeGdiPlus()
{
    Gdiplus::GdiplusStartupInput gdiplusStartupInput;
    Gdiplus::Status status = Gdiplus::GdiplusStartup(&GGlobals::GdiPlus, &gdiplusStartupInput, nullptr);
    if (status != Gdiplus::Ok) {
        std::cout << "GDI+ initialization failed." << std::endl;
    }
}

using FValueCallback = Napi::Value (*)(const Napi::CallbackInfo&);
using FVoidCallback = void (*)(const Napi::CallbackInfo&);

void ExportFunctions(Napi::Env& Environment, Napi::Object& Exports)
{
    const std::map<std::string, FValueCallback> ValueFunctions =
    {
        { "InitializeMonitors", InitializeMonitors },
        { "GetTileableWindows", GetTileableWindowsNode },
        { "GetMonitorFromWindow", GetMonitorFromWindow },
        { "GetWindowTitle", GetWindowTitle },
        { "GetScreenshot", GetScreenshot },
        { "GetDwmWindowRect", GetDwmWindowRectNode },
        { "CaptureScreenSectionToTempPngFile", CaptureScreenSectionToTempPngFile },
        { "GetMonitorFriendlyName", GetMonitorFriendlyName },
        { "GetApplicationFriendlyName", GetApplicationFriendlyName },
        { "BlurBackground", BlurBackground },
        { "GetNotepadHandles", GetNotepadHandles },
        { "WriteTaskbarIconToPng", WriteTaskbarIconToPng },
        { "GetMonitors", GetMonitors },
        { "GetFocusedWindow", GetFocusedWindow },
        { "GetWindowShape", GetWindowShape },
        { "CaptureWindowScreenshot", CaptureWindowScreenshot },
        { "GetTitlebarHeight", GetTitlebarHeight },
        { "GetWindowByName", GetWindowByName },
        { "GetIsLightMode", GetIsLightMode },
        { "GetThemeColor", GetThemeColor },
        { "GetRunOnStartup", GetRunOnStartup },
        { "GetIsElevated", GetIsElevated }
    };

    const std::map<std::string, FVoidCallback> VoidFunctions =
    {
        { "UpdateTiledList", UpdateTiledList },
        { "SetWindowPosition", SetWindowPosition },
        { "RestoreAllWindows", RestoreAllWindows },
        { "UnblurBackground", UnblurBackground },
        { "KillNotepadInstances", KillNotepadInstances },
        { "KillOrphans", KillOrphans },
        { "RestoreWindow", RestoreWindow },
        { "MinimizeWindow", MinimizeWindow },
        { "CloseApplication", CloseApplication },
        { "StealFocus", StealFocusNode },
        { "InitializeBorderManager", InitializeBorderManager },
        { "SendNativeIpc", SendNativeIpc },
        { "InitializeMessageLoop", InitializeMessageLoop },
        { "InitializeIpc", InitializeIpc },
        { "InitializeHooks", InitializeHooks },
        { "InitializeWinEvents", InitializeWinEvent },
        { "SetForegroundWindow", SetForegroundWindowNode },
        { "TestIpc", TestIpc },
        { "SetRunOnStartup", SetRunOnStartup }
    };

    for (auto [ Name, Pointer ] : ValueFunctions)
    {
        Exports.Set(
            Name,
            Napi::Function::New(Environment, Pointer)
        );
    }

    for (auto [ Name, Pointer ] : VoidFunctions)
    {
        Exports.Set(
            Name,
            Napi::Function::New(Environment, Pointer)
        );
    }
}

void InitializeTempDirectory()
{
    FWideString TempPath = GetTempPath();
    DWORD attributes = GetFileAttributesW(TempPath.c_str());

    if (attributes == INVALID_FILE_ATTRIBUTES)
    {
        if (CreateDirectoryW(TempPath.c_str(), NULL))
        {
            std::wcout << L"Directory created successfully: " << TempPath << std::endl;
        }
        else
        {
            std::wcerr << L"Error: Failed to create directory '" << TempPath << L"'. Error code: " << GetLastError() << std::endl;
        }
    }
    else if (attributes & FILE_ATTRIBUTE_DIRECTORY)
    {
        // std::wcout << L"Directory already exists: " << TempPath << std::endl;
    }
    else
    {
        std::wcerr << L"Error: The path '" << TempPath << L"' exists but is not a directory." << std::endl;
    }
}

Napi::Object Init(Napi::Env Environment, Napi::Object Exports)
{
    //  Set general COM security levels.
    HRESULT hr = CoInitializeSecurity(
        NULL,
        -1,
        NULL,
        NULL,
        RPC_C_AUTHN_LEVEL_PKT_PRIVACY,
        RPC_C_IMP_LEVEL_IMPERSONATE,
        NULL,
        0,
        NULL
    );

    if( FAILED(hr) )
    {
        std::cout << "CoInitializeSecurity failed: " << hr << std::endl;
        CoUninitialize();
    }

    ExportFunctions(Environment, Exports);
    InitializeTempDirectory();
    InitializeGdiPlus();

    return Exports;
}

NODE_API_MODULE(WindowsApi, Init)
