
#pragma once

#include "./Core.h"
#include "./IntPoint.h"

Napi::Value GetCursorPosition(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetApplicationName(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetApplicationNameFromPath(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetHoveredMaximizeButton(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetHoveredMinimizeButton(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetManageableTopLevelWindows(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetMovingWindow(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetMouseHoverTime(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetRefreshRate(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowRect_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowText_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowWorkArea(const Napi::CallbackInfo& CallbackInfo);
Napi::Value HasRoundedCorners(const Napi::CallbackInfo& CallbackInfo);
Napi::Value IsCurrentProcessElevated(const Napi::CallbackInfo& CallbackInfo);
Napi::Value IsSnapLayoutsOnHoverEnabled(const Napi::CallbackInfo& CallbackInfo);
Napi::Value IsSnapWindowsEnabled(const Napi::CallbackInfo& CallbackInfo);
Napi::Value IsWindowElevated(const Napi::CallbackInfo& CallbackInfo);
Napi::Value IsWindowObscured(const Napi::CallbackInfo& CallbackInfo);
Napi::Value SetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo);
Napi::Value SetWindowZOrderAfter(const Napi::CallbackInfo& CallbackInfo);
Napi::Value SetWindowRect(const Napi::CallbackInfo& CallbackInfo);
