/**
 *
 *
 * @module @sorrell/windows/Native/Mouse
 *
 * @file      Mouse.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

Napi::Value SetCursorPosition(const Napi::CallbackInfo& CallbackInfo);
Napi::Value MouseButtonDown(const Napi::CallbackInfo& CallbackInfo);
Napi::Value MouseButtonUp(const Napi::CallbackInfo& CallbackInfo);
