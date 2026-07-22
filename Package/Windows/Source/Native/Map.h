/* File:      Map.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <functional>
#include <memory>
#include <string>
#include <unordered_map>
#include <utility>

template
<
    typename KeyType,
    typename ValueType,
    typename HashType=std::hash<KeyType>,
    typename KeyEqualType=std::equal_to<KeyType>,
    typename AllocatorType=std::allocator<std::pair<const KeyType, ValueType>>
>
using Map = std::unordered_map
<
    KeyType,
    ValueType,
    HashType,
    KeyEqualType,
    AllocatorType
>;
