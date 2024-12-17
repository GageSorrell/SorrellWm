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
    return DecodeHandle(HandleObject);
}

#pragma region "Blur"

static HBITMAP gCapturedBitmap = nullptr;
static std::pair<int32_t*, int32_t*> Buffers(nullptr, nullptr);
static int Width = 0;
static int Height = 0;
static const int ChannelsNum = 3;
static int32_t* Buffer = nullptr;
static BYTE* RawArray = nullptr;

// HBITMAP CreateHBitmapFromInt32Array(int32_t* pixelArray, HDC DeviceContext)
// {
//     if (!pixelArray || Width <= 0 || Height <= 0 || (ChannelsNum != 3 && ChannelsNum != 4))
//         return NULL;

//     // Define the bitmap header
//     BITMAPINFO bmi;
//     memset(&bmi, 0, sizeof(BITMAPINFO));
//     bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
//     bmi.bmiHeader.biWidth = Width;
//     bmi.bmiHeader.biHeight = Height; // Positive for bottom-up DIB
//     bmi.bmiHeader.biPlanes = 1;
//     bmi.bmiHeader.biBitCount = ChannelsNum * 8; // 24 for RGB, 32 for RGBA
//     bmi.bmiHeader.biCompression = BI_RGB;
//     bmi.bmiHeader.biSizeImage = 0; // Can be 0 for BI_RGB

//     // Calculate the size of the pixel data
//     int bytesPerPixel = ChannelsNum;
//     int rowSize = ((Width * bytesPerPixel + 3) & ~3); // DWORD aligned
//     int dataSize = rowSize * Height;

//     void* pBits = NULL;
//     HBITMAP hBitmap = CreateDIBSection(DeviceContext, &bmi, DIB_RGB_COLORS, &pBits, NULL, 0);
//     ReleaseDC(NULL, DeviceContext);

//     if (!hBitmap || !pBits)
//         return NULL;

//     // Copy pixel data into the bitmap
//     // Windows expects BGR(A) format
//     // Your pixelArray is in 0xAARRGGBB or 0x00RRGGBB format

//     BYTE* dest = static_cast<BYTE*>(pBits);
//     for (int y = 0; y < Height; ++y)
//     {
//         for (int x = 0; x < Width; ++x)
//         {
//             int srcIndex = y * Width + x;
//             int32_t pixel = pixelArray[srcIndex];

//             // Extract color components
//             BYTE blue = pixel & 0xFF;
//             BYTE green = (pixel >> 8) & 0xFF;
//             BYTE red = (pixel >> 16) & 0xFF;
//             // BYTE alpha = (pixel >> 24) & 0xFF; // Not used in BI_RGB

//             // Calculate destination index (bottom-up)
//             int destY = Height - 1 - y; // Bottom-up
//             BYTE* row = dest + destY * rowSize;
//             BYTE* pixelDest = row + x * bytesPerPixel;

//             pixelDest[0] = blue;
//             pixelDest[1] = green;
//             pixelDest[2] = red;

//             if (ChannelsNum == 4)
//             {
//                 BYTE alpha = (pixel >> 24) & 0xFF;
//                 pixelDest[3] = alpha;
//             }
//         }
//     }

//     return hBitmap;
// }

