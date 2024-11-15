/* File:      WindowUtilities.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "WindowUtilities.h"

std::string HandleToString(HWND Handle)
{
    std::stringstream StringStream;
    StringStream << std::hex << reinterpret_cast<uintptr_t>(Handle);
    return StringStream.str();
}

Napi::Object EncodeHandle(const Napi::Env& Environment, HWND Handle)
{
    std::string HandleString = HandleToString(Handle);
    Napi::Object OutObject = Napi::Object::New(Environment);
    OutObject.Set("Handle", Napi::String::New(Environment, HandleString));
    return OutObject;
}

HWND DecodeHandle(const Napi::Object& Object)
{
    Napi::Env Environment = Object.Env();
    Napi::Value HandleValue = Object.Get("Handle");

    if (!HandleValue.IsString())
    {
        Napi::TypeError::New(Environment, "Expected \"Handle\" property to be a string").ThrowAsJavaScriptException();
        return nullptr;
    }

    std::string HandleString = HandleValue.As<Napi::String>().Utf8Value();
    uintptr_t HandleInt = std::stoull(HandleString, nullptr, 16);
    return reinterpret_cast<HWND>(HandleInt);
}

Napi::Value GetFocusedWindow(const Napi::CallbackInfo& CallbackInfo)
{
    return EncodeHandle(CallbackInfo.Env(), GetForegroundWindow());
}

// std::string CaptureWindowScreenshot_Internal(HWND hwnd)
// {
//     // Initialize GDI+
//     Gdiplus::GdiplusStartupInput gdiplusStartupInput;
//     ULONG_PTR gdiplusToken;
//     Gdiplus::GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, nullptr);

//     // Get window dimensions
//     RECT rect;
//     GetClientRect(hwnd, &rect);
//     int width = rect.right - rect.left;
//     int height = rect.bottom - rect.top;

//     // Create device contexts and bitmap
//     HDC hdcWindow = GetDC(hwnd);
//     HDC hdcMemDC = CreateCompatibleDC(hdcWindow);
//     HBITMAP hBitmap = CreateCompatibleBitmap(hdcWindow, width, height);
//     SelectObject(hdcMemDC, hBitmap);

//     // Copy the window content to memory device context
//     BitBlt(hdcMemDC, 0, 0, width, height, hdcWindow, 0, 0, SRCCOPY);

//     // Save bitmap to a temporary file
//     std::string tempPath = std::string(getenv("TEMP")) + "\\screenshot.png";
//     Gdiplus::Bitmap bitmap(hBitmap, nullptr);
//     CLSID pngClsid;
//     Gdiplus::Status status = Gdiplus::Ok;

//     // Get the CLSID of the PNG encoder
//     UINT numEncoders = 0, size = 0;
//     Gdiplus::GetImageEncodersSize(&numEncoders, &size);
//     if (size == 0)
//     {
//         std::cerr << "Failed to get image encoder size." << std::endl;
//         return "";
//     }

//     Gdiplus::ImageCodecInfo* pImageCodecInfo = (Gdiplus::ImageCodecInfo*)(malloc(size));
//     Gdiplus::GetImageEncoders(numEncoders, size, pImageCodecInfo);

//     for (UINT i = 0; i < numEncoders; ++i)
//     {
//         if (wcscmp(pImageCodecInfo[i].MimeType, L"image/png") == 0)
//         {
//             pngClsid = pImageCodecInfo[i].Clsid;
//             break;
//         }
//     }
//     free(pImageCodecInfo);

//     // Save the bitmap as PNG
//     status = bitmap.Save(std::wstring(tempPath.begin(), tempPath.end()).c_str(), &pngClsid, nullptr);

//     // Cleanup
//     DeleteObject(hBitmap);
//     DeleteDC(hdcMemDC);
//     ReleaseDC(hwnd, hdcWindow);
//     Gdiplus::GdiplusShutdown(gdiplusToken);

//     if (status == Gdiplus::Ok)
//     {
//         std::cout << "Saved image to path " << tempPath << std::endl;
//         return tempPath;
//     }
//     else
//     {
//         std::cerr << "Failed to save the screenshot." << std::endl;
//         return "";
//     }
// }
int GetEncoderClsid(const WCHAR* format, CLSID* pClsid) {
    UINT  num = 0;          // number of image encoders
    UINT  size = 0;         // size of the image encoder array in bytes

    Gdiplus::GetImageEncodersSize(&num, &size);
    if (size == 0)
        return -1;  // Failure

    Gdiplus::ImageCodecInfo* pImageCodecInfo = (Gdiplus::ImageCodecInfo*)(malloc(size));
    if (pImageCodecInfo == NULL)
        return -1;  // Failure

    Gdiplus::GetImageEncoders(num, size, pImageCodecInfo);

    for (UINT j = 0; j < num; ++j) {
        if (wcscmp(pImageCodecInfo[j].MimeType, format) == 0) {
            *pClsid = pImageCodecInfo[j].Clsid;
            free(pImageCodecInfo);
            return j;  // Success
        }
    }

    free(pImageCodecInfo);
    return -1;  // Failure
}

std::string GetGdiplusStatusString(Gdiplus::Status status) {
    switch (status) {
        case Gdiplus::Ok:
            return "Ok";
        case Gdiplus::GenericError:
            return "Generic Error";
        case Gdiplus::InvalidParameter:
            return "Invalid Parameter";
        case Gdiplus::OutOfMemory:
            return "Out of Memory";
        case Gdiplus::ObjectBusy:
            return "Object Busy";
        case Gdiplus::InsufficientBuffer:
            return "Insufficient Buffer";
        case Gdiplus::NotImplemented:
            return "Not Implemented";
        case Gdiplus::Win32Error:
            return "Win32 Error";
        case Gdiplus::ValueOverflow:
            return "Value Overflow";
        case Gdiplus::AccessDenied:
            return "Access Denied";
        case Gdiplus::UnknownImageFormat:
            return "Unknown Image Format";
        case Gdiplus::FontFamilyNotFound:
            return "Font Family Not Found";
        case Gdiplus::FontStyleNotFound:
            return "Font Style Not Found";
        case Gdiplus::NotTrueTypeFont:
            return "Not a TrueType Font";
        case Gdiplus::UnsupportedGdiplusVersion:
            return "Unsupported GDI+ Version";
        case Gdiplus::GdiplusNotInitialized:
            return "GDI+ Not Initialized";
        case Gdiplus::PropertyNotFound:
            return "Property Not Found";
        case Gdiplus::PropertyNotSupported:
            return "Property Not Supported";
        default:
            return "Unknown Gdiplus::Status Code";
    }
}

std::string CaptureWindowScreenshot_Internal(HWND hwnd) {
    // Initialize GDI+
    Gdiplus::GdiplusStartupInput gdiplusStartupInput;
    ULONG_PTR gdiplusToken;
    Gdiplus::Status status = Gdiplus::GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, nullptr);
    if (status != Gdiplus::Ok) {
        std::cerr << "GDI+ initialization failed." << std::endl;
        return "";
    }

    // Get window dimensions
    RECT rect;
    if (!GetWindowRect(hwnd, &rect)) {
        std::cerr << "GetWindowRect failed. Error: " << GetLastError() << std::endl;
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }
    int width = rect.right - rect.left;
    int height = rect.bottom - rect.top;

    // Create device contexts and bitmap
    HDC hdcWindow = GetDC(hwnd);
    if (!hdcWindow) {
        std::cerr << "GetDC failed. Error: " << GetLastError() << std::endl;
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }

    HDC hdcMemDC = CreateCompatibleDC(hdcWindow);
    if (!hdcMemDC) {
        std::cerr << "CreateCompatibleDC failed. Error: " << GetLastError() << std::endl;
        ReleaseDC(hwnd, hdcWindow);
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }

    HBITMAP hBitmap = CreateCompatibleBitmap(hdcWindow, width, height);
    if (!hBitmap) {
        std::cerr << "CreateCompatibleBitmap failed. Error: " << GetLastError() << std::endl;
        DeleteDC(hdcMemDC);
        ReleaseDC(hwnd, hdcWindow);
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }

    SelectObject(hdcMemDC, hBitmap);

    // Use PrintWindow with PW_RENDERFULLCONTENT
    BOOL success = PrintWindow(hwnd, hdcMemDC, PW_RENDERFULLCONTENT);
    if (!success) {
        std::cerr << "PrintWindow failed. Error: " << GetLastError() << std::endl;
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(hwnd, hdcWindow);
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }

    // Optionally, verify bitmap content here

    // Save bitmap to a temporary file
    std::wstring HandleString = StringToWString(HandleToString(hwnd));
    std::wstring tempPath = L"%TEMP%\\SorrellWm\\Screenshot-" +
        // StringToWString(HandleToString(hwnd)) +
        HandleString +
        // L"-" +
        // GetTimestamp() +
        L".png";

    wchar_t resolvedPath[MAX_PATH];
    DWORD ret = ExpandEnvironmentStringsW(tempPath.c_str(), resolvedPath, MAX_PATH);
    if (ret == 0 || ret > MAX_PATH) {
        std::cerr << "ExpandEnvironmentStringsW failed. Error: " << GetLastError() << std::endl;
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(hwnd, hdcWindow);
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }

    Gdiplus::Bitmap bitmap(hBitmap, nullptr);
    CLSID pngClsid;
    if (GetEncoderClsid(L"image/png", &pngClsid) == -1) {
        std::cerr << "GetEncoderClsid failed." << std::endl;
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(hwnd, hdcWindow);
        Gdiplus::GdiplusShutdown(gdiplusToken);
        return "";
    }

    status = bitmap.Save(resolvedPath, &pngClsid, nullptr);
    if (status != Gdiplus::Ok) {
        std::cerr << "Bitmap.Save failed."
            << WStringToString(resolvedPath)
            << std::endl
            << WStringToString(HandleString)
            << std::endl
            << GetGdiplusStatusString(status)
            << std::endl;
    } else {
        std::cout << "Screenshot saved to " << std::string("screenshot.png") << std::endl;
    }

    // Clean up
    DeleteObject(hBitmap);
    DeleteDC(hdcMemDC);
    ReleaseDC(hwnd, hdcWindow);
    Gdiplus::GdiplusShutdown(gdiplusToken);

    return "CaptureWindowScreenshotError";
}

/**
 * Given `CallbackInfo` and an `Index` of an argument that is an `HWindow` object, return the corresponding HWND pointer.
 */
HWND GetHandleArgument(const Napi::Env& Environment, const Napi::CallbackInfo& CallbackInfo, int Index)
{
    Napi::Object HandleString = CallbackInfo[Index].As<Napi::Object>();
    return DecodeHandle(HandleString);
}

/**
 * Given the handle to a window, take a screenshot, and return the path.
 */
Napi::Value CaptureWindowScreenshot(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();

    HWND Handle = GetHandleArgument(Environment, CallbackInfo, 0);
    std::string ScreenshotPath = CaptureWindowScreenshot_Internal(Handle);

    return Napi::String::New(Environment, ScreenshotPath);
}
