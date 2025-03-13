/* File:      Typedefs.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <functional>
#include <napi.h>

#define DECLARE_NAPI_FUNCTION(FunctionName, ...) Napi::Value FunctionName(const Napi::CallbackInfo& Information);

typedef std::chrono::milliseconds FTimeDuration;