LRESULT CALLBACK BlurWindowProc(HWND Handle, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    static DWORD startTime = 0;
    static const UINT_PTR TIMER_ID = 1;
    static int FramesElapsed = 0;
    const float Duration = 500.f;

    std::cout << "uMsg: " << uMsg << "\n";

    switch (uMsg)
    {
        case WM_DESTROY:
            KillTimer(Handle, TIMER_ID);
            std::cout << "Killed timer!" << std::endl;
            return 0;
        case WM_CREATE:
            startTime = GetTickCount();
            SetTimer(Handle, 1, 1000 / 60, NULL);
            std::cout << "Created timer!" << std::endl;
            return 0;
        case WM_TIMER:
        {
            if (wParam == TIMER_ID)
            {
                std::cout << "WM_TIMER Fired!" << std::endl;
                FramesElapsed++;
                DWORD currentTime = GetTickCount();
                DWORD elapsedTime = currentTime - startTime;
                if (elapsedTime >= Duration)
                {
                    KillTimer(Handle, TIMER_ID);
                }

                InvalidateRect(Handle, NULL, TRUE);
            }
            return 0;
        }
        case WM_PAINT:
        {
            std::cout << "Painting..." << std::endl;
            PAINTSTRUCT PaintStruct;
            HDC DeviceContext = BeginPaint(Handle, &PaintStruct);
            HDC MemoryDc = CreateCompatibleDC(DeviceContext);
            DWORD currentTime = GetTickCount();
            DWORD elapsedTime = currentTime - startTime;
            HBITMAP bitmap = CreateCompatibleBitmap(DeviceContext, Width, Height);
            HBITMAP oldbmp = (HBITMAP) SelectObject(MemoryDc, bitmap);
            // BITMAPINFO bmi;
            // memset(&bmi, 0, sizeof(BITMAPINFO));
            // bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
            // bmi.bmiHeader.biWidth = Width;
            // bmi.bmiHeader.biHeight = Height;
            // bmi.bmiHeader.biPlanes = 1;
            // bmi.bmiHeader.biBitCount = ChannelsNum * 8;
            // bmi.bmiHeader.biCompression = BI_RGB;

            int32_t* gPixelArray = new int32_t[Width * Height];
            for (int y = 0; y < Height; ++y)
            {
                for (int x = 0; x < Width; ++x)
                {
                    const int PixelIndex = 3 * (x + Width * y);
                    if (x % 3 == 0)
                    {
                        BYTE Blue = static_cast<BYTE>(RawArray[PixelIndex]);
                        BYTE Green = static_cast<BYTE>(RawArray[PixelIndex + 1]);
                        BYTE Red = static_cast<BYTE>(RawArray[PixelIndex + 2]);
                        gPixelArray[y * Width + x] = (Red << 16) | (Green << 8) | Blue;
                    }
                }
            }

            BitBlt(DeviceContext, 0, 0, Width, Height, MemoryDc, 0, 0, SRCCOPY);
            SelectObject(MemoryDc, oldbmp);
            DeleteDC(MemoryDc);
            DeleteObject(bitmap);
            EndPaint(Handle, &PaintStruct);
    //         StretchDIBits(
    //             DeviceContext,
    //             0,
    //             0,
    //             Width,
    //             Height,
    //             0,
    //             0,
    //             Width,
    //             Height,
    //             gPixelArray,
    //             &bmi,
    //             DIB_RGB_COLORS,
    //             SRCCOPY
    //         );

    //             SelectObject(memdc, oldbmp);
    // DeleteDC(memdc);
    // DeleteObject(bitmap);

    //         std::cout << GetLastErrorAsString() << std::endl;


            // HDC MemoryDc = CreateCompatibleDC(DeviceContext);
            // if (MemoryDc)
            // {
            //     // HBITMAP OldBitmap = (HBITMAP) SelectObject(MemoryDc, gCapturedBitmap);

            //     BITMAP bmp;
            //     if (GetObject(gCapturedBitmap, sizeof(BITMAP), &bmp))
            //     {
            //         BITMAPINFO bmi;
            //         memset(&bmi, 0, sizeof(BITMAPINFO));
            //         bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
            //         bmi.bmiHeader.biWidth = bmp.bmWidth;
            //         bmi.bmiHeader.biHeight = bmp.bmHeight;
            //         bmi.bmiHeader.biPlanes = 1;
            //         bmi.bmiHeader.biBitCount = ChannelsNum * 8;
            //         bmi.bmiHeader.biCompression = BI_RGB;

            //         // Calculate the size of the pixel data
            //         // int bytesPerPixel = ChannelsNum;
            //         // int rowSize = ((bmp.bmWidth * bytesPerPixel + 3) & ~3); // DWORD aligned
            //         // int dataSize = rowSize * bmp.bmHeight;

            //         // Allocate memory for pixel data
            //         BYTE* pPixels = new BYTE[Width * Height];
            //         if (pPixels)
            //         {
            //             if (GetDIBits(MemoryDc, gCapturedBitmap, 0, bmp.bmHeight, pPixels, &bmi, DIB_RGB_COLORS))
            //             {
            //                 // std::cout << "B" << std::endl;
            //                 BYTE* BlurredArray = new BYTE[Width * Height * ChannelsNum];
            //                 if (RawArray)
            //                 {
            //                     for (int Y = 0; Y < Height; Y++)
            //                     {
            //                     //     for (int X = 0; X < Width; X++)
            //                     //     {
            //                     //         int bufferY = bmp.bmHeight - 1 - Y;
            //                     //         int bufferIndex = bufferY * rowSize + X * bytesPerPixel;

            //                     //         BYTE blue = pPixels[bufferIndex];
            //                     //         BYTE green = pPixels[bufferIndex + 1];
            //                     //         BYTE red = pPixels[bufferIndex + 2];
            //                     //         BYTE alpha = 255;

            //                     //         if (ChannelsNum == 4)
            //                     //         {
            //                     //             alpha = pPixels[bufferIndex + 3];
            //                     //         }

            //                     //         int32_t pixel = (alpha << 24) | (red << 16) | (green << 8) | blue;

            //                     //         RawArray[Y * Width + X] = pixel;
            //                     //     }
            //                     // }

            //                     // float Factor = 1.f - std::exp(-1.f * (elapsedTime / Duration));
            //                     // float Sigma = 1.f + (50.f - 1.f) * Factor;
            //                     float Sigma = 10.f;
            //                     // std::cout << "C " << static_cast<int>(RawArray[0]) << " " << static_cast<int>(RawArray[1000]) << std::endl;
            //                     // Blur(RawArray, BlurredArray, Width, Height, ChannelsNum, Sigma, 1, kExtend);
            //                     BlurredArray = RawArray;
            //                     // std::cout << "D" << std::endl;
            //                     StretchDIBits(
            //                         DeviceContext,
            //                         0,
            //                         0,
            //                         Width,
            //                         Height,
            //                         0,
            //                         0,
            //                         Width,
            //                         Height,
            //                         BlurredArray,
            //                         &bmi,
            //                         DIB_RGB_COLORS,
            //                         SRCCOPY
            //                     );
            //                     // std::cout << "E" << std::endl;

            //                     delete[] RawArray;
            //                     delete[] BlurredArray;
            //                 }
            //             }
            //             else
            //             {
            //                 std::cout << "Failed to retrieve bitmap bits." << std::endl;
            //             }

            //             delete[] pPixels;
            //         }
            //     }

            //     // SelectObject(MemoryDc, OldBitmap);
            //     // DeleteDC(MemoryDc);
            // }
            // else
            // {
            //     std::cout << "Failed to create compatible DC." << std::endl;
            //     std::cout << GetLastErrorAsString() << std::endl;
            // }
            // EndPaint(Handle, &PaintStruct);
            // return 0;
            // std::cout << "Painting..." << std::endl;
            // PAINTSTRUCT paintStruct;
            // HDC deviceContext = BeginPaint(hWnd, &paintStruct);

            // HDC memoryDeviceContext = CreateCompatibleDC(deviceContext);
            // HBITMAP OldBitmap = (HBITMAP)SelectObject(memoryDeviceContext, gCapturedBitmap);

            // // BITMAP BitmapInfo;
            // // GetObject(gCapturedBitmap, sizeof(BitmapInfo), &BitmapInfo);

            // DWORD currentTime = GetTickCount();
            // DWORD elapsedTime = currentTime - startTime;
            // float CurrentSigma = 1.f + (50.f - 1.f) * (1 - std::exp(-1.0f * elapsedTime / Duration));
            // // memcpy(gCapturedBitmap, OriginalBuffer, Width * Height * 4);
            // // Blur(OriginalBuffer, gCapturedBitmap, Width, Height, 4, CurrentSigma, 1, kExtend);

            // // Step 1: Retrieve basic bitmap information
            // BITMAP Bitmap;
            // if (GetObject(gCapturedBitmap, sizeof(BITMAP), &Bitmap) == 0)
            // {
            //     ReleaseDC(NULL, deviceContext);
            //     return false;
            // }

            // int32_t* InBuffer = FramesElapsed % 2 == 0 ? Buffers.first : Buffers.second;
            // int32_t* OutBuffer = FramesElapsed % 2 == 1 ? Buffers.first : Buffers.second;

            // BITMAPINFO BitmapInfo = {0};
            // BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
            // BitmapInfo.bmiHeader.biWidth = Width;
            // BitmapInfo.bmiHeader.biHeight = -Height; // Negative to indicate a top-down DIB
            // BitmapInfo.bmiHeader.biPlanes = 1;
            // BitmapInfo.bmiHeader.biBitCount = 32;
            // BitmapInfo.bmiHeader.biCompression = BI_RGB; // No compression
            // BitmapInfo.bmiHeader.biSizeImage = 0;        // 0 for uncompressed BI_RGB

            // std::cout << "Going to get bits..." << std::endl;
            // BOOL GotBits = GetDIBits(
            // deviceContext,
            // gCapturedBitmap,
            // 0,
            // Bitmap.bmHeight,
            // InBuffer,
            // &BitmapInfo,
            // DIB_RGB_COLORS
            // );

            // if (!GotBits)
            // {
            //     std::cout << "Did not get the bits" << std::endl;
            //     ReleaseDC(NULL, deviceContext);
            //     return false;
            // }

            // Blur(
            //     InBuffer,
            //     OutBuffer,
            //     Width,
            //     Height,
            //     4,
            //     CurrentSigma,
            //     1,
            //     kExtend
            // );

            // std::cout << "Blurred!" << std::endl;

            // SetDIBitsToDevice(
            //     deviceContext,                // Handle to the device context
            //     0,                  // X destination (upper-left corner)
            //     0,                  // Y destination (upper-left corner)
            //     Width,              // Width of the image
            //     Height,             // Height of the image
            //     0,                  // X source (upper-left corner of the buffer)
            //     0,                  // Y source (upper-left corner of the buffer)
            //     0,                  // First scan line to copy
            //     Height,             // Number of scan lines to copy
            //     OutBuffer,             // Pointer to the pixel data
            //     &BitmapInfo,        // Pointer to the BITMAPINFO structure
            //     DIB_RGB_COLORS      // Use RGB color values
            // );

            // std::cout << "Sent Bits!" << std::endl;

            // // const int Result = SetDIBits(, g_Bitmap, 0, Height, Buffer, &BitmapInfo, DIB_RGB_COLORS);
            // // std::string LogMessage = Result == 0 ? "SetDIBits failed" : "SetDIBits SUCCEEDED";
            // // std::cout << LogMessage << std::endl;

            // // BitBlt(
            // //     deviceContext,
            // //     0,
            // //     0,
            // //     Bitmap.bmWidth,
            // //     Bitmap.bmHeight,
            // //     memoryDeviceContext,
            // //     0,
            // //     0,
            // //     SRCCOPY
            // // );

            // SelectObject(memoryDeviceContext, OldBitmap);
            // DeleteDC(memoryDeviceContext);

            // EndPaint(hWnd, &paintStruct);
            // return 0;
            }
    }

    return DefWindowProc(Handle, uMsg, wParam, lParam);
}

