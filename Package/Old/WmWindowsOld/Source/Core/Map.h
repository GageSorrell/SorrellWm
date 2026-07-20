/* File:      Map.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "CoreBase.h"

#include <functional>
#include <memory>
#include <utility>
#include <string>

template
<
    typename KeyType,
    typename ValueType,
    typename HashType=std::hash<KeyType>,
    typename KeyEqualType=std::equal_to<KeyType>,
    typename AllocatorType=std::allocator<std::pair<const KeyType, ValueType>>
>
using TMap = std::unordered_map
<
    KeyType,
    ValueType,
    HashType,
    KeyEqualType,
    AllocatorType
>;
