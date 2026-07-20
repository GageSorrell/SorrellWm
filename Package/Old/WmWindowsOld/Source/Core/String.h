/* File:      String.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"

FWideString StringToWString(const std::string& str);
std::string WStringToString(const FWideString& wstr);