Napi::Value StartBlurOverlay(const Napi::CallbackInfo &CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND Handle = GetHandleArgument(Environment, CallbackInfo, 0);

    return Environment.Undefined();

    // HWND windowHandle = GetHandleArgument(environment, CallbackInfo, 0);

    // RECT WindowRect;
    // DwmGetWindowAttribute(windowHandle, DWMWA_EXTENDED_FRAME_BOUNDS, &WindowRect, sizeof(WindowRect));

    // Width = WindowRect.right - WindowRect.left;
    // Height = WindowRect.bottom - WindowRect.top;

    // HDC ScreenDC = GetDC(NULL);
    // HDC MemoryDC = CreateCompatibleDC(ScreenDC);
    // HBITMAP CapturedBitmap = CreateCompatibleBitmap(ScreenDC, Width, Height);
    // // HGDIOBJ OldObject = SelectObject(MemoryDC, CapturedBitmap);

    // if (MemoryDC == nullptr)
    // {
    //     std::cout << "Failed to create MemoryDC in Start function." << std::endl;
    // }

    // // BOOL Success = BitBlt(
    // //     MemoryDC,
    // //     0,
    // //     0,
    // //     Width,
    // //     Height,
    // //     ScreenDC,
    // //     WindowRect.left,
    // //     WindowRect.top,
    // //     SRCCOPY
    // // );
    // // if (Success)
    // // {
    // //     std::cout << "BitBlt SUCCESS" << std::endl;
    // // }
    // // else
    // // {
    // //     std::cout << "BitBlt Failed" << "\n" << GetLastErrorAsString() << std::endl;
    // // }

    // BITMAPINFOHEADER bi = {0};
    // bi.biSize = sizeof(BITMAPINFOHEADER);
    // bi.biWidth = Width;
    // bi.biHeight = Height; // Top-down bitmap
    // bi.biPlanes = 1;
    // bi.biBitCount = 24; // 24-bit bitmap
    // bi.biCompression = BI_RGB;

    // // int rowSize = ((bi.biBitCount * Width + 31) / 32) * 4;
    // // int dataSize = rowSize * Height;

    // if (!BitBlt(MemoryDC, 0, 0, Width, Height, MemoryDC, WindowRect.left, WindowRect.top, SRCCOPY))
    // {
    //     std::cerr << "BitBlt failed." << std::endl;
    //     DeleteObject(CapturedBitmap);
    //     DeleteDC(MemoryDC);
    // }

    // RawArray = new BYTE[Width * Height * ChannelsNum];

    // // Get the bitmap bits
    // BITMAPINFO bmi = {0};
    // bmi.bmiHeader = bi;
    // if (!GetDIBits(MemoryDC, CapturedBitmap, 0, Height, RawArray, &bmi, DIB_RGB_COLORS))
    // {
    //     std::cout << "GetDIBits failed." << std::endl;
    //     DeleteObject(CapturedBitmap);
    //     DeleteDC(MemoryDC);
    //     ReleaseDC(windowHandle, ScreenDC);
    //     // return {};
    // }

    // SelectObject(MemoryDC, CapturedBitmap);
    // DeleteDC(MemoryDC);
    // ReleaseDC(windowHandle, ScreenDC);

    // // gCapturedBitmap = CapturedBitmap;

    // // Create a new window with similar size and position that will display the captured bitmap.
    // // The window should not appear on the taskbar or in Alt+Tab, so we use WS_EX_TOOLWINDOW.
    // // Also, no icon on the taskbar. WS_POPUP and WS_EX_TOOLWINDOW typically ensure no taskbar entry or Alt+Tab listing.

    // HINSTANCE instanceHandle = GetModuleHandle(NULL);
    // const char* ClassName = "BlurWindowClass";
    // const char* WindowName = "SorrellWm Background";
    // // std::string className = "";

    // static bool classRegistered = false;
    // if (!classRegistered)
    // {
    //     WNDCLASS windowClass = { 0 };
    //     windowClass.lpfnWndProc = BlurWindowProc;
    //     windowClass.hInstance = instanceHandle;
    //     windowClass.lpszClassName = ClassName;
    //     RegisterClass(&windowClass);
    //     classRegistered = true;
    // }

    // HWND overlayWindow = CreateWindowEx(
    //     WS_EX_TOOLWINDOW | WS_EX_TOPMOST | WS_EX_NOACTIVATE,
    //     ClassName,
    //     WindowName,
    //     WS_POPUP,
    //     WindowRect.left,
    //     WindowRect.top,
    //     Width,
    //     Height,
    //     NULL,
    //     NULL,
    //     instanceHandle,
    //     NULL
    // );

    // ShowWindow(overlayWindow, SW_SHOW);

    // return environment.Undefined();
}

// // constexpr int kExtend = 0; // Border policy for the Blur function

// // // Global buffer for the blurred image
// // static * g_BlurBuffer = nullptr;
// // static int g_BufferWidth = 0;
// // static int g_BufferHeight = 0;

// // // Function to capture the window to a buffer
// // static bool CaptureWindowToBuffer(HWND TargetWindow, unsigned char*& Buffer, int& Width, int& Height, int& Channels)
// // {
// //     RECT WindowRect;
// //     if (!GetWindowRect(TargetWindow, &WindowRect))
// //     {
// //         return false;
// //     }

// //     Width = WindowRect.right - WindowRect.left;
// //     Height = WindowRect.bottom - WindowRect.top;
// //     Channels = 4; // Assume BGRA format

// //     HDC WindowDC = GetDC(TargetWindow);
// //     if (!WindowDC)
// //     {
// //         return false;
// //     }

// //     HDC MemDC = CreateCompatibleDC(WindowDC);
// //     if (!MemDC)
// //     {
// //         ReleaseDC(TargetWindow, WindowDC);
// //         return false;
// //     }

// //     BITMAPINFO BitmapInfo = {0};
// //     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// //     BitmapInfo.bmiHeader.biWidth = Width;
// //     BitmapInfo.bmiHeader.biHeight = -Height; // top-down
// //     BitmapInfo.bmiHeader.biPlanes = 1;
// //     BitmapInfo.bmiHeader.biBitCount = 32;
// //     BitmapInfo.bmiHeader.biCompression = BI_RGB;

// //     void* Bits = nullptr;
// //     HBITMAP DIB = CreateDIBSection(MemDC, &BitmapInfo, DIB_RGB_COLORS, &Bits, NULL, 0);
// //     if (!DIB)
// //     {
// //         DeleteDC(MemDC);
// //         ReleaseDC(TargetWindow, WindowDC);
// //         return false;
// //     }

// //     HGDIOBJ OldObject = SelectObject(MemDC, DIB);

// //     PrintWindow(TargetWindow, MemDC, PW_CLIENTONLY);

// //     // Allocate or resize the buffer
// //     int BufferSize = Width * Height * Channels;
// //     if (!Buffer)
// //     {
// //         Buffer = new unsigned char[BufferSize];
// //     }
// //     memcpy(Buffer, Bits, BufferSize);

// //     SelectObject(MemDC, OldObject);
// //     DeleteObject(DIB);
// //     DeleteDC(MemDC);
// //     ReleaseDC(TargetWindow, WindowDC);

// //     return true;
// // }

// // // Window procedure for rendering the blurred image
// // static LRESULT CALLBACK OverlayWindowProc(HWND Hwnd, UINT Msg, WPARAM WParam, LPARAM LParam)
// // {
// //     switch (Msg)
// //     {
// //         case WM_PAINT:
// //         {
// //             if (g_BlurBuffer)
// //             {
// //                 PAINTSTRUCT Ps;
// //                 HDC Hdc = BeginPaint(Hwnd, &Ps);

// //                 BITMAPINFO BitmapInfo = {0};
// //                 BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// //                 BitmapInfo.bmiHeader.biWidth = g_BufferWidth;
// //                 BitmapInfo.bmiHeader.biHeight = -g_BufferHeight; // top-down
// //                 BitmapInfo.bmiHeader.biPlanes = 1;
// //                 BitmapInfo.bmiHeader.biBitCount = 32;
// //                 BitmapInfo.bmiHeader.biCompression = BI_RGB;

// //                 StretchDIBits(
// //                     Hdc,
// //                     0, 0, g_BufferWidth, g_BufferHeight, // Destination
// //                     0, 0, g_BufferWidth, g_BufferHeight, // Source
// //                     g_BlurBuffer,
// //                     &BitmapInfo,
// //                     DIB_RGB_COLORS,
// //                     SRCCOPY
// //                 );

// //                 EndPaint(Hwnd, &Ps);
// //             }
// //             return 0;
// //         }

// //         case WM_DESTROY:
// //         {
// //             PostQuitMessage(0);
// //             return 0;
// //         }
// //     }
// //     return DefWindowProc(Hwnd, Msg, WParam, LParam);
// // }

// // // Create a simple window for displaying the blurred screenshot
// // static HWND CreateBlurWindow(int X, int Y, int Width, int Height, HINSTANCE Instance)
// // {
// //     WNDCLASSEXW Wc = {0};
// //     Wc.cbSize = sizeof(WNDCLASSEXW);
// //     Wc.lpfnWndProc = OverlayWindowProc;
// //     Wc.hInstance = Instance;
// //     Wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1); // Default white background
// //     Wc.lpszClassName = L"BlurWindowClass";
// //     RegisterClassExW(&Wc);

