/* File:      Math.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "Math.h"

std::size_t GetRectArea(const RECT& Rect)
{
    return (Rect.right - Rect.left) * (Rect.bottom - Rect.top);
}
