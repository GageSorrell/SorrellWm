
#include "./Window.h"

#include <dwmapi.h>

namespace
{
    std::optional<HWND> GetWindowArgument(
        const Napi::CallbackInfo& CallbackInfo,
        std::size_t Index = 0
    )
    {
        if (CallbackInfo.Length() <= Index || !CallbackInfo[Index].IsBigInt())
        {
            return std::nullopt;
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = CallbackInfo[Index]
            .As<Napi::BigInt>()
            .Uint64Value(&IsLossless);
        const HWND WindowHandle = reinterpret_cast<HWND>(
            static_cast<std::uintptr_t>(NumericHandle)
        );

        if (!IsLossless || WindowHandle == nullptr || IsWindow(WindowHandle) == FALSE)
        {
            return std::nullopt;
        }

        return WindowHandle;
    }

    Napi::Object RectangleToNapi(const Napi::Env& Environment, const RECT& Rectangle)
    {
        Napi::Object Box = Napi::Object::New(Environment);
        Box.Set("Bottom", Rectangle.bottom);
        Box.Set("Left", Rectangle.left);
        Box.Set("Right", Rectangle.right);
        Box.Set("Top", Rectangle.top);
        return Box;
    }

    std::optional<RECT> GetRectangleArgument(const Napi::Value& Value)
    {
        if (!Value.IsObject())
        {
            return std::nullopt;
        }

        const Napi::Object Box = Value.As<Napi::Object>();
        const Napi::Value Bottom = Box.Get("Bottom");
        const Napi::Value Left = Box.Get("Left");
        const Napi::Value Right = Box.Get("Right");
        const Napi::Value Top = Box.Get("Top");

        if (!Bottom.IsNumber() || !Left.IsNumber() ||
            !Right.IsNumber() || !Top.IsNumber())
        {
            return std::nullopt;
        }

        RECT Rectangle {
            Left.As<Napi::Number>().Int32Value(),
            Top.As<Napi::Number>().Int32Value(),
            Right.As<Napi::Number>().Int32Value(),
            Bottom.As<Napi::Number>().Int32Value()
        };

        if (Rectangle.right <= Rectangle.left || Rectangle.bottom <= Rectangle.top)
        {
            return std::nullopt;
        }

        return Rectangle;
    }

    bool IsManageableTopLevelWindow(HWND WindowHandle)
    {
        if (WindowHandle == nullptr || WindowHandle == GetShellWindow() ||
            IsWindowVisible(WindowHandle) == FALSE || IsIconic(WindowHandle) != FALSE)
        {
            return false;
        }

        DWORD ProcessId = 0;
        GetWindowThreadProcessId(WindowHandle, &ProcessId);
        if (ProcessId == 0 || ProcessId == GetCurrentProcessId())
        {
            return false;
        }

        const LONG_PTR Style = GetWindowLongPtrW(WindowHandle, GWL_STYLE);
        const LONG_PTR ExtendedStyle = GetWindowLongPtrW(WindowHandle, GWL_EXSTYLE);
        if ((Style & WS_CHILD) != 0 || (Style & WS_DISABLED) != 0 ||
            (Style & WS_CAPTION) == 0 || (Style & WS_THICKFRAME) == 0 ||
            (ExtendedStyle & WS_EX_NOACTIVATE) != 0 ||
            (ExtendedStyle & WS_EX_TOOLWINDOW) != 0)
        {
            return false;
        }

        if (GetWindow(WindowHandle, GW_OWNER) != nullptr &&
            (ExtendedStyle & WS_EX_APPWINDOW) == 0)
        {
            return false;
        }

        DWORD Cloaked = 0;
        if (SUCCEEDED(DwmGetWindowAttribute(
            WindowHandle,
            DWMWA_CLOAKED,
            &Cloaked,
            sizeof(Cloaked)
        )) && Cloaked != 0)
        {
            return false;
        }

        RECT Bounds { };
        return GetWindowRect(WindowHandle, &Bounds) != FALSE &&
            Bounds.right > Bounds.left && Bounds.bottom > Bounds.top;
    }

    BOOL CALLBACK CollectManageableTopLevelWindow(HWND WindowHandle, LPARAM ContextValue)
    {
        if (IsManageableTopLevelWindow(WindowHandle))
        {
            auto* Windows = reinterpret_cast<std::vector<HWND>*>(ContextValue);
            Windows->push_back(WindowHandle);
        }

        return TRUE;
    }
}

Napi::Value GetCursorPosition(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    POINT Position { };

    Result Out(Environment);

    if (GetCursorPos(&Position) == FALSE)
    {
        return Out.Fail("Could not get cursor position.");
    }

    return Out.Succeed(IntPoint(Position.x, Position.y).ToNapi(Environment));
}

Napi::Value GetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const HWND WindowHandle = GetForegroundWindow();

    if (WindowHandle == nullptr)
    {
        return Out.Fail("There is no foreground window.");
    }

    const auto NumericHandle = static_cast<std::uint64_t>(
        reinterpret_cast<std::uintptr_t>(WindowHandle)
    );

    return Out.Succeed(Napi::BigInt::New(Environment, NumericHandle));
}

