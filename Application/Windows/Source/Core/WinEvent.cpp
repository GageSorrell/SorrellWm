#include "WinEvent.h"

std::atomic<HWND> WindowToCover(nullptr);

void FWinEvent::DispatchFromEventProc(DWORD Event)
{
    GGlobals::WinEvent->Dispatch(Event);
}

void CALLBACK WinEventProc(HWINEVENTHOOK, DWORD Event, HWND Handle, LONG, LONG, DWORD, DWORD)
{
    FWinEvent::DispatchFromEventProc(Event);
}

Napi::Value FWinEvent::Initialize(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    // Set up the event hook
    eventHook = SetWinEventHook(
        EVENT_OBJECT_CREATE,
        EVENT_OBJECT_CREATE,
        nullptr,
        WinEventProc,
        0,
        0,
        WINEVENT_OUTOFCONTEXT
    );

    if (!eventHook)
    {
        Napi::Error::New(Environment, "Failed to set up event hook").ThrowAsJavaScriptException();
        return Environment.Null();
    }

    return Environment.Undefined();
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
    if (FWinEvent::eventHook)
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
    DwmGetWindowAttribute(WindowToCoverHandle, DWMWA_EXTENDED_FRAME_BOUNDS, &clientRect, sizeof(clientRect));
    // if (!GetClientRect(WindowToCoverHandle, &clientRect)) {
    // // if (!GetWindowRect(WindowToCoverHandle, &clientRect)) {
    //     std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    // }

    RECT MainClientRect;
    if (!GetClientRect(SorrellWmMainWindow, &MainClientRect)) {
        std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    }

    POINT topLeft = { clientRect.left, clientRect.top };

    // BOOL TransitionsDisabled = TRUE;
    // HRESULT hr = DwmSetWindowAttribute(SorrellWmMainWindow, DWMWA_TRANSITIONS_FORCEDISABLED, &TransitionsDisabled, sizeof(TransitionsDisabled));

    // SetForegroundWindow(SorrellWmMainWindow);
    // Shift everything by one since the screenshot clips the window by 1 pixel

    std::cout << "Wee Woo " << clientRect.left << " " << clientRect.top << std::endl;
    SetWindowPos(
        SorrellWmMainWindow,
        nullptr,
        clientRect.left,
        clientRect.top,
        clientRect.right - clientRect.left,
        clientRect.bottom - clientRect.top,
        // clientRect.left + topLeft.x - FrameWidth,
        // clientRect.top + topLeft.y - TitleBarHeight - FrameHeight,
        // clientRect.right - clientRect.left + 2 * FrameWidth,
        // clientRect.bottom - clientRect.top + TitleBarHeight + 2 * FrameHeight,
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
