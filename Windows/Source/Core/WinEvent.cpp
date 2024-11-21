#include "WinEvent.h"

std::atomic<HWND> WindowToCover(nullptr);

void CALLBACK WinEventProc(HWINEVENTHOOK, DWORD event, HWND hwnd, LONG, LONG, DWORD, DWORD)
{
    // if (event != EVENT_OBJECT_CREATE || hwnd == nullptr)
    // {
    //     return;
    // }

    // // Get the window title
    // char title[256];
    // if (GetWindowTextA(hwnd, title, sizeof(title)) > 0)
    // {
    //     std::string windowTitle(title);

    //     if (windowTitle == "SorrellWm Main Window")
    //     {
    //         // @TODO ??
    //         // GGlobals::Ipc->Send("Main");

    //         if (WindowToCover != nullptr)
    //         {
    //             char WindowToCoverTitle[256];
    //             if (GetWindowTextA(WindowToCover, WindowToCoverTitle, sizeof(WindowToCoverTitle)) > 0)
    //             {
    //                 std::string windowTitle(WindowToCoverTitle);
    //                 std::cout << "Window to cover has name " << WindowToCoverTitle << "." << std::endl;
    //             }
    //         }
    //     }
    // }
}

Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    // if (info.Length() < 1 || !info[0].IsFunction())
    // {
    //     Napi::TypeError::New(env, "Expected a function as the first argument").ThrowAsJavaScriptException();
    //     return env.Null();
    // }

    // // Create a ThreadSafeFunction to call the provided JavaScript callback
    // Napi::Function jsCallback = info[0].As<Napi::Function>();
    // threadSafeCallback = Napi::ThreadSafeFunction::New(
    //     env,
    //     jsCallback,
    //     "Window Monitoring Callback",
    //     0,
    //     1
    // );

    // Set up the event hook
    eventHook = SetWinEventHook(
        EVENT_OBJECT_CREATE,   // Event type
        EVENT_OBJECT_CREATE,   // Same for the end range
        nullptr,               // No DLL handle
        WinEventProc,          // Callback function
        0,                     // Monitor all processes
        0,                     // Monitor all threads
        WINEVENT_OUTOFCONTEXT  // Hook type
    );

    if (!eventHook)
    {
        Napi::Error::New(env, "Failed to set up event hook").ThrowAsJavaScriptException();
        return env.Null();
    }

    // return Napi::Boolean::New(env, true);
    return env.Undefined();
}

// Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& info)
// {
//     Napi::Env env = info.Env();

//     if (info.Length() < 1 || !info[0].IsFunction())
//     {
//         Napi::TypeError::New(env, "Expected a function as the first argument").ThrowAsJavaScriptException();
//         return env.Null();
//     }

//     // Create a ThreadSafeFunction to call the provided JavaScript callback
//     Napi::Function jsCallback = info[0].As<Napi::Function>();
//     threadSafeCallback = Napi::ThreadSafeFunction::New(
//         env,
//         jsCallback,
//         "Window Monitoring Callback",
//         0,
//         1
//     );

//     // Set up the event hook
//     eventHook = SetWinEventHook(
//         EVENT_OBJECT_CREATE,   // Event type
//         EVENT_OBJECT_CREATE,   // Same for the end range
//         nullptr,               // No DLL handle
//         WinEventProc,          // Callback function
//         0,                     // Monitor all processes
//         0,                     // Monitor all threads
//         WINEVENT_OUTOFCONTEXT  // Hook type
//     );

//     if (!eventHook)
//     {
//         Napi::Error::New(env, "Failed to set up event hook").ThrowAsJavaScriptException();
//         return env.Null();
//     }

//     return Napi::Boolean::New(env, true);
// }

// @TODO Register this in `Initialization.cpp`
void FWinEvent::OnExit(void* _)
{
    if (eventHook)
    {
        UnhookWinEvent(eventHook);
        eventHook = nullptr;

        // Release the ThreadSafeFunction
        // threadSafeCallback.Release();
    }
}