// //     HWND Hwnd = CreateWindowExW(
// //         0,                  // No extended styles
// //         L"BlurWindowClass",
// //         L"",                // No title
// //         WS_POPUP,           // Popup style, no border
// //         X, Y, Width, Height,
// //         NULL,
// //         NULL,
// //         Instance,
// //         NULL
// //     );

// //     ShowWindow(Hwnd, SW_SHOW);
// //     UpdateWindow(Hwnd);

// //     return Hwnd;
// // }

// // // Function to perform the blur animation
// // static void PerformBlurAnimation(HWND OverlayHwnd, unsigned char* OriginalBuffer, int Width, int Height, int Channels)
// // {
// //     const float StartSigma = 0.0f;
// //     const float EndSigma = 50.0f;
// //     const float Duration = 0.333f; // 333ms
// //     const int Fps = 60;
// //     const int TotalFrames = static_cast<int>(Duration * Fps);

// //     // Allocate buffer for blur output
// //     if (!g_BlurBuffer)
// //     {
// //         g_BlurBuffer = new unsigned char[Width * Height * Channels];
// //         g_BufferWidth = Width;
// //         g_BufferHeight = Height;
// //     }

// //     auto StartTime = std::chrono::high_resolution_clock::now();

// //     for (int Frame = 0; Frame <= TotalFrames; Frame++)
// //     {
// //         // Calculate elapsed time
// //         auto Now = std::chrono::high_resolution_clock::now();
// //         std::chrono::duration<float> Elapsed = Now - StartTime;
// //         float ElapsedTime = Elapsed.count();
// //         if (ElapsedTime > Duration)
// //         {
// //             ElapsedTime = Duration;
// //         }

// //         // Exponential easing for blur sigma
// //         float CurrentSigma = StartSigma + (EndSigma - StartSigma) * (1 - std::exp(-5.0f * ElapsedTime / Duration));

// //         // Perform the blur
// //         memcpy(g_BlurBuffer, OriginalBuffer, Width * Height * Channels);
// //         Blur(OriginalBuffer, g_BlurBuffer, Width, Height, Channels, CurrentSigma, 1, kExtend);

// //         // Redraw the window with the blurred buffer
// //         InvalidateRect(OverlayHwnd, NULL, TRUE);
// //         UpdateWindow(OverlayHwnd);

// //         // Wait for the next frame
// //         std::this_thread::sleep_for(std::chrono::milliseconds(1000 / Fps));
// //     }
// // }

// // // Example usage in a main function
// // int WINAPI WinMain(HINSTANCE HInstance, HINSTANCE, LPSTR, int)
// // {
// //     HWND TargetWindow = FindWindow(NULL, L"WindowTitle"); // Replace with target window title
// //     if (!TargetWindow)
// //     {
// //         return 1;
// //     }

// //     int* ScreenshotBuffer = nullptr;
// //     int Width = 0, Height = 0, Channels = 0;
// //     if (!CaptureWindowToBuffer(TargetWindow, ScreenshotBuffer, Width, Height, Channels))
// //     {
// //         return 1;
// //     }

// //     // Create a window at the same position and size as the captured window
// //     RECT TargetRect;
// //     GetWindowRect(TargetWindow, &TargetRect);
// //     HWND BlurWindow = CreateBlurWindow(TargetRect.left, TargetRect.top, Width, Height, HInstance);

// //     // Perform the blur animation
// //     PerformBlurAnimation(BlurWindow, ScreenshotBuffer, Width, Height, Channels);

// //     // Free resources
// //     delete[] ScreenshotBuffer;
// //     delete[] g_BlurBuffer;

// //     // Standard message loop
// //     MSG Msg;
// //     while (GetMessage(&Msg, NULL, 0, 0))
// //     {
// //         TranslateMessage(&Msg);
// //         DispatchMessage(&Msg);
// //     }

// //     return 0;
// // }

// // struct FScreenshotBuffer
// // {
// //     int Width;
// //     int Height;
// //     int Channels;
// //     unsigned char *Data;
// // };

// // static LRESULT CALLBACK OverlayWindowProc(HWND Hwnd, UINT Msg, WPARAM WParam, LPARAM LParam)
// // {
// //     switch (Msg)
// //     {
// //         case WM_DESTROY:
// //         {
// //             PostQuitMessage(0);
// //             return 0;
// //         }
// //     }
// //     return DefWindowProc(Hwnd, Msg, WParam, LParam);
// // }

// // static bool CaptureWindowToBuffer(HWND TargetWindow, FScreenshotBuffer& Buffer)
// // {
// //     RECT WindowRect;
// //     if (!GetWindowRect(TargetWindow, &WindowRect))
// //     {
// //         return false;
// //     }

// //     int Width = WindowRect.right - WindowRect.left;
// //     int Height = WindowRect.bottom - WindowRect.top;

// //     HDC WindowDC = GetDC(TargetWindow);
// //     if (!WindowDC)
// //     {
// //         std::cout << "Could not get screenshot 0." << std::endl;
// //         return false;
// //     }

// //     HDC MemDC = CreateCompatibleDC(WindowDC);
// //     if (!MemDC)
// //     {
// //         std::cout << "Could not get screenshot 1." << std::endl;
// //         ReleaseDC(TargetWindow, WindowDC);
// //         return false;
// //     }

// //     BITMAPINFO BitmapInfo = {0};
// //     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// //     BitmapInfo.bmiHeader.biWidth = Width;
// //     BitmapInfo.bmiHeader.biHeight = -Height; // top-down
// //     BitmapInfo.bmiHeader.biPlanes = 1;
// //     BitmapInfo.bmiHeader.biBitCount = 32;
// //     BitmapInfo.bmiHeader.biCompression = BI_RGB;

// //     void *Bits = nullptr;
// //     HBITMAP DIB = CreateDIBSection(MemDC, &BitmapInfo, DIB_RGB_COLORS, &Bits, NULL, 0);
// //     if (!DIB)
// //     {
// //         std::cout << "Could not get screenshot no DIB." << std::endl;
// //         DeleteDC(MemDC);
// //         ReleaseDC(TargetWindow, WindowDC);
// //         return false;
// //     }

// //     HGDIOBJ OldObject = SelectObject(MemDC, DIB);

// //     // PrintWindow(TargetWindow, MemDC, PW_CLIENTONLY);
// //     BOOL Success = BitBlt(WindowDC, WindowRect.left, WindowRect.top, Width, Height, MemDC, WindowRect.left, WindowRect.top, SRCCOPY);
// //     if (Success)
// //     {
// //         std::cout << "BitBlt SUCCESS" << std::endl;
// //     }
// //     else
// //     {
// //         std::cout << "BitBlt Failed" << "\n" << GetLastErrorAsString() << std::endl;
// //     }

// //     if (!Buffer.Data || Buffer.Width != Width || Buffer.Height != Height)
// //     {
// //         std::cout << "Inside weird if statement." << std::endl;
// //         delete[] Buffer.Data;
// //         Buffer.Width = Width;
// //         Buffer.Height = Height;
// //         Buffer.Channels = 3;
// //         Buffer.Data = new unsigned char[Width * Height * 3];
// //     }

// //     memcpy(Buffer.Data, Bits, Width * Height * 3);

// //     SelectObject(MemDC, OldObject);
// //     DeleteObject(DIB);
// //     DeleteDC(MemDC);
// //     ReleaseDC(TargetWindow, WindowDC);

// //     return true;
// // }

// // static HWND CreateTransparentOverlayWindow(int X, int Y, int Width, int Height, HINSTANCE Instance)
// // {
// //     WNDCLASSEXW Wc = {0};
// //     Wc.cbSize = sizeof(WNDCLASSEXW);
// //     Wc.lpfnWndProc = OverlayWindowProc;
// //     Wc.hInstance = Instance;
// //     Wc.lpszClassName = L"TransparentOverlayClass";
// //     RegisterClassExW(&Wc);

// //     std::cout << "X: " << X << ", Y: " << Y << ", Width: " << Width << ", Height: " << Height << std::endl;

