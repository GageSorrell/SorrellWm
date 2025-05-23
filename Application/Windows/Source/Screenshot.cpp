/* File:      Screenshot.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#include "Screenshot.h"

#include <objidl.h>
#include <cstdlib>
#include "Core/Log.h"
#include "Core/String.h"
#include "Core/Utility.h"

// DEFINE_LOG_CATEGORY(Screenshot)

static std::string Base64Encode(const std::vector<BYTE> &BinaryData)
{
    static const char Base64Table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    std::string EncodedString;
    size_t BinaryDataSize = BinaryData.size();
    EncodedString.reserve(((BinaryDataSize + 2) / 3) * 4);

    size_t DataIndex = 0;
    while (DataIndex < BinaryDataSize)
    {
        unsigned long Value = 0;
        int ByteCount = 0;
        for (; ByteCount < 3 && DataIndex < BinaryDataSize; ++ByteCount, ++DataIndex)
        {
            Value = (Value << 8) | BinaryData[DataIndex];
        }

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
                EncodedString.push_back('=');
            }
        }
    }

    return EncodedString;
}

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
        std::cout
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
    }

    HGDIOBJ oldObject = SelectObject(memoryDeviceContext, compatibleBitmap);

    if (!BitBlt(memoryDeviceContext, 0, 0, Width, Height, deviceContext,
                CaptureArea.left, CaptureArea.top, SRCCOPY))
    {
        SelectObject(memoryDeviceContext, oldObject);
        DeleteObject(compatibleBitmap);
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
    }

    BITMAPINFO bitmapInfo;
    ZeroMemory(&bitmapInfo, sizeof(bitmapInfo));
    bitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    bitmapInfo.bmiHeader.biWidth = Width;
    bitmapInfo.bmiHeader.biHeight = Height;
    bitmapInfo.bmiHeader.biPlanes = 1;
    bitmapInfo.bmiHeader.biBitCount = 24;
    bitmapInfo.bmiHeader.biCompression = BI_RGB;

    if (!GetDIBits(memoryDeviceContext, compatibleBitmap, 0, Height,
                   nullptr, &bitmapInfo, DIB_RGB_COLORS))
    {
        SelectObject(memoryDeviceContext, oldObject);
        DeleteObject(compatibleBitmap);
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
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

    fileHeader->bfType = 0x4D42;
    fileHeader->bfSize = totalSize;
    fileHeader->bfOffBits = fileHeaderSize + infoHeaderSize;
    fileHeader->bfReserved1 = 0;
    fileHeader->bfReserved2 = 0;

    *infoHeader = bitmapInfo.bmiHeader;

    BYTE* pixelData = bmpBuffer.data() + fileHeader->bfOffBits;
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

void GetScreenshotNew(RECT CaptureArea, std::vector<BYTE>* ScreenshotData)
{
    int32_t Width = CaptureArea.right - CaptureArea.left;
    int32_t Height = CaptureArea.bottom - CaptureArea.top;
    int32_t ChannelsNum = 3;

    BYTE* Screenshot = nullptr;
    LPBITMAPINFO ScreenshotBmi = nullptr;

    HDC deviceContext = GetDC(nullptr);

    HDC memoryDeviceContext = CreateCompatibleDC(deviceContext);
    if (!memoryDeviceContext)
    {
        std::cout
            // << ELogLevel::Error
            << "Failed to create compatible DC."
            << std::endl;

        ReleaseDC(nullptr, deviceContext);
        return;
    }

    ScreenshotData->reserve(Width * Height * ChannelsNum);
    Screenshot = ScreenshotData->data();

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
    bitmapInfo.bmiHeader.biHeight = -1 * Height;
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
}

std::unique_ptr<Gdiplus::Bitmap> CaptureScreenSectionAsBitmap(const RECT &captureArea)
{
    // Calculate capture dimensions.
    int width = captureArea.right - captureArea.left;
    int height = captureArea.bottom - captureArea.top;
    if (width <= 0 || height <= 0)
    {
        // throw std::runtime_error("Invalid capture dimensions.");
    }

    HDC deviceContext = GetDC(nullptr);
    if (!deviceContext)
    {
        std::cout
            << "Failed to get desktop device context."
            << std::endl;
        // throw std::runtime_error("Failed to get desktop device context.");
    }

    HDC memoryDeviceContext = CreateCompatibleDC(deviceContext);
    if (!memoryDeviceContext)
    {
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("Failed to create compatible device context.");
        std::cout
            << "Failed to create compatible device context."
            << std::endl;
    }

    HBITMAP compatibleBitmap = CreateCompatibleBitmap(deviceContext, width, height);
    if (!compatibleBitmap)
    {
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("Failed to create compatible bitmap.");
        std::cout
            << "Failed to create compatible bitmap."
            << std::endl;
    }

    // Select the bitmap into the memory device context.
    HGDIOBJ oldObject = SelectObject(memoryDeviceContext, compatibleBitmap);

    // Copy the specified rectangle from the desktop.
    if (!BitBlt(memoryDeviceContext, 0, 0, width, height,
                deviceContext, captureArea.left, captureArea.top, SRCCOPY))
    {
        // Clean up if BitBlt fails.
        SelectObject(memoryDeviceContext, oldObject);
        DeleteObject(compatibleBitmap);
        DeleteDC(memoryDeviceContext);
        ReleaseDC(nullptr, deviceContext);
        // throw std::runtime_error("BitBlt failed.");
        std::cout
            << "BitBlt Failed."
            << std::endl;
    }

    // Restore and free resources.
    SelectObject(memoryDeviceContext, oldObject);
    DeleteDC(memoryDeviceContext);
    ReleaseDC(nullptr, deviceContext);

    // Create a GDI+ bitmap from the HBITMAP.
    Gdiplus::Bitmap* rawBitmap = Gdiplus::Bitmap::FromHBITMAP(compatibleBitmap, nullptr);
    DeleteObject(compatibleBitmap);

    if (rawBitmap == nullptr)
    {
        // throw std::runtime_error("Failed to create GDI+ Bitmap from HBITMAP.");
        std::cout
            << "Failed to create GDI+ Bitmap from HBITMAP."
            << std::endl;
    }

    // Wrap the raw pointer in a smart pointer for exception safety.
    std::cout
        << "CaptureScreenSectionAsBitmap succeeded."
        << std::endl;

    return std::unique_ptr<Gdiplus::Bitmap>(rawBitmap);
}

// This function uses the above capture function and writes the image to a temporary PNG,
// returning the path of that PNG.
Napi::Value CaptureScreenSectionToTempPngFile(const Napi::CallbackInfo &callbackInfo)
{
    Napi::Env environment = callbackInfo.Env();

    // Decode the capture-area rectangle from the JS argument.
    RECT captureArea = DecodeRect(callbackInfo[0].As<Napi::Object>());

    // Capture as a GDI+ Bitmap.
    std::unique_ptr<Gdiplus::Bitmap> pngBitmap = CaptureScreenSectionAsBitmap(captureArea);
    if (!pngBitmap)
    {
        // throw std::runtime_error("CaptureScreenSectionAsBitmap returned null.");
    }

    // Create a temporary file path for writing.
    wchar_t tempPathBuffer[MAX_PATH] = {0};
    DWORD tempPathLength = GetTempPathW(MAX_PATH, tempPathBuffer);
    if (tempPathLength == 0 || tempPathLength > MAX_PATH)
    {
        // throw std::runtime_error("Failed to get temporary path.");
    }

    wchar_t tempFileName[MAX_PATH] = {0};
    if (!GetTempFileNameW(tempPathBuffer, L"PNG", 0, tempFileName))
    {
        // throw std::runtime_error("Failed to generate temporary file name.");
    }

    // By default, GetTempFileNameW() might assign a .tmp extension; change it to .png
    std::wstring tempFilePath(tempFileName);
    size_t dotPosition = tempFilePath.rfind(L'.');
    if (dotPosition != std::wstring::npos)
    {
        tempFilePath = tempFilePath.substr(0, dotPosition) + L".png";
    }
    else
    {
        tempFilePath += L".png";
    }

    // Obtain the CLSID for the PNG encoder.
    CLSID pngClsid;
    if (GetEncoderClsid(L"image/png", &pngClsid) == -1)
    {
        // throw std::runtime_error("Failed to get PNG encoder CLSID.");
    }

    // Save the Bitmap as a PNG to the temporary path.
    Gdiplus::Status saveStatus = pngBitmap->Save(tempFilePath.c_str(), &pngClsid, nullptr);
    if (saveStatus != Gdiplus::Ok)
    {
        // throw std::runtime_error("Failed to save PNG file.");
    }

    return Napi::String::New(environment, WStringToString(tempFilePath));
}

Napi::Value WriteTaskbarIconToPng(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env& Environment = CallbackInfo.Env();

    HWND WindowHandle = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    // Retrieve the icon used in the taskbar.
    HICON WindowIcon = (HICON) SendMessage(WindowHandle, WM_GETICON, ICON_SMALL, 0);
    if (WindowIcon == nullptr)
    {
        WindowIcon = (HICON)  GetClassLongPtr(WindowHandle, -34);
    }
    if (WindowIcon == nullptr)
    {
        WindowIcon = (HICON) GetClassLongPtr(WindowHandle, -14);
    }
    if (WindowIcon == nullptr)
    {
        return Environment.Undefined();
    }

    // Create a Bitmap from the icon.
    Gdiplus::Bitmap* IconBitmap = Gdiplus::Bitmap::FromHICON(WindowIcon);
    if (IconBitmap == nullptr)
    {
        return Environment.Undefined();
    }

    // Create a temporary file path for writing.
    wchar_t tempPathBuffer[MAX_PATH] = {0};
    DWORD tempPathLength = GetTempPathW(MAX_PATH, tempPathBuffer);
    if (tempPathLength == 0 || tempPathLength > MAX_PATH)
    {
        // throw std::runtime_error("Failed to get temporary path.");
    }

    wchar_t tempFileName[MAX_PATH] = {0};
    if (!GetTempFileNameW(tempPathBuffer, L"PNG", 0, tempFileName))
    {
        // throw std::runtime_error("Failed to generate temporary file name.");
    }

    // By default, GetTempFileNameW() might assign a .tmp extension; change it to .png
    std::wstring FilePath(tempFileName);
    size_t dotPosition = FilePath.rfind(L'.');
    if (dotPosition != std::wstring::npos)
    {
        FilePath = FilePath.substr(0, dotPosition) + L".png";
    }
    else
    {
        FilePath += L".png";
    }

    if (!FilePath.empty() && FilePath.back() != L'\\')
    {
        FilePath.push_back(L'\\');
    }
    FilePath.append(L"taskbar_icon.png");

    // Retrieve the CLSID of the PNG encoder.
    CLSID PngEncoderClsid;
    if (GetEncoderClsid(L"image/png", &PngEncoderClsid) < 0)
    {
        delete IconBitmap;
        return Environment.Undefined();
    }

    // Save the bitmap as a PNG file.
    Gdiplus::Status SaveStatus = IconBitmap->Save(FilePath.c_str(), &PngEncoderClsid, nullptr);
    if (SaveStatus != Gdiplus::Ok)
    {
        // Handle error if necessary.
    }

    // Cleanup.
    delete IconBitmap;

    return Napi::String::New(Environment, WStringToString(FilePath));
}

