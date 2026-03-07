/* File:      Typedefs.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <functional>
#include <napi.h>

#define DECLARE_NAPI_FUNCTION(FunctionName, ...) Napi::Value FunctionName(const Napi::CallbackInfo& Information);

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_TRUE Napi::Boolean::New(Environment, true)

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_FALSE Napi::Boolean::New(Environment, false)

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_NULL Environment.Null()

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_UNDEFINED Environment.Undefined()

/** Assumes that an `Napi::Env Environment` is defined. */
#define RETURN_NAPI(...) return NAPI_UNDEFINED

#define NAPI_VOID Napi::Value

#define FString std::string
#define TArray std::vector
#define TMap std::unordered_map

typedef std::chrono::milliseconds FTimeDuration;
