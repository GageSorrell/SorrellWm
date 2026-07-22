/**
 *
 *
 * @module @sorrell/windows/Native/MessageLoop
 * @internal
 *
 * @file      MessageLoop.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

Napi::Value StartMessageLoop(const Napi::CallbackInfo& CallbackInfo);
Napi::Value StopMessageLoop(const Napi::CallbackInfo& CallbackInfo);
Napi::Value SubscribeToMessageLoop(const Napi::CallbackInfo& CallbackInfo);
Napi::Value UnsubscribeFromMessageLoop(const Napi::CallbackInfo& CallbackInfo);
void CleanupMessageLoop(void* Data);
