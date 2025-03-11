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
#include <dwmapi.h>

/**
 * Get the current time as a wstring, ISO timestamp.
 * Intended for writing file names.
 */
std::wstring GetTimestamp();

/** `GetTimestamp`, with punctuation removed, so that file names can include the time. */
std::wstring GetFileNameTimestamp();

std::wstring GetTempPath();

BOOL GetDwmWindowRect(HWND Handle, RECT* Rect);

Napi::Object EncodeHandle(const Napi::Env& Environment, HWND Handle);
HWND DecodeHandle(const Napi::Object& Object);
Napi::Object EncodeRect(const Napi::Env& Environment, RECT InRect);

template <typename THandle>
std::string HandleToString(THandle Handle);
