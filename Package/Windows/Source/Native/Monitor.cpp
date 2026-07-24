/**
 *
 *
 * @module @sorrell/windows/Native/Monitor
 *
 * @file      Monitor.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./Monitor.h"

#include <initguid.h>
#include <devpkey.h>
#include <setupapi.h>

namespace
{
    struct DisplayIdentity
    {
        std::wstring DevicePath;
        std::wstring FriendlyName;
        std::wstring GdiName;
    };

    struct ExtendedMonitorInformation
    {
        HMONITOR Handle = nullptr;
        MONITORINFOEXW Information { };
    };

    struct MonitorEnumeration
    {
        bool Failed = false;
        std::vector<ExtendedMonitorInformation> Monitors;
    };

    class DeviceInformationSet
    {
    public:
        explicit DeviceInformationSet(HDEVINFO HandleValue)
            : Handle(HandleValue) { }

        ~DeviceInformationSet()
        {
            if (Handle != INVALID_HANDLE_VALUE)
            {
                SetupDiDestroyDeviceInfoList(Handle);
            }
        }

        DeviceInformationSet(const DeviceInformationSet&) = delete;
        DeviceInformationSet& operator=(const DeviceInformationSet&) = delete;

        HDEVINFO Get() const
        {
            return Handle;
        }

    private:
        HDEVINFO Handle;
    };

    Napi::Object RectangleToNapi(
        const Napi::Env& Environment,
        const RECT& Rectangle
    )
    {
        Napi::Object Box = Napi::Object::New(Environment);
        Box.Set("Bottom", Rectangle.bottom);
        Box.Set("Left", Rectangle.left);
        Box.Set("Right", Rectangle.right);
        Box.Set("Top", Rectangle.top);
        return Box;
    }

    Napi::String WideStringToNapi(
        const Napi::Env& Environment,
        const std::wstring& Value
    )
    {
        return Napi::String::New(
            Environment,
            reinterpret_cast<const char16_t*>(Value.data()),
            Value.size()
        );
    }

    BOOL CALLBACK CollectMonitorInformation(
        HMONITOR MonitorHandle,
        HDC,
        LPRECT,
        LPARAM Context
    )
    {
        auto* Enumeration = reinterpret_cast<MonitorEnumeration*>(Context);
        ExtendedMonitorInformation Monitor;
        Monitor.Handle = MonitorHandle;
        Monitor.Information.cbSize = sizeof(MONITORINFOEXW);
        if (GetMonitorInfoW(
            MonitorHandle,
            reinterpret_cast<MONITORINFO*>(&Monitor.Information)
        ) == FALSE)
        {
            Enumeration->Failed = true;
            return FALSE;
        }

        Enumeration->Monitors.push_back(Monitor);
        return TRUE;
    }

    std::vector<DisplayIdentity> GetActiveDisplayIdentities()
    {
        UINT32 PathCount = 0;
        UINT32 ModeCount = 0;
        LONG Status = ERROR_SUCCESS;
        std::vector<DISPLAYCONFIG_PATH_INFO> Paths;
        std::vector<DISPLAYCONFIG_MODE_INFO> Modes;

        for (int Attempt = 0; Attempt < 3; ++Attempt)
        {
            Status = GetDisplayConfigBufferSizes(
                QDC_ONLY_ACTIVE_PATHS,
                &PathCount,
                &ModeCount
            );
            if (Status != ERROR_SUCCESS)
            {
                return { };
            }

            Paths.resize(PathCount);
            Modes.resize(ModeCount);
            Status = QueryDisplayConfig(
                QDC_ONLY_ACTIVE_PATHS,
                &PathCount,
                Paths.data(),
                &ModeCount,
                Modes.data(),
                nullptr
            );
            if (Status != ERROR_INSUFFICIENT_BUFFER)
            {
                break;
            }
        }

        if (Status != ERROR_SUCCESS)
        {
            return { };
        }

        Paths.resize(PathCount);
        std::vector<DisplayIdentity> Identities;
        Identities.reserve(Paths.size());

        for (const DISPLAYCONFIG_PATH_INFO& Path : Paths)
        {
            DISPLAYCONFIG_SOURCE_DEVICE_NAME Source { };
            Source.header.type = DISPLAYCONFIG_DEVICE_INFO_GET_SOURCE_NAME;
            Source.header.size = sizeof(Source);
            Source.header.adapterId = Path.sourceInfo.adapterId;
            Source.header.id = Path.sourceInfo.id;

            DISPLAYCONFIG_TARGET_DEVICE_NAME Target { };
            Target.header.type = DISPLAYCONFIG_DEVICE_INFO_GET_TARGET_NAME;
            Target.header.size = sizeof(Target);
            Target.header.adapterId = Path.targetInfo.adapterId;
            Target.header.id = Path.targetInfo.id;

            if (DisplayConfigGetDeviceInfo(&Source.header) != ERROR_SUCCESS ||
                DisplayConfigGetDeviceInfo(&Target.header) != ERROR_SUCCESS)
            {
                continue;
            }

            Identities.push_back({
                Target.monitorDevicePath,
                Target.monitorFriendlyDeviceName,
                Source.viewGdiDeviceName
            });
        }

        return Identities;
    }

    const DisplayIdentity* FindDisplayIdentity(
        const std::vector<DisplayIdentity>& Identities,
        const wchar_t* GdiName
    )
    {
        for (const DisplayIdentity& Identity : Identities)
        {
            if (_wcsicmp(Identity.GdiName.c_str(), GdiName) == 0)
            {
                return &Identity;
            }
        }

        return nullptr;
    }

    std::wstring GetFriendlyName(
        const ExtendedMonitorInformation& Monitor,
        const std::vector<DisplayIdentity>& Identities
    )
    {
        const DisplayIdentity* Identity = FindDisplayIdentity(
            Identities,
            Monitor.Information.szDevice
        );
        if (Identity != nullptr && !Identity->FriendlyName.empty())
        {
            return Identity->FriendlyName;
        }

        DISPLAY_DEVICEW Device { };
        Device.cb = sizeof(Device);
        if (EnumDisplayDevicesW(
            Monitor.Information.szDevice,
            0,
            &Device,
            0
        ) != FALSE && Device.DeviceString[0] != L'\0')
        {
            return Device.DeviceString;
        }

        return Monitor.Information.szDevice;
    }

    std::optional<std::wstring> GetDeviceManufacturer(
        const std::wstring& DevicePath
    )
    {
        if (DevicePath.empty())
        {
            return std::nullopt;
        }

        DeviceInformationSet Devices(SetupDiCreateDeviceInfoList(nullptr, nullptr));
        if (Devices.Get() == INVALID_HANDLE_VALUE)
        {
            return std::nullopt;
        }

        SP_DEVICE_INTERFACE_DATA Interface { };
        Interface.cbSize = sizeof(Interface);
        if (SetupDiOpenDeviceInterfaceW(
            Devices.Get(),
            DevicePath.c_str(),
            0,
            &Interface
        ) == FALSE)
        {
            return std::nullopt;
        }

        DWORD DetailSize = 0;
        SetupDiGetDeviceInterfaceDetailW(
            Devices.Get(),
            &Interface,
            nullptr,
            0,
            &DetailSize,
            nullptr
        );
        if (DetailSize < sizeof(SP_DEVICE_INTERFACE_DETAIL_DATA_W))
        {
            return std::nullopt;
        }

        std::vector<std::byte> DetailBuffer(DetailSize);
        auto* Detail = reinterpret_cast<SP_DEVICE_INTERFACE_DETAIL_DATA_W*>(
            DetailBuffer.data()
        );
        Detail->cbSize = sizeof(SP_DEVICE_INTERFACE_DETAIL_DATA_W);
        SP_DEVINFO_DATA Device { };
        Device.cbSize = sizeof(Device);
        if (SetupDiGetDeviceInterfaceDetailW(
            Devices.Get(),
            &Interface,
            Detail,
            DetailSize,
            nullptr,
            &Device
        ) == FALSE)
        {
            return std::nullopt;
        }

        DEVPROPTYPE PropertyType = 0;
        DWORD PropertySize = 0;
        SetupDiGetDevicePropertyW(
            Devices.Get(),
            &Device,
            &DEVPKEY_Device_Manufacturer,
            &PropertyType,
            nullptr,
            0,
            &PropertySize,
            0
        );
        if (PropertySize < sizeof(wchar_t))
        {
            return std::nullopt;
        }

        std::vector<std::byte> PropertyBuffer(PropertySize);
        if (SetupDiGetDevicePropertyW(
            Devices.Get(),
            &Device,
            &DEVPKEY_Device_Manufacturer,
            &PropertyType,
            reinterpret_cast<PBYTE>(PropertyBuffer.data()),
            PropertySize,
            nullptr,
            0
        ) == FALSE || PropertyType != DEVPROP_TYPE_STRING)
        {
            return std::nullopt;
        }

        const auto* PropertyValue = reinterpret_cast<const wchar_t*>(
            PropertyBuffer.data()
        );
        std::wstring Manufacturer(PropertyValue);
        if (Manufacturer.empty() ||
            _wcsicmp(Manufacturer.c_str(), L"(Standard monitor types)") == 0)
        {
            return std::nullopt;
        }

        return Manufacturer;
    }

    std::optional<ExtendedMonitorInformation> GetMonitorArgument(
        const Napi::CallbackInfo& CallbackInfo
    )
    {
        if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsBigInt())
        {
            return std::nullopt;
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = CallbackInfo[0]
            .As<Napi::BigInt>()
            .Uint64Value(&IsLossless);
        ExtendedMonitorInformation Monitor;
        Monitor.Handle = reinterpret_cast<HMONITOR>(
            static_cast<std::uintptr_t>(NumericHandle)
        );
        Monitor.Information.cbSize = sizeof(MONITORINFOEXW);

        if (!IsLossless || Monitor.Handle == nullptr || GetMonitorInfoW(
            Monitor.Handle,
            reinterpret_cast<MONITORINFO*>(&Monitor.Information)
        ) == FALSE)
        {
            return std::nullopt;
        }

        return Monitor;
    }
}

Napi::Value GetMonitorBrand(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<ExtendedMonitorInformation> Monitor =
        GetMonitorArgument(CallbackInfo);
    if (!Monitor.has_value())
    {
        return Out.Fail("Expected a valid monitor handle.");
    }

    const std::vector<DisplayIdentity> Identities = GetActiveDisplayIdentities();
    const DisplayIdentity* Identity = FindDisplayIdentity(
        Identities,
        Monitor->Information.szDevice
    );
    if (Identity == nullptr)
    {
        return Out.Fail("Could not resolve the monitor device identity.");
    }

    const std::optional<std::wstring> Brand = GetDeviceManufacturer(
        Identity->DevicePath
    );
    if (!Brand.has_value())
    {
        return Out.Fail("The monitor device does not expose a brand.");
    }

    return Out.Succeed(WideStringToNapi(Environment, Brand.value()));
}

Napi::Value GetMonitors(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    if (CallbackInfo.Length() != 0)
    {
        return Out.Fail("GetMonitors does not accept arguments.");
    }

    MonitorEnumeration Enumeration;
    const BOOL EnumerationResult = EnumDisplayMonitors(
        nullptr,
        nullptr,
        CollectMonitorInformation,
        reinterpret_cast<LPARAM>(&Enumeration)
    );
    if (EnumerationResult == FALSE || Enumeration.Failed)
    {
        return Out.Fail("Could not enumerate extended monitor information.");
    }

    const std::vector<DisplayIdentity> Identities = GetActiveDisplayIdentities();
    Napi::Array Monitors = Napi::Array::New(
        Environment,
        Enumeration.Monitors.size()
    );
    for (std::size_t Index = 0; Index < Enumeration.Monitors.size(); ++Index)
    {
        const ExtendedMonitorInformation& Monitor =
            Enumeration.Monitors[Index];
        const auto NumericHandle = static_cast<std::uint64_t>(
            reinterpret_cast<std::uintptr_t>(Monitor.Handle)
        );

        Napi::Object Information = Napi::Object::New(Environment);
        Information.Set(
            "DeviceName",
            WideStringToNapi(
                Environment,
                GetFriendlyName(Monitor, Identities)
            )
        );
        Information.Set("Flags", Monitor.Information.dwFlags);
        Information.Set(
            "Handle",
            Napi::BigInt::New(Environment, NumericHandle)
        );
        Information.Set(
            "IsPrimary",
            Napi::Boolean::New(
                Environment,
                (Monitor.Information.dwFlags & MONITORINFOF_PRIMARY) != 0
            )
        );
        Information.Set(
            "Monitor",
            RectangleToNapi(Environment, Monitor.Information.rcMonitor)
        );
        Information.Set(
            "WorkArea",
            RectangleToNapi(Environment, Monitor.Information.rcWork)
        );
        Monitors.Set(static_cast<std::uint32_t>(Index), Information);
    }

    return Out.Succeed(Monitors);
}
