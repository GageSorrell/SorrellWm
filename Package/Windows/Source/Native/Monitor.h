/**
 *
 *
 * @module @sorrell/windows/Native/Monitor
 *
 * @file      Monitor.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "./Core.h"

Napi::Value GetMonitorBrand(const Napi::CallbackInfo& CallbackInfo);
Napi::Value GetMonitors(const Napi::CallbackInfo& CallbackInfo);
