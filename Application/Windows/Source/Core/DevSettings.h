/* File:      DevSettings.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "./Core.h"
#include <nlohmann/json.hpp>

using FJson = nlohmann::json;

struct FDevSettings
{
public:
    struct FStaticModeSettings
    {
public:
        bool bEnabled;
        RECT WindowShape;
    };

    FStaticModeSettings StaticMode;
};

FDevSettings GetDevSettings();
