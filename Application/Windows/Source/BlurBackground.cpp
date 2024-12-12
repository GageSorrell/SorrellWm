/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "BlurBackground.h"

static const char* WindowTitle = "SorrellWm Blurred Background";
static const char* WindowClassName = WindowTitle;
static int Depth = 24;
static int ChannelsNum = 3;
static RECT WindowRect;
static int Width = 320;
static int Height = 240;
static HWND BackgroundHandle = nullptr;
static const float MinSigma = 1.f;
static const float MaxSigma = 10.f;
static float Sigma = MinSigma;
static const std::size_t FairlyHighResolution = 3840 * 2160 * 3;
static std::vector<BYTE> BlurredScreenshotData(FairlyHighResolution);
static std::vector<BYTE> ScreenshotData(FairlyHighResolution);
static BYTE* Screenshot = nullptr;
static BYTE* BlurredScreenshot = nullptr;
static bool CalledOnce = false;
static double Luminance = 0.f;
static double BrightnessScalar = 1.f;
static std::string ThemeMode = "Indeterminate";
static bool ScalesBrightness = false;
static HWND SorrellWmMainWindow = nullptr;
static DWORD BlurStartTime = 0;
static DWORD FadeStartTime = 0;
static DWORD BlurLastTimestamp = 0;
static DWORD FadeLastTimestamp = 0;
static const UINT_PTR BlurTimerId = 1;
static const UINT_PTR FadeTimerId = 2;
static const int Duration = 200;
static const int MsPerFrame = static_cast<int>(1000 / 90);
static HWND SourceHandle = nullptr;
static bool PaintedOnce = false;

LPBITMAPINFO ScreenshotBmi = NULL;
LPBITMAPINFO BlurredBmi = NULL;

double CalculateScalingFactor(double AverageLuminance)
{
    double d_dark = std::abs(AverageLuminance - 85.l);
    double d_light = std::abs(170.l - AverageLuminance);

    if (d_dark < d_light)
    {
        if (AverageLuminance <= 85.l)
        {
            return 1.l;
        }
        else
        {
            return 85.l / AverageLuminance;
        }
    }
    else
    {
        if (AverageLuminance >= 170.l)
        {
            return 1.l;
        }
        else
        {
            return 170.l / AverageLuminance;
        }
    }
}

void ApplyScalingFactor(BYTE* PixelData, int width, int height, int channelsNum, double scalingFactor)
{
    if (!PixelData || width <= 0 || height <= 0 || (channelsNum != 3 && channelsNum != 4))
    {
        return;
    }

    size_t totalPixels = static_cast<size_t>(width) * height;

    for (size_t Index = 0; Index < totalPixels; ++Index)
    {
        size_t index = Index * channelsNum;

        BYTE blue = PixelData[index];
        BYTE green = PixelData[index + 1];
        BYTE red = PixelData[index + 2];

        int scaled_red = static_cast<int>(red * scalingFactor);
        int scaled_green = static_cast<int>(green * scalingFactor);
        int scaled_blue = static_cast<int>(blue * scalingFactor);

        PixelData[index + 2] = static_cast<BYTE>(std::clamp(scaled_red, 0, 255));
        PixelData[index + 1] = static_cast<BYTE>(std::clamp(scaled_green, 0, 255));
        PixelData[index]     = static_cast<BYTE>(std::clamp(scaled_blue, 0, 255));
    }
}

double CalculateAverageLuminance(const BYTE* pixelData, int width, int height, int channelsNum)
{
    if (!pixelData || width <= 0 || height <= 0 || (channelsNum != 3 && channelsNum != 4))
    {
        return -1.l;
    }

    double TotalLuminance = 0.l;
    size_t totalPixels = static_cast<size_t>(width) * height;

    for (size_t i = 0; i < totalPixels; ++i) {
        size_t index = i * channelsNum;

        BYTE blue = pixelData[index];
        BYTE green = pixelData[index + 1];
        BYTE red = pixelData[index + 2];
        // BYTE alpha = (channelsNum == 4) ? pixelData[index + 3] : 255;

        // Calculate luminance using Rec. 709
        double luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

        TotalLuminance += luminance;
    }

    double averageLuminance = TotalLuminance / static_cast<double>(totalPixels);
    return averageLuminance;
}


