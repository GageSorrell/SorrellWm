/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "BlurBackground.h"

#include "Core/Utility.h"
#include <Windowsx.h>
#include "ThirdParty/Blur.h"
#include <algorithm>
#include <cstdlib>
#include "Core/WinEvent.h"
#include "Core/WindowUtilities.h"
#include <algorithm>
#include "Core/Math.h"
#include <cstdint>
#include "Core/MonitorUtilities.h"
#include "Core/Globals.h"

// DECLARE_LOG_CATEGORY(Blur)

/**
 * 1. Get screenshot of SourceHandle window
 * 2. Draw empty window that will show blur
 * 3. Animate blur
 * 4. Superimpose Main window
 * 5. (Closing down) play fade animation (fading both windows)
 * 6. (When fade animation is done) Move Main window away and destroy blur window
 */


namespace Shared
{
    static int ChannelsNum = 3;
    static int Depth = 24;
    static int Width;
    static int Height;
    static RECT Bounds;
    static HWND BackdropHandle = nullptr;
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
    static const int Duration = 150;
    static int MsPerFrame = 1000 / 120;
    static HWND SourceHandle = nullptr;
    static bool PaintedOnce = false;
    LPBITMAPINFO ScreenshotBmi = nullptr;
    LPBITMAPINFO BlurredBmi = nullptr;
    static const UINT_PTR BlurTimerId = 1;
    static const UINT_PTR FadeTimerId = 2;
    static const int MinDeferResolution = 1920 * 1080 + 1;
};

// /**
//  * Return the ms per frame (inverse of frame rate).
//  * Depends upon the refresh rate of the monitor and the
//  * size of the window.
//  */
// static void SetMsPerFrame(HWND SourceHandle)
// {
//     const bool IsLargerThan2k = Width * Height > 2560 * 1440;
//     const int32_t BaseMsPerFrame = IsLargerThan2k
//         ? 60
//         : 120;

//     const int32_t RefreshRate = GetRefreshRateFromWindow(SourceHandle);

//     MsPerFrame = 1000 / min(RefreshRate, BaseMsPerFrame);
// }

int32_t GetMsPerFrame()
{
    const bool IsLargerThan2k = Shared::Width * Shared::Height > 2560 * 1440;
    const int32_t BaseMsPerFrame = IsLargerThan2k
        ? 60
        : 120;

    const int32_t RefreshRate = GetLeastRefreshRateOverRect(Shared::Bounds);

    return 1000 / min(RefreshRate, BaseMsPerFrame);
}

double CalculateScalingFactor(double AverageLuminance)
{
    const double DarkThreshold = std::abs(AverageLuminance - 85.l);
    const double LightThreshold = std::abs(170.l - AverageLuminance);
    double ScalingFactor;

    if (DarkThreshold < LightThreshold)
    {
        if (AverageLuminance <= 85.l)
        {
            ScalingFactor = 1.l;
        }
        else
        {
            ScalingFactor = 85.l / AverageLuminance;
        }
    }
    else
    {
        if (AverageLuminance >= 170.l)
        {
            ScalingFactor = 1.l;
        }
        else
        {
            ScalingFactor = 170.l / AverageLuminance;
        }
    }

    return ScalingFactor;
}

void ApplyScalingFactor(
    BYTE* PixelData,
    int width,
    int height,
    int channelsNum,
    double scalingFactor
)
{
    if (!PixelData || width <= 0 || height <= 0 || (channelsNum != 3 && channelsNum != 4))
    {
        return;
    }

    const size_t TotalPixels = static_cast<size_t>(width) * height;

    for (size_t PixelIndex = 0; PixelIndex < TotalPixels; ++PixelIndex)
    {
        const size_t ColorIndex = PixelIndex * channelsNum;

        const BYTE Blue = PixelData[ColorIndex];
        const BYTE Green = PixelData[ColorIndex + 1];
        const BYTE Red = PixelData[ColorIndex + 2];

        const int ScaledRed = static_cast<int>(Red * scalingFactor);
        const int ScaledGreen = static_cast<int>(Green * scalingFactor);
        const int ScaledBlue = static_cast<int>(Blue * scalingFactor);

        PixelData[ColorIndex + 2] = static_cast<BYTE>(std::clamp(ScaledRed, 0, 255));
        PixelData[ColorIndex + 1] = static_cast<BYTE>(std::clamp(ScaledGreen, 0, 255));
        PixelData[ColorIndex] = static_cast<BYTE>(std::clamp(ScaledBlue, 0, 255));
    }
}

