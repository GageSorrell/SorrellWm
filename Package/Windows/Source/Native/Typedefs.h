/* File:      Typedefs.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <functional>
#include <napi.h>
#include "Map.h"

using int8  = signed __int8;
using int16 = signed __int16;
using int32 = signed __int32;
using int64 = signed __int64;

using uint8  = unsigned __int8;
using uint16 = unsigned __int16;
using uint32 = unsigned __int32;
using uint64 = unsigned __int64;

using uint = unsigned int;

template <typename FirstType, typename SecondType>
using Pair = std::pair<FirstType, SecondType>;

template<typename ElementType>
using InitializerList = std::initializer_list<ElementType>;
