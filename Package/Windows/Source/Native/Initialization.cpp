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
#include "./Keyboard.h"
#include "./MessageLoop.h"
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

    Napi::Object Window = Napi::Object::New(Environment);
    Window.Set(
        "ClearWindowDimming",
        Napi::Function::New(Environment, ClearWindowDimming)
    );
    Window.Set(
        "DimWindowsExcept",
        Napi::Function::New(Environment, DimWindowsExcept)
    );
    Window.Set(
        "GetCursorPosition",
        Napi::Function::New(Environment, GetCursorPosition)
    );
    Window.Set(
        "GetForegroundWindow",
        Napi::Function::New(Environment, GetForegroundWindow_Node)
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
        "HasRoundedCorners",
        Napi::Function::New(Environment, HasRoundedCorners)
    );

    Exports.Set("Keyboard", Keyboard);
    Exports.Set("MessageLoop", MessageLoop);
    Exports.Set("Window", Window);

    napi_add_env_cleanup_hook(Environment, CleanupMessageLoop, nullptr);
    napi_add_env_cleanup_hook(Environment, CleanupWindowDimming, nullptr);

    return Exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Initialize)