LPBITMAPINFO CreateDIB(int cx, int cy, int iBpp, BYTE* &pBits)
{
	LPBITMAPINFO lpBmi;
	int iBmiSize = sizeof(BITMAPINFO);
	int iSurfaceSize = cx * cy * (sizeof(BYTE) * 3);

	// Allocate memory for the bitmap info header.
	if((lpBmi = (LPBITMAPINFO)malloc(iBmiSize)) == NULL){
		// std::cout << "Error allocating BitmapInfo!\n";
		return NULL;
	}

	ZeroMemory(lpBmi, iBmiSize);

	// Allocate memory for the DIB surface.
	if((pBits = (BYTE*)malloc(iSurfaceSize)) == NULL) {
		// std::cout << "Error allocating memory for bitmap bits\n";
		return NULL;
	}

	ZeroMemory(pBits, iSurfaceSize);

	// Initialize bitmap info header
	lpBmi->bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	lpBmi->bmiHeader.biWidth = cx;
	// lpBmi->bmiHeader.biHeight = -(signed)cy;		// <-- NEGATIVE MEANS TOP DOWN!!!
	lpBmi->bmiHeader.biHeight = (signed)cy;
	lpBmi->bmiHeader.biPlanes = 1;
	lpBmi->bmiHeader.biSizeImage = 0;
	lpBmi->bmiHeader.biXPelsPerMeter = 0;
	lpBmi->bmiHeader.biYPelsPerMeter = 0;
	lpBmi->bmiHeader.biClrUsed = 0;
	lpBmi->bmiHeader.biClrImportant = 0;
	lpBmi->bmiHeader.biCompression = BI_RGB;

	lpBmi->bmiHeader.biBitCount = 24;

	return lpBmi;
}

void PutPixel(int x, int y, BYTE r, BYTE g, BYTE b, LPBITMAPINFO lpBmi, void* pBits)
{
	int iOffset = lpBmi->bmiHeader.biWidth * y + x;

	BYTE* p = (BYTE*)pBits;
	p[iOffset * 3 + 0] = r;
	p[iOffset * 3 + 1] = g;
	p[iOffset * 3 + 2] = b;
}

