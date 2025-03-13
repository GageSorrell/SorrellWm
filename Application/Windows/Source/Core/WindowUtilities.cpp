/* File:      WindowUtilities.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "WindowUtilities.h"
#include "Globals.h"

DECLARE_LOG_CATEGORY(Window)

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

// std::string CaptureWindowScreenshot_Internal(HWND hwnd) {
//     // Initialize GDI+
//     Gdiplus::GdiplusStartupInput gdiplusStartupInput;
//     ULONG_PTR gdiplusToken;
//     Gdiplus::Status status = Gdiplus::GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, nullptr);
//     if (status != Gdiplus::Ok) {
//         std::cerr << "GDI+ initialization failed." << std::endl;
//         return "";
//     }

//     // Get window dimensions
//     RECT rect;
//     if (!GetWindowRect(hwnd, &rect)) {
//         std::cerr << "GetWindowRect failed. Error: " << GetLastError() << std::endl;
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }
//     int width = rect.right - rect.left;
//     int height = rect.bottom - rect.top;

//     // Create device contexts and bitmap
//     HDC hdcWindow = GetDC(hwnd);
//     if (!hdcWindow) {
//         std::cerr << "GetDC failed. Error: " << GetLastError() << std::endl;
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }

//     HDC hdcMemDC = CreateCompatibleDC(hdcWindow);
//     if (!hdcMemDC) {
//         std::cerr << "CreateCompatibleDC failed. Error: " << GetLastError() << std::endl;
//         ReleaseDC(hwnd, hdcWindow);
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }

//     HBITMAP hBitmap = CreateCompatibleBitmap(hdcWindow, width, height);
//     if (!hBitmap) {
//         std::cerr << "CreateCompatibleBitmap failed. Error: " << GetLastError() << std::endl;
//         DeleteDC(hdcMemDC);
//         ReleaseDC(hwnd, hdcWindow);
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }

//     SelectObject(hdcMemDC, hBitmap);

//     // Use PrintWindow with PW_RENDERFULLCONTENT
//     BOOL success = PrintWindow(hwnd, hdcMemDC, PW_RENDERFULLCONTENT);
//     if (!success) {
//         std::cerr << "PrintWindow failed. Error: " << GetLastError() << std::endl;
//         DeleteObject(hBitmap);
//         DeleteDC(hdcMemDC);
//         ReleaseDC(hwnd, hdcWindow);
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }

//     // Optionally, verify bitmap content here

//     // Save bitmap to a temporary file
//     std::wstring HandleString = StringToWString(HandleToString(hwnd));
//     std::wstring tempPath = L"%TEMP%\\SorrellWm\\Screenshot-" +
//         // StringToWString(HandleToString(hwnd)) +
//         HandleString +
//         // L"-" +
//         // GetTimestamp() +
//         L".png";

//     wchar_t resolvedPath[MAX_PATH];
//     DWORD ret = ExpandEnvironmentStringsW(tempPath.c_str(), resolvedPath, MAX_PATH);
//     if (ret == 0 || ret > MAX_PATH) {
//         std::cerr << "ExpandEnvironmentStringsW failed. Error: " << GetLastError() << std::endl;
//         DeleteObject(hBitmap);
//         DeleteDC(hdcMemDC);
//         ReleaseDC(hwnd, hdcWindow);
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }

//     Gdiplus::Bitmap bitmap(hBitmap, nullptr);
//     CLSID pngClsid;
//     if (GetEncoderClsid(L"image/png", &pngClsid) == -1) {
//         std::cerr << "GetEncoderClsid failed." << std::endl;
//         DeleteObject(hBitmap);
//         DeleteDC(hdcMemDC);
//         ReleaseDC(hwnd, hdcWindow);
//         Gdiplus::GdiplusShutdown(gdiplusToken);
//         return "";
//     }

//     status = bitmap.Save(resolvedPath, &pngClsid, nullptr);
//     if (status != Gdiplus::Ok) {
//         std::cerr << "Bitmap.Save failed."
//             << WStringToString(resolvedPath)
//             << std::endl
//             << WStringToString(HandleString)
//             << std::endl
//             << GetGdiplusStatusString(status)
//             << std::endl;
//     } else {
//         std::cout << "Screenshot saved to " << std::string("screenshot.png") << std::endl;
//     }

//     // Clean up
//     DeleteObject(hBitmap);
//     DeleteDC(hdcMemDC);
//     ReleaseDC(hwnd, hdcWindow);
//     Gdiplus::GdiplusShutdown(gdiplusToken);

//     return "CaptureWindowScreenshotError";
// }

std::string CaptureWindowScreenshot_Internal(HWND hwnd)
{
     // Get the window rectangle excluding shadows
    RECT rc;
    HRESULT hr = DwmGetWindowAttribute(hwnd, DWMWA_EXTENDED_FRAME_BOUNDS, &rc, sizeof(rc));
    if (FAILED(hr))
    {
        // Fallback to GetWindowRect if DwmGetWindowAttribute fails
        if (!GetWindowRect(hwnd, &rc))
        {
            std::cout << "Failed to get window rectangle." << std::endl;
            return false;
        }
    }

    int width = rc.right - rc.left;
    int height = rc.bottom - rc.top;

    // Get the device context of the window
    HDC hdcWindow = GetDC(hwnd);
    if (!hdcWindow)
    {
        std::wcerr << L"Failed to get window device context." << std::endl;
        return false;
    }

    // Create a compatible device context in memory
    HDC hdcMemDC = CreateCompatibleDC(hdcWindow);
    if (!hdcMemDC)
    {
        std::wcerr << L"Failed to create compatible DC." << std::endl;
        ReleaseDC(hwnd, hdcWindow);
        return false;
    }

    // Create a compatible bitmap to hold the screenshot
    HBITMAP hbmCapture = CreateCompatibleBitmap(hdcWindow, width, height);
    if (!hbmCapture)
    {
        std::wcerr << L"Failed to create compatible bitmap." << std::endl;
        DeleteDC(hdcMemDC);
        ReleaseDC(hwnd, hdcWindow);
        return false;
    }

    // Select the bitmap into the memory device context
    HGDIOBJ hOld = SelectObject(hdcMemDC, hbmCapture);

    // Use PrintWindow to copy the window image to the memory DC
    // PW_RENDERFULLCONTENT ensures that the entire window is captured
    BOOL success = PrintWindow(hwnd, hdcMemDC, PW_RENDERFULLCONTENT);
    if (!success)
    {
        std::wcerr << L"PrintWindow failed." << std::endl;
        // Cleanup
        SelectObject(hdcMemDC, hOld);
        DeleteObject(hbmCapture);
        DeleteDC(hdcMemDC);
        ReleaseDC(hwnd, hdcWindow);
        return false;
    }

    // Restore the original object
    SelectObject(hdcMemDC, hOld);

    // Clean up device contexts
    DeleteDC(hdcMemDC);
    ReleaseDC(hwnd, hdcWindow);

    // Initialize GDI+
    Gdiplus::GdiplusStartupInput gdiplusStartupInput;
    ULONG_PTR gdiplusToken;
    Gdiplus::Status gdiplusStatus = Gdiplus::GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, NULL);
    if (gdiplusStatus != Gdiplus::Ok)
    {
        std::wcerr << L"Failed to initialize GDI+." << std::endl;
        DeleteObject(hbmCapture);
        return false;
    }

    // Create a GDI+ Bitmap from the HBITMAP
    Gdiplus::Bitmap bmp(hbmCapture, NULL);
    if (bmp.GetLastStatus() != Gdiplus::Ok)
    {
        std::wcerr << L"Failed to create GDI+ Bitmap from HBITMAP." << std::endl;
        Gdiplus::GdiplusShutdown(gdiplusToken);
        DeleteObject(hbmCapture);
        return false;
    }

    // Get the CLSID of the PNG encoder
    CLSID pngClsid;
    if (GetEncoderClsid(L"image/png", &pngClsid) == -1)
    {
        std::wcerr << L"Failed to get PNG encoder CLSID." << std::endl;
        Gdiplus::GdiplusShutdown(gdiplusToken);
        DeleteObject(hbmCapture);
        return false;
    }

    // Construct the file path: %TEMP%\SorrellWm\Screenshot-<HandleString>-<Timestamp>.png
    std::wstring HandleString = StringToWString(HandleToString(hwnd));
    std::wstring tempPath = L"%TEMP%\\SorrellWm\\Screenshot-" +
        HandleString +
        L"-" +
        GetFileNameTimestamp() +
        L".png";

    wchar_t resolvedPath[MAX_PATH];
    DWORD ret = ExpandEnvironmentStringsW(tempPath.c_str(), resolvedPath, MAX_PATH);
    // if (ret == 0 || ret > MAX_PATH) {
    //     std::cout << "ExpandEnvironmentStringsW failed. Error: " << GetLastError() << std::endl;
    //     DeleteObject(hBitmap);
    //     DeleteDC(hdcMemDC);
    //     ReleaseDC(NULL, hdcScreen);
    //     Gdiplus::GdiplusShutdown(gdiplusToken);
    //     return "";
    // }

    // Save the bitmap to the specified path as PNG
    Gdiplus::Status saveStatus = bmp.Save(resolvedPath, &pngClsid, NULL);
    return WStringToString(resolvedPath);
    // // Initialize GDI+
    // Gdiplus::GdiplusStartupInput gdiplusStartupInput;
    // ULONG_PTR gdiplusToken;
    // Gdiplus::Status status = Gdiplus::GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, nullptr);
    // if (status != Gdiplus::Ok) {
    //     std::wcerr << L"GDI+ initialization failed." << std::endl;
    //     return "";
    // }

    // // std::cout << "Stop One" << std::endl;

    // // // Get **client** window dimensions instead of the entire window
    // RECT clientRect;
    // // if (!GetWindowRect(hwnd, &clientRect)) {
    // // // if (!GetClientRect(hwnd, &clientRect)) {
    // //     std::cerr << "GetClientRect failed. Error: " << GetLastError() << std::endl;
    // //     Gdiplus::GdiplusShutdown(gdiplusToken);
    // //     return "";
    // // }
    // DwmGetWindowAttribute(hwnd, DWMWA_EXTENDED_FRAME_BOUNDS, &clientRect, sizeof(RECT));

    // // Convert client coordinates to screen coordinates
    // POINT topLeft = { clientRect.left, clientRect.top };
    // // if (!ClientToScreen(hwnd, &topLeft)) {
    // //     std::cerr << "ClientToScreen failed. Error: " << GetLastError() << std::endl;
    // //     Gdiplus::GdiplusShutdown(gdiplusToken);
    // //     return "";
    // // }

    // // Calculate width and height from clientRect
    // const int width = clientRect.right - clientRect.left;
    // const int height = clientRect.bottom - clientRect.top;

    // // Create device contexts and bitmap
    // HDC hdcScreen = GetDC(NULL); // Use screen DC to capture specific area
    // if (!hdcScreen) {
    //     std::cout << "GetDC(NULL) failed. Error: " << GetLastError() << std::endl;
    //     Gdiplus::GdiplusShutdown(gdiplusToken);
    //     return "";
    // }

    // // std::cout << "Stop Three" << std::endl;
    // HDC hdcMemDC = CreateCompatibleDC(hdcScreen);
    // if (!hdcMemDC)
    // {
    //     std::cout << "CreateCompatibleDC failed. Error: " << GetLastError() << std::endl;
    //     ReleaseDC(NULL, hdcScreen);
    //     Gdiplus::GdiplusShutdown(gdiplusToken);
    //     return "";
    // }

    // HBITMAP hBitmap = CreateCompatibleBitmap(hdcScreen, width, height);
    // if (!hBitmap) {
    //     std::cout << "CreateCompatibleBitmap failed. Error: " << GetLastError() << std::endl;
    //     DeleteDC(hdcMemDC);
    //     ReleaseDC(NULL, hdcScreen);
    //     Gdiplus::GdiplusShutdown(gdiplusToken);
    //     return "";
    // }


    // SelectObject(hdcMemDC, hBitmap);

    // // // **Use BitBlt instead of PrintWindow to exclude shadows and non-client areas**
    // // BOOL success = BitBlt(hdcMemDC, 0, 0, width, height, hdcScreen, topLeft.x, topLeft.y, SRCCOPY);
    // // if (!success) {
    // //     std::cout << "BitBlt failed. Error: " << GetLastError() << std::endl;
    // //     DeleteObject(hBitmap);
    // //     DeleteDC(hdcMemDC);
    // //     ReleaseDC(NULL, hdcScreen);
    // //     Gdiplus::GdiplusShutdown(gdiplusToken);
    // //     return "";
    // // }
    // PrintWindow(hwnd, hdcMemDC, PW_RENDERFULLCONTENT);

    // // Optionally, verify bitmap content here

    // // Construct the file path: %TEMP%\SorrellWm\Screenshot-<HandleString>-<Timestamp>.png
    // std::wstring HandleString = StringToWString(HandleToString(hwnd));
    // std::wstring tempPath = L"%TEMP%\\SorrellWm\\Screenshot-" +
    //     HandleString +
    //     L"-" +
    //     GetFileNameTimestamp() +
    //     L".png";

    // wchar_t resolvedPath[MAX_PATH];
    // DWORD ret = ExpandEnvironmentStringsW(tempPath.c_str(), resolvedPath, MAX_PATH);
    // if (ret == 0 || ret > MAX_PATH) {
    //     std::cout << "ExpandEnvironmentStringsW failed. Error: " << GetLastError() << std::endl;
    //     DeleteObject(hBitmap);
    //     DeleteDC(hdcMemDC);
    //     ReleaseDC(NULL, hdcScreen);
    //     Gdiplus::GdiplusShutdown(gdiplusToken);
    //     return "";
    // }

    // std::wcout << "ResolvedPath is " << resolvedPath << std::endl;

    // Gdiplus::Bitmap bitmap(hBitmap, nullptr);
    // CLSID pngClsid;
    // if (GetEncoderClsid(L"image/png", &pngClsid) == -1) {
    //     std::cout << "GetEncoderClsid failed." << std::endl;
    //     DeleteObject(hBitmap);
    //     DeleteDC(hdcMemDC);
    //     ReleaseDC(NULL, hdcScreen);
    //     Gdiplus::GdiplusShutdown(gdiplusToken);
    //     return "";
    // }

    // status = bitmap.Save(resolvedPath, &pngClsid, nullptr);
    // if (status != Gdiplus::Ok) {
    //     std::cout << "Bitmap.Save failed: "
    //               << WStringToString(resolvedPath)
    //               << std::endl
    //               << WStringToString(HandleString)
    //               << std::endl
    //               << GetGdiplusStatusString(status)
    //               << std::endl;
    // } else {
    //     std::cout << "Screenshot saved to " << resolvedPath << std::endl;
    // }

    // std::cout << "Last Stop" << std::endl;

    // // Clean up
    // std::cout << "0" << std::endl;
    // DeleteObject(hBitmap);
    // std::cout << "1" << std::endl;
    // DeleteDC(hdcMemDC);
    // std::cout << "2" << std::endl;
    // ReleaseDC(NULL, hdcScreen);
    // std::cout << "3" << std::endl;
    // Gdiplus::GdiplusShutdown(gdiplusToken);
    // std::cout << "4" << std::endl;

    // return WStringToString(resolvedPath);
}

/**
 * Given `CallbackInfo` and an `Index` of an argument that is an `HWindow` object, return the corresponding HWND pointer.
 */
