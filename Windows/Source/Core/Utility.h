/* File:      Utility.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"

#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>
#include <chrono>
#include <ctime>

std::tm convertToUTC(std::time_t time);
std::wstring GetTimestamp();
std::wstring GetTempPath();