bool CaptureWindowScreenshot(HWND SourceHandle)
{
    std::cout << "Left: " << WindowRect.left << "\nRight: " << WindowRect.right << "\nTop: " << WindowRect.top << "\nBottom: " << WindowRect.bottom << std::endl;

    Width = WindowRect.right - WindowRect.left;
    Height = WindowRect.bottom - WindowRect.top;
    ChannelsNum = 3;

    HDC ScreenDc = GetDC(NULL);

    HDC hdcMemDC = CreateCompatibleDC(ScreenDc);
    if (!hdcMemDC)
    {
        std::cout << "Failed to create compatible DC." << std::endl;
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }

    ScreenshotData.reserve(Width * Height * ChannelsNum);
    Screenshot = ScreenshotData.data();
    HBITMAP hBitmap = CreateDIBSection(ScreenDc, ScreenshotBmi, DIB_RGB_COLORS, (void**) Screenshot, NULL, 0);
    if (!hBitmap)
    {
        std::cout << "Failed to create DIB section." << std::endl;
        LogLastWindowsError();
        DeleteDC(hdcMemDC);
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "Made DIB Section." << std::endl;
    }

    HGDIOBJ hOld = SelectObject(hdcMemDC, hBitmap);
    if (!hOld)
    {
        std::cout << "Failed to select bitmap into DC." << std::endl;
        LogLastWindowsError();
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "hOld has been selected." << std::endl;
    }

    if (!BitBlt(hdcMemDC, 0, 0, Width, Height, ScreenDc, WindowRect.left, WindowRect.top, SRCCOPY))
    {
        std::cout << "BitBlt failed." << std::endl;
        SelectObject(hdcMemDC, hOld);
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "CaptureWindowScreenshot: BitBlt call is GOOD." << std::endl;
    }

    SIZE_T bufferSize = static_cast<SIZE_T>(Width) * Height * ChannelsNum;
    ScreenshotData.reserve(bufferSize);
    if (!Screenshot)
    {
        std::cout << "Failed to allocate memory for screenshot." << std::endl;
        LogLastWindowsError();
        SelectObject(hdcMemDC, hOld);
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(NULL, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "Screenshot is GOOD!" << std::endl;
    }

    int scanLines = GetDIBits(ScreenDc, hBitmap, 0, Height, Screenshot, ScreenshotBmi, DIB_RGB_COLORS);
    if (scanLines == 0)
    {
        std::cout << "GetDIBits failed." << std::endl;
        LogLastWindowsError();
        Screenshot = nullptr;
    }
    else
    {
        // std::cout << "There are " << scanLines << " scanLines!" << std::endl;
    }

    Screenshot = ScreenshotData.data();
    Luminance = CalculateAverageLuminance(Screenshot, Width, Height, ChannelsNum);
    BrightnessScalar = CalculateScalingFactor(Luminance);
    ScalesBrightness = BrightnessScalar != 1.f;

    SelectObject(hdcMemDC, hOld);
    DeleteObject(hBitmap);
    DeleteDC(hdcMemDC);
    ReleaseDC(nullptr, ScreenDc);

    if (scanLines == 0)
    {
        return false;
    }

    return true;
}

void Render(HWND hWnd, HWND SourceHandle)
{
    BOOL Captured = CaptureWindowScreenshot(SourceHandle);
    if (Captured)
    {
        std::cout << "CapturedWindowScreenshot Successfully." << std::endl;
    }
    else
    {
        std::cout << "CapturedWindowScreenshot FAILED." << std::endl;
    }

	InvalidateRect(hWnd, NULL, FALSE);
}

BOOL OnCreate(HWND hWnd, CREATESTRUCT FAR* lpCreateStruct)
{
    BlurLastTimestamp = BlurStartTime;
    SetTimer(hWnd, BlurTimerId, MsPerFrame, NULL);
	// Create a new DIB
	if((ScreenshotBmi = CreateDIB(Width, Height, Depth, Screenshot)) == NULL)
    {
        std::cout << "g_lpBmi COULD NOT BE CREATED" << std::endl;
		return FALSE;
	}
    else
    {
        std::cout << "g_lpBmi WAS CREATED ! ! !" << std::endl;
    }
	if((BlurredBmi = CreateDIB(Width, Height, Depth, BlurredScreenshot)) == NULL)
    {
        std::cout << "BlurredBmi COULD NOT BE CREATED" << std::endl;
		return FALSE;
	}
    else
    {
        std::cout << "BlurredBmi was created." << std::endl;
    }

	return TRUE;
}

void OnDestroy(HWND hWnd)
{
	if(ScreenshotBmi)
    {
		free(ScreenshotBmi);
	}
	if(BlurredBmi)
    {
		free(BlurredBmi);
	}

    WindowRect = RECT();
    BackgroundHandle = nullptr;
    Sigma = MinSigma;
    CalledOnce = false;
    Luminance = 0.f;
    BrightnessScalar = 1.f;
    ThemeMode = "Indeterminate";
    ScalesBrightness = false;
    BlurStartTime = 0;
    FadeStartTime = 0;
    BlurLastTimestamp = 0;
    FadeLastTimestamp = 0;
    SetForegroundWindow(SourceHandle);
    BOOL Here = SetWindowPos(
        SorrellWmMainWindow,
        HWND_TOP,
        2000,
        2000,
        0,
        0,
    SWP_NOSIZE
    );
    if (Here)
    {
        std::cout << "Here was true." << std::endl;
    }
    else
    {
        std::cout << "Here was false." << std::endl;
    }
}

void GetBackgroundMode() {
    double d_dark = std::abs(Luminance - 85.0);
    double d_light = std::abs(170.0 - Luminance);

    if (d_dark < d_light)
    {
        ThemeMode = "Dark";
        // if (averageLuminance <= 85.0)
        // {
        //     ThemeMode = "Dark";
        // }
        // else
        // {
        //     ThemeMode = "Dark Mode Target: Scale Down";
        // }
    }
    else
    {
        ThemeMode = "Light";
        // if (averageLuminance >= 170.0)
        // {
        //     return "Light Mode Background";
        // }
        // else
        // {
        //     return "Light Mode Target: Scale Up";
        // }
    }
}

void OnPaint(HWND hWnd) {
    static PAINTSTRUCT PaintStruct;
    static HDC hDC;

    hDC = BeginPaint(hWnd, &PaintStruct);

    BITMAPINFO bmi;
    ZeroMemory(&bmi, sizeof(BITMAPINFO));
    bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    bmi.bmiHeader.biWidth = Width;
    bmi.bmiHeader.biHeight = -1 * Height;
    bmi.bmiHeader.biPlanes = 1;
    bmi.bmiHeader.biBitCount = 24;
    bmi.bmiHeader.biCompression = BI_RGB;

    std::cout << "Blur is being called with Sigma " << std::setprecision(4)
              << Sigma << std::endl;
    SIZE_T bufferSize = static_cast<SIZE_T>(Width) * Height * ChannelsNum;
    BlurredScreenshotData.reserve(bufferSize);
    BlurredScreenshot = BlurredScreenshotData.data();
    Screenshot = ScreenshotData.data();
    if (Sigma < MaxSigma)
    {
        Blur(
            Screenshot,
            BlurredScreenshot,
            Width,
            Height,
            ChannelsNum,
            Sigma,
            3,
            kExtend
        );

        int result = SetDIBitsToDevice(
            hDC,
            0,
            0,
            Width,
            Height,
            0,
            0,
            0,
            Height,
            BlurredScreenshot,
            BlurredBmi,
            DIB_RGB_COLORS
        );

        BlurredScreenshot = BlurredScreenshotData.data();
        if (ScalesBrightness)
        {
            const float Alpha = Sigma / MaxSigma;
            const float Brightness = BrightnessScalar * Alpha;
            ApplyScalingFactor(
                BlurredScreenshot,
                Width,
                Height,
                ChannelsNum,
                Brightness
            );
        }
    }

    if (!PaintedOnce)
    {
        PaintedOnce = true;
        ShowWindow(hWnd, SW_SHOW);
        ShowWindow(SorrellWmMainWindow, SW_SHOW);
        SetForegroundWindow(SorrellWmMainWindow);
    }

    EndPaint(hWnd, &PaintStruct);
}

BOOL OnEraseBkgnd(HWND hWnd, HDC hdc)
{
    return TRUE;
}

LRESULT CALLBACK BlurWndProc(HWND hWnd, UINT iMsg, WPARAM wParam, LPARAM lParam)
{
    switch (iMsg)
    {
        HANDLE_MSG(hWnd, WM_CREATE, OnCreate);
        HANDLE_MSG(hWnd, WM_DESTROY, OnDestroy);
        HANDLE_MSG(hWnd, WM_PAINT, OnPaint);
        HANDLE_MSG(hWnd, WM_ERASEBKGND, OnEraseBkgnd);
    case WM_TIMER:
        DWORD currentTime = GetTickCount();
        DWORD elapsedTime = 0;
        switch (wParam)
        {
            case BlurTimerId:
            if (BlurStartTime == 0) {
              BlurStartTime = GetTickCount();
              InvalidateRect(SorrellWmMainWindow, NULL, FALSE);
            }
            elapsedTime = currentTime - BlurStartTime;
            if (elapsedTime == 0) {
              InvalidateRect(hWnd, NULL, FALSE);
            }
            if (elapsedTime >= Duration) {
              std::cout << std::setprecision(10)
                        << "For the blur timer, elapsedTime >= Duration: "
                        << +(elapsedTime) << " >= " << Duration
                        << " and a final Sigma of " << Sigma << std::endl;
              Sigma = MaxSigma;
              BOOL PostTimerRes = SetLayeredWindowAttributes(
                  SorrellWmMainWindow, 0, 255, LWA_ALPHA);
              if (PostTimerRes) {
                std::cout << "PostTimerRes was true." << std::endl;
              } else {
                std::cout << "PostTimerRes was false." << std::endl;
              }
              InvalidateRect(hWnd, NULL, FALSE);
              KillTimer(hWnd, BlurTimerId);
            } else if (currentTime - BlurLastTimestamp >= MsPerFrame) {
              const float Alpha =
                  static_cast<float>((float)elapsedTime / (float)Duration);
              const float Factor = 1 - std::pow(2, -10.f * Alpha);
              Sigma = MinSigma + (MaxSigma - MinSigma) * Factor;
              InvalidateRect(hWnd, NULL, FALSE);

              unsigned char Transparency = static_cast<unsigned char>(
                  std::clamp(std::round(255.f * Alpha), 0.f, 255.f));
              BOOL Res = SetLayeredWindowAttributes(SorrellWmMainWindow, 0,
                                                    Transparency, LWA_ALPHA);
              if (!Res) {
                std::cout << "SetLayeredWindowAttributes failed when "
                             "increasing opacity."
                          << std::endl;
                LogLastWindowsError();
              }

              BlurLastTimestamp = currentTime;
            } else {
              std::cout << std::setprecision(4) << "WM_TIMER came too soon, "
                        << currentTime << " " << BlurLastTimestamp << std::endl;
            }
            return 0;
                case FadeTimerId:
            Sigma = MinSigma;
            elapsedTime = currentTime - FadeStartTime;
            if (elapsedTime >= Duration) {
              std::cout << "Destroying window..." << std::endl;
              ShowWindow(hWnd, SW_HIDE);
              DestroyWindow(hWnd);
            }
            // InvalidateRect(hWnd, NULL, FALSE);
            if (elapsedTime == 0) {
              InvalidateRect(hWnd, NULL, FALSE);
            }
            if (elapsedTime >= Duration) {
              std::cout << std::setprecision(2)
                        << "For the Fade timer, elapsedTime >= Duration: "
                        << std::to_string(
                               static_cast<unsigned int>(elapsedTime))
                        << " >= " << Duration << std::endl;
              KillTimer(hWnd, FadeTimerId);
              SetLayeredWindowAttributes(BackgroundHandle, 0, 0, LWA_ALPHA);
              SetLayeredWindowAttributes(SorrellWmMainWindow, 0, 255,
                                         LWA_ALPHA);
              // Might not need this, and it is expensive...
              InvalidateRect(SorrellWmMainWindow, NULL, FALSE);
            } else if (currentTime - FadeLastTimestamp >= MsPerFrame) {
              // const float EasedAlpha = std::exp(-2.f * (1.f - (elapsedTime /
              // Duration)));
              const float EasedAlpha =
                  1.f -
                  std::pow(2, -10.f * ((float)elapsedTime / (float)Duration));
              const float Alpha = elapsedTime / (float)Duration;
              unsigned char Transparency =
                  static_cast<unsigned char>(std::clamp(
                      std::round(255.f - 255.f * EasedAlpha), 0.f, 255.f));
              unsigned char MainWindowTransparency = static_cast<unsigned char>(
                  std::clamp(std::round(255.f - 255.f * Alpha), 0.f, 255.f));
              InvalidateRect(hWnd, NULL, FALSE);
              std::cout << std::setprecision(4) << "Transparency is "
                        << +(Transparency) << " at time " << currentTime
                        << " with EasedAlpha " << EasedAlpha << std::endl;

              SetLayeredWindowAttributes(BackgroundHandle, 0, Transparency, LWA_ALPHA);
              SetLayeredWindowAttributes(SorrellWmMainWindow, 0,
                                         MainWindowTransparency, LWA_ALPHA);

              FadeLastTimestamp = currentTime;
            } else {
              std::cout << "WM_TIMER came too soon, " << currentTime << " "
                        << FadeLastTimestamp << std::endl;
            }
            return 0;
                }
    }
    }

    return DefWindowProc(hWnd, iMsg, wParam, lParam);
}

