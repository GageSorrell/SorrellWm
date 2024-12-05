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
#include "Core/WindowUtilities.h"
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

/* BEGIN AUTO-GENERATED REGION: INCLUDES. */
/* END AUTO-GENERATED REGION. */

// using namespace Utilities;

// std::map<std::string, HWND> WindowHandleMap;
// std::map<std::string, HMONITOR> MonitorHandleMap;

// std::string GetLastErrorAsString()
// {
//     DWORD ErrorMessageID = ::GetLastError();

//     if (ErrorMessageID == 0)
//     {
//         return STRING_ERROR;
//     }

//     LPSTR MessageBuffer = nullptr;

//     size_t Size = FormatMessageA(
//         FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS,
//         NULL,
//         ErrorMessageID,
//         MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
//         (LPSTR) &MessageBuffer,
//         0,
//         NULL
//     );

//     std::string Message(MessageBuffer, Size);

//     LocalFree(MessageBuffer);

//     return Message;
// }

// BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM LParam)
// {
//     std::vector<HWND>* Handles = reinterpret_cast<std::vector<HWND>*>(LParam);
//     Handles->push_back(hwnd);
//     LPWSTR WindowText = L"Dummy";
//     std::wstring Title;
//     Title.reserve(GetWindowTextLength(hwnd) + 1);
//     GetWindowTextW(hwnd, const_cast<WCHAR *>(Title.c_str()), Title.capacity());

//     return TRUE;
// }

// Napi::Value BigIntFromCallback(const Napi::CallbackInfo& Information, const Napi::Env& Environment, int Index = 0)
// {
//     if (Information.Length() < Index + 1 || !Information[Index].IsBigInt())
//     {
//         Napi::TypeError::New(Environment, "Expected a number.").ThrowAsJavaScriptException();
//         return Environment.Null();
//     }

//     return Information[Index].As<Napi::BigInt>();
// }

// Napi::Value GetWindowTextNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     // std::string hwndStr = Information[0].As<Napi::Object>().Utf8Value();
//     // HWND Handle = WindowHandleMap[hwndStr];
//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     const int BufferSize = 256;
//     wchar_t Title[BufferSize];
//     GetWindowTextW(Handle, Title, BufferSize);

//     // std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
//     // std::string utf8String = converter.to_bytes(Title);
//     std::string WindowText;
//     String::FromWide(Title, WindowText);

//     if (WindowText == "")
//     {
//         WindowText = NAME_NONE;
//     }

//     return Napi::String::New(Environment, WindowText);
// }

// Napi::Value GetMonitorRefreshRate(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();
//     HMONITOR Handle = FromNode::Monitor(Information, MonitorHandleMap);
//     MONITORINFOEX monitorInfo;
//     monitorInfo.cbSize = sizeof(MONITORINFOEX);
//     GetMonitorInfo(Handle, &monitorInfo);

//     DEVMODE devMode;
//     devMode.dmSize = sizeof(DEVMODE);
//     devMode.dmDriverExtra = 0;

//     if (EnumDisplaySettings(monitorInfo.szDevice, ENUM_CURRENT_SETTINGS, &devMode))
//     {
//         std::cout << "Got Refresh Rate from C++, " << devMode.dmDisplayFrequency << std::endl;
//         return Napi::Number::New(Environment, devMode.dmDisplayFrequency);
//     }

//     std::cout << "No refresh rate found." << std::endl;
//     return Napi::Number::New(Environment, -1);
// }

// Napi::Value DisableStyling(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);
//     // LONG_PTR ExtendedStyle = GetWindowLongPtr(Handle, GWL_EXSTYLE);
//     // ExtendedStyle &= ~WS_EX_LAYERED;
//     // const bool Success = SetWindowLongPtr(Handle, GWL_EXSTYLE, ExtendedStyle);

