/**
 *
 *
 * @module @sorrell/windows/Native/WindowDimming
 *
 * @file      WindowDimming.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

Napi::Value ClearWindowDimming(const Napi::CallbackInfo& CallbackInfo);
Napi::Value DimWindowsExcept(const Napi::CallbackInfo& CallbackInfo);
Napi::Value ShowBackdrop(const Napi::CallbackInfo& CallbackInfo);
void CleanupWindowDimming(void* Data);
