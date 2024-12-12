/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"
#include "Core/Globals.h"
#include "Core/Utility.h"
#include <Windowsx.h>
#include "ThirdParty/Blur.h"
#include <algorithm>
#include <stdlib.h>
#include "Core/WindowUtilities.h"
#include <cstddef>
#include <cstdint>

DECLARE_NAPI_FUNCTION(MyBlur, FBlurReturnType);
DECLARE_NAPI_FUNCTION(TearDown, void);
