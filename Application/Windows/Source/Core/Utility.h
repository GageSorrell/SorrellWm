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

Napi::Object EncodeHandle(const Napi::Env& Environment, void* Handle);
void* DecodeHandle(const Napi::Object& Object);
Napi::Object EncodeRect(const Napi::Env& Environment, RECT InRect);
RECT DecodeRect(const Napi::Object& Object);

template <typename THandle>
std::string HandleToString(THandle Handle);

template <typename T>
Napi::Array EncodeArray(const Napi::Env& Environment, std::vector<T> Vector, std::function<Napi::Object(const Napi::Env&, T)> MapFunction)
{
    Napi::Array OutArray = Napi::Array::New(Environment);

    for (int32_t Index = 0; Index < Vector.size(); Index++)
    {
        T Value = Vector[Index];
        Napi::Value OutValue = MapFunction(Environment, Value);
        OutArray[Index] = OutValue;
    }

    return OutArray;
}

RECT GetRectArgument(const Napi::CallbackInfo& CallbackInfo, int32_t Index);

struct FBox
{
    FBox(int32_t InX, int32_t InY, int32_t InWidth, int32_t InHeight)
        : Height(InHeight)
        , Width(InWidth)
        , X(InX)
        , Y(InY)
    { }

    int32_t Height;
    int32_t Width;
    int32_t X;
    int32_t Y;
};

FBox GetBoxArgument(const Napi::CallbackInfo& CallbackInfo, int32_t Index);