Napi::Value TearDown(const Napi::CallbackInfo &CallbackInfo) {
    Napi::Env Environment = CallbackInfo.Env();

    std::cout << "Tearing down window!" << std::endl;

    BOOL Shadow = false;
    BOOL SystemSuccess =
        SystemParametersInfoA(SPI_GETDROPSHADOW, 0, &Shadow, 0);
    if (Shadow) {
                std::cout << "Shadow is TRUE" << std::endl;
    } else {
                std::cout << "Shadow is FALSE" << std::endl;
    }
    if (SystemSuccess) {
                std::cout << "SystemSuccess is TRUE" << std::endl;
    } else {
                std::cout << "SystemSuccess is FALSE" << std::endl;
    }

    /* @TODO If this is called while the blur is still animating, then the fade
     * animation should only take the length of time that the blur animation
     * played. */

    BOOL KillResult = KillTimer(BackgroundHandle, BlurTimerId);
    if (!KillResult) {
                std::cout << "KillTimer for BlurTimerId returned " << KillResult
                          << std::endl;
                LogLastWindowsError();
    }

    FadeStartTime = GetTickCount();
    FadeLastTimestamp = FadeStartTime;
    int SetTimerResult = SetTimer(BackgroundHandle, FadeTimerId, MsPerFrame, NULL);

    return Environment.Undefined();
}