// //     HWND Hwnd = CreateWindowExW(
// //         WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TOOLWINDOW,
// //         L"TransparentOverlayClass",
// //         L"SorrellWmTransparentBackground",
// //         WS_POPUP,
// //         X, Y, Width, Height,
// //         NULL,
// //         NULL,
// //         Instance,
// //         NULL
// //     );

// //     // SetLayeredWindowAttributes(Hwnd, 0, 255, LWA_ALPHA);

// //     ShowWindow(Hwnd, SW_SHOW);
// //     // UpdateWindow(Hwnd);

// //     return Hwnd;
// // }

// // // static HWND CreateTransparentOverlayWindow(int X, int Y, int Width, int Height, HINSTANCE Instance)
// // // {
// // //     WNDCLASSEXW Wc = {0};
// // //     Wc.cbSize = sizeof(WNDCLASSEXW);
// // //     Wc.lpfnWndProc = OverlayWindowProc;
// // //     Wc.hInstance = Instance;
// // //     Wc.lpszClassName = L"TransparentOverlayClass";
// // //     RegisterClassExW(&Wc);

// // //     HWND Hwnd = CreateWindowExW(
// // //         WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TOOLWINDOW,
// // //         L"TransparentOverlayClass",
// // //         L"", // no title
// // //         WS_POPUP,
// // //         X, Y, Width, Height,
// // //         NULL,
// // //         NULL,
// // //         Instance,
// // //         NULL
// // //     );

// // //     // Create a temporary pink buffer
// // //     // RGBA: bright pink = (255,0,255). Half-transparency = alpha = 128
// // //     // Fill a buffer with this solid color
// // //     unsigned char* PinkBuffer = new unsigned char[Width * Height * 4];
// // //     for (int i = 0; i < Width * Height; i++)
// // //     {
// // //         PinkBuffer[i * 4 + 0] = 255; // Blue
// // //         PinkBuffer[i * 4 + 1] = 0;   // Green
// // //         PinkBuffer[i * 4 + 2] = 255; // Red
// // //         PinkBuffer[i * 4 + 3] = 128; // Alpha half-transparent
// // //     }

// // //     HDC ScreenDC = GetDC(NULL);
// // //     HDC MemDC = CreateCompatibleDC(ScreenDC);

// // //     BITMAPINFO BitmapInfo = {0};
// // //     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// // //     BitmapInfo.bmiHeader.biWidth = Width;
// // //     BitmapInfo.bmiHeader.biHeight = -Height;
// // //     BitmapInfo.bmiHeader.biPlanes = 1;
// // //     BitmapInfo.bmiHeader.biBitCount = 32;
// // //     BitmapInfo.bmiHeader.biCompression = BI_RGB;

// // //     void *Bits = nullptr;
// // //     HBITMAP DIB = CreateDIBSection(MemDC, &BitmapInfo, DIB_RGB_COLORS, &Bits, NULL, 0);
// // //     HGDIOBJ OldObject = SelectObject(MemDC, DIB);

// // //     // Copy pink buffer into the DIB
// // //     memcpy(Bits, PinkBuffer, Width * Height * 4);

// // //     POINT PtSrc = {0,0};
// // //     POINT PtDest = {X,Y};
// // //     SIZE SizeDest = {Width, Height};

// // //     BLENDFUNCTION Blend = {0};
// // //     Blend.BlendOp = AC_SRC_OVER;
// // //     Blend.SourceConstantAlpha = 255;
// // //     Blend.AlphaFormat = AC_SRC_ALPHA;

// // //     // Update the layered window with the pink buffer
// // //     UpdateLayeredWindow(Hwnd, ScreenDC, &PtDest, &SizeDest, MemDC, &PtSrc, 0, &Blend, ULW_ALPHA);

// // //     // Cleanup
// // //     SelectObject(MemDC, OldObject);
// // //     DeleteObject(DIB);
// // //     DeleteDC(MemDC);
// // //     ReleaseDC(NULL, ScreenDC);
// // //     delete[] PinkBuffer;

// // //     ShowWindow(Hwnd, SW_SHOW);
// // //     UpdateWindow(Hwnd);

// // //     return Hwnd;
// // // }

// // static void UpdateOverlayWindow(HWND OverlayHwnd, unsigned char *Buffer, int Width, int Height)
// // {
// //     HDC ScreenDC = GetDC(NULL);
// //     HDC MemDC = CreateCompatibleDC(ScreenDC);

// //     BITMAPINFO BitmapInfo = {0};
// //     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// //     BitmapInfo.bmiHeader.biWidth = Width;
// //     BitmapInfo.bmiHeader.biHeight = -Height;
// //     BitmapInfo.bmiHeader.biPlanes = 1;
// //     BitmapInfo.bmiHeader.biBitCount = 32;
// //     BitmapInfo.bmiHeader.biCompression = BI_RGB;

// //     void *Bits = nullptr;
// //     HBITMAP DIB = CreateDIBSection(MemDC, &BitmapInfo, DIB_RGB_COLORS, &Bits, NULL, 0);
// //     HGDIOBJ OldObject = SelectObject(MemDC, DIB);

// //     memcpy(Bits, Buffer, Width * Height * 3);

// //     POINT PtSrc = {0, 0};
// //     POINT PtDest = {0, 0};
// //     SIZE SizeDest = {Width, Height};

// //     BLENDFUNCTION Blend = {0};
// //     Blend.BlendOp = AC_SRC_OVER;
// //     Blend.SourceConstantAlpha = 255;
// //     Blend.AlphaFormat = AC_SRC_ALPHA; // If your buffer has alpha
// //     BOOL Updated = UpdateLayeredWindow(OverlayHwnd, ScreenDC, &PtDest, &SizeDest, MemDC, &PtSrc, 0, &Blend, ULW_ALPHA);
// //     if (!Updated)
// //     {
// //         std::cout << "UpdateLayeredWindow Failed!" << "\n";
// //         std::cout << GetLastErrorAsString() << "\n";
// //     }
// //     else
// //     {
// //         std::cout << "UpdateLayeredWindow succeeded!" << "\n";
// //     }

// //     SelectObject(MemDC, OldObject);
// //     DeleteObject(DIB);
// //     DeleteDC(MemDC);
// //     ReleaseDC(NULL, ScreenDC);
// // }

// // static float ExponentialEasing(float Elapsed, float Duration, float Start, float End)
// // {
// //     float Factor = 1.f - std::exp(-1.f * (Elapsed / Duration));
// //     return Start + (End - Start) * Factor;
// // }

// // #include <windows.h>

// // // Pink brush handle (global or static)
// // static HBRUSH g_PinkBrush = CreateSolidBrush(RGB(255, 0, 255));

// // static LRESULT CALLBACK OverlayWindowProc(HWND Hwnd, UINT Msg, WPARAM WParam, LPARAM LParam)
// // {
// //     switch (Msg)
// //     {
// //         case WM_PAINT:
// //         {
// //             PAINTSTRUCT Ps;
// //             HDC Hdc = BeginPaint(Hwnd, &Ps);
// //             RECT Rect;
// //             GetClientRect(Hwnd, &Rect);
// //             FillRect(Hdc, &Rect, g_PinkBrush);
// //             EndPaint(Hwnd, &Ps);
// //             return 0;
// //         }

// //         case WM_DESTROY:
// //         {
// //             PostQuitMessage(0);
// //             return 0;
// //         }
// //     }
// //     return DefWindowProc(Hwnd, Msg, WParam, LParam);
// // }

// // static HWND CreatePinkWindow(int X, int Y, int Width, int Height, HINSTANCE Instance)
// // {
// //     WNDCLASSEXW Wc = {0};
// //     Wc.cbSize = sizeof(WNDCLASSEXW);
// //     Wc.lpfnWndProc = OverlayWindowProc;
// //     Wc.hInstance = Instance;
// //     Wc.hbrBackground = (HBRUSH)(COLOR_WINDOW+1); // Not strictly needed since we paint in WM_PAINT
// //     Wc.lpszClassName = L"PinkWindowClass";
// //     RegisterClassExW(&Wc);

