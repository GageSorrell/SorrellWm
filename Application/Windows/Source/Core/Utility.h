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

/**
 * Get the current time as a wstring, ISO timestamp.
 * Intended for writing file names.
 */
std::wstring GetTimestamp();

/** `GetTimestamp`, with punctuation removed, so that file names can include the time. */
std::wstring GetFileNameTimestamp();

std::wstring GetTempPath();