HWND GetHandleArgument(const Napi::Env& Environment, const Napi::CallbackInfo& CallbackInfo, int Index)
{
    Napi::Object HandleObject = CallbackInfo[Index].As<Napi::Object>();
    return (HWND) DecodeHandle(HandleObject);
}

/**
 * Given the handle to a window, take a screenshot, and return the path.
 */
Napi::Value CaptureWindowScreenshot(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND hwnd = GetHandleArgument(Environment, CallbackInfo, 0);
    RECT clientRect;
    DwmGetWindowAttribute(hwnd, DWMWA_EXTENDED_FRAME_BOUNDS, &clientRect, sizeof(clientRect));

    POINT topLeft = { clientRect.left, clientRect.top };

    const int Width = clientRect.right - clientRect.left;
    const int Height = clientRect.bottom - clientRect.top;

    /* Create device contexts and bitmap */
    HDC HdcScreen = GetDC(NULL);
    if (!HdcScreen) {
        std::cout << "GetDC(NULL) failed. Error: " << GetLastError() << std::endl;
        std::cout << GetLastError() << std::endl;
        Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
    }

    HDC HdcMemDC = CreateCompatibleDC(HdcScreen);
    if (!HdcMemDC)
    {
        std::cout << "CreateCompatibleDC failed. Error: " << GetLastError() << std::endl;
        ReleaseDC(NULL, HdcScreen);
        Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
    }

    HBITMAP hBitmap = CreateCompatibleBitmap(HdcScreen, Width, Height);
    if (!hBitmap) {
        std::cout << "CreateCompatibleBitmap failed. Error: " << GetLastError() << std::endl;
        DeleteDC(HdcMemDC);
        ReleaseDC(NULL, HdcScreen);
        Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
    }

    SelectObject(HdcMemDC, hBitmap);

    // **Use BitBlt instead of PrintWindow to exclude shadows and non-client areas**
    BOOL Success = BitBlt(HdcMemDC, 0, 0, Width, Height, HdcScreen, topLeft.x, topLeft.y, SRCCOPY);
    if (!Success)
    {
        std::cout << "BitBlt failed. Error: " << GetLastError() << std::endl;
        DeleteObject(hBitmap);
        DeleteDC(HdcMemDC);
        ReleaseDC(NULL, HdcScreen);
        Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
    }

    /* Construct the file path: %TEMP%\SorrellWm\Screenshot-<HandleString>-<Timestamp>.png */
    std::wstring HandleString = StringToWString(HandleToString(hwnd));
    std::wstring tempPath = L"%TEMP%\\SorrellWm\\Screenshot-" +
        HandleString +
        L"-" +
        GetFileNameTimestamp() +
        L".png";

    wchar_t resolvedPath[MAX_PATH];
    DWORD ret = ExpandEnvironmentStringsW(tempPath.c_str(), resolvedPath, MAX_PATH);
    if (ret == 0 || ret > MAX_PATH) {
        std::cout << "ExpandEnvironmentStringsW failed. Error: " << GetLastError() << std::endl;
        DeleteObject(hBitmap);
        DeleteDC(HdcMemDC);
        ReleaseDC(NULL, HdcScreen);
        Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
    }

    Gdiplus::Bitmap bitmap(hBitmap, nullptr);
    CLSID pngClsid;
    if (GetEncoderClsid(L"image/png", &pngClsid) == -1)
    {
        std::cout << "GetEncoderClsid failed." << std::endl;
        DeleteObject(hBitmap);
        DeleteDC(HdcMemDC);
        ReleaseDC(NULL, HdcScreen);
        Gdiplus::GdiplusShutdown(GGlobals::GdiPlus);
    }

    Gdiplus::Status status = bitmap.Save(resolvedPath, &pngClsid, nullptr);
    if (status != Gdiplus::Ok)
    {
        std::cout << "Bitmap.Save failed: "
                  << WStringToString(resolvedPath)
                  << std::endl
                  << WStringToString(HandleString)
                  << std::endl
                  << GetGdiplusStatusString(status)
                  << std::endl;
    }
    else
    {
        std::cout << "Screenshot saved to " << resolvedPath << std::endl;
    }

    DeleteObject(hBitmap);
    DeleteDC(HdcMemDC);
    ReleaseDC(NULL, HdcScreen);
    std::string ScreenshotPath = WStringToString(resolvedPath);

    return Napi::String::New(Environment, ScreenshotPath);
}