//     BOOL Attribute = TRUE;
//     DwmSetWindowAttribute(Handle, DWMWA_TRANSITIONS_FORCEDISABLED, &Attribute, sizeof(Attribute));

//     return Napi::Boolean::New(Environment, true);
// }

// Napi::Value GetWindowHandles(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     std::vector<HWND> Handles;
//     EnumWindows(EnumWindowsProc, reinterpret_cast<LPARAM>(&Handles));

//     const int BufferSize = 256;
//     TCHAR Title[BufferSize];
//     if (GetWindowText(Handles[0], Title, BufferSize) > 0)
//     {
//         std::wcout << L"Handle has title " << Title << std::endl;
//     }
//     else
//     {
//         std::cout << "Handle 0 had no title." << std::endl;
//     }

//     Napi::Array Array = Napi::Array::New(Environment, Handles.size());

//     for (uint32_t Index = 0; Index < Handles.size(); Index++)
//     {
//         Napi::Object WrappedHandle = ToNode::Window(Environment, WindowHandleMap, Handles[Index]);
//         Array.Set(Index, WrappedHandle);
//     }

//     return Array;
// }

// Napi::Value IsIconicNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     return Napi::Boolean::New(Environment, IsIconic(Handle));
// }

// Napi::Value IsWindowVisibleNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     return Napi::Boolean::New(Environment, IsWindowVisible(Handle));
// }

// Napi::Value GetStyles(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     return Napi::BigInt::New(Environment, GetWindowLongPtr(Handle, GWL_STYLE));
// }

// Napi::FunctionReference OnWindowFocusNodeCallback;

// void OnWindowFocus(HWND Handle)
// {
//     Napi::Env Environment = OnWindowFocusNodeCallback.Env();
//     Napi::HandleScope Scope(Environment);

//     OnWindowFocusNodeCallback.Call({ ToNode::Window(Environment, WindowHandleMap, Handle) });
// }

// /** Currently-global value for the hook that listens for a window gaining focus. */
// HHOOK Hook;

// LRESULT CALLBACK CBTProc(int NCode, WPARAM WParam, LPARAM LParam)
// {
//     if (NCode == HCBT_SETFOCUS)
//     {
//         OnWindowFocus((HWND)WParam);
//     }
//     return CallNextHookEx(NULL, NCode, WParam, LParam);
// }

// Napi::Value SetupFocusHook(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HHOOK Hook = SetWindowsHookEx(
//         WH_CBT,
//         CBTProc,
//         NULL,
//         0
//     );

//     if (Hook == NULL)
//     {
//         // @TODO Handle the error
//     }

//     Napi::Function Callback = Information[0].As<Napi::Function>();
//     OnWindowFocusNodeCallback = Napi::Persistent(Callback);

//     return Environment.Undefined();
// }

// Napi::Value RemoveFocusHook(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     if (Hook != NULL)
//     {
//         UnhookWindowsHookEx(Hook);
//         Hook = NULL;
//     }

//     return Environment.Undefined();
// }

// /**
//  * Get the RECT of a window, excluding the drop shadow.
//  */
// bool GetWindowBounds(HWND Handle, RECT* WindowRect, bool ScreenSpace = true)
// {
//     bool Success = true;

//     RECT DwmRect;
//     RECT WinRect;

//     HRESULT Result = DwmGetWindowAttribute(
//         Handle,
//         DWMWA_EXTENDED_FRAME_BOUNDS,
//         &DwmRect,
//         sizeof(DwmRect)
//     );

