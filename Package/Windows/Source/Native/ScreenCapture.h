/**
 *
 *
 * @module @sorrell/windows/Native/ScreenCapture
 *
 * @file      ScreenCapture.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

Napi::Value CaptureScreen(const Napi::CallbackInfo& CallbackInfo);
Napi::Value CaptureWindow(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetWindowIcon(const Napi::CallbackInfo& CallbackInfo);
