/* File:      Typedefs.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <functional>
#include <napi.h>
#include "Map.h"

// region Integral Types

using int8  = signed __int8;
using int16 = signed __int16;
using int32 = signed __int32;
using int64 = signed __int64;

using uint8  = unsigned __int8;
using uint16 = unsigned __int16;
using uint32 = unsigned __int32;
using uint64 = unsigned __int64;

using uint = unsigned int;

// endregion Integral Types

// region node-addon-api

#define CAT(Left, Right) CAT_IMPL(Left, Right)
#define CAT_IMPL(Left, Right) Left##Right

#define CHECK(...) CHECK_IMPL(__VA_ARGS__, 0)
#define CHECK_IMPL(ProbeValue, Result, ...) Result
#define PROBE() ~, 1

#define IS_VOID(Token) CHECK(CAT(IS_VOID_PROBE_, Token))
#define IS_VOID_PROBE_void PROBE()

#define IF(Condition) CAT(IF_, Condition)
#define IF_0(TrueBranch, FalseBranch) FalseBranch
#define IF_1(TrueBranch, FalseBranch) TrueBranch

#define RETURN_PREFIX(ReturnTypeToken) IF(IS_VOID(ReturnTypeToken))(void, Napi::Value)

// #define NAPI_CAT(Left, Right) NAPI_CAT_IMPL(Left, Right)
// #define NAPI_CAT_IMPL(Left, Right) Left##Right

// #define NAPI_PROBE() ~, 1
// #define NAPI_SECOND(First, Second, ...) Second
// #define NAPI_IS_PROBE(...) NAPI_SECOND(__VA_ARGS__, 0)

// #define NAPI_IS_VOID(Token) NAPI_IS_PROBE(NAPI_CAT(NAPI_IS_VOID_PROBE_, Token))
// #define NAPI_IS_VOID_PROBE_void NAPI_PROBE()

// #define NAPI_RETURN_TYPE(Token) NAPI_CAT(NAPI_RETURN_TYPE_, NAPI_IS_VOID(Token))
// #define NAPI_RETURN_TYPE_1 void
// #define NAPI_VALUE Napi::Value
// #define NAPI_RETURN_TYPE_0 NAPI_VALUE

#define DECLARE_NAPI_FUNCTION(FunctionName, ReturnType, ...) RETURN_PREFIX(ReturnType) FunctionName(const Napi::CallbackInfo& CallbackInfo);
// #define DECLARE_NAPI_FUNCTION(FunctionName, ReturnType, ...) NAPI_RETURN_TYPE(ReturnType) FunctionName(const Napi::CallbackInfo& CallbackInfo);

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_TRUE Napi::Boolean::New(Environment, true)

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_FALSE Napi::Boolean::New(Environment, false)

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_NULL Environment.Null()

/** Assumes that an `Napi::Env Environment` is defined. */
#define NAPI_UNDEFINED Environment.Undefined()

#define RETURN_NAPI() return NAPI_UNDEFINED

// endregion node-addon-api
// region Miscellaneous

using FString = std::string;
using FWideString = std::wstring;
using FWideStringStream = std::wstringstream;

typedef std::chrono::milliseconds FTimeDuration;
typedef std::chrono::milliseconds FMilliseconds;

template <typename FirstType, typename SecondType>
using TPair = std::pair<FirstType, SecondType>;

template<typename ElementType>
using TInitializerList = std::initializer_list<ElementType>;

// endregion Miscellaneous