//     if (FAILED(Result))
//     {
//         Success = GetWindowRect(Handle, &WinRect);
//     }
//     else
//     {
//         MONITORINFO MonitorInfo = { sizeof(MonitorInfo) };
//         HMONITOR Monitor = MonitorFromWindow(Handle, MONITOR_DEFAULTTONEAREST);
//         GetMonitorInfo(Monitor, &MonitorInfo);
//         WindowRect->bottom = DwmRect.bottom + MonitorInfo.rcMonitor.bottom;
//         WindowRect->left = DwmRect.left + MonitorInfo.rcMonitor.left;
//         WindowRect->right = DwmRect.right + MonitorInfo.rcMonitor.right;
//         WindowRect->top = DwmRect.top + MonitorInfo.rcMonitor.top;
//         // if (ScreenSpace)
//         // {
//         //     WindowRect = &DwmRect;
//         // }
//         // else if (Success)
//         // {
//         //     // MONITORINFO MonitorInfo = { sizeof(MonitorInfo) };
//         //     // HMONITOR Monitor = MonitorFromWindow(Handle, MONITOR_DEFAULTTONEAREST);
//         //     // GetMonitorInfo(Monitor, &MonitorInfo);
//         //     // WindowRect->bottom = DwmRect.bottom - WinRect.bottom - MonitorInfo.rcMonitor.bottom;
//         //     // WindowRect->left = DwmRect.left - WinRect.left - MonitorInfo.rcMonitor.left;
//         //     // WindowRect->right = DwmRect.right - WinRect.right - MonitorInfo.rcMonitor.right;
//         //     // WindowRect->top = DwmRect.top - WinRect.top - MonitorInfo.rcMonitor.top;
//         // }
//     }

//     return Success;
// }

// Napi::Value GetDwmMargins(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();
//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     RECT DwmRect;
//     RECT WinRect;

//     HRESULT Result = DwmGetWindowAttribute(
//         Handle,
//         DWMWA_EXTENDED_FRAME_BOUNDS,
//         &DwmRect,
//         sizeof(DwmRect)
//     );

//     GetWindowRect(Handle, &WinRect);

//     RECT OutRect;
//     OutRect.bottom = DwmRect.bottom - WinRect.bottom;
//     OutRect.right = DwmRect.right - WinRect.right;
//     OutRect.left = WinRect.left - DwmRect.left;
//     OutRect.top = WinRect.top - DwmRect.top;

//     return ToNode::Rect(Environment, OutRect);
// }

// Napi::Value SetWindowPosNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);
//     int X = Information[1].As<Napi::Number>();
//     int Y = Information[2].As<Napi::Number>();
//     int Width = Information[3].As<Napi::Number>();
//     int Height = Information[4].As<Napi::Number>();

//     MONITORINFO MonitorInfo = { sizeof(MonitorInfo) };
//     HMONITOR Monitor = MonitorFromWindow(Handle, MONITOR_DEFAULTTONEAREST);
//     GetMonitorInfo(Monitor, &MonitorInfo);

//     RECT WindowRect;
//     const bool HasRect = GetWindowBounds(Handle, &WindowRect, true);
//     if (HasRect)
//     {
//         const bool Result = SetWindowPos(
//             Handle,
//             nullptr,
//             X + MonitorInfo.rcMonitor.left,
//             Y + MonitorInfo.rcMonitor.top,
//             Width,
//             Height,
//             SWP_NOACTIVATE
//         );

//         if (!Result)
//         {
//             std::wstring Title;
//             Title.reserve(GetWindowTextLength(Handle) + 1);
//             GetWindowTextW(Handle, const_cast<WCHAR *>(Title.c_str()), Title.capacity());
//             std::string LogString;
//             String::FromWide(Title.c_str(), LogString);
//             std::cout << "SetWindowPos Error: " << GetLastErrorAsString() << " on window " << LogString << std::endl;
//         }
//         else
//         {
//             std::cout << "SetWindowPos was successful!" << std::endl;
//         }

//         return Napi::Boolean::New(Environment, Result);
//     }
//     else
//     {
//         std::cout << "Rect is the nullptr." << std::endl;
//     }

//     std::cout << GetLastErrorAsString() << std::endl;

//     return Napi::Boolean::New(Environment, false);
// }

// Napi::Value GetWindowBoundsNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();
//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     RECT OutRect = { 0 };

