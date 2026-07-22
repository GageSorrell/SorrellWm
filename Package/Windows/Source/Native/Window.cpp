
#include "./Window.h"

#include <dwmapi.h>

namespace
{
    std::optional<HWND> GetWindowArgument(const Napi::CallbackInfo& CallbackInfo)
    {
        if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsBigInt())
        {
            return std::nullopt;
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = CallbackInfo[0]
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

    Napi::Object Box = Napi::Object::New(Environment);
    Box.Set("Bottom", Rectangle.bottom);
    Box.Set("Left", Rectangle.left);
    Box.Set("Right", Rectangle.right);
    Box.Set("Top", Rectangle.top);

    return Out.Succeed(Box);
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
