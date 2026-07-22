
#include "./Window.h"

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