//     const bool Success = GetWindowRect(Handle, &OutRect);

//     return ToNode::Rect(Environment, OutRect);
// }

// // Napi::Value MoveWindowNode(const Napi::CallbackInfo& Information)
// // {
// //     Napi::Env Environment = Information.Env();

// //     HWND Handle = FromNode::Window(Information, WindowHandleMap);
// //     int X = Information[1].As<Napi::Number>();
// //     int Y = Information[2].As<Napi::Number>();
// //     int Width = Information[3].As<Napi::Number>();
// //     int Height = Information[4].As<Napi::Number>();

// //     const bool Result = MoveWindow(
// //         Handle,
// //         X,
// //         Y,
// //         Width,
// //         Height,
// //         true
// //     );

// //     std::cout << GetLastErrorAsString() << std::endl;

// //     return Napi::Boolean::New(Environment, Result);
// // }

// BOOL MonitorEnumProc(HMONITOR Handle, HDC _Hdc, LPRECT _LpRect, LPARAM InArray)
// {
//     std::vector<HMONITOR>* Handles = reinterpret_cast<std::vector<HMONITOR>*>(InArray);
//     Handles->push_back(Handle);

//     return TRUE;
// }

// Napi::Value GetMonitorHandles(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     std::vector<HMONITOR> Handles;
//     EnumDisplayMonitors(nullptr, nullptr, MonitorEnumProc, reinterpret_cast<LPARAM>(&Handles));

//     Napi::Array Array = Napi::Array::New(Environment);
//     for(HMONITOR Handle : Handles)
//     {
//         Array.Set(Array.Length(), ToNode::Monitor(Environment, MonitorHandleMap, Handle));
//     }

//     return Array;
// }

// Napi::Value GetMonitorInfoNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HMONITOR Handle = FromNode::Monitor(Information, MonitorHandleMap);

//     MONITORINFOEX MonitorInfo;
//     MonitorInfo.cbSize = sizeof(MONITORINFOEX);

//     const bool Success = GetMonitorInfo(Handle, &MonitorInfo);

//     if (Success)
//     {
//         Napi::Object OutObject = Napi::Object::New(Environment);
//         std::string DeviceName;
//         OutObject.Set("Name", Napi::String::New(Environment, std::string(MonitorInfo.szDevice)));
//         OutObject.Set("Rectangle", ToNode::Rect(Environment, MonitorInfo.rcMonitor));
//         OutObject.Set("WorkArea", ToNode::Rect(Environment, MonitorInfo.rcWork));
//         OutObject.Set("IsPrimary", Napi::Boolean::New(Environment, MonitorInfo.dwFlags & MONITORINFOF_PRIMARY));

//         return OutObject;
//     }
//     else
//     {
//         return Environment.Undefined();
//     }
// }

// Napi::Value MonitorFromRectNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     RECT Rect = FromNode::Rect(Information);

//     HMONITOR Monitor = MonitorFromRect(&Rect, MONITOR_DEFAULTTONEAREST);

//     return ToNode::Monitor(Environment, MonitorHandleMap, Monitor);
// }

// Napi::Value RestoreWindowNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);

//     ShowWindow(Handle, SW_RESTORE);

//     return Environment.Undefined();
// }

// Napi::Value GetWindowClassInfo(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND Handle = FromNode::Window(Information, WindowHandleMap);
//     WNDCLASSEX ClassInfo;
//     ClassInfo.cbSize = sizeof(WNDCLASSEX);

//     // std::wstring ClassName;
//     // ClassName.reserve(512);

//     CHAR ClassName[512];

//     GetClassName(Handle, ClassName, 512);
//     GetClassInfoEx(nullptr, ClassName, &ClassInfo);

//     return Napi::BigInt::New(Environment, (uint64_t) ClassInfo.style);
// }

// Napi::Value MonitorFromWindowNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND WindowHandle = FromNode::Window(Information, WindowHandleMap);