Napi::Value GetTitlebarHeight(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    const int TitleBarHeight = GetSystemMetrics(SM_CYCAPTION);
    return Napi::Number::New(Environment, TitleBarHeight);
}

Napi::Value GetWindowLocationAndSize(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    HWND hwnd = (HWND) DecodeHandle(info[0].As<Napi::Object>());

    RECT rect;
    if (!GetWindowRect(hwnd, &rect)) {
        Napi::Error::New(env, "Failed to get window rectangle").ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }

    HMONITOR hMonitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
    if (!hMonitor)
    {
        Napi::Error::New(env, "Failed to get monitor").ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }

    MONITORINFO monitorInfo = { 0 };
    monitorInfo.cbSize = sizeof(MONITORINFO);
    if (!GetMonitorInfo(hMonitor, &monitorInfo))
    {
        Napi::Error::New(env, "Failed to get monitor information").ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }

    int absoluteX = rect.left - monitorInfo.rcMonitor.left;
    int absoluteY = rect.top - monitorInfo.rcMonitor.top;

    std::cout << "Left: " << rect.left << std::endl;
    std::cout << "Top: " << rect.top << std::endl;
    std::cout << "Monitor Left: " << monitorInfo.rcMonitor.left << std::endl;
    std::cout << "Monitor Top: " << monitorInfo.rcMonitor.top << std::endl;

    Napi::Object result = Napi::Object::New(env);

    result.Set("MonitorX", Napi::Number::New(env, monitorInfo.rcMonitor.left));
    result.Set("MonitorY", Napi::Number::New(env, monitorInfo.rcMonitor.top));
    result.Set("X", Napi::Number::New(env, rect.left));
    result.Set("Y", Napi::Number::New(env, rect.top));
    result.Set("Width", Napi::Number::New(env, rect.right - rect.left));
    result.Set("Height", Napi::Number::New(env, rect.bottom - rect.top));

    return result;
}

