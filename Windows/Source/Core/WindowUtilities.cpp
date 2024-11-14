/* File:      WindowUtilities.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "WindowUtilities.h"

Napi::Object EncodeHandle(const Napi::Env& env, HWND handle)
{
    std::stringstream ss;
    ss << std::hex << reinterpret_cast<uintptr_t>(handle);
    Napi::Object obj = Napi::Object::New(env);
    obj.Set("Handle", Napi::String::New(env, ss.str()));
    return obj;
}

HWND DecodeHandle(const Napi::Object& obj)
{
    Napi::Env env = obj.Env();
    Napi::Value handleValue = obj.Get("Handle");

    if (!handleValue.IsString())
    {
        Napi::TypeError::New(env, "Expected 'Handle' property to be a string").ThrowAsJavaScriptException();
        return nullptr;
    }

    std::string handleStr = handleValue.As<Napi::String>().Utf8Value();
    uintptr_t handleInt = std::stoull(handleStr, nullptr, 16);
    return reinterpret_cast<HWND>(handleInt);
}

Napi::Value GetFocusedWindow(const Napi::CallbackInfo& CallbackInfo)
{
    return EncodeHandle(CallbackInfo.Env(), GetForegroundWindow());
}
