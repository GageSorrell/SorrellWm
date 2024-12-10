#pragma once

#include "Core/Core.h"
#include "Core/Globals.h"
#include "Core/Utility.h"
#include <Windowsx.h>
#include "ThirdParty/Blur.h"
#include <algorithm>
#include <stdlib.h>
#include "Core/WindowUtilities.h"

DECLARE_NAPI_FUNCTION(MyBlur, FBlurReturnType);
DECLARE_NAPI_FUNCTION(TearDown, void);