Napi::Value GetWindowByName(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    std::string WindowNameString = CallbackInfo[0].As<Napi::String>();
    LPCSTR WindowName = WindowNameString.c_str();

    HWND Window = FindWindow(NULL, WindowName);

    return EncodeHandle(Environment, Window);
}

Napi::Value SetForegroundWindowNode(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND WindowToFocus = GetHandleArgument(Environment, CallbackInfo, 0);

    SetForegroundWindow(WindowToFocus);

    return Environment.Undefined();
}

/** SetWindowPos takes drop shadow into account when using `cx`, `cy`.  */
int32_t GetWindowMargin(HWND Handle)
{
    RECT Rect;
    GetWindowRect(Handle, &Rect);

    RECT DwmRect;
    GetDwmWindowRect(Handle, &DwmRect);

    return DwmRect.left - Rect.left;
}

Napi::Value SetWindowPosition(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND Handle = GetHandleArgument(Environment, CallbackInfo, 0);

    FBox Box = GetBoxArgument(CallbackInfo, 1);

    int32_t Margin = GetWindowMargin(Handle);

    SetWindowPos(
        Handle,
        nullptr,
        Box.X - Margin,
        Box.Y,
        Box.Width + 2 * Margin,
        Box.Height + Margin,
        SWP_SHOWWINDOW
    );

    return Environment.Undefined();
}

