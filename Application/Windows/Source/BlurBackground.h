/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(MyBlur, FBlurReturnType);
DECLARE_NAPI_FUNCTION(TearDown, void);
void InitializeBlurBackground();
