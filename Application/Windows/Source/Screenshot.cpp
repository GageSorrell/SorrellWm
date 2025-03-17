/* File:      Screenshot.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "Screenshot.h"

#include <gdiplus.h>
#include <objidl.h>
#include <cstdlib>
#include "Core/Log.h"
#include "Core/String.h"
#include "Core/Utility.h"

DEFINE_LOG_CATEGORY(Screenshot)

static std::string Base64Encode(const std::vector<BYTE> &BinaryData)
{
    static const char Base64Table[] =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    std::string EncodedString;
    size_t BinaryDataSize = BinaryData.size();
    EncodedString.reserve(((BinaryDataSize + 2) / 3) * 4);

    size_t DataIndex = 0;
    while (DataIndex < BinaryDataSize)
    {
        // Read up to 3 bytes at a time.
        unsigned long Value = 0;
        int ByteCount = 0;
        for (; ByteCount < 3 && DataIndex < BinaryDataSize; ++ByteCount, ++DataIndex)
        {
            Value = (Value << 8) | BinaryData[DataIndex];
        }

        // Encode into four Base64 characters.
        int BitsToShift = (ByteCount - 1) * 8;
        for (int OutputIndex = 0; OutputIndex < 4; ++OutputIndex)
        {
            if (OutputIndex <= ByteCount)
            {
                int Index = (Value >> (BitsToShift - 6 * OutputIndex)) & 0x3F;
                EncodedString.push_back(Base64Table[Index]);
            }
            else
            {
                // If fewer than 3 bytes were read, pad with '='.
                EncodedString.push_back('=');
            }
        }
    }

    return EncodedString;
}

// Napi::Value GetScreenshot(const Napi::CallbackInfo& CallbackInfo)
// {
//     Napi::Env Environment = CallbackInfo.Env();

//     RECT Bounds = DecodeRect(CallbackInfo[0].As<Napi::Object>());

//     int32_t Width = Bounds.right - Bounds.left;
//     int32_t Height = Bounds.bottom - Bounds.top;
//     int32_t ChannelsNum = 3;

//     const int32_t FairlyHighResolution = 3840 * 2160 * ChannelsNum;

//     std::vector<BYTE> ScreenshotData(FairlyHighResolution);
//     BYTE* Screenshot = nullptr;
//     LPBITMAPINFO ScreenshotBmi = nullptr;

//     HDC ScreenDc = GetDC(nullptr);

//     HDC HdcMemDC = CreateCompatibleDC(ScreenDc);
//     if (!HdcMemDC)
//     {
//         LOG
//             << ELogLevel::Error
//             << "Failed to create compatible DC."
//             << std::endl;

//         ReleaseDC(nullptr, ScreenDc);
//         return Environment.Undefined();
//     }

//     ScreenshotData.reserve(Width * Height * ChannelsNum);
//     Screenshot = ScreenshotData.data();

//     HBITMAP BitmapHandle = CreateDIBSection(
//         ScreenDc,
//         ScreenshotBmi,
//         DIB_RGB_COLORS,
//         (void**) Screenshot,
//         nullptr,
//         0
//     );

//     if (!BitmapHandle)
//     {
//         LOG
//             << ELogLevel::Error
//             << "Failed to create DIB section."
//             << GetLastWindowsError()
//             << std::endl;

//         DeleteDC(HdcMemDC);
//         ReleaseDC(nullptr, ScreenDc);
//         return Environment.Undefined();
//     }
//     else
//     {
//         // LOG << "Made DIB Section." << std::endl;
//     }

//     HGDIOBJ OldHandle = SelectObject(HdcMemDC, BitmapHandle);
//     if (!OldHandle)
//     {
//         LOG
//             << ELogLevel::Error
//             << "Failed to select bitmap into DC."
//             << std::endl;
//         LogLastWindowsError();
//         DeleteObject(BitmapHandle);
//         DeleteDC(HdcMemDC);
//         ReleaseDC(nullptr, ScreenDc);

//         return Environment.Undefined();
//     }
//     else
//     {
//         // LOG << "hOld has been selected." << std::endl;
//         return Environment.Undefined();
//     }

//     BOOL BltSuccess = BitBlt(
//         HdcMemDC,
//         0,
//         0,
//         Width,
//         Height,
//         ScreenDc,
//         Bounds.left,
//         Bounds.top,
//         SRCCOPY
//     );

//     if (!BltSuccess)
//     {
//         LOG
//             << ELogLevel::Error
//             << "BitBlt failed."
//             << std::endl;
//         SelectObject(HdcMemDC, OldHandle);
//         DeleteObject(BitmapHandle);
//         DeleteDC(HdcMemDC);
//         ReleaseDC(nullptr, ScreenDc);

//         return Environment.Undefined();
//     }
//     else
//     {
//         // LOG << "CaptureWindowScreenshot: BitBlt call is GOOD." <<
//         // std::endl;
//         return Environment.Undefined();
//     }

//     SIZE_T BufferSize = static_cast<SIZE_T>(Width) * Height * ChannelsNum;
//     ScreenshotData.reserve(BufferSize);

//     if (!Screenshot)
//     {
//         LOG
//             << ELogLevel::Error
//             << "Failed to allocate memory for screenshot."
//             << std::endl;

//         LogLastWindowsError();
//         SelectObject(HdcMemDC, OldHandle);
//         DeleteObject(BitmapHandle);
//         DeleteDC(HdcMemDC);
//         ReleaseDC(nullptr, ScreenDc);

//         return Environment.Undefined();
//     }
//     else
//     {
//         // std::cout << "Screenshot is GOOD!" << std::endl;
//     }

//     const int32_t ScanLines = GetDIBits(
//         ScreenDc,
//         BitmapHandle,
//         0,
//         Height,
//         Screenshot,
//         ScreenshotBmi,
//         DIB_RGB_COLORS
//     );

//     if (ScanLines == 0)
//     {
//         std::cout << "GetDIBits failed." << std::endl;
//         LogLastWindowsError();
//         Screenshot = nullptr;
//     }
//     else
//     {
//         // std::cout << "There are " << scanLines << " scanLines!" << std::endl;
//     }

//     Screenshot = ScreenshotData.data();

//     SelectObject(HdcMemDC, OldHandle);
//     DeleteObject(BitmapHandle);
//     DeleteDC(HdcMemDC);
//     ReleaseDC(nullptr, ScreenDc);

//     if (ScanLines == 0)
//     {
//         return Environment.Undefined();
//     }
//     else
//     {
//         std::string EncodedData = Base64Encode(ScreenshotData.data(), ScreenshotData.size());
//         std::string DataUrl = "data:image/bmp;base64," + EncodedData;
//         return Napi::String::New(Environment, DataUrl);
//     }
// }

Napi::Value GetScreenshot(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    RECT CaptureArea = DecodeRect(CallbackInfo[0].As<Napi::Object>());

    int32_t Width = CaptureArea.right - CaptureArea.left;
    int32_t Height = CaptureArea.bottom - CaptureArea.top;
    int32_t ChannelsNum = 3;

    const int32_t FairlyHighResolution = 3840 * 2160 * ChannelsNum;

    std::vector<BYTE> ScreenshotData(FairlyHighResolution);
    BYTE* Screenshot = nullptr;
    LPBITMAPINFO ScreenshotBmi = nullptr;

    HDC deviceContext = GetDC(nullptr);

    HDC memoryDeviceContext = CreateCompatibleDC(deviceContext);
    if (!memoryDeviceContext)
    {
        LOG
            << ELogLevel::Error
            << "Failed to create compatible DC."
            << std::endl;

        ReleaseDC(nullptr, deviceContext);
        return Environment.Undefined();
    }

    ScreenshotData.reserve(Width * Height * ChannelsNum);
    Screenshot = ScreenshotData.data();

    HBITMAP compatibleBitmap = CreateCompatibleBitmap(deviceContext, Width, Height);
    if (!compatibleBitmap)
    {
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("Failed to create compatible bitmap.");
    }

    // Select the new bitmap into the memory device context
    HGDIOBJ oldObject = SelectObject(memoryDeviceContext, compatibleBitmap);

    // Copy the specified rectangle from the desktop into our bitmap
    if (!BitBlt(memoryDeviceContext, 0, 0, Width, Height, deviceContext,
                CaptureArea.left, CaptureArea.top, SRCCOPY))
    {
        // Clean up
        SelectObject(memoryDeviceContext, oldObject);
        DeleteObject(compatibleBitmap);
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("BitBlt failed; could not copy desktop image.");
    }

    BITMAPINFO bitmapInfo;
    ZeroMemory(&bitmapInfo, sizeof(bitmapInfo));
    bitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    bitmapInfo.bmiHeader.biWidth = Width;
    bitmapInfo.bmiHeader.biHeight = Height; // positive => bottom-up DIB
    bitmapInfo.bmiHeader.biPlanes = 1;
    bitmapInfo.bmiHeader.biBitCount = 24; // 24 bits per pixel (RGB)
    bitmapInfo.bmiHeader.biCompression = BI_RGB;

    if (!GetDIBits(memoryDeviceContext, compatibleBitmap, 0, Height,
                   nullptr, &bitmapInfo, DIB_RGB_COLORS))
    {
        SelectObject(memoryDeviceContext, oldObject);
        DeleteObject(compatibleBitmap);
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("GetDIBits failed (size query).");
    }

    DWORD pixelDataSize = bitmapInfo.bmiHeader.biSizeImage;
    if (pixelDataSize == 0)
    {
        DWORD bytesPerRow = ((Width * bitmapInfo.bmiHeader.biBitCount + 31) / 32) * 4;
        pixelDataSize = bytesPerRow * Height;
    }

    DWORD fileHeaderSize = sizeof(BITMAPFILEHEADER);
    DWORD infoHeaderSize = sizeof(BITMAPINFOHEADER);
    DWORD totalSize = fileHeaderSize + infoHeaderSize + pixelDataSize;

    std::vector<BYTE> bmpBuffer(totalSize);
    BITMAPFILEHEADER *fileHeader = reinterpret_cast<BITMAPFILEHEADER*>(bmpBuffer.data());
    BITMAPINFOHEADER *infoHeader =
        reinterpret_cast<BITMAPINFOHEADER*>(bmpBuffer.data() + fileHeaderSize);

    fileHeader->bfType = 0x4D42; // 'BM'
    fileHeader->bfSize = totalSize;
    fileHeader->bfOffBits = fileHeaderSize + infoHeaderSize;
    fileHeader->bfReserved1 = 0;
    fileHeader->bfReserved2 = 0;

    *infoHeader = bitmapInfo.bmiHeader;

    BYTE *pixelData = bmpBuffer.data() + fileHeader->bfOffBits;
    if (!GetDIBits(memoryDeviceContext, compatibleBitmap, 0, Height,
                   pixelData, &bitmapInfo, DIB_RGB_COLORS))
    {
        SelectObject(memoryDeviceContext, oldObject);
        DeleteObject(compatibleBitmap);
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("GetDIBits failed (pixel extraction).");
    }

    SelectObject(memoryDeviceContext, oldObject);
    DeleteObject(compatibleBitmap);
    DeleteDC(memoryDeviceContext);
    ReleaseDC(nullptr, deviceContext);

    std::string base64Data = Base64Encode(bmpBuffer);

    std::string DataUri = "data:image/bmp;base64," + base64Data;
    return Napi::String::New(Environment, DataUri);
}

static int GetEncoderClsid(const WCHAR* Format, CLSID* pClsid)
{
    UINT Number = 0;
    UINT Size = 0;

    Gdiplus::GetImageEncodersSize(&Number, &Size);
    if (Size == 0)
    {
        return -1; // Failure
    }

    Gdiplus::ImageCodecInfo* ImageCodecInfoArray = (Gdiplus::ImageCodecInfo*)(malloc(Size));
    if (ImageCodecInfoArray == nullptr)
    {
        return -1; // Failure
    }

    Gdiplus::GetImageEncoders(Number, Size, ImageCodecInfoArray);
    for (UINT j = 0; j < Number; ++j)
    {
        if (wcscmp(ImageCodecInfoArray[j].MimeType, Format) == 0)
        {
            *pClsid = ImageCodecInfoArray[j].Clsid;
            free(ImageCodecInfoArray);
            return j;
        }
    }
    free(ImageCodecInfoArray);
    return -1;
}

Napi::Value CaptureScreenSectionToTempPngFile(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    RECT CaptureArea = DecodeRect(CallbackInfo[0].As<Napi::Object>());

    // Calculate capture dimensions.
    int Width = CaptureArea.right - CaptureArea.left;
    int Height = CaptureArea.bottom - CaptureArea.top;
    if (Width <= 0 || Height <= 0)
    {
        // throw std::runtime_error("Invalid capture dimensions.");
    }

    HDC DeviceContext = GetDC(nullptr);
    if (!DeviceContext)
    {
        // throw std::runtime_error("Failed to get desktop device context.");
    }

    HDC MemoryDeviceContext = CreateCompatibleDC(DeviceContext);
    if (!MemoryDeviceContext)
    {
        ReleaseDC(nullptr, DeviceContext);
        // throw std::runtime_error("Failed to create compatible device context.");
    }

    HBITMAP CompatibleBitmap = CreateCompatibleBitmap(DeviceContext, Width, Height);
    if (!CompatibleBitmap)
    {
        DeleteDC(MemoryDeviceContext);
        ReleaseDC(nullptr, DeviceContext);
        // throw std::runtime_error("Failed to create compatible bitmap.");
    }

    // Select the bitmap into the memory device context.
    HGDIOBJ OldObject = SelectObject(MemoryDeviceContext, CompatibleBitmap);

    // Copy the specified rectangle from the desktop.
    if (!BitBlt(MemoryDeviceContext, 0, 0, Width, Height,
                DeviceContext, CaptureArea.left, CaptureArea.top, SRCCOPY))
    {
        SelectObject(MemoryDeviceContext, OldObject);
        DeleteObject(CompatibleBitmap);
        DeleteDC(MemoryDeviceContext);
        ReleaseDC(nullptr, DeviceContext);
    }

    SelectObject(MemoryDeviceContext, OldObject);
    DeleteDC(MemoryDeviceContext);
    ReleaseDC(nullptr, DeviceContext);

    Gdiplus::Bitmap* PngBitmap = Gdiplus::Bitmap::FromHBITMAP(CompatibleBitmap, nullptr);
    DeleteObject(CompatibleBitmap);

    if (PngBitmap == nullptr)
    {
        // throw std::runtime_error("Failed to create GDI+ Bitmap from HBITMAP.");
    }

    wchar_t TempPathBuffer[MAX_PATH] = { 0 };
    DWORD TempPathLength = GetTempPathW(MAX_PATH, TempPathBuffer);
    if (TempPathLength == 0 || TempPathLength > MAX_PATH)
    {
        delete PngBitmap;
        // throw std::runtime_error("Failed to get temporary path.");
    }

    wchar_t TempFileName[MAX_PATH] = { 0 };
    if (!GetTempFileNameW(TempPathBuffer, L"PNG", 0, TempFileName))
    {
        delete PngBitmap;
        // throw std::runtime_error("Failed to generate temporary file name.");
    }

    std::wstring TempFilePath(TempFileName);
    size_t DotPosition = TempFilePath.rfind(L'.');
    if (DotPosition != std::wstring::npos)
    {
        TempFilePath = TempFilePath.substr(0, DotPosition) + L".png";
    }
    else
    {
        TempFilePath += L".png";
    }

    CLSID PngClsid;
    if (GetEncoderClsid(L"image/png", &PngClsid) == -1)
    {
        delete PngBitmap;
        // throw std::runtime_error("Failed to get PNG encoder CLSID.");
    }

    Gdiplus::Status SaveStatus = PngBitmap->Save(TempFilePath.c_str(), &PngClsid, nullptr);
    delete PngBitmap;

    if (SaveStatus != Gdiplus::Ok)
    {
        // throw std::runtime_error("Failed to save PNG file.");
    }

    return Napi::String::New(Environment, WStringToString(TempFilePath));
}
