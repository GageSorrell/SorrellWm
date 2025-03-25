/* File:      WindowUtilities.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "WindowUtilities.h"
#include "Globals.h"

// DECLARE_LOG_CATEGORY(Window)

BOOL GetDwmWindowRect(HWND Handle, RECT* Rect)
{
    HRESULT Result = DwmGetWindowAttribute(
        Handle,
        DWMWA_EXTENDED_FRAME_BOUNDS,
        Rect,
        sizeof(RECT)
    );

    if (FAILED(Result))
    {
        return GetWindowRect(Handle, Rect);
    }
    else
    {
        return TRUE;
    }

    return TRUE;
}

Napi::Value GetDwmWindowRectNode(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    HWND Handle = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());
    RECT Bounds;
    GetDwmWindowRect(Handle, &Bounds);

    return EncodeRect(Environment, Bounds);
}


Napi::Value GetFocusedWindow(const Napi::CallbackInfo& CallbackInfo)
{
    return EncodeHandle(CallbackInfo.Env(), GetForegroundWindow());
}

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

std::string GetGdiplusStatusString(Gdiplus::Status status)
{
    switch (status)
    {
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

    // std::cout << "Left: " << rect.left << std::endl;
    // std::cout << "Top: " << rect.top << std::endl;
    // std::cout << "Monitor Left: " << monitorInfo.rcMonitor.left << std::endl;
    // std::cout << "Monitor Top: " << monitorInfo.rcMonitor.top << std::endl;

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

    const int BufferSize = 256;
    wchar_t WindowTextW[BufferSize] = { 0 };

    GetWindowTextW(Handle, WindowTextW, BufferSize);

    // std::cout
    //     << "Inside SetWindowPosition, Title is "
    //     << WStringToString(WindowTextW)
    //     << std::endl;

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

    DWORD Color;
    BOOL IsOpaque;

    HRESULT ColorizationResult = DwmGetColorizationColor(&Color, &IsOpaque);
    if (FAILED(ColorizationResult))
    {
        std::cout << "Failed to retrieve taskbar color." << std::endl;
        std::string DefaultThemeColor = "#0078D7";
        return Napi::String::New(Environment, DefaultThemeColor);
    }

    BYTE Red = (Color >> 16) & 0xFF;
    BYTE Green = (Color >> 8) & 0xFF;
    BYTE Blue = Color & 0xFF;

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

    HWND Handle = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    const int BufferSize = 256;
    wchar_t WindowTextW[BufferSize] = { 0 };

    GetWindowTextW(Handle, WindowTextW, BufferSize);

    std::string WindowText = WStringToString(WindowTextW);
    return Napi::String::New(Environment, WindowText);
}

Napi::Value GetApplicationFriendlyName(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HWND WindowHandle = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    DWORD ProcessIdentifier = 0;
    GetWindowThreadProcessId(WindowHandle, &ProcessIdentifier);
    if (ProcessIdentifier == 0)
    {
        return Environment.Undefined();
    }

    HANDLE ProcessHandle = OpenProcess(
        PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ,
        FALSE,
        ProcessIdentifier
    );

    if (!ProcessHandle)
    {
        return Environment.Undefined();
    }

    char ModuleFilePath[MAX_PATH];
    if (!GetModuleFileNameExA(ProcessHandle, nullptr, ModuleFilePath, MAX_PATH))
    {
        CloseHandle(ProcessHandle);
        return Environment.Undefined();
    }

    DWORD UnusedHandleForVersion = 0;
    DWORD VersionInformationSize = GetFileVersionInfoSizeA(
        ModuleFilePath,
        &UnusedHandleForVersion
    );

    if (VersionInformationSize > 0)
    {
        std::vector<char> VersionInformationData(VersionInformationSize);
        if (GetFileVersionInfoA(ModuleFilePath, 0, VersionInformationSize, VersionInformationData.data()))
        {
            /* The block for "FileDescription" in a typical US-English resource is under: *
             * \StringFileInfo\040904B0\FileDescription                                 */
            char *FileDescriptionData = nullptr;
            UINT FileDescriptionSize = 0;
            if (VerQueryValueA(
                    VersionInformationData.data(),
                    "\\StringFileInfo\\040904B0\\FileDescription",
                    reinterpret_cast<void**>(&FileDescriptionData),
                    &FileDescriptionSize)
            )
            {
                if (FileDescriptionSize > 0 && FileDescriptionData)
                {
                    CloseHandle(ProcessHandle);
                    return Napi::String::New(Environment, std::string(FileDescriptionData));
                }
            }
        }
    }

    std::string FullPathString = ModuleFilePath;
    size_t DirectorySeparatorPosition = FullPathString.find_last_of("\\/");
    std::string BaseName = (DirectorySeparatorPosition == std::string::npos)
        ? FullPathString
        : FullPathString.substr(DirectorySeparatorPosition + 1);

    size_t DotPosition = BaseName.rfind('.');
    if (DotPosition != std::string::npos)
    {
        BaseName = BaseName.substr(0, DotPosition);
    }

    CloseHandle(ProcessHandle);
    return Napi::String::New(Environment, BaseName);
}

BOOL CALLBACK EnumWindowsRestore(HWND WindowHandle, LPARAM LParam)
{
    if (IsWindowVisible(WindowHandle))
    {
        if (IsZoomed(WindowHandle))
        {
            ShowWindow(WindowHandle, SW_RESTORE);
        }
    }
    return TRUE;
}

Napi::Value RestoreAllWindows(const Napi::CallbackInfo& CallbackInfo)
{
    EnumWindows(EnumWindowsRestore, 0);
    return CallbackInfo.Env().Undefined();
}

/** Get the main window of the window manager. */
HWND GetMainWindow()
{
    LPCSTR WindowName = "SorrellWm Main Window";
    return FindWindow(nullptr, WindowName);
}

/**
 * Like `SetForegroundWindow`, but works even if the window that is currently
 * focused does not belong to this process.
 */
void StealFocus(HWND Window)
{
    INPUT pInputs[] = {
        { INPUT_KEYBOARD, VK_MENU, 0 },
        { INPUT_KEYBOARD, VK_MENU, KEYEVENTF_KEYUP }
    };

    SendInput(2, pInputs, sizeof(INPUT));

    SetForegroundWindow(Window);
}

/** Exposed copy of `StealFocus`. */
Napi::Value StealFocusNode(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    HWND Window = (HWND) DecodeHandle(CallbackInfo[0].As<Napi::Object>());

    StealFocus(Window);

    return Environment.Undefined();
}
