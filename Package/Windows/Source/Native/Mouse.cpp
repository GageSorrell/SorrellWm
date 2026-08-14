/**
 *
 *
 * @module @sorrell/windows/Native/Mouse
 *
 * @file      Mouse.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./Mouse.h"

namespace
{
    std::optional<int> GetInt32Argument(
        const Napi::CallbackInfo& CallbackInfo,
        std::size_t Index
    )
    {
        if (CallbackInfo.Length() <= Index || !CallbackInfo[Index].IsNumber())
        {
            return std::nullopt;
        }

        return CallbackInfo[Index].As<Napi::Number>().Int32Value();
    }

    // Maps one mouse-button virtual-key code (`VK_LBUTTON`/`VK_RBUTTON`/`VK_MBUTTON`/
    // `VK_XBUTTON1`/`VK_XBUTTON2`, as already defined in `Vk.ts`) to the `MOUSEEVENTF_*`
    // down/up flag pair `SendInput` expects, plus the `mouseData` value the X-button
    // flags additionally require (`XBUTTON1`/`XBUTTON2`, which are distinct constants
    // from the `VK_XBUTTON1`/`VK_XBUTTON2` virtual-key codes).
    struct MouseButtonFlags
    {
        DWORD Down;
        DWORD Up;
        DWORD MouseData;
    };

    std::optional<MouseButtonFlags> GetMouseButtonFlags(int VirtualKey)
    {
        switch (VirtualKey)
        {
            case VK_LBUTTON:
                return MouseButtonFlags { MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_LEFTUP, 0 };
            case VK_RBUTTON:
                return MouseButtonFlags { MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP, 0 };
            case VK_MBUTTON:
                return MouseButtonFlags { MOUSEEVENTF_MIDDLEDOWN, MOUSEEVENTF_MIDDLEUP, 0 };
            case VK_XBUTTON1:
                return MouseButtonFlags { MOUSEEVENTF_XDOWN, MOUSEEVENTF_XUP, XBUTTON1 };
            case VK_XBUTTON2:
                return MouseButtonFlags { MOUSEEVENTF_XDOWN, MOUSEEVENTF_XUP, XBUTTON2 };
            default:
                return std::nullopt;
        }
    }

    Napi::Value SendMouseButtonEvent(
        const Napi::CallbackInfo& CallbackInfo,
        DWORD MouseButtonFlags::* Direction
    )
    {
        const Napi::Env Environment = CallbackInfo.Env();
        Result Out(Environment);

        const std::optional<int> VirtualKey = GetInt32Argument(CallbackInfo, 0);
        if (!VirtualKey.has_value())
        {
            return Out.Fail("Expected a mouse-button virtual-key code.");
        }

        const std::optional<MouseButtonFlags> Flags = GetMouseButtonFlags(VirtualKey.value());
        if (!Flags.has_value())
        {
            return Out.Fail("Expected a mouse-button virtual-key code.");
        }

        INPUT Input { };
        Input.type = INPUT_MOUSE;
        Input.mi.dwFlags = Flags.value().*Direction;
        Input.mi.mouseData = Flags.value().MouseData;

        if (SendInput(1, &Input, sizeof(INPUT)) != 1)
        {
            return Out.Fail("Could not simulate the mouse-button event.");
        }

        return Out.Succeed(Environment.Undefined());
    }
}

Napi::Value SetCursorPosition(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    const std::optional<int> X = GetInt32Argument(CallbackInfo, 0);
    const std::optional<int> Y = GetInt32Argument(CallbackInfo, 1);

    if (!X.has_value() || !Y.has_value())
    {
        return Out.Fail("Expected numeric X and Y coordinates.");
    }

    if (SetCursorPos(X.value(), Y.value()) == FALSE)
    {
        return Out.Fail("Could not set the cursor position.");
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value MouseButtonDown(const Napi::CallbackInfo& CallbackInfo)
{
    return SendMouseButtonEvent(CallbackInfo, &MouseButtonFlags::Down);
}

Napi::Value MouseButtonUp(const Napi::CallbackInfo& CallbackInfo)
{
    return SendMouseButtonEvent(CallbackInfo, &MouseButtonFlags::Up);
}