Napi::Value GetManageableTopLevelWindows(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    std::vector<HWND> Windows;

    SetLastError(ERROR_SUCCESS);
    if (EnumWindows(
        CollectManageableTopLevelWindow,
        reinterpret_cast<LPARAM>(&Windows)
    ) == FALSE)
    {
        return Out.Fail("Could not enumerate top-level windows.");
    }

    Napi::Array Handles = Napi::Array::New(Environment, Windows.size());
    for (std::size_t Index = 0; Index < Windows.size(); ++Index)
    {
        const auto NumericHandle = static_cast<std::uint64_t>(
            reinterpret_cast<std::uintptr_t>(Windows[Index])
        );
        Handles.Set(
            static_cast<std::uint32_t>(Index),
            Napi::BigInt::New(Environment, NumericHandle)
        );
    }

    return Out.Succeed(Handles);
}

Napi::Value GetWindowRect_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    RECT Rectangle { };

    if (GetWindowRect(WindowHandle.value(), &Rectangle) == FALSE)
    {
        return Out.Fail("Could not get the window rectangle.");
    }

    return Out.Succeed(RectangleToNapi(Environment, Rectangle));
}

Napi::Value GetWindowText_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    SetLastError(ERROR_SUCCESS);
    const int TextLength = GetWindowTextLengthW(WindowHandle.value());

    if (TextLength == 0 && GetLastError() != ERROR_SUCCESS)
    {
        return Out.Fail("Could not get the window title length.");
    }

    if (TextLength == 0)
    {
        return Out.Succeed(Napi::String::New(Environment, ""));
    }

    std::wstring WindowText(static_cast<std::size_t>(TextLength) + 1, L'\0');
    SetLastError(ERROR_SUCCESS);
    const int CopiedLength = GetWindowTextW(
        WindowHandle.value(),
        WindowText.data(),
        TextLength + 1
    );

    if (CopiedLength == 0 && GetLastError() != ERROR_SUCCESS)
    {
        return Out.Fail("Could not get the window title.");
    }

    return Out.Succeed(Napi::String::New(
        Environment,
        reinterpret_cast<const char16_t*>(WindowText.data()),
        static_cast<std::size_t>(CopiedLength)
    ));
}

Napi::Value HasRoundedCorners(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid top-level window handle.");
    }

    if ((GetWindowLongPtrW(WindowHandle.value(), GWL_STYLE) & WS_CHILD) != 0)
    {
        return Out.Fail("Expected a top-level window handle.");
    }

    DWM_WINDOW_CORNER_PREFERENCE CornerPreference = DWMWCP_DEFAULT;
    const HRESULT QueryResult = DwmGetWindowAttribute(
        WindowHandle.value(),
        DWMWA_WINDOW_CORNER_PREFERENCE,
        &CornerPreference,
        sizeof(CornerPreference)
    );

    if (FAILED(QueryResult))
    {
        return Out.Fail("Could not query the window corner preference.");
    }

    switch (CornerPreference)
    {
        case DWMWCP_DONOTROUND:
            return Out.Succeed(Napi::Boolean::New(Environment, false));

        case DWMWCP_ROUND:
        case DWMWCP_ROUNDSMALL:
            return Out.Succeed(Napi::Boolean::New(Environment, true));

        case DWMWCP_DEFAULT:
        default:
            return Out.Fail("The window corner preference is indeterminate.");
    }
}

Napi::Value GetWindowWorkArea(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid top-level window handle.");
    }

    const HMONITOR Monitor = MonitorFromWindow(
        WindowHandle.value(),
        MONITOR_DEFAULTTONEAREST
    );
    MONITORINFO Information { };
    Information.cbSize = sizeof(Information);

    if (Monitor == nullptr || GetMonitorInfoW(Monitor, &Information) == FALSE)
    {
        return Out.Fail("Could not get the window monitor work area.");
    }

    return Out.Succeed(RectangleToNapi(Environment, Information.rcWork));
}

Napi::Value SetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    if (SetForegroundWindow(WindowHandle.value()) == FALSE)
    {
        return Out.Fail("Windows did not allow the window to become foreground.");
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value SetWindowRect(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 2)
    {
        return Out.Fail("Expected a window handle and a nonempty rectangle.");
    }

    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);
    const std::optional<RECT> Rectangle = GetRectangleArgument(CallbackInfo[1]);
    if (!WindowHandle.has_value() || !Rectangle.has_value())
    {
        return Out.Fail("Expected a valid window handle and a nonempty rectangle.");
    }

    if (IsZoomed(WindowHandle.value()) != FALSE)
    {
        ShowWindowAsync(WindowHandle.value(), SW_RESTORE);
    }

    const int Width = Rectangle->right - Rectangle->left;
    const int Height = Rectangle->bottom - Rectangle->top;
    const UINT Flags = SWP_ASYNCWINDOWPOS | SWP_NOACTIVATE |
        SWP_NOOWNERZORDER | SWP_NOZORDER;

    if (SetWindowPos(
        WindowHandle.value(),
        nullptr,
        Rectangle->left,
        Rectangle->top,
        Width,
        Height,
        Flags
    ) == FALSE)
    {
        return Out.Fail("Could not set the window rectangle.");
    }

    return Out.Succeed(Environment.Undefined());
}