// //     // Create a simple popup window without a title bar
// //     HWND Hwnd = CreateWindowExW(
// //         0,                  // No extended styles like WS_EX_LAYERED
// //         L"PinkWindowClass",
// //         L"",                // no title
// //         WS_POPUP,           // Popup style, no border
// //         X, Y, Width, Height,
// //         NULL,
// //         NULL,
// //         Instance,
// //         NULL
// //     );

// //     ShowWindow(Hwnd, SW_SHOW);
// //     UpdateWindow(Hwnd);

// //     return Hwnd;
// // }

// // constexpr int kExtend = 0; // Border policy for the Blur function

// // // Global buffer for the blurred image
// // static int32_t* g_BlurBuffer = nullptr;
// // static int g_BufferWidth = 0;
// // static int g_BufferHeight = 0;

// // // Function to capture the window to a buffer
// // static bool CaptureWindowToBuffer(HWND TargetWindow, int32_t*& Buffer, int& Width, int& Height, int& Channels)
// // {
// //     RECT WindowRect;
// //     if (!GetWindowRect(TargetWindow, &WindowRect))
// //     {
// //         return false;
// //     }

// //     Width = WindowRect.right - WindowRect.left;
// //     Height = WindowRect.bottom - WindowRect.top;
// //     Channels = 4; // Assume BGRA format

// //     HDC WindowDC = GetDC(TargetWindow);
// //     if (!WindowDC)
// //     {
// //         return false;
// //     }

// //     HDC MemDC = CreateCompatibleDC(WindowDC);
// //     if (!MemDC)
// //     {
// //         ReleaseDC(TargetWindow, WindowDC);
// //         return false;
// //     }

// //     BITMAPINFO BitmapInfo = {0};
// //     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// //     BitmapInfo.bmiHeader.biWidth = Width;
// //     BitmapInfo.bmiHeader.biHeight = -Height; // top-down
// //     BitmapInfo.bmiHeader.biPlanes = 1;
// //     BitmapInfo.bmiHeader.biBitCount = 32;
// //     BitmapInfo.bmiHeader.biCompression = BI_RGB;

// //     void* Bits = nullptr;
// //     HBITMAP DIB = CreateDIBSection(MemDC, &BitmapInfo, DIB_RGB_COLORS, &Bits, NULL, 0);
// //     if (!DIB)
// //     {
// //         DeleteDC(MemDC);
// //         ReleaseDC(TargetWindow, WindowDC);
// //         return false;
// //     }

// //     HGDIOBJ OldObject = SelectObject(MemDC, DIB);

// //     PrintWindow(TargetWindow, MemDC, PW_CLIENTONLY);

// //     // Allocate or resize the buffer
// //     int BufferSize = Width * Height * Channels;
// //     if (!Buffer)
// //     {
// //         Buffer = new int32_t[BufferSize];
// //     }
// //     memcpy(Buffer, Bits, BufferSize);

// //     SelectObject(MemDC, OldObject);
// //     DeleteObject(DIB);
// //     DeleteDC(MemDC);
// //     ReleaseDC(TargetWindow, WindowDC);

// //     return true;
// // }

// // // Window procedure for rendering the blurred image
// // static LRESULT CALLBACK OverlayWindowProc(HWND Hwnd, UINT Msg, WPARAM WParam, LPARAM LParam)
// // {
// //     switch (Msg)
// //     {
// //         case WM_PAINT:
// //         {
// //             if (g_BlurBuffer)
// //             {
// //                 PAINTSTRUCT Ps;
// //                 HDC Hdc = BeginPaint(Hwnd, &Ps);

// //                 BITMAPINFO BitmapInfo = {0};
// //                 BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// //                 BitmapInfo.bmiHeader.biWidth = g_BufferWidth;
// //                 BitmapInfo.bmiHeader.biHeight = -g_BufferHeight; // top-down
// //                 BitmapInfo.bmiHeader.biPlanes = 1;
// //                 BitmapInfo.bmiHeader.biBitCount = 32;
// //                 BitmapInfo.bmiHeader.biCompression = BI_RGB;

// //                 StretchDIBits(
// //                     Hdc,
// //                     0, 0, g_BufferWidth, g_BufferHeight, // Destination
// //                     0, 0, g_BufferWidth, g_BufferHeight, // Source
// //                     g_BlurBuffer,
// //                     &BitmapInfo,
// //                     DIB_RGB_COLORS,
// //                     SRCCOPY
// //                 );

// //                 EndPaint(Hwnd, &Ps);
// //             }
// //             return 0;
// //         }

// //         case WM_DESTROY:
// //         {
// //             PostQuitMessage(0);
// //             return 0;
// //         }
// //     }
// //     return DefWindowProc(Hwnd, Msg, WParam, LParam);
// // }

// // // Create a simple window for displaying the blurred screenshot
// // static HWND CreateBlurWindow(int X, int Y, int Width, int Height, HINSTANCE Instance)
// // {
// //     WNDCLASSEXW Wc = {0};
// //     Wc.cbSize = sizeof(WNDCLASSEXW);
// //     Wc.lpfnWndProc = OverlayWindowProc;
// //     Wc.hInstance = Instance;
// //     Wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1); // Default white background
// //     Wc.lpszClassName = L"BlurWindowClass";
// //     RegisterClassExW(&Wc);

// //     HWND Hwnd = CreateWindowExW(
// //         0,                  // No extended styles
// //         L"BlurWindowClass",
// //         L"",                // No title
// //         WS_POPUP,           // Popup style, no border
// //         X, Y, Width, Height,
// //         NULL,
// //         NULL,
// //         Instance,
// //         NULL
// //     );

// //     ShowWindow(Hwnd, SW_SHOW);
// //     UpdateWindow(Hwnd);

// //     return Hwnd;
// // }

// // static void PerformBlurAnimation(HWND OverlayHwnd, int32_t* OriginalBuffer, int Width, int Height, int Channels)
// // {
// //     const float StartSigma = 1.f;
// //     const float EndSigma = 50.f;
// //     const float Duration = 1.f;
// //     const int Fps = 60;
// //     const int TotalFrames = static_cast<int>(Duration * Fps);

// //     if (!g_BlurBuffer)
// //     {
// //         g_BlurBuffer = new int32_t[Width * Height * Channels];
// //         g_BufferWidth = Width;
// //         g_BufferHeight = Height;
// //     }

// //     auto StartTime = std::chrono::high_resolution_clock::now();

// //     for (int Frame = 0; Frame <= TotalFrames; Frame++)
// //     {
// //         // Calculate elapsed time
// //         auto Now = std::chrono::high_resolution_clock::now();
// //         std::chrono::duration<float> Elapsed = Now - StartTime;
// //         float ElapsedTime = Elapsed.count();
// //         if (ElapsedTime > Duration)
// //         {
// //             ElapsedTime = Duration;
// //         }

// //         // Exponential easing for blur sigma
// //         float CurrentSigma = StartSigma + (EndSigma - StartSigma) * (1 - std::exp(-1.0f * ElapsedTime / Duration));

// //         // Perform the blur
// //         memcpy(g_BlurBuffer, OriginalBuffer, Width * Height * Channels);
// //         Blur(OriginalBuffer, g_BlurBuffer, Width, Height, Channels, CurrentSigma, 1, kExtend);

// //         // Redraw the window with the blurred buffer
// //         InvalidateRect(OverlayHwnd, NULL, TRUE);
// //         UpdateWindow(OverlayHwnd);

// //         // Wait for the next frame
// //         std::this_thread::sleep_for(std::chrono::milliseconds(1000 / Fps));
// //     }
// // }

// static HBITMAP g_Bitmap = NULL;
// static int g_BitmapWidth = 0;
// static int g_BitmapHeight = 0;
// static HWND g_Hwnd = NULL;
// static int32_t* g_OriginalBuffer = nullptr;
// static int32_t* g_WorkBuffer = nullptr;
// static int g_Channels = 4; // Typically 4 for BGRA

// // Window Procedure
// static LRESULT CALLBACK WindowProc(HWND Hwnd, UINT Msg, WPARAM WParam, LPARAM LParam)
// {
//     // std::cout << "WIN PROC" << std::endl;
//     switch (Msg)
//     {
//         case WM_PAINT:
//         {
//             // std::cout << "WM_PAINT\n";
//             PAINTSTRUCT Ps;
//             HDC Hdc = BeginPaint(Hwnd, &Ps);

