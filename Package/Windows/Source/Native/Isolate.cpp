/**
 *
 *
 * @module @sorrell/windows/Native/Isolate
 *
 * @file      Isolate.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./Isolate.h"

#include <algorithm>
#include <cstdint>
#include <dwmapi.h>
#include <exception>
#include <limits>
#include <unordered_set>
#include <vector>
#include <wincodec.h>
#include <wrl/client.h>

namespace
{
    using Microsoft::WRL::ComPtr;

    constexpr const wchar_t* IsolationWindowClassName =
        L"SorrellWm.WindowIsolationOverlay";

    std::vector<HWND> IsolationWindows;
    HINSTANCE IsolationInstance = nullptr;
    bool OwnsIsolationWindowClass = false;

    struct EnumerationContext
    {
        const std::unordered_set<HWND>& ExcludedWindows;
        std::vector<HWND> Windows;
        bool Failed = false;
    };

    /** The decoded desktop wallpaper image, as top-down 32bpp BGRA pixels. */
    struct WallpaperBitmap
    {
        UINT Width = 0;
        UINT Height = 0;
        std::vector<BYTE> Pixels;
    };

    class ComApartment
    {
    public:
        ComApartment()
        {
            const HRESULT InitializationResult = CoInitializeEx(
                nullptr,
                COINIT_MULTITHREADED
            );
            IsUsable = SUCCEEDED(InitializationResult) ||
                InitializationResult == RPC_E_CHANGED_MODE;
            MustUninitialize = SUCCEEDED(InitializationResult);
        }

        ~ComApartment()
        {
            if (MustUninitialize)
            {
                CoUninitialize();
            }
        }

        bool IsReady() const
        {
            return IsUsable;
        }

    private:
        bool IsUsable = false;
        bool MustUninitialize = false;
    };

    LRESULT CALLBACK IsolationWindowProcedure(
        HWND Window,
        UINT Message,
        WPARAM WParameter,
        LPARAM LParameter
    )
    {
        switch (Message)
        {
            case WM_MOUSEACTIVATE:
                return MA_NOACTIVATE;

            case WM_DESTROY:
            {
                const auto Crop = reinterpret_cast<HBITMAP>(
                    GetWindowLongPtrW(Window, GWLP_USERDATA)
                );

                if (Crop != nullptr)
                {
                    DeleteObject(Crop);
                    SetWindowLongPtrW(Window, GWLP_USERDATA, 0);
                }

                return 0;
            }

            case WM_PAINT:
            {
                PAINTSTRUCT Paint { };
                const HDC DeviceContext = BeginPaint(Window, &Paint);
                const auto Crop = reinterpret_cast<HBITMAP>(
                    GetWindowLongPtrW(Window, GWLP_USERDATA)
                );

                if (Crop == nullptr)
                {
                    FillRect(
                        DeviceContext,
                        &Paint.rcPaint,
                        static_cast<HBRUSH>(GetStockObject(BLACK_BRUSH))
                    );
                    EndPaint(Window, &Paint);
                    return 0;
                }

                RECT ClientBounds { };
                GetClientRect(Window, &ClientBounds);

                const HDC MemoryDeviceContext = CreateCompatibleDC(DeviceContext);
                if (MemoryDeviceContext != nullptr)
                {
                    const HGDIOBJ PreviousObject = SelectObject(
                        MemoryDeviceContext,
                        Crop
                    );
                    BitBlt(
                        DeviceContext,
                        0,
                        0,
                        ClientBounds.right - ClientBounds.left,
                        ClientBounds.bottom - ClientBounds.top,
                        MemoryDeviceContext,
                        0,
                        0,
                        SRCCOPY
                    );
                    SelectObject(MemoryDeviceContext, PreviousObject);
                    DeleteDC(MemoryDeviceContext);
                }

                EndPaint(Window, &Paint);
                return 0;
            }

            default:
                return DefWindowProcW(Window, Message, WParameter, LParameter);
        }
    }

    bool DestroyIsolationWindows()
    {
        bool Succeeded = true;

        for (const HWND Window : IsolationWindows)
        {
            if (IsWindow(Window) != FALSE && DestroyWindow(Window) == FALSE)
            {
                Succeeded = false;
            }
        }

        IsolationWindows.clear();
        return Succeeded;
    }

    bool EnsureIsolationWindowClass(std::string& ErrorMessage)
    {
        if (IsolationInstance != nullptr)
        {
            return true;
        }

        IsolationInstance = GetModuleHandleW(nullptr);

        if (IsolationInstance == nullptr)
        {
            ErrorMessage = "Could not get the application module handle.";
            return false;
        }

        WNDCLASSEXW WindowClass { };
        WindowClass.cbSize = sizeof(WindowClass);
        WindowClass.hbrBackground = static_cast<HBRUSH>(
            GetStockObject(BLACK_BRUSH)
        );
        WindowClass.hInstance = IsolationInstance;
        WindowClass.lpfnWndProc = IsolationWindowProcedure;
        WindowClass.lpszClassName = IsolationWindowClassName;
        WindowClass.style = CS_HREDRAW | CS_VREDRAW;

        if (RegisterClassExW(&WindowClass) == 0)
        {
            if (GetLastError() != ERROR_CLASS_ALREADY_EXISTS)
            {
                IsolationInstance = nullptr;
                ErrorMessage = "Could not register the isolation-window class.";
                return false;
            }
        }
        else
        {
            OwnsIsolationWindowClass = true;
        }

        return true;
    }

    bool IsCloaked(HWND Window)
    {
        DWORD Cloaked = 0;
        return SUCCEEDED(DwmGetWindowAttribute(
            Window,
            DWMWA_CLOAKED,
            &Cloaked,
            sizeof(Cloaked)
        )) && Cloaked != 0;
    }

    BOOL CALLBACK CollectWindow(HWND Window, LPARAM ContextParameter)
    {
        auto& Context = *reinterpret_cast<EnumerationContext*>(ContextParameter);

        if (
            Context.ExcludedWindows.contains(Window)
            || std::find(
                IsolationWindows.cbegin(),
                IsolationWindows.cend(),
                Window
            ) != IsolationWindows.cend()
            || IsWindowVisible(Window) == FALSE
            || IsIconic(Window) != FALSE
            || IsCloaked(Window)
        )
        {
            return TRUE;
        }

        RECT Bounds { };

        if (
            GetWindowRect(Window, &Bounds) == FALSE
            || Bounds.right <= Bounds.left
            || Bounds.bottom <= Bounds.top
        )
        {
            return TRUE;
        }

        try
        {
            Context.Windows.push_back(Window);
        }
        catch (const std::exception&)
        {
            Context.Failed = true;
            return FALSE;
        }

        return TRUE;
    }

    bool DecodeExcludedWindows(
        const Napi::Array& Values,
        std::unordered_set<HWND>& Out
    )
    {
        try
        {
            Out.reserve(Values.Length());

            for (std::uint32_t Index = 0; Index < Values.Length(); ++Index)
            {
                const Napi::Value Value = Values.Get(Index);

                if (!Value.IsBigInt())
                {
                    return false;
                }

                bool IsLossless = false;
                const std::uint64_t NumericHandle = Value
                    .As<Napi::BigInt>()
                    .Uint64Value(&IsLossless);
                const HWND Window = reinterpret_cast<HWND>(
                    static_cast<std::uintptr_t>(NumericHandle)
                );

                if (!IsLossless || Window == nullptr)
                {
                    return false;
                }

                Out.insert(Window);
            }
        }
        catch (const std::exception&)
        {
            return false;
        }

        return true;
    }

    /** Get the file path of the desktop wallpaper currently applied by Windows. */
    std::optional<std::wstring> GetWallpaperPath()
    {
        std::vector<wchar_t> PathBuffer(MAX_PATH);

        if (SystemParametersInfoW(
            SPI_GETDESKWALLPAPER,
            static_cast<UINT>(PathBuffer.size()),
            PathBuffer.data(),
            0
        ) == FALSE)
        {
            return std::nullopt;
        }

        std::wstring Path(PathBuffer.data());

        if (Path.empty())
        {
            return std::nullopt;
        }

        return Path;
    }

    /** Decode the current desktop wallpaper image into 32bpp BGRA pixels. */
    std::optional<WallpaperBitmap> LoadWallpaperBitmap()
    {
        const std::optional<std::wstring> Path = GetWallpaperPath();

        if (!Path.has_value())
        {
            return std::nullopt;
        }

        ComApartment Apartment;

        if (!Apartment.IsReady())
        {
            return std::nullopt;
        }

        ComPtr<IWICImagingFactory> ImagingFactory;
        if (FAILED(CoCreateInstance(
            CLSID_WICImagingFactory,
            nullptr,
            CLSCTX_INPROC_SERVER,
            IID_PPV_ARGS(ImagingFactory.ReleaseAndGetAddressOf())
        )))
        {
            return std::nullopt;
        }

        ComPtr<IWICBitmapDecoder> Decoder;
        if (FAILED(ImagingFactory->CreateDecoderFromFilename(
            Path->c_str(),
            nullptr,
            GENERIC_READ,
            WICDecodeMetadataCacheOnDemand,
            Decoder.ReleaseAndGetAddressOf()
        )))
        {
            return std::nullopt;
        }

        ComPtr<IWICBitmapFrameDecode> Frame;
        if (FAILED(Decoder->GetFrame(0, Frame.ReleaseAndGetAddressOf())))
        {
            return std::nullopt;
        }

        ComPtr<IWICFormatConverter> Converter;
        if (FAILED(ImagingFactory->CreateFormatConverter(
            Converter.ReleaseAndGetAddressOf()
        )) || FAILED(Converter->Initialize(
            Frame.Get(),
            GUID_WICPixelFormat32bppBGRA,
            WICBitmapDitherTypeNone,
            nullptr,
            0.0,
            WICBitmapPaletteTypeCustom
        )))
        {
            return std::nullopt;
        }

        UINT Width = 0;
        UINT Height = 0;
        if (FAILED(Converter->GetSize(&Width, &Height)) || Width == 0 || Height == 0)
        {
            return std::nullopt;
        }

        const std::uint64_t Stride64 = static_cast<std::uint64_t>(Width) * 4;
        const std::uint64_t ByteCount64 = Stride64 * static_cast<std::uint64_t>(Height);
        if (Stride64 > std::numeric_limits<UINT>::max() ||
            ByteCount64 > std::numeric_limits<UINT>::max())
        {
            return std::nullopt;
        }

        WallpaperBitmap Wallpaper;
        Wallpaper.Width = Width;
        Wallpaper.Height = Height;

        try
        {
            Wallpaper.Pixels.resize(static_cast<std::size_t>(ByteCount64));
        }
        catch (const std::exception&)
        {
            return std::nullopt;
        }

        if (FAILED(Converter->CopyPixels(
            nullptr,
            static_cast<UINT>(Stride64),
            static_cast<UINT>(Wallpaper.Pixels.size()),
            Wallpaper.Pixels.data()
        )))
        {
            return std::nullopt;
        }

        return Wallpaper;
    }

    /**
     * Sample the wallpaper region that Windows would render at `TargetBounds`,
     * approximating the common "Fill" wallpaper style (scaled to cover
     * `MonitorBounds`, cropping overflow, centered) on the primary monitor.
     */
    HBITMAP CreateWallpaperCrop(
        const WallpaperBitmap& Wallpaper,
        const RECT& MonitorBounds,
        const RECT& TargetBounds
    )
    {
        const int DestinationWidth = TargetBounds.right - TargetBounds.left;
        const int DestinationHeight = TargetBounds.bottom - TargetBounds.top;
        const double MonitorWidth = static_cast<double>(
            MonitorBounds.right - MonitorBounds.left
        );
        const double MonitorHeight = static_cast<double>(
            MonitorBounds.bottom - MonitorBounds.top
        );

        if (DestinationWidth <= 0 || DestinationHeight <= 0 ||
            MonitorWidth <= 0 || MonitorHeight <= 0)
        {
            return nullptr;
        }

        const double Scale = std::max(
            MonitorWidth / static_cast<double>(Wallpaper.Width),
            MonitorHeight / static_cast<double>(Wallpaper.Height)
        );
        const double ScaledWidth = static_cast<double>(Wallpaper.Width) * Scale;
        const double ScaledHeight = static_cast<double>(Wallpaper.Height) * Scale;
        const double OffsetX = (MonitorWidth - ScaledWidth) / 2.0;
        const double OffsetY = (MonitorHeight - ScaledHeight) / 2.0;

        BITMAPINFO BitmapInformation { };
        BitmapInformation.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        BitmapInformation.bmiHeader.biWidth = DestinationWidth;
        BitmapInformation.bmiHeader.biHeight = -DestinationHeight;
        BitmapInformation.bmiHeader.biPlanes = 1;
        BitmapInformation.bmiHeader.biBitCount = 32;
        BitmapInformation.bmiHeader.biCompression = BI_RGB;

        void* Bits = nullptr;
        const HBITMAP CropBitmap = CreateDIBSection(
            nullptr,
            &BitmapInformation,
            DIB_RGB_COLORS,
            &Bits,
            nullptr,
            0
        );

        if (CropBitmap == nullptr || Bits == nullptr)
        {
            return nullptr;
        }

        const auto MaximumSourceX = static_cast<double>(Wallpaper.Width) - 1.0;
        const auto MaximumSourceY = static_cast<double>(Wallpaper.Height) - 1.0;
        auto* DestinationPixels = static_cast<BYTE*>(Bits);
        const auto DestinationStride = static_cast<std::size_t>(DestinationWidth) * 4;
        const auto SourceStride = static_cast<std::size_t>(Wallpaper.Width) * 4;

        for (int Y = 0; Y < DestinationHeight; ++Y)
        {
            const double ScreenY = static_cast<double>(
                TargetBounds.top - MonitorBounds.top + Y
            );
            const double SourceY = std::clamp(
                (ScreenY - OffsetY) / Scale,
                0.0,
                MaximumSourceY
            );
            BYTE* DestinationRow = DestinationPixels +
                static_cast<std::size_t>(Y) * DestinationStride;
            const BYTE* SourceRow = Wallpaper.Pixels.data() +
                static_cast<std::size_t>(SourceY) * SourceStride;

            for (int X = 0; X < DestinationWidth; ++X)
            {
                const double ScreenX = static_cast<double>(
                    TargetBounds.left - MonitorBounds.left + X
                );
                const double SourceX = std::clamp(
                    (ScreenX - OffsetX) / Scale,
                    0.0,
                    MaximumSourceX
                );
                const BYTE* SourcePixel = SourceRow +
                    static_cast<std::size_t>(SourceX) * 4;
                BYTE* DestinationPixel = DestinationRow +
                    static_cast<std::size_t>(X) * 4;

                DestinationPixel[0] = SourcePixel[0];
                DestinationPixel[1] = SourcePixel[1];
                DestinationPixel[2] = SourcePixel[2];
                DestinationPixel[3] = 255;
            }
        }

        return CropBitmap;
    }

    bool CreateIsolationWindow(
        HWND TargetWindow,
        const WallpaperBitmap* Wallpaper,
        const RECT& MonitorBounds
    )
    {
        RECT Bounds { };

        if (GetWindowRect(TargetWindow, &Bounds) == FALSE)
        {
            return true;
        }

        const LONG_PTR TargetExtendedStyle = GetWindowLongPtrW(
            TargetWindow,
            GWL_EXSTYLE
        );
        DWORD ExtendedStyle = WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW;

        if ((TargetExtendedStyle & WS_EX_TOPMOST) != 0)
        {
            ExtendedStyle |= WS_EX_TOPMOST;
        }

        const HWND IsolationWindow = CreateWindowExW(
            ExtendedStyle,
            IsolationWindowClassName,
            L"",
            WS_POPUP,
            Bounds.left,
            Bounds.top,
            Bounds.right - Bounds.left,
            Bounds.bottom - Bounds.top,
            TargetWindow,
            nullptr,
            IsolationInstance,
            nullptr
        );

        if (IsolationWindow == nullptr)
        {
            return false;
        }

        IsolationWindows.push_back(IsolationWindow);

        if (Wallpaper != nullptr)
        {
            const HBITMAP Crop = CreateWallpaperCrop(*Wallpaper, MonitorBounds, Bounds);

            if (Crop != nullptr)
            {
                SetWindowLongPtrW(
                    IsolationWindow,
                    GWLP_USERDATA,
                    reinterpret_cast<LONG_PTR>(Crop)
                );
            }
        }

        HWND InsertAfter = GetWindow(TargetWindow, GW_HWNDPREV);

        if (InsertAfter == nullptr)
        {
            InsertAfter = (TargetExtendedStyle & WS_EX_TOPMOST) != 0
                ? HWND_TOPMOST
                : HWND_TOP;
        }

        return SetWindowPos(
            IsolationWindow,
            InsertAfter,
            Bounds.left,
            Bounds.top,
            Bounds.right - Bounds.left,
            Bounds.bottom - Bounds.top,
            SWP_NOACTIVATE | SWP_SHOWWINDOW
        ) != FALSE;
    }
}

