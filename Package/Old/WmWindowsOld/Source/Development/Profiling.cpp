/* File:      Profiling.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "Profiling.h"

#include <chrono>
#include <functional>

FTimeDuration ProfileTime(std::function<void()>& Function)
{
    auto StartTime = std::chrono::high_resolution_clock::now();

    Function();

    auto EndTime = std::chrono::high_resolution_clock::now();

    return std::chrono::duration_cast<std::chrono::milliseconds>(EndTime - StartTime);
}

FTimeDuration ProfileLogTime(const std::string& Identifier, std::function<void()>& Function)
{
    const FTimeDuration Duration = ProfileTime(Function);

    std::cout
        << "Profiled Function `"
        << Identifier
        << "` executed in "
        << Duration.count()
        << " ms."
        << std::endl;

    return Duration;
}
