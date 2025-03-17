/* File:      MonitorUtilities.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "MonitorUtilities.h"
#include "InterProcessCommunication.h"
#include "../MessageLoop/MessageLoop.h"
#include "Globals.h"
#include "String.h"
#include <Dbt.h>
#include "Utility.h"

Napi::Value GetMonitorFriendlyName(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    HMONITOR Handle = (HMONITOR) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    MONITORINFOEXW MonitorInfo;
    ZeroMemory(&MonitorInfo, sizeof(MonitorInfo));
    MonitorInfo.cbSize = sizeof(MONITORINFOEXW);

    if (!GetMonitorInfoW(Handle, &MonitorInfo))
    {
        return Environment.Undefined();
    }

    DISPLAY_DEVICEW DisplayDevice;
    ZeroMemory(&DisplayDevice, sizeof(DisplayDevice));
    DisplayDevice.cb = sizeof(DisplayDevice);

    BOOL EnumSuccess = EnumDisplayDevicesW(
        MonitorInfo.szDevice,
        0,
        &DisplayDevice,
        0
    );

    if (!EnumSuccess)
    {
        return Environment.Undefined();
    }
    else
    {
        std::wstring FriendlyNameWideString(DisplayDevice.DeviceString);
        std::string FriendlyNameString = WStringToString(FriendlyNameWideString);

        return Napi::String::New(Environment, FriendlyNameString);
    }
}

int32_t GetRefreshRateFromWindow(HWND HWnd)
{
    if (HWnd == NULL)
    {
        return 0;
    }

    HMONITOR Monitor = MonitorFromWindow(HWnd, MONITOR_DEFAULTTONEAREST);
    if (Monitor == NULL)
    {
        return 0;
    }

    MONITORINFOEX MonitorInfo;
    MonitorInfo.cbSize = sizeof(MONITORINFOEX);
    if (!GetMonitorInfo(Monitor, reinterpret_cast<MONITORINFO*>(&MonitorInfo)))
    {
        return 0;
    }

    DEVMODE DevMode;
    ZeroMemory(&DevMode, sizeof(DevMode));
    DevMode.dmSize = sizeof(DevMode);

    if (!EnumDisplaySettings(MonitorInfo.szDevice, ENUM_CURRENT_SETTINGS, &DevMode))
    {
        return 0;
    }

    return static_cast<int32_t>(DevMode.dmDisplayFrequency);
}

struct FMonitorInfo
{
    HMONITOR HMonitor;
    MONITORINFOEX MonitorInfoEx;
};

BOOL CALLBACK MonitorEnumProc(HMONITOR HMonitor, HDC HDCMonitor, LPRECT LprcMonitor, LPARAM LParam)
{
    std::vector<FMonitorInfo>& Monitors = *reinterpret_cast<std::vector<FMonitorInfo>*>(LParam);

    MONITORINFOEX InfoEx = { };
    InfoEx.cbSize = sizeof(InfoEx);
    if (GetMonitorInfo(HMonitor, reinterpret_cast<MONITORINFO*>(&InfoEx)))
    {
        DISPLAY_DEVICE DisplayDevice = {};
        DisplayDevice.cb = sizeof(DisplayDevice);
        if (EnumDisplayDevices(InfoEx.szDevice, 0, &DisplayDevice, 0))
        {
            if (!(DisplayDevice.StateFlags & DISPLAY_DEVICE_MIRRORING_DRIVER))
            {
                FMonitorInfo Info;
                Info.HMonitor = HMonitor;
                Info.MonitorInfoEx = InfoEx;
                Monitors.push_back(Info);
            }
        }
    }
    return TRUE;
}

FWindowProc ListenForMonitorChanges = [](HWND Handle, UINT Message, WPARAM wParam, LPARAM lParam) -> void
{
    switch (Message)
    {
        case WM_DISPLAYCHANGE:
        {
            GGlobals::Ipc->Send("Monitors");
            break;
        }
        case WM_DEVICECHANGE:
        {
            if (wParam == DBT_DEVNODES_CHANGED)
            {
                /* A monitor has been added or removed. */
                GGlobals::Ipc->Send("Monitors");
            }
            break;
        }
    }
};

Napi::Value InitializeMonitors(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    GGlobals::MessageLoop->RegisterWindowProc(ListenForMonitorChanges);

    return GetMonitors(CallbackInfo);
}

Napi::Value GetMonitors(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    std::vector<FMonitorInfo> Monitors;
    EnumDisplayMonitors(
        NULL,
        NULL,
        reinterpret_cast<MONITORENUMPROC>(MonitorEnumProc),
        reinterpret_cast<LPARAM>(&Monitors)
    );

    Napi::Array OutArray = Napi::Array::New(Environment, Monitors.size());
    for (int32_t Index = 0; Index < Monitors.size(); Index++)
    {
        FMonitorInfo& Monitor = Monitors[Index];
        Napi::Object MonitorInfo = Napi::Object::New(Environment);

        MonitorInfo.Set("Handle", EncodeHandle(Environment, (void*) Monitor.HMonitor));

        Napi::Object Size = EncodeRect(Environment, Monitor.MonitorInfoEx.rcMonitor);
        Napi::Object WorkSize = EncodeRect(Environment, Monitor.MonitorInfoEx.rcWork);
        Napi::Boolean IsPrimary = Napi::Boolean::New(Environment, Monitor.MonitorInfoEx.dwFlags == MONITORINFOF_PRIMARY);

        MonitorInfo.Set("Size", Size);
        MonitorInfo.Set("WorkSize", WorkSize);
        MonitorInfo.Set("IsPrimary", IsPrimary);

        OutArray[Index] = MonitorInfo;
    }

    return OutArray;
}