//             if (g_Bitmap)
//             {
//                 HDC MemDC = CreateCompatibleDC(Hdc);
//                 HGDIOBJ OldObj = SelectObject(MemDC, g_Bitmap);

//                 BitBlt(Hdc, 0, 0, g_BitmapWidth, g_BitmapHeight, MemDC, 0, 0, SRCCOPY);

//                 SelectObject(MemDC, OldObj);
//                 DeleteDC(MemDC);
//             }

//             EndPaint(Hwnd, &Ps);
//             return 0;
//         }

//         case WM_DESTROY:
//             PostQuitMessage(0);
//             return 0;
//     }
//     return DefWindowProc(Hwnd, Msg, WParam, LParam);
// }

// // Create a simple popup window
// static HWND CreateBitmapWindow(int X, int Y, int Width, int Height, HINSTANCE Instance)
// {
//     WNDCLASSEXW Wc = {0};
//     Wc.cbSize = sizeof(WNDCLASSEXW);
//     Wc.lpfnWndProc = WindowProc;
//     Wc.hInstance = Instance;
//     // Wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
//     Wc.lpszClassName = L"BlurWindowClass";
//     RegisterClassExW(&Wc);

//     HWND Hwnd = CreateWindowExW(
//         0,
//         L"BlurWindowClass",
//         L"",
//         WS_POPUP,
//         X, Y, Width, Height,
//         NULL, NULL, Instance, NULL
//     );

//     ShowWindow(Hwnd, SW_SHOW);
//     UpdateWindow(Hwnd);

//     return Hwnd;
// }

// // Update the bitmap using SetDIBits
// static void UpdateBitmap(int32_t* Buffer, int Width, int Height)
// {
//     if (!Buffer || Width <= 0 || Height <= 0)
//     {
//         std::cout << "UpdateBitmap returned immediately." << std::endl;
//         return;
//     }

//     // If needed, create the bitmap
//     if (!g_Bitmap || g_BitmapWidth != Width || g_BitmapHeight != Height)
//     {
//         std::cout << "Needed to create the bitmap." << std::endl;
//         if (g_Bitmap)
//         {
//             std::cout << "Deleting existing bitmap." << std::endl;
//             DeleteObject(g_Bitmap);
//         }

//         g_BitmapWidth = Width;
//         g_BitmapHeight = Height;

//         HDC ScreenDC = GetDC(NULL);
//         std::cout << "Creating a compatible bitmap." << std::endl;
//         g_Bitmap = CreateCompatibleBitmap(ScreenDC, Width, Height);
//         ReleaseDC(NULL, ScreenDC);
//     }

//     BITMAPINFO BitmapInfo = {0};
//     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
//     BitmapInfo.bmiHeader.biWidth = Width;
//     BitmapInfo.bmiHeader.biHeight = -Height; // top-down
//     BitmapInfo.bmiHeader.biPlanes = 1;
//     BitmapInfo.bmiHeader.biBitCount = 32; // BGRA
//     BitmapInfo.bmiHeader.biCompression = BI_RGB;

//     HDC ScreenDC = GetDC(NULL);
//     std::cout << "Creating a compatible bitmap." << std::endl;
//     const int Result = SetDIBits(ScreenDC, g_Bitmap, 0, Height, Buffer, &BitmapInfo, DIB_RGB_COLORS);
//     std::string LogMessage = Result == 0 ? "SetDIBits failed" : "SetDIBits SUCCEEDED";
//     std::cout << LogMessage << std::endl;
//     ReleaseDC(NULL, ScreenDC);

//     InvalidateRect(g_Hwnd, NULL, FALSE);
//     UpdateWindow(g_Hwnd);
// }

// static bool CaptureWindowToBuffer(HWND TargetWindow, int32_t*& Buffer, int& Width, int& Height, int& Channels)
// {
//     RECT WindowRect;
//     if (!GetWindowRect(TargetWindow, &WindowRect))
//     {
//         return false;
//     }

//     Width = WindowRect.right - WindowRect.left;
//     Height = WindowRect.bottom - WindowRect.top;
//     Channels = 4; // BGRA

//     HDC WindowDC = GetDC(TargetWindow);
//     if (!WindowDC)
//     {
//         return false;
//     }

//     HDC DesktopDC = GetDC(GetDesktopWindow());
//     HDC MemDC = CreateCompatibleDC(WindowDC);
//     if (!MemDC)
//     {
//         ReleaseDC(TargetWindow, WindowDC);
//         return false;
//     }

//     BITMAPINFO BitmapInfo = {0};
//     BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
//     BitmapInfo.bmiHeader.biWidth = Width;
//     BitmapInfo.bmiHeader.biHeight = -Height; // top-down
//     BitmapInfo.bmiHeader.biPlanes = 1;
//     BitmapInfo.bmiHeader.biBitCount = 32;
//     BitmapInfo.bmiHeader.biCompression = BI_RGB;

//     void* Bits = nullptr;
//     HBITMAP DIB = CreateDIBSection(DesktopDC, &BitmapInfo, DIB_RGB_COLORS, &Bits, NULL, 0);
//     if (!DIB)
//     {
//         DeleteDC(DesktopDC);
//         DeleteDC(WindowDC);
//         ReleaseDC(TargetWindow, WindowDC);
//         return false;
//     }
//     HDC DibDC = CreateCompatibleDC(DesktopDC);

//     HGDIOBJ OldObj = SelectObject(DibDC, DIB);
//     PrintWindow(TargetWindow, MemDC, PW_CLIENTONLY);

//     int BufferSize = Width * Height * Channels;
//     Buffer = new int32_t[BufferSize];
//     memcpy(Buffer, Bits, BufferSize);

//     ReleaseDC(GetDesktopWindow(), DesktopDC);
//     // SelectObject(MemDC, OldObj);
//     // DeleteObject(DIB);
//     // DeleteDC(MemDC);
//     // ReleaseDC(TargetWindow, WindowDC);

//     return true;
// }

// // Exponential easing function for the sigma
// static float ExponentialEasing(float Elapsed, float Duration, float Start, float End)
// {
//     const float Factor = 1.f - std::exp(-1.f * (Elapsed / Duration));
//     return Start + (End - Start) * Factor;
// }

// // Perform the blur animation
// static void PerformBlurAnimation(float Duration = 1.f, int Fps = 60)
// {
//     float StartSigma = 1.f;
//     float EndSigma = 50.f;
//     int TotalFrames = static_cast<int>(Duration * Fps);

//     auto StartTime = std::chrono::high_resolution_clock::now();

//     for (int Frame = 0; Frame <= TotalFrames; Frame++)
//     {
//         auto Now = std::chrono::high_resolution_clock::now();
//         std::chrono::duration<float> Elapsed = Now - StartTime;
//         float ElapsedTime = Elapsed.count();
//         if (ElapsedTime > Duration) ElapsedTime = Duration;

//         float CurrentSigma = ExponentialEasing(ElapsedTime, Duration, StartSigma, EndSigma);

//         memcpy(g_WorkBuffer, g_OriginalBuffer, g_BitmapWidth * g_BitmapHeight * g_Channels);
//         // Blur(g_OriginalBuffer, g_WorkBuffer, g_BitmapWidth, g_BitmapHeight, g_Channels, CurrentSigma, 1, kExtend);

//         // for (int Index = 0; Index < g_BitmapWidth * g_BitmapHeight * g_Channels; Index++)
//         // {
//         //     if (Index % 4 == 1)
//         //     {
//         //         g_WorkBuffer[Index] = 200;
//         //     }
//         // }

//         UpdateBitmap(g_WorkBuffer, g_BitmapWidth, g_BitmapHeight);

//         std::this_thread::sleep_for(std::chrono::milliseconds(1000 / Fps));
//     }
// }

// Napi::Value StartBlurOverlay(const Napi::CallbackInfo& Info)
// {
//     Napi::Env Environment = Info.Env();

//     std::cout << "StartBlurOverlay was called!" << "\n";

//     HWND TargetWindow = GetHandleArgument(Environment, Info, 0);

