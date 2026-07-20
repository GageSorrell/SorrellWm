/* File:      ForwardDeclarations.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This header includes forward declarations for the Windows API,
 *            `Gdiplus`, and the `node-addon-api`.
 */

#pragma once

#ifndef NOMINMAX
#define NOMINMAX
#endif

#include <windef.h>

namespace Gdiplus
{
    class Bitmap;
}

namespace Napi
{
    class Value;
}
