/**
 * @file      Theme.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./Theme.h"

#include <cstdio>
#include <dwmapi.h>

#pragma comment(lib, "Advapi32.lib")

std::optional<DWORD> GetRegistryAccentColor()
{
    DWORD RegistryColor = 0;
    DWORD RegistryColorSize = sizeof(RegistryColor);
    const LSTATUS QueryResult = RegGetValueW(
        HKEY_CURRENT_USER,
        L"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Accent",
        L"AccentColorMenu",
        RRF_RT_REG_DWORD,
        nullptr,
        &RegistryColor,
        &RegistryColorSize
    );

    if (QueryResult != ERROR_SUCCESS || RegistryColorSize != sizeof(RegistryColor))
    {
        return std::nullopt;
    }

    // AccentColorMenu is stored as AABBGGRR; convert it to RRGGBB.
    return ((RegistryColor & 0x000000FFUL) << 16)
        | (RegistryColor & 0x0000FF00UL)
        | ((RegistryColor & 0x00FF0000UL) >> 16);
}

Napi::Value GetAccentColor(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    DWORD ColorizationColor = 0;
    BOOL IsOpaqueBlend = FALSE;

    const HRESULT DwmQueryResult = DwmGetColorizationColor(
        &ColorizationColor,
        &IsOpaqueBlend
    );
    DWORD RgbColor = ColorizationColor & 0x00FFFFFFUL;

    if (FAILED(DwmQueryResult))
    {
        const std::optional<DWORD> RegistryColor = GetRegistryAccentColor();

        if (!RegistryColor.has_value())
        {
            return Out.Fail("Failed to get the Windows accent color.");
        }

        RgbColor = RegistryColor.value();
    }

    char HexColor[8] = {};
    const int CharacterCount = std::snprintf(
        HexColor,
        sizeof(HexColor),
        "#%06lX",
        static_cast<unsigned long>(RgbColor)
    );

    if (CharacterCount != 7)
    {
        return Out.Fail("Failed to format the Windows accent color.");
    }

    return Out.Succeed(Napi::String::New(Environment, HexColor));
}