double CalculateAverageLuminance(
    const BYTE* PixelData,
    int width,
    int height,
    int channelsNum
)
{
    if (!PixelData || width <= 0 || height <= 0 || (channelsNum != 3 && channelsNum != 4))
    {
        return -1.l;
    }

    double TotalLuminance = 0.l;
    const size_t TotalPixels = static_cast<size_t>(width) * height;

    for (std::size_t PixelIndex = 0; PixelIndex < TotalPixels; ++PixelIndex)
    {
        const std::size_t ColorIndex = PixelIndex * channelsNum;

        const BYTE Blue = PixelData[ColorIndex];
        const BYTE Green = PixelData[ColorIndex + 1];
        const BYTE Red = PixelData[ColorIndex + 2];

        // Calculate luminance using Rec. 709
        const double AdjustedLuminance = 0.2126l * Red + 0.7152l * Green + 0.0722l * Blue;

        TotalLuminance += AdjustedLuminance;
    }

    double averageLuminance = TotalLuminance / static_cast<double>(TotalPixels);
    return averageLuminance;
}

LPBITMAPINFO CreateDib(int Width, int Height, int Depth, BYTE*& Bits)
{
    LPBITMAPINFO BitmapInfo;
    const int BmiSize = sizeof(BITMAPINFO);
    const int SurfaceSize = Width * Height * (sizeof(BYTE) * 3);

    BitmapInfo = (LPBITMAPINFO) malloc(BmiSize);

    if (BitmapInfo == nullptr)
    {
        std::cout
            << "Error allocating BitmapInfo."
            << std::endl;

        return nullptr;
    }

    ZeroMemory(BitmapInfo, BmiSize);

    Bits = (BYTE*) malloc(SurfaceSize);

    if (Bits == nullptr)
    {
        std::cout
            << "Failed to allocate memory for Bits."
            << std::endl;

        return nullptr;
    }

    ZeroMemory(Bits, SurfaceSize);

    BitmapInfo->bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    BitmapInfo->bmiHeader.biWidth = Width;
    BitmapInfo->bmiHeader.biHeight = (signed) Height;
    BitmapInfo->bmiHeader.biPlanes = 1;
    BitmapInfo->bmiHeader.biSizeImage = 0;
    BitmapInfo->bmiHeader.biXPelsPerMeter = 0;
    BitmapInfo->bmiHeader.biYPelsPerMeter = 0;
    BitmapInfo->bmiHeader.biClrUsed = 0;
    BitmapInfo->bmiHeader.biClrImportant = 0;
    BitmapInfo->bmiHeader.biCompression = BI_RGB;
    BitmapInfo->bmiHeader.biBitCount = Depth;

    return BitmapInfo;
}

