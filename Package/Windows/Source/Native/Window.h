
#pragma once

#include "./Core.h"
#include "./IntPoint.h"

Napi::Value GetCursorPosition(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo);