Napi::Value ShowIsolation(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsArray())
    {
        return Out.Fail("ShowIsolation requires an array of window handles.");
    }

    std::unordered_set<HWND> ExcludedWindows;

    if (!DecodeExcludedWindows(
        CallbackInfo[0].As<Napi::Array>(),
        ExcludedWindows
    ))
    {
        return Out.Fail("Every excluded window handle must be a nonzero bigint.");
    }

    EnumerationContext Context { ExcludedWindows };

    if (EnumWindows(CollectWindow, reinterpret_cast<LPARAM>(&Context)) == FALSE)
    {
        return Out.Fail(Context.Failed
            ? "Could not store every top-level window."
            : "Could not enumerate top-level windows.");
    }

    std::string ErrorMessage;

    if (!EnsureIsolationWindowClass(ErrorMessage))
    {
        return Out.Fail(ErrorMessage);
    }

    if (!DestroyIsolationWindows())
    {
        return Out.Fail("Could not replace the existing isolation windows.");
    }

    try
    {
        IsolationWindows.reserve(Context.Windows.size());
    }
    catch (const std::exception& Error)
    {
        return Out.Fail(Error.what());
    }

    const RECT MonitorBounds {
        0,
        0,
        GetSystemMetrics(SM_CXSCREEN),
        GetSystemMetrics(SM_CYSCREEN)
    };
    const std::optional<WallpaperBitmap> Wallpaper = LoadWallpaperBitmap();

    for (const HWND Window : Context.Windows)
    {
        if (!CreateIsolationWindow(
            Window,
            Wallpaper.has_value() ? &Wallpaper.value() : nullptr,
            MonitorBounds
        ))
        {
            DestroyIsolationWindows();
            return Out.Fail("Could not create every isolation window.");
        }
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value ClearIsolation(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 0)
    {
        return Out.Fail("ClearIsolation does not accept arguments.");
    }

    if (!DestroyIsolationWindows())
    {
        return Out.Fail("Could not destroy every isolation window.");
    }

    return Out.Succeed(Environment.Undefined());
}

void CleanupIsolation(void*)
{
    DestroyIsolationWindows();

    if (OwnsIsolationWindowClass && IsolationInstance != nullptr)
    {
        UnregisterClassW(IsolationWindowClassName, IsolationInstance);
    }

    IsolationInstance = nullptr;
    OwnsIsolationWindowClass = false;
}
