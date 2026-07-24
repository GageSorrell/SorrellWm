/**
 *
 *
 * @module @sorrell/windows/Native/ScreenCapture
 *
 * @file      ScreenCapture.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./ScreenCapture.h"

#include <algorithm>
#include <array>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <dwmapi.h>
#include <limits>
#include <new>
#include <objidl.h>
#include <propkey.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <shobjidl_core.h>
#include <utility>
#include <wincodec.h>
#include <wrl/client.h>

namespace
{
    using Microsoft::WRL::ComPtr;

    struct Bitmap
    {
        UINT Width = 0;
        UINT Height = 0;
        UINT Stride = 0;
        std::vector<BYTE> Pixels;
    };

    class IconHandle
    {
    public:
        IconHandle() = default;

        IconHandle(HICON InValue, bool InIsOwned)
            : IsOwned(InIsOwned), Value(InValue) { }

        IconHandle(const IconHandle&) = delete;
        IconHandle& operator=(const IconHandle&) = delete;

        IconHandle(IconHandle&& Other) noexcept
            : IsOwned(Other.IsOwned), Value(Other.Value)
        {
            Other.IsOwned = false;
            Other.Value = nullptr;
        }

        IconHandle& operator=(IconHandle&& Other) noexcept
        {
            if (this != &Other)
            {
                Reset();
                IsOwned = Other.IsOwned;
                Value = Other.Value;
                Other.IsOwned = false;
                Other.Value = nullptr;
            }

            return *this;
        }

        ~IconHandle()
        {
            Reset();
        }

        HICON Get() const
        {
            return Value;
        }

        explicit operator bool() const
        {
            return Value != nullptr;
        }

    private:
        bool IsOwned = false;
        HICON Value = nullptr;

        void Reset()
        {
            if (IsOwned && Value != nullptr)
            {
                DestroyIcon(Value);
            }

            IsOwned = false;
            Value = nullptr;
        }
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

    std::optional<RECT> GetRectangleArgument(const Napi::Value& Value)
    {
        if (!Value.IsObject())
        {
            return std::nullopt;
        }

        const Napi::Object Box = Value.As<Napi::Object>();
        const Napi::Value Bottom = Box.Get("Bottom");
        const Napi::Value Left = Box.Get("Left");
        const Napi::Value Right = Box.Get("Right");
        const Napi::Value Top = Box.Get("Top");

        if (!Bottom.IsNumber() || !Left.IsNumber() ||
            !Right.IsNumber() || !Top.IsNumber())
        {
            return std::nullopt;
        }

        const auto ToLong = [](const Napi::Value& Coordinate) -> std::optional<LONG>
        {
            const double NumericCoordinate = Coordinate.As<Napi::Number>().DoubleValue();
            if (!std::isfinite(NumericCoordinate) ||
                NumericCoordinate < std::numeric_limits<LONG>::min() ||
                NumericCoordinate > std::numeric_limits<LONG>::max())
            {
                return std::nullopt;
            }

            return static_cast<LONG>(NumericCoordinate);
        };

        const std::optional<LONG> BottomCoordinate = ToLong(Bottom);
        const std::optional<LONG> LeftCoordinate = ToLong(Left);
        const std::optional<LONG> RightCoordinate = ToLong(Right);
        const std::optional<LONG> TopCoordinate = ToLong(Top);
        if (!BottomCoordinate.has_value() || !LeftCoordinate.has_value() ||
            !RightCoordinate.has_value() || !TopCoordinate.has_value())
        {
            return std::nullopt;
        }

        const RECT Rectangle {
            LeftCoordinate.value(),
            TopCoordinate.value(),
            RightCoordinate.value(),
            BottomCoordinate.value()
        };

        if (Rectangle.right <= Rectangle.left || Rectangle.bottom <= Rectangle.top)
        {
            return std::nullopt;
        }

        return Rectangle;
    }

    std::optional<HWND> GetWindowArgument(const Napi::Value& Value)
    {
        if (!Value.IsBigInt())
        {
            return std::nullopt;
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = Value
            .As<Napi::BigInt>()
            .Uint64Value(&IsLossless);
        const HWND WindowHandle = reinterpret_cast<HWND>(
            static_cast<std::uintptr_t>(NumericHandle)
        );

        if (!IsLossless || WindowHandle == nullptr || IsWindow(WindowHandle) == FALSE)
        {
            return std::nullopt;
        }

        return WindowHandle;
    }

    BOOL CALLBACK CollectMonitorRectangle(
        HMONITOR,
        HDC,
        LPRECT MonitorRectangle,
        LPARAM Context
    )
    {
        auto* MonitorRectangles = reinterpret_cast<std::vector<RECT>*>(Context);
        MonitorRectangles->push_back(*MonitorRectangle);
        return TRUE;
    }

    std::optional<RECT> Intersect(const RECT& Left, const RECT& Right)
    {
        RECT Intersection {
            std::max(Left.left, Right.left),
            std::max(Left.top, Right.top),
            std::min(Left.right, Right.right),
            std::min(Left.bottom, Right.bottom)
        };

        if (Intersection.right <= Intersection.left ||
            Intersection.bottom <= Intersection.top)
        {
            return std::nullopt;
        }

        return Intersection;
    }

    void SetOpaque(
        BYTE* Pixels,
        UINT Stride,
        const RECT& DestinationRectangle
    )
    {
        for (LONG Y = DestinationRectangle.top; Y < DestinationRectangle.bottom; ++Y)
        {
            BYTE* Row = Pixels + static_cast<std::size_t>(Y) * Stride;
            for (LONG X = DestinationRectangle.left; X < DestinationRectangle.right; ++X)
            {
                Row[static_cast<std::size_t>(X) * 4 + 3] = 255;
            }
        }
    }

    std::optional<Bitmap> CaptureRectangle(
        const RECT& Rectangle,
        std::string& Error
    )
    {
        const std::int64_t Width64 =
            static_cast<std::int64_t>(Rectangle.right) - Rectangle.left;
        const std::int64_t Height64 =
            static_cast<std::int64_t>(Rectangle.bottom) - Rectangle.top;
        if (Width64 <= 0 || Height64 <= 0 ||
            Width64 > std::numeric_limits<int>::max() ||
            Height64 > std::numeric_limits<int>::max())
        {
            Error = "Expected nonempty screen bounds with representable dimensions.";
            return std::nullopt;
        }

        const std::uint64_t Stride64 = static_cast<std::uint64_t>(Width64) * 4;
        const std::uint64_t ByteCount64 =
            Stride64 * static_cast<std::uint64_t>(Height64);
        if (Stride64 > std::numeric_limits<UINT>::max() ||
            ByteCount64 > std::numeric_limits<UINT>::max())
        {
            Error = "The requested screen capture is too large to encode as PNG.";
            return std::nullopt;
        }

        HDC ScreenDeviceContext = GetDC(nullptr);
        if (ScreenDeviceContext == nullptr)
        {
            Error = "Could not acquire the screen device context.";
            return std::nullopt;
        }

        HDC MemoryDeviceContext = CreateCompatibleDC(ScreenDeviceContext);
        if (MemoryDeviceContext == nullptr)
        {
            ReleaseDC(nullptr, ScreenDeviceContext);
            Error = "Could not create a screen-capture device context.";
            return std::nullopt;
        }

        BITMAPINFO BitmapInformation { };
        BitmapInformation.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        BitmapInformation.bmiHeader.biWidth = static_cast<LONG>(Width64);
        BitmapInformation.bmiHeader.biHeight = -static_cast<LONG>(Height64);
        BitmapInformation.bmiHeader.biPlanes = 1;
        BitmapInformation.bmiHeader.biBitCount = 32;
        BitmapInformation.bmiHeader.biCompression = BI_RGB;

        void* BitmapBits = nullptr;
        HBITMAP DeviceIndependentBitmap = CreateDIBSection(
            ScreenDeviceContext,
            &BitmapInformation,
            DIB_RGB_COLORS,
            &BitmapBits,
            nullptr,
            0
        );
        if (DeviceIndependentBitmap == nullptr || BitmapBits == nullptr)
        {
            DeleteDC(MemoryDeviceContext);
            ReleaseDC(nullptr, ScreenDeviceContext);
            Error = "Could not allocate the screen-capture bitmap.";
            return std::nullopt;
        }

        HGDIOBJ PreviousObject = SelectObject(
            MemoryDeviceContext,
            DeviceIndependentBitmap
        );
        if (PreviousObject == nullptr || PreviousObject == HGDI_ERROR)
        {
            DeleteObject(DeviceIndependentBitmap);
            DeleteDC(MemoryDeviceContext);
            ReleaseDC(nullptr, ScreenDeviceContext);
            Error = "Could not select the screen-capture bitmap.";
            return std::nullopt;
        }

        std::memset(BitmapBits, 0, static_cast<std::size_t>(ByteCount64));
        std::vector<RECT> MonitorRectangles;
        if (EnumDisplayMonitors(
            nullptr,
            nullptr,
            CollectMonitorRectangle,
            reinterpret_cast<LPARAM>(&MonitorRectangles)
        ) == FALSE)
        {
            SelectObject(MemoryDeviceContext, PreviousObject);
            DeleteObject(DeviceIndependentBitmap);
            DeleteDC(MemoryDeviceContext);
            ReleaseDC(nullptr, ScreenDeviceContext);
            Error = "Could not enumerate the user's screens.";
            return std::nullopt;
        }

        BYTE* Pixels = static_cast<BYTE*>(BitmapBits);
        for (const RECT& MonitorRectangle : MonitorRectangles)
        {
            const std::optional<RECT> VisibleRectangle =
                Intersect(Rectangle, MonitorRectangle);
            if (!VisibleRectangle.has_value())
            {
                continue;
            }

            const int DestinationX = VisibleRectangle->left - Rectangle.left;
            const int DestinationY = VisibleRectangle->top - Rectangle.top;
            const int CaptureWidth =
                VisibleRectangle->right - VisibleRectangle->left;
            const int CaptureHeight =
                VisibleRectangle->bottom - VisibleRectangle->top;
            if (BitBlt(
                MemoryDeviceContext,
                DestinationX,
                DestinationY,
                CaptureWidth,
                CaptureHeight,
                ScreenDeviceContext,
                VisibleRectangle->left,
                VisibleRectangle->top,
                SRCCOPY | CAPTUREBLT
            ) == FALSE)
            {
                SelectObject(MemoryDeviceContext, PreviousObject);
                DeleteObject(DeviceIndependentBitmap);
                DeleteDC(MemoryDeviceContext);
                ReleaseDC(nullptr, ScreenDeviceContext);
                Error = "Could not copy pixels from one of the user's screens.";
                return std::nullopt;
            }

            const RECT DestinationRectangle {
                DestinationX,
                DestinationY,
                DestinationX + CaptureWidth,
                DestinationY + CaptureHeight
            };
            SetOpaque(
                Pixels,
                static_cast<UINT>(Stride64),
                DestinationRectangle
            );
        }

        Bitmap CapturedBitmap {
            static_cast<UINT>(Width64),
            static_cast<UINT>(Height64),
            static_cast<UINT>(Stride64),
            std::vector<BYTE>(
                Pixels,
                Pixels + static_cast<std::size_t>(ByteCount64)
            )
        };

        SelectObject(MemoryDeviceContext, PreviousObject);
        DeleteObject(DeviceIndependentBitmap);
        DeleteDC(MemoryDeviceContext);
        ReleaseDC(nullptr, ScreenDeviceContext);
        return CapturedBitmap;
    }

    bool EncodePng(
        const Bitmap& CapturedBitmap,
        std::vector<BYTE>& Png,
        std::string& Error
    )
    {
        ComApartment Apartment;
        if (!Apartment.IsReady())
        {
            Error = "Could not initialize COM for PNG encoding.";
            return false;
        }

        ComPtr<IWICImagingFactory> ImagingFactory;
        HRESULT OperationResult = CoCreateInstance(
            CLSID_WICImagingFactory,
            nullptr,
            CLSCTX_INPROC_SERVER,
            IID_PPV_ARGS(ImagingFactory.ReleaseAndGetAddressOf())
        );
        if (FAILED(OperationResult))
        {
            Error = "Could not create the Windows Imaging Component factory.";
            return false;
        }

        ComPtr<IStream> Stream;
        OperationResult = CreateStreamOnHGlobal(
            nullptr,
            TRUE,
            Stream.ReleaseAndGetAddressOf()
        );
        if (FAILED(OperationResult))
        {
            Error = "Could not create the in-memory PNG stream.";
            return false;
        }

        ComPtr<IWICBitmapEncoder> Encoder;
        OperationResult = ImagingFactory->CreateEncoder(
            GUID_ContainerFormatPng,
            nullptr,
            Encoder.ReleaseAndGetAddressOf()
        );
        if (FAILED(OperationResult) ||
            FAILED(Encoder->Initialize(Stream.Get(), WICBitmapEncoderNoCache)))
        {
            Error = "Could not initialize the PNG encoder.";
            return false;
        }

        ComPtr<IWICBitmapFrameEncode> Frame;
        ComPtr<IPropertyBag2> EncoderOptions;
        OperationResult = Encoder->CreateNewFrame(
            Frame.ReleaseAndGetAddressOf(),
            EncoderOptions.ReleaseAndGetAddressOf()
        );
        if (FAILED(OperationResult) ||
            FAILED(Frame->Initialize(EncoderOptions.Get())) ||
            FAILED(Frame->SetSize(CapturedBitmap.Width, CapturedBitmap.Height)))
        {
            Error = "Could not initialize the PNG frame.";
            return false;
        }

        WICPixelFormatGUID PixelFormat = GUID_WICPixelFormat32bppBGRA;
        OperationResult = Frame->SetPixelFormat(&PixelFormat);
        if (FAILED(OperationResult) ||
            !IsEqualGUID(PixelFormat, GUID_WICPixelFormat32bppBGRA))
        {
            Error = "The Windows PNG encoder does not support BGRA pixels.";
            return false;
        }

        OperationResult = Frame->WritePixels(
            CapturedBitmap.Height,
            CapturedBitmap.Stride,
            static_cast<UINT>(CapturedBitmap.Pixels.size()),
            const_cast<BYTE*>(CapturedBitmap.Pixels.data())
        );
        if (FAILED(OperationResult) ||
            FAILED(Frame->Commit()) ||
            FAILED(Encoder->Commit()))
        {
            Error = "Could not encode the captured pixels as PNG.";
            return false;
        }

        STATSTG StreamStatistics { };
        if (FAILED(Stream->Stat(&StreamStatistics, STATFLAG_NONAME)) ||
            StreamStatistics.cbSize.QuadPart <= 0 ||
            StreamStatistics.cbSize.QuadPart >
                static_cast<ULONGLONG>(std::numeric_limits<std::size_t>::max()))
        {
            Error = "Could not determine the encoded PNG size.";
            return false;
        }

        HGLOBAL StreamMemory = nullptr;
        if (FAILED(GetHGlobalFromStream(Stream.Get(), &StreamMemory)) ||
            StreamMemory == nullptr)
        {
            Error = "Could not access the encoded PNG memory.";
            return false;
        }

        const void* StreamBytes = GlobalLock(StreamMemory);
        if (StreamBytes == nullptr)
        {
            Error = "Could not lock the encoded PNG memory.";
            return false;
        }

        const std::size_t PngSize =
            static_cast<std::size_t>(StreamStatistics.cbSize.QuadPart);
        const BYTE* FirstByte = static_cast<const BYTE*>(StreamBytes);
        Png.assign(FirstByte, FirstByte + PngSize);
        GlobalUnlock(StreamMemory);
        return true;
    }

    bool IconToBitmap(
        HICON Icon,
        Bitmap& ConvertedBitmap,
        std::string& Error
    )
    {
        ComApartment Apartment;
        if (!Apartment.IsReady())
        {
            Error = "Could not initialize COM for icon conversion.";
            return false;
        }

        ComPtr<IWICImagingFactory> ImagingFactory;
        HRESULT OperationResult = CoCreateInstance(
            CLSID_WICImagingFactory,
            nullptr,
            CLSCTX_INPROC_SERVER,
            IID_PPV_ARGS(ImagingFactory.ReleaseAndGetAddressOf())
        );
        if (FAILED(OperationResult))
        {
            Error = "Could not create the Windows Imaging Component factory.";
            return false;
        }

        ComPtr<IWICBitmap> IconBitmap;
        OperationResult = ImagingFactory->CreateBitmapFromHICON(
            Icon,
            IconBitmap.ReleaseAndGetAddressOf()
        );
        if (FAILED(OperationResult))
        {
            Error = "Could not convert the application icon to a bitmap.";
            return false;
        }

        ComPtr<IWICBitmapSource> ConvertedSource;
        OperationResult = WICConvertBitmapSource(
            GUID_WICPixelFormat32bppBGRA,
            IconBitmap.Get(),
            ConvertedSource.ReleaseAndGetAddressOf()
        );
        if (FAILED(OperationResult))
        {
            Error = "Could not convert the application icon to BGRA pixels.";
            return false;
        }

        UINT Width = 0;
        UINT Height = 0;
        if (FAILED(ConvertedSource->GetSize(&Width, &Height)) ||
            Width == 0 || Height == 0)
        {
            Error = "The application icon does not have valid dimensions.";
            return false;
        }

        const std::uint64_t Stride64 = static_cast<std::uint64_t>(Width) * 4;
        const std::uint64_t ByteCount64 =
            Stride64 * static_cast<std::uint64_t>(Height);
        if (Stride64 > std::numeric_limits<UINT>::max() ||
            ByteCount64 > std::numeric_limits<UINT>::max())
        {
            Error = "The application icon is too large to encode.";
            return false;
        }

        ConvertedBitmap.Width = Width;
        ConvertedBitmap.Height = Height;
        ConvertedBitmap.Stride = static_cast<UINT>(Stride64);
        ConvertedBitmap.Pixels.resize(static_cast<std::size_t>(ByteCount64));
        if (FAILED(ConvertedSource->CopyPixels(
            nullptr,
            ConvertedBitmap.Stride,
            static_cast<UINT>(ConvertedBitmap.Pixels.size()),
            ConvertedBitmap.Pixels.data()
        )))
        {
            Error = "Could not read the application icon pixels.";
            return false;
        }

        return true;
    }

    IconHandle ExtractIconResource(const std::wstring& Resource)
    {
        if (Resource.empty())
        {
            return { };
        }

        std::vector<wchar_t> MutableResource(Resource.begin(), Resource.end());
        MutableResource.push_back(L'\0');
        const int IconIndex = PathParseIconLocationW(MutableResource.data());

        const DWORD ExpandedLength = ExpandEnvironmentStringsW(
            MutableResource.data(),
            nullptr,
            0
        );
        if (ExpandedLength == 0)
        {
            return { };
        }

        std::vector<wchar_t> ExpandedPath(ExpandedLength);
        if (ExpandEnvironmentStringsW(
            MutableResource.data(),
            ExpandedPath.data(),
            ExpandedLength
        ) == 0)
        {
            return { };
        }

        HICON LargeIcon = nullptr;
        HICON SmallIcon = nullptr;
        if (ExtractIconExW(
            ExpandedPath.data(),
            IconIndex,
            &LargeIcon,
            &SmallIcon,
            1
        ) == 0)
        {
            return { };
        }

        if (LargeIcon != nullptr)
        {
            if (SmallIcon != nullptr)
            {
                DestroyIcon(SmallIcon);
            }

            return IconHandle(LargeIcon, true);
        }

        return IconHandle(SmallIcon, true);
    }

    std::wstring GetStringProperty(
        IPropertyStore* PropertyStore,
        REFPROPERTYKEY Key
    )
    {
        PROPVARIANT Value;
        PropVariantInit(&Value);
        if (FAILED(PropertyStore->GetValue(Key, &Value)))
        {
            PropVariantClear(&Value);
            return { };
        }

        std::wstring Out;
        if (Value.vt == VT_LPWSTR && Value.pwszVal != nullptr)
        {
            Out = Value.pwszVal;
        }
        else if (Value.vt == VT_BSTR && Value.bstrVal != nullptr)
        {
            Out.assign(
                Value.bstrVal,
                static_cast<std::size_t>(SysStringLen(Value.bstrVal))
            );
        }

        PropVariantClear(&Value);
        return Out;
    }

    bool GetBooleanProperty(
        IPropertyStore* PropertyStore,
        REFPROPERTYKEY Key
    )
    {
        PROPVARIANT Value;
        PropVariantInit(&Value);
        const bool Out = SUCCEEDED(PropertyStore->GetValue(Key, &Value)) &&
            Value.vt == VT_BOOL &&
            Value.boolVal != VARIANT_FALSE;
        PropVariantClear(&Value);
        return Out;
    }

    IconHandle GetRelaunchIcon(HWND WindowHandle)
    {
        ComApartment Apartment;
        if (!Apartment.IsReady())
        {
            return { };
        }

        ComPtr<IPropertyStore> PropertyStore;
        if (FAILED(SHGetPropertyStoreForWindow(
            WindowHandle,
            IID_PPV_ARGS(PropertyStore.ReleaseAndGetAddressOf())
        )))
        {
            return { };
        }

        if (GetBooleanProperty(
            PropertyStore.Get(),
            PKEY_AppUserModel_PreventPinning
        ) || GetStringProperty(
            PropertyStore.Get(),
            PKEY_AppUserModel_ID
        ).empty())
        {
            return { };
        }

        return ExtractIconResource(GetStringProperty(
            PropertyStore.Get(),
            PKEY_AppUserModel_RelaunchIconResource
        ));
    }

    IconHandle GetWindowDefinedIcon(HWND WindowHandle)
    {
        const UINT Dpi = GetDpiForWindow(WindowHandle);
        for (const WPARAM IconType : {
            static_cast<WPARAM>(ICON_BIG),
            static_cast<WPARAM>(ICON_SMALL2),
            static_cast<WPARAM>(ICON_SMALL)
        })
        {
            DWORD_PTR MessageResult = 0;
            if (SendMessageTimeoutW(
                WindowHandle,
                WM_GETICON,
                IconType,
                static_cast<LPARAM>(Dpi == 0 ? 96 : Dpi),
                SMTO_ABORTIFHUNG | SMTO_BLOCK | SMTO_ERRORONEXIT,
                200,
                &MessageResult
            ) != 0 && MessageResult != 0)
            {
                return IconHandle(
                    reinterpret_cast<HICON>(
                        static_cast<std::uintptr_t>(MessageResult)
                    ),
                    false
                );
            }
        }

        for (const int IconIndex : { GCLP_HICON, GCLP_HICONSM })
        {
            SetLastError(ERROR_SUCCESS);
            const ULONG_PTR IconValue = static_cast<ULONG_PTR>(
                GetClassLongPtrW(WindowHandle, IconIndex)
            );
            if (IconValue != 0)
            {
                return IconHandle(
                    reinterpret_cast<HICON>(IconValue),
                    false
                );
            }
        }

        return { };
    }

    IconHandle GetExecutableIcon(HWND WindowHandle)
    {
        DWORD ProcessId = 0;
        GetWindowThreadProcessId(WindowHandle, &ProcessId);
        if (ProcessId == 0)
        {
            return { };
        }

        HANDLE Process = OpenProcess(
            PROCESS_QUERY_LIMITED_INFORMATION,
            FALSE,
            ProcessId
        );
        if (Process == nullptr)
        {
            return { };
        }

        std::vector<wchar_t> ExecutablePath(32768);
        DWORD PathLength = static_cast<DWORD>(ExecutablePath.size());
        const BOOL QueryResult = QueryFullProcessImageNameW(
            Process,
            0,
            ExecutablePath.data(),
            &PathLength
        );
        CloseHandle(Process);
        if (QueryResult == FALSE || PathLength == 0)
        {
            return { };
        }

        ExecutablePath[PathLength] = L'\0';
        ComApartment Apartment;
        if (!Apartment.IsReady())
        {
            return { };
        }

        SHFILEINFOW FileInformation { };
        if (SHGetFileInfoW(
            ExecutablePath.data(),
            0,
            &FileInformation,
            sizeof(FileInformation),
            SHGFI_ICON | SHGFI_LARGEICON
        ) == 0 || FileInformation.hIcon == nullptr)
        {
            return { };
        }

        return IconHandle(FileInformation.hIcon, true);
    }

    IconHandle FindWindowIcon(HWND WindowHandle)
    {
        IconHandle Icon = GetRelaunchIcon(WindowHandle);
        if (Icon)
        {
            return Icon;
        }

        Icon = GetWindowDefinedIcon(WindowHandle);
        if (Icon)
        {
            return Icon;
        }

        return GetExecutableIcon(WindowHandle);
    }

    std::string Base64Encode(const std::vector<BYTE>& Bytes)
    {
        constexpr std::array<char, 64> Alphabet {
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '+', '/'
        };

        std::string Encoded;
        Encoded.reserve(((Bytes.size() + 2) / 3) * 4);
        for (std::size_t Index = 0; Index < Bytes.size(); Index += 3)
        {
            const std::uint32_t First = Bytes[Index];
            const std::uint32_t Second =
                Index + 1 < Bytes.size() ? Bytes[Index + 1] : 0;
            const std::uint32_t Third =
                Index + 2 < Bytes.size() ? Bytes[Index + 2] : 0;
            const std::uint32_t Group = (First << 16) | (Second << 8) | Third;

            Encoded.push_back(Alphabet[(Group >> 18) & 0x3F]);
            Encoded.push_back(Alphabet[(Group >> 12) & 0x3F]);
            Encoded.push_back(
                Index + 1 < Bytes.size() ? Alphabet[(Group >> 6) & 0x3F] : '='
            );
            Encoded.push_back(
                Index + 2 < Bytes.size() ? Alphabet[Group & 0x3F] : '='
            );
        }

        return Encoded;
    }

    bool IsArranged(HWND WindowHandle)
    {
        using IsWindowArrangedFunction = BOOL(WINAPI*)(HWND);
        const HMODULE User32Module = GetModuleHandleW(L"user32.dll");
        if (User32Module == nullptr)
        {
            return false;
        }

        const auto Function = reinterpret_cast<IsWindowArrangedFunction>(
            GetProcAddress(User32Module, "IsWindowArranged")
        );
        return Function != nullptr && Function(WindowHandle) != FALSE;
    }

    std::optional<int> GetRoundedCornerRadius(HWND WindowHandle)
    {
        BOOL CompositionEnabled = FALSE;
        if (FAILED(DwmIsCompositionEnabled(&CompositionEnabled)) ||
            CompositionEnabled == FALSE ||
            IsIconic(WindowHandle) != FALSE ||
            IsZoomed(WindowHandle) != FALSE ||
            IsArranged(WindowHandle))
        {
            return std::nullopt;
        }

        const LONG_PTR ExtendedStyle =
            GetWindowLongPtrW(WindowHandle, GWL_EXSTYLE);
        if ((ExtendedStyle & WS_EX_LAYERED) != 0)
        {
            return std::nullopt;
        }

        DWM_WINDOW_CORNER_PREFERENCE Preference = DWMWCP_DEFAULT;
        if (FAILED(DwmGetWindowAttribute(
            WindowHandle,
            DWMWA_WINDOW_CORNER_PREFERENCE,
            &Preference,
            sizeof(Preference)
        )) || Preference == DWMWCP_DONOTROUND)
        {
            return std::nullopt;
        }

        if (Preference == DWMWCP_DEFAULT)
        {
            const LONG_PTR Style = GetWindowLongPtrW(WindowHandle, GWL_STYLE);
            if ((Style & WS_CAPTION) == 0 || (Style & WS_THICKFRAME) == 0)
            {
                return std::nullopt;
            }
        }

        const int EffectiveRadius =
            Preference == DWMWCP_ROUNDSMALL ? 4 : 8;
        const UINT Dpi = GetDpiForWindow(WindowHandle);
        return std::max(1, MulDiv(EffectiveRadius, Dpi == 0 ? 96 : Dpi, 96));
    }

    BYTE CornerAlpha(
        UINT X,
        UINT Y,
        UINT Width,
        UINT Height,
        int Radius
    )
    {
        const UINT DistanceFromHorizontalEdge =
            std::min(X, Width - 1 - X);
        const UINT DistanceFromVerticalEdge =
            std::min(Y, Height - 1 - Y);
        if (DistanceFromHorizontalEdge >= static_cast<UINT>(Radius) ||
            DistanceFromVerticalEdge >= static_cast<UINT>(Radius))
        {
            return 255;
        }

        constexpr int SampleCount = 4;
        int InsideSamples = 0;
        for (int SampleY = 0; SampleY < SampleCount; ++SampleY)
        {
            for (int SampleX = 0; SampleX < SampleCount; ++SampleX)
            {
                const double Horizontal =
                    static_cast<double>(DistanceFromHorizontalEdge) +
                    (static_cast<double>(SampleX) + 0.5) / SampleCount;
                const double Vertical =
                    static_cast<double>(DistanceFromVerticalEdge) +
                    (static_cast<double>(SampleY) + 0.5) / SampleCount;
                const double DeltaX = Radius - Horizontal;
                const double DeltaY = Radius - Vertical;
                if (DeltaX * DeltaX + DeltaY * DeltaY <= Radius * Radius)
                {
                    ++InsideSamples;
                }
            }
        }

        return static_cast<BYTE>(
            (InsideSamples * 255 + SampleCount * SampleCount / 2) /
            (SampleCount * SampleCount)
        );
    }

    void ApplyWindowShape(
        Bitmap& CapturedBitmap,
        HWND WindowHandle,
        const RECT& CaptureBounds
    )
    {
        RECT WindowBounds { };
        GetWindowRect(WindowHandle, &WindowBounds);

        HRGN WindowRegion = CreateRectRgn(0, 0, 0, 0);
        const int RegionType = WindowRegion == nullptr
            ? ERROR
            : GetWindowRgn(WindowHandle, WindowRegion);
        if (RegionType != ERROR && RegionType != NULLREGION)
        {
            for (UINT Y = 0; Y < CapturedBitmap.Height; ++Y)
            {
                BYTE* Row = CapturedBitmap.Pixels.data() +
                    static_cast<std::size_t>(Y) * CapturedBitmap.Stride;
                for (UINT X = 0; X < CapturedBitmap.Width; ++X)
                {
                    const int RegionX =
                        CaptureBounds.left + static_cast<int>(X) - WindowBounds.left;
                    const int RegionY =
                        CaptureBounds.top + static_cast<int>(Y) - WindowBounds.top;
                    if (PtInRegion(WindowRegion, RegionX, RegionY) == FALSE)
                    {
                        Row[static_cast<std::size_t>(X) * 4 + 3] = 0;
                    }
                }
            }

            DeleteObject(WindowRegion);
            return;
        }

        if (WindowRegion != nullptr)
        {
            DeleteObject(WindowRegion);
        }

        const std::optional<int> Radius = GetRoundedCornerRadius(WindowHandle);
        if (!Radius.has_value())
        {
            return;
        }

        const int EffectiveRadius = std::min({
            Radius.value(),
            static_cast<int>(CapturedBitmap.Width / 2),
            static_cast<int>(CapturedBitmap.Height / 2)
        });
        if (EffectiveRadius <= 0)
        {
            return;
        }

        for (UINT Y = 0; Y < CapturedBitmap.Height; ++Y)
        {
            BYTE* Row = CapturedBitmap.Pixels.data() +
                static_cast<std::size_t>(Y) * CapturedBitmap.Stride;
            for (UINT X = 0; X < CapturedBitmap.Width; ++X)
            {
                BYTE& Alpha = Row[static_cast<std::size_t>(X) * 4 + 3];
                Alpha = static_cast<BYTE>(
                    (static_cast<unsigned int>(Alpha) * CornerAlpha(
                        X,
                        Y,
                        CapturedBitmap.Width,
                        CapturedBitmap.Height,
                        EffectiveRadius
                    )) / 255
                );
            }
        }
    }

    Napi::Value CaptureAsPng(
        const Napi::Env& Environment,
        const RECT& Rectangle,
        HWND WindowHandle = nullptr
    )
    {
        Result Out(Environment);
        try
        {
            std::string Error;
            std::optional<Bitmap> CapturedBitmap =
                CaptureRectangle(Rectangle, Error);
            if (!CapturedBitmap.has_value())
            {
                return Out.Fail(Error);
            }

            if (WindowHandle != nullptr)
            {
                ApplyWindowShape(CapturedBitmap.value(), WindowHandle, Rectangle);
            }

            std::vector<BYTE> Png;
            if (!EncodePng(CapturedBitmap.value(), Png, Error))
            {
                return Out.Fail(Error);
            }

            return Out.Succeed(Napi::String::New(Environment, Base64Encode(Png)));
        }
        catch (const std::bad_alloc&)
        {
            return Out.Fail("There was not enough memory for the screen capture.");
        }
    }
}

Napi::Value CaptureScreen(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    if (CallbackInfo.Length() != 1)
    {
        return Out.Fail("Expected one nonempty screen-bounds box.");
    }

    const std::optional<RECT> Rectangle =
        GetRectangleArgument(CallbackInfo[0]);
    if (!Rectangle.has_value())
    {
        return Out.Fail("Expected one nonempty screen-bounds box.");
    }

    return CaptureAsPng(Environment, Rectangle.value());
}

Napi::Value CaptureWindow(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    if (CallbackInfo.Length() != 1)
    {
        return Out.Fail("Expected one visible top-level window handle.");
    }

    const std::optional<HWND> WindowHandle =
        GetWindowArgument(CallbackInfo[0]);
    if (!WindowHandle.has_value() ||
        IsWindowVisible(WindowHandle.value()) == FALSE ||
        IsIconic(WindowHandle.value()) != FALSE ||
        (GetWindowLongPtrW(WindowHandle.value(), GWL_STYLE) & WS_CHILD) != 0)
    {
        return Out.Fail("Expected one visible, non-minimized top-level window handle.");
    }

    RECT Rectangle { };
    HRESULT BoundsResult = DwmGetWindowAttribute(
        WindowHandle.value(),
        DWMWA_EXTENDED_FRAME_BOUNDS,
        &Rectangle,
        sizeof(Rectangle)
    );
    if (FAILED(BoundsResult) &&
        GetWindowRect(WindowHandle.value(), &Rectangle) == FALSE)
    {
        return Out.Fail("Could not get the visible window bounds.");
    }

    if (Rectangle.right <= Rectangle.left || Rectangle.bottom <= Rectangle.top)
    {
        return Out.Fail("The window does not have nonempty visible bounds.");
    }

    return CaptureAsPng(Environment, Rectangle, WindowHandle.value());
}

Napi::Value GetWindowIcon(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    if (CallbackInfo.Length() != 1)
    {
        return Out.Fail("Expected one window handle.");
    }

    const std::optional<HWND> WindowHandle =
        GetWindowArgument(CallbackInfo[0]);
    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected one valid window handle.");
    }

    try
    {
        IconHandle Icon = FindWindowIcon(WindowHandle.value());
        if (!Icon)
        {
            return Out.Fail("The window's application does not expose an icon.");
        }

        std::string Error;
        Bitmap IconBitmap;
        std::vector<BYTE> Png;
        if (!IconToBitmap(Icon.Get(), IconBitmap, Error) ||
            !EncodePng(IconBitmap, Png, Error))
        {
            return Out.Fail(Error);
        }

        return Out.Succeed(Napi::String::New(Environment, Base64Encode(Png)));
    }
    catch (const std::bad_alloc&)
    {
        return Out.Fail("There was not enough memory to encode the window icon.");
    }
}
