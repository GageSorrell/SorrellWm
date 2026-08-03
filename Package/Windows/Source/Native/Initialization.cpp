/**
 *
 *
 * @module @sorrell/windows/Native/Windows
 * @internal
 *
 * @file      Windows.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./Core.h"
#include "./Isolate.h"
#include "./Keyboard.h"
#include "./MessageLoop.h"
#include "./Monitor.h"
#include "./ScreenCapture.h"
#include "./Theme.h"
#include "./Window.h"
#include "./WindowDimming.h"

Napi::Object Initialize(Napi::Env Environment, Napi::Object Exports)
{
    Napi::Object Keyboard = Napi::Object::New(Environment);
    Keyboard.Set(
        "Subscribe",
        Napi::Function::New(Environment, SubscribeToKeyboard)
    );
    Keyboard.Set(
        "Unsubscribe",
        Napi::Function::New(Environment, UnsubscribeFromKeyboard)
    );
    Keyboard.Set(
        "SetSuppressedKeys",
        Napi::Function::New(Environment, SetSuppressedKeys)
    );

    Napi::Object MessageLoop = Napi::Object::New(Environment);
    MessageLoop.Set(
        "Start",
        Napi::Function::New(Environment, StartMessageLoop)
    );
    MessageLoop.Set(
        "Stop",
        Napi::Function::New(Environment, StopMessageLoop)
    );
    MessageLoop.Set(
        "Subscribe",
        Napi::Function::New(Environment, SubscribeToMessageLoop)
    );
    MessageLoop.Set(
        "Unsubscribe",
        Napi::Function::New(Environment, UnsubscribeFromMessageLoop)
    );

    Napi::Object Theme = Napi::Object::New(Environment);
    Theme.Set(
        "GetAccentColor",
        Napi::Function::New(Environment, GetAccentColor)
    );

    Napi::Object Screen = Napi::Object::New(Environment);
    Screen.Set(
        "Capture",
        Napi::Function::New(Environment, CaptureScreen)
    );
    Screen.Set(
        "GetMonitors",
        Napi::Function::New(Environment, GetMonitors)
    );
    Screen.Set(
        "GetMonitorBrand",
        Napi::Function::New(Environment, GetMonitorBrand)
    );

    Napi::Object Window = Napi::Object::New(Environment);
    Window.Set(
        "GetApplicationName",
        Napi::Function::New(Environment, GetApplicationName)
    );
    Window.Set(
        "GetApplicationNameFromPath",
        Napi::Function::New(Environment, GetApplicationNameFromPath)
    );
    Window.Set(
        "GetExecutablePath",
        Napi::Function::New(Environment, GetExecutablePath_Node)
    );
    Window.Set(
        "Capture",
        Napi::Function::New(Environment, CaptureWindow)
    );
    Window.Set(
        "ClearIsolation",
        Napi::Function::New(Environment, ClearIsolation)
    );
    Window.Set(
        "ShowIsolation",
        Napi::Function::New(Environment, ShowIsolation)
    );
    Window.Set(
        "ClearWindowDimming",
        Napi::Function::New(Environment, ClearWindowDimming)
    );
    Window.Set(
        "DimWindowsExcept",
        Napi::Function::New(Environment, DimWindowsExcept)
    );
    Window.Set(
        "ShowBackdrop",
        Napi::Function::New(Environment, ShowBackdrop)
    );
    Window.Set(
        "GetCursorPosition",
        Napi::Function::New(Environment, GetCursorPosition)
    );
    Window.Set(
        "GetIcon",
        Napi::Function::New(Environment, GetWindowIcon)
    );
    Window.Set(
        "GetForegroundWindow",
        Napi::Function::New(Environment, GetForegroundWindow_Node)
    );
    Window.Set(
        "GetHoveredMaximizeButton",
        Napi::Function::New(Environment, GetHoveredMaximizeButton)
    );
    Window.Set(
        "GetHoveredMinimizeButton",
        Napi::Function::New(Environment, GetHoveredMinimizeButton)
    );
    Window.Set(
        "GetManageableTopLevelWindows",
        Napi::Function::New(Environment, GetManageableTopLevelWindows)
    );
    Window.Set(
        "GetMovingWindow",
        Napi::Function::New(Environment, GetMovingWindow)
    );
    Window.Set(
        "GetMouseHoverTime",
        Napi::Function::New(Environment, GetMouseHoverTime)
    );
    Window.Set(
        "GetRefreshRate",
        Napi::Function::New(Environment, GetRefreshRate)
    );
    Window.Set(
        "GetWindowRect",
        Napi::Function::New(Environment, GetWindowRect_Node)
    );
    Window.Set(
        "GetWindowText",
        Napi::Function::New(Environment, GetWindowText_Node)
    );
    Window.Set(
        "GetWindowWorkArea",
        Napi::Function::New(Environment, GetWindowWorkArea)
    );
    Window.Set(
        "HasRoundedCorners",
        Napi::Function::New(Environment, HasRoundedCorners)
    );
    Window.Set(
        "IsSnapLayoutsOnHoverEnabled",
        Napi::Function::New(Environment, IsSnapLayoutsOnHoverEnabled)
    );
    Window.Set(
        "IsSnapWindowsEnabled",
        Napi::Function::New(Environment, IsSnapWindowsEnabled)
    );
    Window.Set(
        "IsWindowElevated",
        Napi::Function::New(Environment, IsWindowElevated)
    );
    Window.Set(
        "IsWindowObscured",
        Napi::Function::New(Environment, IsWindowObscured)
    );
    Window.Set(
        "IsCurrentProcessElevated",
        Napi::Function::New(Environment, IsCurrentProcessElevated)
    );
    Window.Set(
        "SetForegroundWindow",
        Napi::Function::New(Environment, SetForegroundWindow_Node)
    );
    Window.Set(
        "SetWindowZOrderAfter",
        Napi::Function::New(Environment, SetWindowZOrderAfter)
    );
    Window.Set(
        "SetWindowRect",
        Napi::Function::New(Environment, SetWindowRect)
    );

    Exports.Set("Keyboard", Keyboard);
    Exports.Set("MessageLoop", MessageLoop);
    Exports.Set("Screen", Screen);
    Exports.Set("Theme", Theme);
    Exports.Set("Window", Window);

    napi_add_env_cleanup_hook(Environment, CleanupIsolation, nullptr);
    napi_add_env_cleanup_hook(Environment, CleanupMessageLoop, nullptr);
    napi_add_env_cleanup_hook(Environment, CleanupWindowDimming, nullptr);

    return Exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Initialize)