std::string GetDerivedThemeMode(double Luminance)
{
    if (Luminance <= 85.0)
    {
        return "Dark";
    }
    else if (Luminance >= 170.0)
    {
        return "Light";
    }
    else
    {
        return "Indeterminate";
    }
}

Napi::Value MyBlur(const Napi::CallbackInfo &CallbackInfo) {
    Napi::Env Environment = CallbackInfo.Env();
    HINSTANCE hInstance = GetModuleHandle(NULL);

    MSG msg;
    WNDCLASSEXA WindowClass;

    WindowClass.cbSize = sizeof(WindowClass);
    WindowClass.style = CS_VREDRAW | CS_HREDRAW;
    WindowClass.lpfnWndProc = BlurWndProc;
    WindowClass.cbClsExtra = 0;
    WindowClass.cbWndExtra = 0;
    WindowClass.hInstance = hInstance;
    WindowClass.lpszMenuName = NULL;
    WindowClass.lpszClassName = WindowClassName;

    SourceHandle = GetForegroundWindow();
    if (SourceHandle == nullptr || SourceHandle == SorrellWmMainWindow) {
                std::cout << "MyBlur was called, but GetForegroundWindow gave "
                             "the nullptr."
                          << std::endl;
                return Environment.Undefined();
    }

    GetDwmWindowRect(SourceHandle, &WindowRect);
    Height = WindowRect.bottom - WindowRect.top;
    Width = WindowRect.right - WindowRect.left;

    RegisterClassExA(&WindowClass);
    // std::cout << "Registered window class!" << std::endl;

    BackgroundHandle = CreateWindowExA(
        NULL, WindowClassName, NULL,
        // WS_OVERLAPPEDWINDOW,
        WS_EX_TOOLWINDOW | WS_POPUP | WS_EX_NOACTIVATE, WindowRect.left,
        WindowRect.top, WindowRect.right - WindowRect.left,
        WindowRect.bottom - WindowRect.top, NULL, NULL, hInstance, NULL);

    SetWindowLong(BackgroundHandle, GWL_EXSTYLE,
                  GetWindowLong(BackgroundHandle, GWL_EXSTYLE) | WS_EX_LAYERED);

    BOOL attrib = TRUE;
    DwmSetWindowAttribute(BackgroundHandle, DWMWA_TRANSITIONS_FORCEDISABLED, &attrib,
                          sizeof(attrib));

    // SetWindowLong(BackgroundHandle, GWL_STYLE, 0);

    Render(BackgroundHandle, SourceHandle);

    ShowWindow(BackgroundHandle, SW_SHOWNOACTIVATE);
    UpdateWindow(BackgroundHandle);
    SetWindowPos(
        BackgroundHandle,
        GetNextWindow(SourceHandle, GW_HWNDPREV),
        0,
        0,
        0,
        0,
        SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE
    );

    BOOL LayeredSuccess = SetLayeredWindowAttributes(BackgroundHandle, 0, 255, LWA_ALPHA);
    if (LayeredSuccess)
    {
                std::cout << "SetLayeredWindowAttributes was SUCCESSFUL."
                          << std::endl;
    }
    else
    {
                std::cout << "SetLayeredWindowAttributes FAILED." << std::endl;
                LogLastWindowsError();
    }

    LPCSTR WindowName = "SorrellWm Main Window";
    SorrellWmMainWindow = FindWindow(NULL, WindowName);
    SetWindowLong(SorrellWmMainWindow, GWL_EXSTYLE,
                  GetWindowLong(SorrellWmMainWindow, GWL_EXSTYLE) |
                      WS_EX_LAYERED);
    SetLayeredWindowAttributes(SorrellWmMainWindow, 0, 0, LWA_ALPHA);
    BOOL MyRes = SetWindowPos(
        SorrellWmMainWindow,
        HWND_TOP,
        WindowRect.left,
        WindowRect.top,
        WindowRect.right - WindowRect.left,
        WindowRect.bottom - WindowRect.top,
        SWP_SHOWWINDOW
    );
    BOOL SetFore = SetForegroundWindow(SorrellWmMainWindow);
    std::cout << "SetFore " << SetFore << std::endl;
    if (MyRes) {
                std::cout << "MyRes was true" << std::endl;
    } else {
                std::cout << "MyRes was false" << std::endl;
    }

    GetBackgroundMode();
    Napi::Object OutObject = Napi::Object::New(Environment);
    OutObject.Set("BackgroundWindow", EncodeHandle(Environment, SourceHandle));
    OutObject.Set("ThemeMode", ThemeMode);
    return OutObject;
}
