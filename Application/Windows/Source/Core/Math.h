/* File:      Math.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include <limits>
#include <random>

std::size_t GetRectArea(const RECT& Rect);

template<typename NumericType>
NumericType GetRandomNumber(NumericType MinimumValue, NumericType MaximumValueInclusive)
{
    static thread_local std::mt19937 Generator(std::random_device{}());
    std::uniform_int_distribution<NumericType> Distribution(MinimumValue, MaximumValueInclusive);
    return Distribution(Generator);
}

template<typename NumericType>
NumericType GetRandomNumber(NumericType MaximumValueInclusive)
{
    return GetRandomNumber<NumericType>(std::numeric_limits<NumericType>::min(), MaximumValueInclusive);
}

template<typename NumericType>
NumericType GetRandomNumber()
{
    return GetRandomNumber(
        std::numeric_limits<NumericType>::min(),
        std::numeric_limits<NumericType>::max()
    );
}
