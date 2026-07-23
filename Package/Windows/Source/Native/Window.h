
#pragma once

#include "./Core.h"
#include "./IntPoint.h"

Napi::Value GetCursorPosition(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetManageableTopLevelWindows(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowRect_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowText_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowWorkArea(const Napi::CallbackInfo& CallbackInfo);
Napi::Value HasRoundedCorners(const Napi::CallbackInfo& CallbackInfo);
Napi::Value SetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value SetWindowRect(const Napi::CallbackInfo& CallbackInfo);
