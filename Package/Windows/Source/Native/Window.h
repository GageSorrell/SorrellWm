
#pragma once

#include "./Core.h"
#include "./IntPoint.h"

Napi::Value GetCursorPosition(Napi::Env Environment, const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetForegroundWindow_Node(Napi::Env Environment, const Napi::CallbackInfo& CallbackInfo);
