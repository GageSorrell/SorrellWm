
#pragma once

#include "./Core.h"
#include "./IntPoint.h"

Napi::Value GetCursorPosition(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowRect_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowText_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value HasRoundedCorners(const Napi::CallbackInfo& CallbackInfo);