bool CaptureWindowScreenshot()
{
    HDC ScreenDc = GetDC(nullptr);

    HDC HdcMemDc = CreateCompatibleDC(ScreenDc);
    if (!HdcMemDc)
    {
        std::cout << "Failed to create compatible DC." << std::endl;
        ReleaseDC(Shared::SourceHandle, ScreenDc);
        return false;
    }

    Shared::ScreenshotData.reserve(Shared::Width * Shared::Height * Shared::ChannelsNum);
    Shared::Screenshot = Shared::ScreenshotData.data();

    HBITMAP Bitmap = CreateDIBSection(
        ScreenDc,
        Shared::ScreenshotBmi,
        DIB_RGB_COLORS,
        (void**) Shared::Screenshot,
        nullptr,
        0
    );

    if (!Bitmap)
    {
        std::cout
            // << ELogLevel::Error
            << "Failed to create DIB section, handle was "
            << Shared::SourceHandle
            << ", ScreenshotData reserved "
            << Shared::Width * Shared::Height * Shared::ChannelsNum
            << std::endl;

        DeleteDC(HdcMemDc);
        ReleaseDC(Shared::SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "Made DIB Section." << std::endl;
    }

    HGDIOBJ hOld = SelectObject(HdcMemDc, Bitmap);
    if (!hOld)
    {
        std::cout
            // << ELogLevel::Error
            << "Failed to select bitmap into DC."
            << std::endl;
        LogLastWindowsError();
        DeleteObject(Bitmap);
        DeleteDC(HdcMemDc);
        ReleaseDC(Shared::SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "hOld has been selected." << std::endl;
    }

    BOOL BitBltResult = BitBlt(
        HdcMemDc,
        0,
        0,
        Shared::Width,
        Shared::Height,
        ScreenDc,
        Shared::Bounds.left,
        Shared::Bounds.top,
        SRCCOPY
    );

    if (!BitBltResult)
    {
        std::cout
            // << ELogLevel::Error
            << "BitBlt failed."
            << std::endl;
        SelectObject(HdcMemDc, hOld);
        DeleteObject(Bitmap);
        DeleteDC(HdcMemDc);
        ReleaseDC(Shared::SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "CaptureWindowScreenshot: BitBlt call is GOOD." <<
        // std::endl;
    }

    SIZE_T BufferSize = static_cast<SIZE_T>(Shared::Width) * Shared::Height * Shared::ChannelsNum;
    Shared::ScreenshotData.reserve(BufferSize);
    if (!Shared::Screenshot)
    {
        std::cout << "Failed to allocate memory for screenshot." << std::endl;
        LogLastWindowsError();
        SelectObject(HdcMemDc, hOld);
        DeleteObject(Bitmap);
        DeleteDC(HdcMemDc);
        ReleaseDC(nullptr, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "Screenshot is GOOD!" << std::endl;
    }

    int scanLines = GetDIBits(
        ScreenDc,
        Bitmap,
        0,
        Shared::Height,
        Shared::Screenshot,
        Shared::ScreenshotBmi,
        DIB_RGB_COLORS
    );

    if (scanLines == 0)
    {
        std::cout << "GetDIBits failed." << std::endl;
        LogLastWindowsError();
        Shared::Screenshot = nullptr;
    }
    else
    {
        // std::cout << "There are " << scanLines << " scanLines!" << std::endl;
    }

    Shared::Screenshot = Shared::ScreenshotData.data();
    Shared::Luminance = CalculateAverageLuminance(Shared::Screenshot, Shared::Width, Shared::Height, Shared::ChannelsNum);
    Shared::BrightnessScalar = CalculateScalingFactor(Shared::Luminance);
    Shared::ScalesBrightness = Shared::BrightnessScalar != 1.f;

    SelectObject(HdcMemDc, hOld);
    DeleteObject(Bitmap);
    DeleteDC(HdcMemDc);
    ReleaseDC(nullptr, ScreenDc);

    if (scanLines == 0)
    {
        return false;
    }

    InvalidateRect(Shared::BackdropHandle, nullptr, FALSE);

    return true;
}

BOOL OnCreate(HWND hWnd, CREATESTRUCT FAR* lpCreateStruct)
{
    Shared::BlurLastTimestamp = Shared::BlurStartTime;
    SetTimer(hWnd, Shared::BlurTimerId, GetMsPerFrame(), nullptr);
    if ((Shared::ScreenshotBmi = CreateDib(Shared::Width, Shared::Height, Shared::Depth, Shared::Screenshot)) == nullptr)
    {
        std::cout << "g_lpBmi COULD NOT BE CREATED" << std::endl;
        return FALSE;
    }
    else
    {
        std::cout << "g_lpBmi WAS CREATED ! ! !" << std::endl;
    }
    if ((Shared::BlurredBmi = CreateDib(Shared::Width, Shared::Height, Shared::Depth, Shared::BlurredScreenshot)) == nullptr)
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
    if (Shared::ScreenshotBmi)
    {
        free(Shared::ScreenshotBmi);
    }

    if (Shared::BlurredBmi)
    {
        free(Shared::BlurredBmi);
    }

    Shared::Bounds = RECT();
    Shared::BackdropHandle = nullptr;
    Shared::Sigma = Shared::MinSigma;
    Shared::CalledOnce = false;
    Shared::Luminance = 0.f;
    Shared::BrightnessScalar = 1.f;
    Shared::ThemeMode = "Indeterminate";
    Shared::ScalesBrightness = false;
    Shared::BlurStartTime = 0;
    Shared::FadeStartTime = 0;
    Shared::BlurLastTimestamp = 0;
    Shared::FadeLastTimestamp = 0;
    SetForegroundWindow(Shared::SourceHandle);
    BOOL Here = SetWindowPos(Shared::SorrellWmMainWindow, HWND_TOP, 2000, 2000, 0, 0, SWP_NOSIZE);
    if (Here)
    {
        std::cout << "Here was true." << std::endl;
    }
    else
    {
        std::cout << "Here was false." << std::endl;
    }
}

void GetBackgroundMode()
{
    const double d_dark = std::abs(Shared::Luminance - 85.0);
    const double d_light = std::abs(170.0 - Shared::Luminance);

    if (d_dark < d_light)
    {
        Shared::ThemeMode = "Dark";
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
        Shared::ThemeMode = "Light";
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

void OnPaint(HWND hWnd)
{
    static PAINTSTRUCT PaintStruct;
    static HDC hDC;

    hDC = BeginPaint(hWnd, &PaintStruct);

    BITMAPINFO BitmapInfo;
    ZeroMemory(&BitmapInfo, sizeof(BITMAPINFO));
    BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    BitmapInfo.bmiHeader.biWidth = Shared::Width;
    BitmapInfo.bmiHeader.biHeight = -1 * Shared::Height;
    BitmapInfo.bmiHeader.biPlanes = 1;
    BitmapInfo.bmiHeader.biBitCount = Shared::Depth;
    BitmapInfo.bmiHeader.biCompression = BI_RGB;

    // std::cout << "Blur is being called with Sigma " << std::setprecision(4) << Sigma << std::endl;
    SIZE_T BufferSize = static_cast<SIZE_T>(Shared::Width) * Shared::Height * Shared::ChannelsNum;
    Shared::BlurredScreenshotData.reserve(BufferSize);
    Shared::BlurredScreenshot = Shared::BlurredScreenshotData.data();
    Shared::Screenshot = Shared::ScreenshotData.data();
    if (Shared::Sigma < Shared::MaxSigma)
    {
        Blur(
            Shared::Screenshot,
            Shared::BlurredScreenshot,
            Shared::Width,
            Shared::Height,
            Shared::ChannelsNum,
            Shared::Sigma,
            3,
            kExtend
        );

        const int Result = SetDIBitsToDevice(
            hDC,
            0,
            0,
            Shared::Width,
            Shared::Height,
            0,
            0,
            0,
            Shared::Height,
            Shared::BlurredScreenshot,
            Shared::BlurredBmi,
            DIB_RGB_COLORS
        );

        Shared::BlurredScreenshot = Shared::BlurredScreenshotData.data();
        if (Shared::ScalesBrightness)
        {
            const float Alpha = Shared::Sigma / Shared::MaxSigma;
            const float Brightness = Shared::BrightnessScalar * Alpha;
            ApplyScalingFactor(
                Shared::BlurredScreenshot,
                Shared::Width,
                Shared::Height,
                Shared::ChannelsNum,
                Brightness
            );
        }
    }

    if (!Shared::PaintedOnce)
    {
        Shared::PaintedOnce = true;
        ShowWindow(hWnd, SW_SHOW);
        ShowWindow(Shared::SorrellWmMainWindow, SW_SHOW);
        SetForegroundWindow(Shared::SorrellWmMainWindow);
    }

    EndPaint(hWnd, &PaintStruct);
}

BOOL OnEraseBackground(HWND _Handle, HDC _Hdc)
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
        HANDLE_MSG(hWnd, WM_ERASEBKGND, OnEraseBackground);
    case WM_TIMER:
        DWORD CurrentTime = GetTickCount();
        DWORD ElapsedTime = 0;
        switch (wParam)
        {
        case Shared::BlurTimerId:
            if (Shared::BlurStartTime == 0)
            {
                Shared::BlurStartTime = GetTickCount();
                InvalidateRect(Shared::SorrellWmMainWindow, nullptr, FALSE);
            }
            ElapsedTime = CurrentTime - Shared::BlurStartTime;
            if (ElapsedTime == 0)
            {
                InvalidateRect(hWnd, nullptr, FALSE);
            }
            if (ElapsedTime >= Shared::Duration)
            {
                // std::cout << std::setprecision(10) << "For the blur timer, elapsedTime >= Duration: " << +(elapsedTime)
                //           << " >= " << Duration << " and a final Sigma of " << Sigma << std::endl;
                Shared::Sigma = Shared::MaxSigma;
                BOOL PostTimerRes = SetLayeredWindowAttributes(Shared::SorrellWmMainWindow, 0, 255, LWA_ALPHA);
                // if (PostTimerRes)
                // {
                //     std::cout << "PostTimerRes was true." << std::endl;
                // }
                // else
                // {
                //     std::cout << "PostTimerRes was false." << std::endl;
                // }
                InvalidateRect(hWnd, nullptr, FALSE);
                KillTimer(hWnd, Shared::BlurTimerId);
            }
            else if (CurrentTime - Shared::BlurLastTimestamp >= Shared::MsPerFrame)
            {
                const float Alpha = static_cast<float>((float) ElapsedTime / (float) Shared::Duration);
                const float Factor = 1 - std::pow(2, -10.f * Alpha);
                Shared::Sigma = Shared::MinSigma + (Shared::MaxSigma - Shared::MinSigma) * Factor;
                InvalidateRect(hWnd, nullptr, FALSE);

                unsigned char Transparency = static_cast<unsigned char>(
                    std::clamp(std::round(255.f * Alpha), 0.f, 255.f));
                BOOL Res = SetLayeredWindowAttributes(Shared::SorrellWmMainWindow, 0, Transparency, LWA_ALPHA);
                if (!Res)
                {
                    std::cout
                        << "SetLayeredWindowAttributes failed when increasing opacity."
                        << std::endl;

                    LogLastWindowsError();
                }

                Shared::BlurLastTimestamp = CurrentTime;
            }
            else
            {
                std::cout
                    << std::setprecision(4)
                    << "WM_TIMER came too soon, "
                    << CurrentTime
                    << " "
                    << Shared::BlurLastTimestamp
                    << std::endl;
            }
            return 0;
        case Shared::FadeTimerId:
            Shared::Sigma = Shared::MinSigma;
            ElapsedTime = CurrentTime - Shared::FadeStartTime;
            if (ElapsedTime >= Shared::Duration)
            {
                std::cout << "Destroying window..." << std::endl;
                ShowWindow(hWnd, SW_HIDE);
                DestroyWindow(hWnd);
            }
            // InvalidateRect(hWnd, nullptr, FALSE);
            if (ElapsedTime == 0)
            {
                InvalidateRect(hWnd, nullptr, FALSE);
            }
            if (ElapsedTime >= Shared::Duration)
            {
                std::cout
                    << std::setprecision(2)
                    << "For the Fade timer, elapsedTime >= Duration: "
                    << std::to_string(static_cast<unsigned int>(ElapsedTime))
                    << " >= "
                    << Shared::Duration
                    << std::endl;
                KillTimer(hWnd, Shared::FadeTimerId);
                SetLayeredWindowAttributes(Shared::BackdropHandle, 0, 0, LWA_ALPHA);
                SetLayeredWindowAttributes(Shared::SorrellWmMainWindow, 0, 255, LWA_ALPHA);
                // Might not need this, and it is expensive...
                InvalidateRect(Shared::SorrellWmMainWindow, nullptr, FALSE);
            }
            else if (CurrentTime - Shared::FadeLastTimestamp >= Shared::MsPerFrame)
            {
                // const float EasedAlpha = std::exp(-2.f * (1.f - (elapsedTime
                // / Duration)));
                const float EasedAlpha = 1.f - std::pow(2, -10.f * ((float) ElapsedTime / (float) Shared::Duration));
                const float Alpha = ElapsedTime / (float) Shared::Duration;
                unsigned char Transparency = static_cast<unsigned char>(
                    std::clamp(std::round(255.f - 255.f * EasedAlpha), 0.f, 255.f));
                unsigned char MainWindowTransparency = static_cast<unsigned char>(
                    std::clamp(std::round(255.f - 255.f * Alpha), 0.f, 255.f));
                InvalidateRect(hWnd, nullptr, FALSE);

                SetLayeredWindowAttributes(Shared::BackdropHandle, 0, Transparency, LWA_ALPHA);
                SetLayeredWindowAttributes(Shared::SorrellWmMainWindow, 0, MainWindowTransparency, LWA_ALPHA);

                Shared::FadeLastTimestamp = CurrentTime;
            }
            else
            {
                std::cout << "WM_TIMER came too soon, " << CurrentTime << " " << Shared::FadeLastTimestamp << std::endl;
            }
            return 0;
        }
    }

    return DefWindowProc(hWnd, iMsg, wParam, lParam);
}

Napi::Value UnblurBackground(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    std::cout << "Tearing down window!" << std::endl;

    BOOL Shadow = false;
    BOOL SystemSuccess = SystemParametersInfoA(SPI_GETDROPSHADOW, 0, &Shadow, 0);
    if (Shadow)
    {
        std::cout << "Shadow is TRUE" << std::endl;
    }
    else
    {
        std::cout << "Shadow is FALSE" << std::endl;
    }
    if (SystemSuccess)
    {
        std::cout << "SystemSuccess is TRUE" << std::endl;
    }
    else
    {
        std::cout << "SystemSuccess is FALSE" << std::endl;
    }

    /* @TODO If this is called while the blur is still animating, then the fade
     * animation should only take the length of time that the blur animation
     * played. */

    BOOL KillResult = KillTimer(Shared::BackdropHandle, Shared::BlurTimerId);
    if (!KillResult)
    {
        std::cout
            << "KillTimer for BlurTimerId returned "
            << KillResult
            << std::endl;

        std::cout
            << "After kill timer, last Windows error is "
            << GetLastWindowsError()
            << std::endl;
    }

    Shared::FadeStartTime = GetTickCount();
    Shared::FadeLastTimestamp = Shared::FadeStartTime;
    int SetTimerResult = SetTimer(Shared::BackdropHandle, Shared::FadeTimerId, Shared::MsPerFrame, nullptr);

    return Environment.Undefined();
}

std::string GetDerivedThemeMode(double Luminance)
{
    if (Luminance <= 85.f)
    {
        return "Dark";
    }
    else if (Luminance >= 170.f)
    {
        return "Light";
    }
    else
    {
        return "Indeterminate";
    }
}

bool CreateBackdrop()
{
    HINSTANCE ModuleHandle = GetModuleHandle(nullptr);
    WNDCLASSEXA WindowClass;
    char* WindowTitle = "SorrellWm Blurred Background";
    char* WindowClassName = WindowTitle;

    WindowClass.cbSize        = sizeof(WindowClass);
    WindowClass.style         = CS_VREDRAW | CS_HREDRAW;
    WindowClass.lpfnWndProc   = BlurWndProc;
    WindowClass.cbClsExtra    = 0;
    WindowClass.cbWndExtra    = 0;
    WindowClass.hInstance     = ModuleHandle;
    WindowClass.hIcon         = LoadIcon(NULL, IDI_APPLICATION);
    WindowClass.hCursor       = LoadCursor(NULL, IDC_ARROW);
    WindowClass.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    WindowClass.lpszMenuName  = NULL;
    WindowClass.lpszClassName = WindowTitle;
    WindowClass.hIconSm       = LoadIcon(NULL, IDI_APPLICATION);

    RegisterClassExA(&WindowClass);

    /* @TODO See if SourceHandle can be removed. */
    Shared::SourceHandle = GetForegroundWindow();
    if (Shared::SourceHandle == nullptr || Shared::SourceHandle == Shared::SorrellWmMainWindow)
    {
        std::cout
            << "BlurBackground was called, but there was no window focused."
            << std::endl;

        return false;
    }

    Shared::BackdropHandle = CreateWindowExA(NULL,
        WindowClassName,
        nullptr,
        WS_EX_TOOLWINDOW | WS_POPUP | WS_EX_NOACTIVATE,
        Shared::Bounds.left,
        Shared::Bounds.top,
        Shared::Bounds.right - Shared::Bounds.left,
        Shared::Bounds.bottom - Shared::Bounds.top,
        nullptr,
        nullptr,
        ModuleHandle,
        nullptr);

    SetWindowLong(
        Shared::BackdropHandle,
        GWL_EXSTYLE,
        GetWindowLong(Shared::BackdropHandle, GWL_EXSTYLE) | WS_EX_LAYERED
    );

    BOOL Attribute = TRUE;
    DwmSetWindowAttribute(
        Shared::BackdropHandle,
        DWMWA_TRANSITIONS_FORCEDISABLED,
        &Attribute,
        sizeof(Attribute)
    );

    return true;
}

void SuperimposeBackdrop()
{
    ShowWindow(Shared::BackdropHandle, SW_SHOWNOACTIVATE);
    UpdateWindow(Shared::BackdropHandle);
    SetWindowPos(Shared::BackdropHandle,
        GetNextWindow(Shared::SourceHandle, GW_HWNDPREV),
        0,
        0,
        0,
        0,
        SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE);

    BOOL LayeredSuccess = SetLayeredWindowAttributes(Shared::BackdropHandle, 0, 255, LWA_ALPHA);
    if (LayeredSuccess)
    {
        std::cout << "SetLayeredWindowAttributes was SUCCESSFUL." << std::endl;
    }
    else
    {
        std::cout << "SetLayeredWindowAttributes FAILED." << std::endl;
        LogLastWindowsError();
    }
}

void SuperimposeMainWindow()
{
    LPCSTR WindowName = "SorrellWm Main Window";
    Shared::SorrellWmMainWindow = GetMainWindow();
    std::cout
        << "SorrellWmMainWindow is "
        << Shared::SorrellWmMainWindow
        << std::endl;
    SetWindowLong(
        Shared::SorrellWmMainWindow,
        GWL_EXSTYLE,
        GetWindowLong(Shared::SorrellWmMainWindow, GWL_EXSTYLE) | WS_EX_LAYERED
    );
    SetLayeredWindowAttributes(Shared::SorrellWmMainWindow, 0, 0, LWA_ALPHA);
    BOOL MyRes = SetWindowPos(
        Shared::SorrellWmMainWindow,
        HWND_TOP,
        Shared::Bounds.left,
        Shared::Bounds.top,
        Shared::Bounds.right - Shared::Bounds.left,
        Shared::Bounds.bottom - Shared::Bounds.top,
        SWP_SHOWWINDOW
    );

    StealFocus(Shared::SorrellWmMainWindow);
}

Napi::Value BlurBackground(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    Shared::Bounds = DecodeRect(CallbackInfo[0].As<Napi::Object>());
    Shared::Height = Shared::Bounds.bottom - Shared::Bounds.top;
    Shared::Width = Shared::Bounds.right - Shared::Bounds.left;

    Shared::SourceHandle = GetForegroundWindow();

    const bool CreatedBackdrop = CreateBackdrop();
    if (!CreatedBackdrop)
    {
        return Environment.Undefined();
    }

    CaptureWindowScreenshot();

    SuperimposeBackdrop();
    SuperimposeMainWindow();

    return Environment.Undefined();
}
