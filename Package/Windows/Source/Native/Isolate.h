/**
 *
 *
 * @module @sorrell/windows/Native/Isolate
 *
 * @file      Isolate.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

Napi::Value ShowIsolation(const Napi::CallbackInfo& CallbackInfo);
Napi::Value ClearIsolation(const Napi::CallbackInfo& CallbackInfo);
void CleanupIsolation(void* Data);