Napi::Value GetIsLightMode(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HKEY HKey;
    DWORD AppsUseLightTheme = 1;
    DWORD Size = sizeof(AppsUseLightTheme);

    LSTATUS HasThemeKey = RegOpenKeyEx(
        HKEY_CURRENT_USER,
        "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
        0,
        KEY_READ,
        &HKey
    );

    if (HasThemeKey == ERROR_SUCCESS)
    {
        LSTATUS HasUseLightTheme = RegQueryValueEx(
            HKey,
            "AppsUseLightTheme",
            nullptr,
            nullptr,
            reinterpret_cast<LPBYTE>(&AppsUseLightTheme),
            &Size
        );

        if (HasUseLightTheme == ERROR_SUCCESS)
        {
            RegCloseKey(HKey);
            return Napi::Boolean::New(Environment, AppsUseLightTheme != 0);
        }

        RegCloseKey(HKey);
    }

    return Napi::Boolean::New(Environment, true);
}

Napi::Value GetThemeColor(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    DWORD color;
    BOOL isOpaque;

    HRESULT result = DwmGetColorizationColor(&color, &isOpaque);
    if (FAILED(result))
    {
        std::cout << "Failed to retrieve taskbar color." << std::endl;
        std::string DefaultThemeColor = "#0078D7";
        return Napi::String::New(Environment, DefaultThemeColor);
    }

    BYTE Red = (color >> 16) & 0xFF;
    BYTE Green = (color >> 8) & 0xFF;
    BYTE Blue = color & 0xFF;

    std::ostringstream HexStream;
    HexStream
        << "#"
        << std::setfill('0')
        << std::setw(2)
        << std::hex
        << (int) Red
        << std::setw(2)
        << (int) Green
        << std::setw(2)
        << (int) Blue;

    return Napi::String::New(Environment, HexStream.str());
}