//     HMONITOR MonitorHandle = MonitorFromWindow(WindowHandle, MONITOR_DEFAULTTONEAREST);

//     return ToNode::Monitor(Environment, MonitorHandleMap, MonitorHandle);
// }

// LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
// {
//     // switch (uMsg)
//     // {
//     //     // Handle different messages here
//     //     case WM_DESTROY:
//     //         return 0;
//     //     // More cases as needed...
//     // }
//     return DefWindowProc(hwnd, uMsg, wParam, lParam);
// }

// void RegisterHotKeys()
// {
//     if (RegisterHotKey(nullptr, 1, 0, VK_F22))
//     {
//         std::cout << "Registered HotKey F22!" << std::endl;
//     }
// }

// Napi::Value GetForegroundWindowNode(const Napi::CallbackInfo& Information)
// {
//     Napi::Env Environment = Information.Env();

//     HWND FocusedWindow = GetForegroundWindow();

//     return ToNode::Window(Environment, WindowHandleMap, FocusedWindow);
// }

Napi::Value GetMe(const Napi::CallbackInfo& Information)
{
    Napi::Env Environment = Information.Env();
    return Napi::String::New(Environment, "CalledBack");
}

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

    // @TODO Find better place to register listeners
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

    /* BEGIN AUTO-GENERATED REGION: EXPORTS. */
    const std::map<std::string, FFunctionPointer> FunctionDefinitions =
    {
        { "GetMe", GetMe },
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
        { "TestFun", TestFun },
        { "GetIsLightMode", GetIsLightMode },
        { "CoverWindow", FWinEvent::CoverWindow },
        { "GetThemeColor", GetThemeColor },
        { "Test", FWinEvent::Test },
        { "TestTwo", FWinEvent::TestTwo }
        // { "GetMonitorFromRect", MonitorFromRectNode },
        // { "GetMonitorFromWindow", MonitorFromWindowNode },
        // { "GetMonitorHandles", GetMonitorHandles },
        // { "GetMonitorInfo", GetMonitorInfoNode },
        // { "GetStyles", GetStyles },
        // { "GetForegroundWindow", GetForegroundWindowNode },
        // { "GetWindowBounds", GetWindowBoundsNode },
        // { "GetWindowHandles", GetWindowHandles },
        // { "GetWindowText", GetWindowTextNode },
        // { "IsIconic", IsIconicNode },
        // { "InitializeWindowProcedure", InitializeWindowProcedure },
        // { "IsWindowVisible", IsWindowVisibleNode },
        // // { "MoveWindow", MoveWindowNode },
        // { "RemoveFocusHook", RemoveFocusHook },
        // { "RestoreWindow", RestoreWindowNode },
        // { "SetupFocusHook", SetupFocusHook },
        // { "SetWindowPos", SetWindowPosNode },
        // { "GetWindowClassInfo", GetWindowClassInfo },
        // { "DisableStyling", DisableStyling },
        // { "GetDwmMargins", GetDwmMargins },
        // { "GetMonitorRefreshRate", GetMonitorRefreshRate }
    };
    /* END AUTO-GENERATED REGION. */

    for(const std::pair<std::string, FFunctionPointer> FunctionDefinition : FunctionDefinitions)
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

    if (attributes == INVALID_FILE_ATTRIBUTES) {
        // Directory does not exist; attempt to create it
        if (CreateDirectoryW(TempPath.c_str(), NULL)) {
            std::wcout << L"Directory created successfully: " << TempPath << std::endl;
        } else {
            std::wcerr << L"Error: Failed to create directory '" << TempPath << L"'. Error code: " << GetLastError() << std::endl;
        }
    } else if (attributes & FILE_ATTRIBUTE_DIRECTORY) {
        // Directory already exists
        std::wcout << L"Directory already exists: " << TempPath << std::endl;
    } else {
        // Path exists but is not a directory
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
