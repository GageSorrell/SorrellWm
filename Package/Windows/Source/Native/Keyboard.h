/**
 *
 *
 * @module @sorrell/windows/Native/Keyboard
 * @internal
 *
 * @file      Keyboard.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

bool StartKeyboardHook(std::string& ErrorMessage);
void StopKeyboardHook();
void CleanupKeyboardSubscriptions();

Napi::Value SubscribeToKeyboard(const Napi::CallbackInfo& CallbackInfo);
Napi::Value UnsubscribeFromKeyboard(const Napi::CallbackInfo& CallbackInfo);