bool IsWmForeground()
{
    const char* MainWindowName = "SorrellWm Main Window";
    LPSTR ForegroundWindowName = new char[32];
    HWND ForegroundWindow = GetForegroundWindow();
    if (ForegroundWindow == nullptr)
    {
        return false;
    }
    else
    {
        GetWindowTextA(ForegroundWindow, ForegroundWindowName, 32);
        bool NamesMatch = strcmp(MainWindowName, ForegroundWindowName);
        return NamesMatch;
    }

}

bool IsTileableWindow(HWND WindowHandle)
{
    if (!IsWindowVisible(WindowHandle))
    {
        return false;
    }

    BOOL IsWindowCloaked = FALSE;
    HRESULT DwmResult = DwmGetWindowAttribute(
        WindowHandle,
        DWMWA_CLOAKED,
        &IsWindowCloaked,
        sizeof(IsWindowCloaked)
    );

    if (SUCCEEDED(DwmResult))
    {
        if (IsWindowCloaked)
        {
            return false;
        }
    }

    /* Exclude tool windows by checking the extended window style. */
    LONG ExtendedStyle = GetWindowLong(WindowHandle, GWL_EXSTYLE);
    if (ExtendedStyle & WS_EX_TOOLWINDOW)
    {
        return false;
    }

    /* Exclude child windows (only top-level windows are considered). */
    if (GetParent(WindowHandle) != nullptr)
    {
        return false;
    }

    /* Exclude minimized windows. */
    WINDOWPLACEMENT WindowPlacement = { 0 };
    WindowPlacement.length = sizeof(WindowPlacement);
    if (GetWindowPlacement(WindowHandle, &WindowPlacement))
    {
        if (WindowPlacement.showCmd == SW_SHOWMINIMIZED)
        {
            return false;
        }
    }

    /* Check that the window has a non-empty title. */
    const int MaxTitleLength = 256;
    char WindowTitle[MaxTitleLength] = { 0 };
    if (GetWindowTextA(WindowHandle, WindowTitle, MaxTitleLength) == 0)
    {
        return false;
    }

    return true;
}