//         int Width = 0, Height = 0;
//     if (!CaptureWindowToBuffer(TargetWindow, g_OriginalBuffer, Width, Height, g_Channels))
//     {
//         std::cout << "Failed to capture window buffer" << std::endl;
//     }

//     g_WorkBuffer = new int32_t[Width * Height * g_Channels];

//     HINSTANCE Instance = GetModuleHandle(NULL);
//     // Create a window at the same position and size as the captured window
//     RECT TargetRect;
//     GetWindowRect(TargetWindow, &TargetRect);
//     g_Hwnd = CreateBitmapWindow(TargetRect.left, TargetRect.top, Width, Height, Instance);

//     // Initially display the unblurred image
//     UpdateBitmap(g_OriginalBuffer, Width, Height);

//     // Now perform the blur animation
//     // Note: This call is blocking. If your main message loop is elsewhere, ensure that loop is running.
//     // You might consider calling this function in a separate thread or after your main loop starts.
//     PerformBlurAnimation();

//     // Cleanup
//     delete[] g_OriginalBuffer;
//     delete[] g_WorkBuffer;

//     return Environment.Undefined();

//     // int32_t* ScreenshotBuffer = nullptr;
//     // int Width = 0, Height = 0, Channels = 0;
//     // if (!CaptureWindowToBuffer(TargetWindow, ScreenshotBuffer, Width, Height, Channels))
//     // {
//     //     std::cout << "Frick" << std::endl;
//     // }

//     // HINSTANCE Instance = GetModuleHandle(NULL);

//     // // Create a window at the same position and size as the captured window
//     // RECT TargetRect;
//     // GetWindowRect(TargetWindow, &TargetRect);
//     // HWND BlurWindow = CreateBlurWindow(TargetRect.left, TargetRect.top, Width, Height, Instance);

//     // // Perform the blur animation
//     // PerformBlurAnimation(BlurWindow, ScreenshotBuffer, Width, Height, Channels);

//     // // Free resources
//     // delete[] ScreenshotBuffer;
//     // delete[] g_BlurBuffer;

//     // return Environment.Undefined();

//     // // // Standard message loop
//     // // MSG Msg;
//     // // while (GetMessage(&Msg, NULL, 0, 0))
//     // // {
//     // //     TranslateMessage(&Msg);
//     // //     DispatchMessage(&Msg);
//     // // }

//     // // RECT TargetRect;
//     // // if (!GetWindowRect(TargetWindow, &TargetRect))
//     // // {
//     // //     Napi::Error::New(Environment, "Failed to get window rect").ThrowAsJavaScriptException();
//     // //     return Environment.Null();
//     // // }

//     // // const int WindowWidth = TargetRect.right - TargetRect.left;
//     // // const int WindowHeight = TargetRect.bottom - TargetRect.top;

//     // // FScreenshotBuffer Buffer = {0};
//     // // if (!CaptureWindowToBuffer(TargetWindow, Buffer))
//     // // {
//     // //     std::cout << "Failed to capture window" << std::endl;
//     // //     Napi::Error::New(Environment, "Failed to capture window").ThrowAsJavaScriptException();
//     // //     return Environment.Null();
//     // // }

//     // // unsigned char* OutBuffer = new unsigned char[Buffer.Width * Buffer.Height * Buffer.Channels];

//     // // float StartSigma = 1.f;
//     // // float EndSigma = 50.f;
//     // // float Duration = 1.f;
//     // // int Fps = 60;
//     // // int TotalFrames = static_cast<int>(Duration * Fps);
//     // // auto StartTime = std::chrono::high_resolution_clock::now();

//     // // MSG Msg;
//     // // ZeroMemory(&Msg, sizeof(MSG));

//     // // HINSTANCE Instance = GetModuleHandle(NULL);
//     // // HWND OverlayHwnd = CreateTransparentOverlayWindow(TargetRect.left, TargetRect.top, WindowWidth, WindowHeight, Instance);
//     // // if (!OverlayHwnd)
//     // // {
//     // //     std::cout << "Failed to create overlay window" << std::endl;
//     // //     Napi::Error::New(Environment, "Failed to create overlay window").ThrowAsJavaScriptException();
//     // //     return Environment.Null();
//     // // }

//     // // // memcpy(OutBuffer, Buffer.Data, Buffer.Width * Buffer.Height * Buffer.Channels);
//     // // // Blur(Buffer.Data, OutBuffer, Buffer.Width, Buffer.Height, Buffer.Channels, 40);
//     // // UpdateOverlayWindow(OverlayHwnd, Buffer.Data, Buffer.Width, Buffer.Height);

//     // // // for (int Frame = 0; Frame <= TotalFrames; Frame++)
//     // // // {
//     // // //     while (PeekMessage(&Msg, NULL, 0, 0, PM_REMOVE))
//     // // //     {
//     // // //         if (Msg.message == WM_QUIT)
//     // // //         {
//     // // //             std::cout << "Blur was told to quit." << std::endl;
//     // // //             break;
//     // // //         }
//     // // //         TranslateMessage(&Msg);
//     // // //         DispatchMessage(&Msg);
//     // // //     }

//     // // //     if (Msg.message == WM_QUIT)
//     // // //     {
//     // // //         std::cout << "Blur was told to quit." << std::endl;
//     // // //         break;
//     // // //     }

//     // // //     auto Now = std::chrono::high_resolution_clock::now();
//     // // //     std::chrono::duration<float> Elapsed = Now - StartTime;
//     // // //     float ElapsedTime = Elapsed.count();
//     // // //     if (ElapsedTime > Duration)
//     // // //     {
//     // // //         ElapsedTime = Duration;
//     // // //     }

//     // // //     float CurrentSigma = ExponentialEasing(ElapsedTime, Duration, StartSigma, EndSigma);
//     // // //     // std::cout << "σ = " << CurrentSigma << "\n";

//     // // //     // // Re-capture the window each frame (if you need dynamic updates)
//     // // //     // CaptureWindowToBuffer(TargetWindow, Buffer);
//     // // //     memcpy(OutBuffer, Buffer.Data, Buffer.Width * Buffer.Height * Buffer.Channels);
//     // // //     Blur(Buffer.Data, OutBuffer, Buffer.Width, Buffer.Height, Buffer.Channels, CurrentSigma);
//     // // //     UpdateOverlayWindow(OverlayHwnd, OutBuffer, Buffer.Width, Buffer.Height);
//     // // //     std::this_thread::sleep_for(std::chrono::milliseconds(1000 / Fps));
//     // // // }

//     // // std::cout << "Outside of for loop." << std::endl;

//     // // delete[] Buffer.Data;
//     // // delete[] OutBuffer;
//     // // Buffer.Data = nullptr;
//     // // OutBuffer = nullptr;

//     // // return Environment.Undefined();
// }

#pragma endregion "Blur"

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

    HWND hwnd = DecodeHandle(info[0].As<Napi::Object>());

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

Napi::Value TestFun(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    LPCSTR WindowName = "SorrellWm Main Window";
    HWND SorrellWmMainWindow = FindWindow(NULL, WindowName);
    if (SorrellWmMainWindow != nullptr)
    {
        SetWindowPos(SorrellWmMainWindow, nullptr, 2048, 2048, 0, 0, SWP_NOSIZE);

        RECT MyRect;
        GetWindowRect(SorrellWmMainWindow, &MyRect);
        std::cout << "TestFun" << MyRect.left << " " << MyRect.top << std::endl;
    }

    return Environment.Undefined();
}

Napi::Value GetIsLightMode(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HKEY hKey;
    DWORD appsUseLightTheme = 1;
    DWORD size = sizeof(appsUseLightTheme);

    // Open the registry key
    if (RegOpenKeyEx(HKEY_CURRENT_USER,
                     "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
                     0, KEY_READ, &hKey) == ERROR_SUCCESS)
    {
        // Read the AppsUseLightTheme value
        if (RegQueryValueEx(hKey, "AppsUseLightTheme", nullptr, nullptr,
                            reinterpret_cast<LPBYTE>(&appsUseLightTheme), &size) == ERROR_SUCCESS)
        {
            RegCloseKey(hKey);
            return Napi::Boolean::New(Environment, appsUseLightTheme != 0);
        }
        RegCloseKey(hKey);
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
