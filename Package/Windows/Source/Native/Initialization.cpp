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
#include "./Window.h"

Napi::Value Initialize(Napi::Env Environment, Napi::Object Exports)
{
    Napi::Object Window = Napi::Object::New(Environment);
    Window.Set("GetCursorPosition", &GetCursorPosition);
    Window.Set("GetForegroundWindow", &GetForegroundWindow_Node);

    Exports.Set("Window", Window);

    return Exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Initialize)