Napi::Value CanTile(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND Handle = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    bool IsTileable = IsTileableWindow(Handle);
    Napi::Boolean OutValue = Napi::Boolean::New(Environment, IsTileable);

    return OutValue;
}

BOOL CALLBACK EnumTileableWindowsProc(HWND WindowHandle, LPARAM LParameter)
{
    std::vector<HWND>* TileableWindows = reinterpret_cast<std::vector<HWND>*>(LParameter);
    if (IsTileableWindow(WindowHandle))
    {
        TileableWindows->push_back(WindowHandle);
    }
    return TRUE;
}

Napi::Value GetTileableWindows(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    std::vector<HWND> TileableWindows;
    EnumWindows(EnumTileableWindowsProc, reinterpret_cast<LPARAM>(&TileableWindows));

    return EncodeArray(Environment, TileableWindows, std::function<Napi::Object(const Napi::Env&, HWND)>(EncodeHandle));
}

Napi::Value GetMonitorFromWindow(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND Handle = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    HMONITOR Monitor = MonitorFromWindow(Handle, MONITOR_DEFAULTTONEAREST);
    return EncodeHandle(Environment, Monitor);
}

Napi::Value GetWindowTitle(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND Handle = GetHandleArgument(Environment, CallbackInfo, 0);

    const int BufferSize = 256;
    wchar_t WindowTextW[BufferSize] = { 0 };

    GetWindowTextW(Handle, WindowTextW, BufferSize);

    std::string WindowText = WStringToString(WindowTextW);
    return Napi::String::New(Environment, WindowText);
}
