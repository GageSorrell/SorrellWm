/* File:      Initialization.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* This is the least value that enables experimental features, such as BigInt support. */
#ifdef NAPI_VERSION
    #undef NAPI_VERSION
    #define NAPI_VERSION 2147483647
#endif

#include "Core/Core.h"
#include "Core/InterProcessCommunication.h"
#include "Core/WinEvent.h"
#include "Core/Hook.h"
#include "Core/WindowUtilities.h"
#include "Core/MonitorUtilities.h"
#include "Keyboard.h"
#include "MessageLoop/MessageLoop.h"
#include "Core/Globals.h"
#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <dwmapi.h>
#include <codecvt>
#include <map>

#include "BlurBackground.h"
#include "BlurBackground_DEPRECATED.h"
#include "Screenshot.h"
#include "Core/WindowUtilities.h"

/* BEGIN AUTO-GENERATED REGION: INCLUDES. */
/* END AUTO-GENERATED REGION. */

Napi::Value InitializeIpc(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();

    Napi::Function Callback = Information[0].As<Napi::Function>();

    GGlobals::Ipc = new FIpc(Environment, Callback);
}

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
Napi::Value InitializeHooks(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();
    GGlobals::Hook = new FHook();
    napi_add_env_cleanup_hook(Environment, HooksExitCleanup, nullptr);
    napi_add_env_cleanup_hook(Environment, ShutdownGdiPlus, nullptr);

    GGlobals::WinEvent = new FWinEvent();
    // InitializeBlurBackground();

    /* @TODO Find better place to register listeners */
    RegisterActivationKey();

    return Environment.Undefined();
}

Napi::Value InitializeMessageLoop(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();

    /** We have to pass a callback function to the AsyncWorker. */
    const Napi::Function EmptyCallback = Information[0].As<Napi::Function>();

    GGlobals::MessageLoop = new FMessageLoop(EmptyCallback);
    GGlobals::MessageLoop->Queue();

    return Environment.Undefined();
}

void InitializeGdiPlus()
{
    Gdiplus::GdiplusStartupInput gdiplusStartupInput;
    Gdiplus::Status status = Gdiplus::GdiplusStartup(&GGlobals::GdiPlus, &gdiplusStartupInput, nullptr);
    if (status != Gdiplus::Ok) {
        std::cout << "GDI+ initialization failed." << std::endl;
    }
}

void ExportFunctions(Napi::Env& Environment, Napi::Object& Exports)
{
    typedef Napi::Value (*FFunctionPointer)(const Napi::CallbackInfo&);

    const std::map<std::string, FFunctionPointer> FunctionDefinitions =
    {
        { "InitializeMonitors", InitializeMonitors },
        { "GetTileableWindows", GetTileableWindows },
        { "SetWindowPosition", SetWindowPosition },
        { "GetMonitorFromWindow", GetMonitorFromWindow },
        { "GetWindowTitle", GetWindowTitle },
        { "GetScreenshot", GetScreenshot },
        { "GetDwmWindowRect", GetDwmWindowRectNode },
        { "CaptureScreenSectionToTempPngFile", CaptureScreenSectionToTempPngFile },
        { "GetMonitorFriendlyName", GetMonitorFriendlyName },
        { "GetApplicationFriendlyName", GetApplicationFriendlyName },
        { "RestoreAllWindows", RestoreAllWindows },
        { "BlurBackground", BlurBackground },
        { "UnblurBackground", UnblurBackground },
        { "BlurBackground_DEPRECATED", BlurBackground_DEPRECATED },
        { "UnblurBackground_DEPRECATED", UnblurBackground_DEPRECATED },
        /* BEGIN AUTO-GENERATED REGION: EXPORTS. */
        { "InitializeMessageLoop", InitializeMessageLoop },
        { "InitializeIpc", InitializeIpc },
        { "InitializeHooks", InitializeHooks },
        { "InitializeWinEvents", FWinEvent::Initialize },
        { "GetFocusedWindow", GetFocusedWindow },
        { "GetWindowLocationAndSize", GetWindowLocationAndSize },
        { "CaptureWindowScreenshot", CaptureWindowScreenshot },
        { "GetTitlebarHeight", GetTitlebarHeight },
        { "GetWindowByName", GetWindowByName },
        { "SetForegroundWindow", SetForegroundWindowNode },
        { "GetIsLightMode", GetIsLightMode },
        { "GetThemeColor", GetThemeColor },
        /* END AUTO-GENERATED REGION. */
    };

    for (const std::pair<std::string, FFunctionPointer> FunctionDefinition : FunctionDefinitions)
    {
        Exports.Set(
            FunctionDefinition.first,
            Napi::Function::New(Environment, FunctionDefinition.second)
        );
    }
}

void InitializeTempDirectory()
{
    std::wstring TempPath = GetTempPath();
    // Step 3: Check if the directory exists
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
        std::wcout << L"Directory already exists: " << TempPath << std::endl;
    }
    else
    {
        std::wcerr << L"Error: The path '" << TempPath << L"' exists but is not a directory." << std::endl;
    }
}

Napi::Object Init(Napi::Env Environment, Napi::Object Exports)
{
    ExportFunctions(Environment, Exports);
    InitializeTempDirectory();
    InitializeGdiPlus();

    return Exports;
}

NODE_API_MODULE(WindowsApi, Init)
