/* File:      MonitorUtilities.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#include "MonitorUtilities.h"
#include "InterProcessCommunication.h"
#include "../MessageLoop/MessageLoop.h"
#include "Globals.h"
#include "String.h"
#include <Dbt.h>
#include "Utility.h"

static std::wstring GetFriendlyNameFromDisplayConfig(const std::wstring &deviceName)
{
    // 1. Get buffer sizes for the active display paths.
    UINT32 numPathArrayElements = 0;
    UINT32 numModeInfoArrayElements = 0;
    LONG status = GetDisplayConfigBufferSizes(QDC_ONLY_ACTIVE_PATHS,
                                              &numPathArrayElements,
                                              &numModeInfoArrayElements);
    if (status != ERROR_SUCCESS)
    {
        return L"";
    }

    // 2. Allocate arrays to hold path and mode info.
    std::vector<DISPLAYCONFIG_PATH_INFO> pathInfoArray(numPathArrayElements);
    std::vector<DISPLAYCONFIG_MODE_INFO> modeInfoArray(numModeInfoArrayElements);

    // 3. Query active paths.
    status = QueryDisplayConfig(QDC_ONLY_ACTIVE_PATHS,
                                &numPathArrayElements,
                                pathInfoArray.data(),
                                &numModeInfoArrayElements,
                                modeInfoArray.data(),
                                nullptr);
    if (status != ERROR_SUCCESS)
    {
        return L"";
    }

    // 4. Scan each path to find one whose GDI device name (wide) matches deviceName.
    for (UINT32 i = 0; i < numPathArrayElements; i++)
    {
        DISPLAYCONFIG_SOURCE_DEVICE_NAME sourceName;
        ZeroMemory(&sourceName, sizeof(sourceName));
        sourceName.header.type = DISPLAYCONFIG_DEVICE_INFO_GET_SOURCE_NAME;
        sourceName.header.size = sizeof(sourceName);
        sourceName.header.adapterId = pathInfoArray[i].sourceInfo.adapterId;
        sourceName.header.id = pathInfoArray[i].sourceInfo.id;

        if (DisplayConfigGetDeviceInfo(&sourceName.header) == ERROR_SUCCESS)
        {
            // Compare (case-insensitive) the device names: sourceName.viewGdiDeviceName vs deviceName
            if (_wcsicmp(sourceName.viewGdiDeviceName, deviceName.c_str()) == 0)
            {
                // 5. Retrieve the target's friendly name.
                DISPLAYCONFIG_TARGET_DEVICE_NAME targetName;
                ZeroMemory(&targetName, sizeof(targetName));
                targetName.header.type = DISPLAYCONFIG_DEVICE_INFO_GET_TARGET_NAME;
                targetName.header.size = sizeof(targetName);
                targetName.header.adapterId = pathInfoArray[i].targetInfo.adapterId;
                targetName.header.id = pathInfoArray[i].targetInfo.id;

                if (DisplayConfigGetDeviceInfo(&targetName.header) == ERROR_SUCCESS)
                {
                    // The monitor's human-readable name is in monitorFriendlyDeviceName (wide chars).
                    return targetName.monitorFriendlyDeviceName;
                }
            }
        }
    }

    // Nothing found, or no match
    return L"";
}

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

    return Napi::String::New(Environment, WStringToString(GetFriendlyNameFromDisplayConfig(MonitorInfo.szDevice)));

    // DISPLAY_DEVICEW DisplayDevice;
    // ZeroMemory(&DisplayDevice, sizeof(DisplayDevice));
    // DisplayDevice.cb = sizeof(DisplayDevice);

    // BOOL EnumSuccess = EnumDisplayDevicesW(
    //     MonitorInfo.szDevice,
    //     0,
    //     &DisplayDevice,
    //     0
    // );

    // if (!EnumSuccess)
    // {
    //     return Environment.Undefined();
    // }
    // else
    // {
    //     std::wstring FriendlyNameWideString(DisplayDevice.DeviceString);
    //     std::string FriendlyNameString = WStringToString(FriendlyNameWideString);

    //     return Napi::String::New(Environment, FriendlyNameString);
    // }
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

struct FOverlapMonitorData
{
    RECT TargetRectangle;
    int MinimumRefreshRate;
};

BOOL CALLBACK OverlapMonitorEnumerationProcedure(
    HMONITOR MonitorHandle,
    HDC DeviceContext,
    LPRECT MonitorRectangle,
    LPARAM UserData
)
{
    FOverlapMonitorData* OverlapData = reinterpret_cast<FOverlapMonitorData*>(UserData);

    RECT IntersectionRectangle;
    if (IntersectRect(&IntersectionRectangle, MonitorRectangle, &OverlapData->TargetRectangle))
    {
        MONITORINFOEX MonitorInformation;
        ZeroMemory(&MonitorInformation, sizeof(MonitorInformation));
        MonitorInformation.cbSize = sizeof(MonitorInformation);

        if (GetMonitorInfo(MonitorHandle, &MonitorInformation))
        {
            DEVMODE DeviceModeInformation;
            ZeroMemory(&DeviceModeInformation, sizeof(DeviceModeInformation));
            DeviceModeInformation.dmSize = sizeof(DeviceModeInformation);

            if (EnumDisplaySettings(MonitorInformation.szDevice, ENUM_CURRENT_SETTINGS, &DeviceModeInformation))
            {
                int CurrentRefreshRate = static_cast<int>(DeviceModeInformation.dmDisplayFrequency);

                if (CurrentRefreshRate > 0)
                {
                    if (OverlapData->MinimumRefreshRate == 0 || CurrentRefreshRate < OverlapData->MinimumRefreshRate)
                    {
                        OverlapData->MinimumRefreshRate = CurrentRefreshRate;
                    }
                }
            }
        }
    }

    return TRUE;
}

int GetLeastRefreshRateOverRect(const RECT& InputRectangle)
{
    FOverlapMonitorData OverlapData;
    OverlapData.TargetRectangle = InputRectangle;
    OverlapData.MinimumRefreshRate = 0;

    BOOL EnumerationResult = EnumDisplayMonitors(
        nullptr,
        nullptr,
        OverlapMonitorEnumerationProcedure,
        reinterpret_cast<LPARAM>(&OverlapData)
    );

    if (!EnumerationResult)
    {
        std::cout
            << "OverlapMonitorEnumerationProceduce failed."
            << std::endl;
    }

    return OverlapData.MinimumRefreshRate;
}
