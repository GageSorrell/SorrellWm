/* File:      Keyboard.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <napi.h>
#include <string>
#include <Windows.h>
#include <iostream>
#include "js_native_api_types.h"

void RegisterActivationKey();

void KeyboardListener(MSG Message);
