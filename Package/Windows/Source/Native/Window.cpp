
#include "./Window.h"

Napi::Value GetCursorPosition(Napi::Env Environment, const Napi::CallbackInfo& CallbackInfo)
{
    POINT Position { };

    Result Out(Environment);

    if (GetCursorPos(&Position) == FALSE)
    {
        return OutResult.Fail("Could not get cursor position.");
    }

    return Out.Succeed(IntPoint(Position.x, Position.y).ToNapi(Environment));
}

Napi::Value GetForegroundWindow_Node(Napi::Env Environment, const Napi::CallbackInfo& CallbackInfo)
{
    const HWND WindowHandle = GetForegroundWindow();

    if (WindowHandle == nullptr)
    {
        Napi::Value Result;

        if (napi_get_null(Environment, &Result) != napi_ok)
        {
            return ThrowNodeApiError(Environment, "Could not create a null value.");
        }

        return Result;
    }

    const int TitleLength = ::GetWindowTextLengthW(WindowHandle);
    std::vector<wchar_t> Title(static_cast<std::size_t>(TitleLength) + 1U, L'\0');
    const int CopiedLength = TitleLength == 0
        ? 0
        : ::GetWindowTextW(WindowHandle, Title.data(), static_cast<int>(Title.size()));

    if (TitleLength > 0 && CopiedLength == 0)
    {
        return ThrowNodeApiError(Environment, "The Win32 GetWindowTextW call failed.");
    }

    Napi::Value Result;
    Napi::Value Handle;
    Napi::Value WindowTitle;
    const auto NumericHandle = static_cast<std::uint64_t>(
        reinterpret_cast<std::uintptr_t>(WindowHandle)
    );

    if (
        napi_create_object(Environment, &Result) != napi_ok
        || napi_create_bigint_uint64(Environment, NumericHandle, &Handle) != napi_ok
        || napi_create_string_utf16(
            Environment,
            reinterpret_cast<const char16_t*>(Title.data()),
            static_cast<std::size_t>(CopiedLength),
            &WindowTitle
        ) != napi_ok
        || !SetProperty(Environment, Result, "Handle", Handle)
        || !SetProperty(Environment, Result, "Title", WindowTitle)
    )
    {
        return ThrowNodeApiError(Environment, "Could not create the foreground-window value.");
    }

    return Result;
}
