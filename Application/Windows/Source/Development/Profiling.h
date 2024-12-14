/* File:      Profiling.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "../Core/Core.h"

/** Like ProfileTime, but the result is logged, using `Identifier` in the log message. */
FTimeDuration ProfileLogTime(const std::string& Identifier, std::function<void()>& Function);

FTimeDuration ProfileTime(FTimeDuration& Duration, std::function<void()>& Function);