Napi::Value FWinEvent::CoverWindow(const Napi::CallbackInfo& Information)
{
    const Napi::Env Environment = Information.Env();

    HWND WindowToCoverHandle = DecodeHandle(Information[0].As<Napi::Object>());

    LPCSTR WindowName = "SorrellWm Main Window";
    HWND SorrellWmMainWindow = FindWindow(NULL, WindowName);

    if (SorrellWmMainWindow == nullptr)
    {
        std::cout << "SorrellWmMainWindow was the nullptr." << std::endl;
    }

    RECT clientRect;
    if (!GetClientRect(WindowToCoverHandle, &clientRect)) {
    // if (!GetWindowRect(WindowToCoverHandle, &clientRect)) {
        std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    }

    RECT MainClientRect;
    if (!GetClientRect(SorrellWmMainWindow, &MainClientRect)) {
        std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    }

    // Convert client coordinates to screen coordinates
    POINT topLeft = { clientRect.left, clientRect.top };
    if (!ClientToScreen(WindowToCoverHandle, &topLeft)) {
        std::cerr << "ClientToScreen failed. Error: " << GetLastError() << std::endl;
    }

    std::cout << clientRect.left << std::endl << clientRect.top << std::endl << clientRect.bottom << std::endl << clientRect.right << std::endl;

    UINT Dpi = GetDpiForWindow(WindowToCoverHandle);
    // const int TitleBarHeight = GetSystemMetrics(SM_CYCAPTION);

    // Calculate scaling factor
    double ScalingFactor = static_cast<double>(Dpi) / 96.0;

    // Retrieve title bar height and frame thickness
    const int TitleBarHeight = static_cast<int>(GetSystemMetrics(SM_CYCAPTION) * ScalingFactor);
    const int FrameWidth = static_cast<int>(GetSystemMetrics(SM_CXFRAME) * ScalingFactor);
    const int FrameHeight = static_cast<int>(GetSystemMetrics(SM_CYFRAME) * ScalingFactor);

    BOOL enabled = TRUE; // TRUE to disable transitions
    HRESULT hr = DwmSetWindowAttribute(SorrellWmMainWindow, DWMWA_TRANSITIONS_FORCEDISABLED, &enabled, sizeof(enabled));
    std::cout << "Result: " << SUCCEEDED(hr) << std::endl;

    // SetWindowPos(
    //     SorrellWmMainWindow,
    //     nullptr,
    //     MainClientRect.left,
    //     MainClientRect.top,
    //     clientRect.right - clientRect.left + 2 * FrameWidth,
    //     clientRect.bottom - clientRect.top + TitleBarHeight + 2 * FrameHeight,
    //     SWP_SHOWWINDOW
    // );

    SetForegroundWindow(SorrellWmMainWindow);
    SetWindowPos(
        SorrellWmMainWindow,
        nullptr,
        clientRect.left + topLeft.x - FrameWidth,
        clientRect.top + topLeft.y - TitleBarHeight - FrameHeight,
        clientRect.right - clientRect.left + 2 * FrameWidth,
        clientRect.bottom - clientRect.top + TitleBarHeight + 2 * FrameHeight,
        SWP_SHOWWINDOW
    );
}

Napi::Value FWinEvent::Test(const Napi::CallbackInfo& Information)
{
    const Napi::Env Environment = Information.Env();

    std::cout << "Test!" << std::endl;

    LPCSTR WindowName = "SorrellWm Main Window";
    HWND SorrellWmMainWindow = FindWindow(NULL, WindowName);

    if (SorrellWmMainWindow == nullptr)
    {
        std::cout << "SorrellWmMainWindow was the nullptr." << std::endl;
    }

    RECT MainClientRect;
    if (!GetClientRect(SorrellWmMainWindow, &MainClientRect)) {
        std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    }

    // BOOL enabled = TRUE; // TRUE to disable transitions
    // HRESULT hr = DwmSetWindowAttribute(SorrellWmMainWindow, DWMWA_TRANSITIONS_FORCEDISABLED, &enabled, sizeof(enabled));
    // std::cout << "Result: " << SUCCEEDED(hr) << std::endl;
    std::cout << "Test will SetWindowPos..." << std::endl;

    SetForegroundWindow(SorrellWmMainWindow);
    // SetWindowPos(
    //     SorrellWmMainWindow,
    //     nullptr,
    //     50,
    //     50,
    //     600,
    //     600,
    //     SWP_SHOWWINDOW | SWP_NOMOVE
    // );
    SetWindowPos(
        SorrellWmMainWindow,
        nullptr,
        50,
        50,
        600,
        600,
        SWP_SHOWWINDOW
    );


    return Environment.Undefined();
}

Napi::Value FWinEvent::TestTwo(const Napi::CallbackInfo& Information)
{
    const Napi::Env Environment = Information.Env();

    std::cout << "Test!" << std::endl;

    LPCSTR WindowName = "SorrellWm Main Window";
    HWND SorrellWmMainWindow = FindWindow(NULL, WindowName);

    if (SorrellWmMainWindow == nullptr)
    {
        std::cout << "SorrellWmMainWindow was the nullptr." << std::endl;
    }

    RECT MainClientRect;
    if (!GetClientRect(SorrellWmMainWindow, &MainClientRect)) {
        std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    }

    // BOOL enabled = TRUE; // TRUE to disable transitions
    // HRESULT hr = DwmSetWindowAttribute(SorrellWmMainWindow, DWMWA_TRANSITIONS_FORCEDISABLED, &enabled, sizeof(enabled));
    // std::cout << "Result: " << SUCCEEDED(hr) << std::endl;
    std::cout << "Test will SetWindowPos..." << std::endl;

    SetWindowPos(
        SorrellWmMainWindow,
        nullptr,
        50,
        50,
        600,
        600,
        SWP_SHOWWINDOW | SWP_NOMOVE
    );

    return Environment.Undefined();
}
