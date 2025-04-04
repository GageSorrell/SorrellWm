/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "BlurBackground.h"

#include "Core/Utility.h"
#include "ThirdParty/Blur.h"
#include "Core/WinEvent.h"
#include "Core/WindowUtilities.h"
#include "Core/Math.h"
#include "Core/MonitorUtilities.h"
#include "Core/Globals.h"
#include <Windowsx.h>
#include <cstdint>
#include <algorithm>
#include <cstdlib>

// DECLARE_LOG_CATEGORY(Blur)

/**
 * 1. Get screenshot of the area that will be drawn over.
 * 2. Draw empty window that will show blur
 * 3. Animate blur
 * 4. Superimpose Main window
 * 5. (Closing down) play fade animation (fading both windows)
 * 6. (When fade animation is done) Move Main window away and destroy blur window
 */

const UINT_PTR BlurTimerId = 1;
const UINT_PTR FadeTimerId = 2;

struct FBackdrop
{
    /**
     * @TODO The length such that if the width or height of the window exceeds this value,
     * then only blur the center, and fade the surroundings.
     */
    // const int Breakpoint = 600;
    int Breakpoint = 600;
    int ChannelsNum = 3;
    int Depth = 24;
    int Width;
    int Height;
    RECT Bounds;
    HWND BackdropHandle = nullptr;
    HWND SourceHandle = nullptr;
    // const float MinSigma = 1.f;
    // const float MaxSigma = 10.f;
    float MinSigma = 1.f;
    float MaxSigma = 10.f;
    float Sigma = MinSigma;
    std::vector<BYTE> BlurredScreenshotData = std::vector<BYTE>(3840 * 2160 * 3);
    std::vector<BYTE> ScreenshotData = std::vector<BYTE>(3840 * 2160 * 3);
    BYTE* Screenshot = nullptr;
    BYTE* BlurredScreenshot = nullptr;
    bool CalledOnce = false;
    double Luminance = 0.f;
    double BrightnessScalar = 1.f;
    std::string ThemeMode = "Indeterminate";
    bool ScalesBrightness = false;
    HWND SorrellWmMainWindow = nullptr;
    DWORD BlurStartTime = 0;
    DWORD FadeStartTime = 0;
    DWORD BlurLastTimestamp = 0;
    DWORD FadeLastTimestamp = 0;
    // const int Duration = 150;
    int Duration = 150;
    int MsPerFrame = 1000 / 120;
    bool PaintedOnce = false;
    LPBITMAPINFO ScreenshotBmi = nullptr;
    LPBITMAPINFO BlurredBmi = nullptr;
};

/**
 * Where to pick up in the morning:
 *   Use `std::list` instead of `std::vector` for Backdrops, so that
 *   Backdrops can be removed by pointer.
 */

std::vector<FBackdrop> Backdrops;
std::vector<FBackdrop*> BackdropsBeingUnblurred;

FBackdrop* GetBackdrop(HWND WindowHandle)
{
    for (FBackdrop& Backdrop : Backdrops)
    {
        if (Backdrop.BackdropHandle == WindowHandle)
        {
            return &Backdrop;
        }
        else
        {
            // std::cout
            //     << "Checked Backdrop with handle "
            //     << Backdrop.BackdropHandle
            //     << " but this was not a match with "
            //     << WindowHandle
            //     << std::endl;
        }
    }

    return nullptr;
}

FBackdrop* CreateNewBackdrop()
{
    Backdrops.push_back(FBackdrop());
    return &Backdrops.back();
}

int32_t GetMsPerFrame(FBackdrop* Backdrop)
{
    const bool IsLargerThan2k = Backdrop->Width * Backdrop->Height > 2560 * 1440;
    const int32_t BaseMsPerFrame = IsLargerThan2k
        ? 60
        : 120;

    const int32_t RefreshRate = GetLeastRefreshRateOverRect(Backdrop->Bounds);

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
        PixelData[ColorIndex + 0] = static_cast<BYTE>(std::clamp(ScaledBlue, 0, 255));
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

        const BYTE Blue  = PixelData[ColorIndex + 0];
        const BYTE Green = PixelData[ColorIndex + 1];
        const BYTE Red   = PixelData[ColorIndex + 2];

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

bool CaptureWindowScreenshot(FBackdrop* Backdrop)
{
    HDC ScreenDc = GetDC(nullptr);

    HDC HdcMemDc = CreateCompatibleDC(ScreenDc);
    if (!HdcMemDc)
    {
        std::cout << "Failed to create compatible DC." << std::endl;
        ReleaseDC(Backdrop->SourceHandle, ScreenDc);
        return false;
    }

    Backdrop->ScreenshotData.reserve(Backdrop->Width * Backdrop->Height * Backdrop->ChannelsNum);
    Backdrop->Screenshot = Backdrop->ScreenshotData.data();

    HBITMAP Bitmap = CreateDIBSection(
        ScreenDc,
        Backdrop->ScreenshotBmi,
        DIB_RGB_COLORS,
        (void**) Backdrop->Screenshot,
        nullptr,
        0
    );

    if (!Bitmap)
    {
        const int BufferSize = 256;
        wchar_t WindowTextW[BufferSize] = { 0 };
        GetWindowTextW(Backdrop->SourceHandle, WindowTextW, BufferSize);
        std::string WindowText = WStringToString(WindowTextW);
        std::cout
            // << ELogLevel::Error
            << "Failed to create DIB section, handle was "
            << Backdrop->SourceHandle
            << " and had title "
            << WindowText
            << ", ScreenshotData reserved "
            << Backdrop->Width * Backdrop->Height * Backdrop->ChannelsNum
            << std::endl;

        DeleteDC(HdcMemDc);
        ReleaseDC(Backdrop->SourceHandle, ScreenDc);
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
        ReleaseDC(Backdrop->SourceHandle, ScreenDc);
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
        Backdrop->Width,
        Backdrop->Height,
        ScreenDc,
        Backdrop->Bounds.left,
        Backdrop->Bounds.top,
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
        ReleaseDC(Backdrop->SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "CaptureWindowScreenshot: BitBlt call is GOOD." <<
        // std::endl;
    }

    SIZE_T BufferSize = static_cast<SIZE_T>(Backdrop->Width) * Backdrop->Height * Backdrop->ChannelsNum;
    Backdrop->ScreenshotData.reserve(BufferSize);
    if (!Backdrop->Screenshot)
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
        Backdrop->Height,
        Backdrop->Screenshot,
        Backdrop->ScreenshotBmi,
        DIB_RGB_COLORS
    );

    if (scanLines == 0)
    {
        std::cout << "GetDIBits failed." << std::endl;
        LogLastWindowsError();
        Backdrop->Screenshot = nullptr;
    }
    else
    {
        // std::cout << "There are " << scanLines << " scanLines!" << std::endl;
    }

    Backdrop->Screenshot = Backdrop->ScreenshotData.data();
    Backdrop->Luminance = CalculateAverageLuminance(Backdrop->Screenshot, Backdrop->Width, Backdrop->Height, Backdrop->ChannelsNum);
    Backdrop->BrightnessScalar = CalculateScalingFactor(Backdrop->Luminance);
    Backdrop->ScalesBrightness = Backdrop->BrightnessScalar != 1.f;

    SelectObject(HdcMemDc, hOld);
    DeleteObject(Bitmap);
    DeleteDC(HdcMemDc);
    ReleaseDC(nullptr, ScreenDc);

    if (scanLines == 0)
    {
        return false;
    }

    InvalidateRect(Backdrop->BackdropHandle, nullptr, FALSE);

    return true;
}

BOOL OnCreate(HWND hWnd, CREATESTRUCT FAR* lpCreateStruct)
{
    /* For some reason, `CreateWindowEx` returns the nullptr, but succeeds...so we set `BackdropHandle` here instead. */
    for (FBackdrop& Backdrop : Backdrops)
    {
        if (Backdrop.BackdropHandle == nullptr)
        {
            Backdrop.BackdropHandle = hWnd;
        }
    }

    FBackdrop* Backdrop = GetBackdrop(hWnd);

    std::cout
        << "Backdrop has been created with handle "
        << Backdrop->BackdropHandle
        << "."
        << std::endl;

    Backdrop->BlurLastTimestamp = Backdrop->BlurStartTime;
    SetTimer(hWnd, BlurTimerId, GetMsPerFrame(Backdrop), nullptr);
    if ((Backdrop->ScreenshotBmi = CreateDib(Backdrop->Width, Backdrop->Height, Backdrop->Depth, Backdrop->Screenshot)) == nullptr)
    {
        return FALSE;
    }
    else
    {
        // std::cout << "g_lpBmi WAS CREATED ! ! !" << std::endl;
    }
    if ((Backdrop->BlurredBmi = CreateDib(Backdrop->Width, Backdrop->Height, Backdrop->Depth, Backdrop->BlurredScreenshot)) == nullptr)
    {
        // std::cout << "BlurredBmi COULD NOT BE CREATED" << std::endl;
        return FALSE;
    }
    else
    {
        // std::cout << "BlurredBmi was created." << std::endl;
    }

    std::cout << "OnCreate Finished." << std::endl;

    return TRUE;
}

void OnDestroy(HWND hWnd)
{
    FBackdrop* Backdrop = GetBackdrop(hWnd);
    if (Backdrop == nullptr)
    {
        return;
    }

    if (Backdrop->ScreenshotBmi)
    {
        free(Backdrop->ScreenshotBmi);
    }

    if (Backdrop->BlurredBmi)
    {
        free(Backdrop->BlurredBmi);
    }

    Backdrop->Bounds = RECT();
    Backdrop->BackdropHandle = nullptr;
    Backdrop->Sigma = Backdrop->MinSigma;
    Backdrop->CalledOnce = false;
    Backdrop->Luminance = 0.f;
    Backdrop->BrightnessScalar = 1.f;
    Backdrop->ThemeMode = "Indeterminate";
    Backdrop->ScalesBrightness = false;
    Backdrop->BlurStartTime = 0;
    Backdrop->FadeStartTime = 0;
    Backdrop->BlurLastTimestamp = 0;
    Backdrop->FadeLastTimestamp = 0;

    SetWindowPos(
        Backdrop->SorrellWmMainWindow,
        HWND_TOP,
        2000,
        2000,
        0,
        0,
        SWP_NOSIZE
    );

    // auto It = std::find_if(
    //     Backdrops.begin(),
    //     Backdrops.end(),
    //     [=](const FBackdrop& InBackdrop)
    //     {
    //         return InBackdrop.BackdropHandle == Backdrop->BackdropHandle;
    //     });

    // if (It != Backdrops.end())
    // {
    //     Backdrops.erase(It);
    // }
    if (Backdrop == nullptr)
    {
        return;
    }

    int32_t BackdropIndex = -1;
    for (uint32_t Index = 0; Index < Backdrops.size(); Index++)
    {
        FBackdrop& _Backdrop = Backdrops[Index];
        if (_Backdrop.BackdropHandle == Backdrop->BackdropHandle)
        {
            BackdropIndex = Index;
            break;
        }
    }

    int32_t BackdropBeingUnblurredIndex = -1;
    for (uint32_t Index = 0; Index < Backdrops.size(); Index++)
    {
        FBackdrop* _BackdropBeingUnblurred = BackdropsBeingUnblurred[Index];
        if (_BackdropBeingUnblurred->BackdropHandle == Backdrop->BackdropHandle)
        {
            BackdropBeingUnblurredIndex = Index;
            break;
        }
    }

    if (BackdropIndex != -1 && BackdropBeingUnblurredIndex != -1)
    {
        Backdrops.erase(Backdrops.begin() + BackdropIndex);
        BackdropsBeingUnblurred.erase(BackdropsBeingUnblurred.begin() + BackdropIndex);
    }
    else
    {
        std::cout << "Could not find index of Backdrop to remove from Backdrops." << std::endl;
    }
}

void GetBackgroundMode(FBackdrop* Backdrop)
{
    const double d_dark = std::abs(Backdrop->Luminance - 85.0);
    const double d_light = std::abs(170.0 - Backdrop->Luminance);

    if (d_dark < d_light)
    {
        Backdrop->ThemeMode = "Dark";
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
        Backdrop->ThemeMode = "Light";
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
    FBackdrop* Backdrop = GetBackdrop(hWnd);
    if (Backdrop == nullptr)
    {
        return;
    }

    static PAINTSTRUCT PaintStruct;
    static HDC hDC;

    hDC = BeginPaint(hWnd, &PaintStruct);

    BITMAPINFO BitmapInfo;
    ZeroMemory(&BitmapInfo, sizeof(BITMAPINFO));
    BitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    BitmapInfo.bmiHeader.biWidth = Backdrop->Width;
    BitmapInfo.bmiHeader.biHeight = -1 * Backdrop->Height;
    BitmapInfo.bmiHeader.biPlanes = 1;
    BitmapInfo.bmiHeader.biBitCount = Backdrop->Depth;
    BitmapInfo.bmiHeader.biCompression = BI_RGB;

    SIZE_T BufferSize = static_cast<SIZE_T>(Backdrop->Width) * Backdrop->Height * Backdrop->ChannelsNum;
    Backdrop->BlurredScreenshotData.reserve(BufferSize);
    Backdrop->BlurredScreenshot = Backdrop->BlurredScreenshotData.data();
    Backdrop->Screenshot = Backdrop->ScreenshotData.data();

    if (Backdrop->Sigma < Backdrop->MaxSigma)
    {
        const int NumPasses = Backdrop->Width > 600 || Backdrop->Height > 600
            ? 2
            : 3;

        Blur(
            Backdrop->Screenshot,
            Backdrop->BlurredScreenshot,
            Backdrop->Width,
            Backdrop->Height,
            Backdrop->ChannelsNum,
            Backdrop->Sigma,
            NumPasses,
            kExtend
        );

        const int Result = SetDIBitsToDevice(
            hDC,
            0,
            0,
            Backdrop->Width,
            Backdrop->Height,
            0,
            0,
            0,
            Backdrop->Height,
            Backdrop->BlurredScreenshot,
            Backdrop->BlurredBmi,
            DIB_RGB_COLORS
        );

        Backdrop->BlurredScreenshot = Backdrop->BlurredScreenshotData.data();
        if (Backdrop->ScalesBrightness)
        {
            const float Alpha = Backdrop->Sigma / Backdrop->MaxSigma;
            const float Brightness = Backdrop->BrightnessScalar * Alpha;
            ApplyScalingFactor(
                Backdrop->BlurredScreenshot,
                Backdrop->Width,
                Backdrop->Height,
                Backdrop->ChannelsNum,
                Brightness
            );
        }
    }

    if (!Backdrop->PaintedOnce)
    {
        Backdrop->PaintedOnce = true;
        ShowWindow(hWnd, SW_SHOW);
        ShowWindow(Backdrop->SorrellWmMainWindow, SW_SHOW);
        SetForegroundWindow(Backdrop->SorrellWmMainWindow);
    }

    EndPaint(hWnd, &PaintStruct);
}

BOOL OnEraseBackground(HWND _Handle, HDC _Hdc)
{
    return TRUE;
}

unsigned char ClampTransparency(const float& Alpha)
{
    return static_cast<unsigned char>(std::clamp(
        std::round(Alpha),
        0.f,
        255.f
    ));
}

LRESULT CALLBACK BlurWindowProc(HWND hWnd, UINT iMsg, WPARAM wParam, LPARAM lParam)
{
    switch (iMsg)
    {
        HANDLE_MSG(hWnd, WM_CREATE, OnCreate);
        HANDLE_MSG(hWnd, WM_DESTROY, OnDestroy);
        HANDLE_MSG(hWnd, WM_PAINT, OnPaint);
        HANDLE_MSG(hWnd, WM_ERASEBKGND, OnEraseBackground);
    case WM_TIMER:
        FBackdrop* Backdrop = GetBackdrop(hWnd);
        if (Backdrop == nullptr)
        {
            return DefWindowProc(hWnd, iMsg, wParam, lParam);
        }

        DWORD CurrentTime = GetTickCount();
        DWORD ElapsedTime = 0;

        switch (wParam)
        {
        case BlurTimerId:
            if (Backdrop->BlurStartTime == 0)
            {
                Backdrop->BlurStartTime = GetTickCount();
                InvalidateRect(Backdrop->SorrellWmMainWindow, nullptr, FALSE);
            }
            ElapsedTime = CurrentTime - Backdrop->BlurStartTime;
            if (ElapsedTime == 0)
            {
                InvalidateRect(hWnd, nullptr, FALSE);
            }
            if (ElapsedTime >= Backdrop->Duration)
            {
                Backdrop->Sigma = Backdrop->MaxSigma;
                SetLayeredWindowAttributes(Backdrop->SorrellWmMainWindow, 0, 255, LWA_ALPHA);
                InvalidateRect(hWnd, nullptr, FALSE);
                KillTimer(hWnd, BlurTimerId);
            }
            // else if (CurrentTime - Backdrop->BlurLastTimestamp >= Backdrop->MsPerFrame)
            else if (CurrentTime - Backdrop->BlurLastTimestamp >= Backdrop->MsPerFrame || CurrentTime == Backdrop->BlurLastTimestamp)
            {
                const float Alpha = static_cast<float>((float) ElapsedTime / (float) Backdrop->Duration);
                const float Factor = 1 - std::pow(2, -10.f * Alpha);
                Backdrop->Sigma = Backdrop->MinSigma + (Backdrop->MaxSigma - Backdrop->MinSigma) * Factor;
                InvalidateRect(hWnd, nullptr, FALSE);

                unsigned char Transparency = ClampTransparency(255.f * Alpha);

                BOOL Res = SetLayeredWindowAttributes(Backdrop->SorrellWmMainWindow, 0, Transparency, LWA_ALPHA);
                if (!Res)
                {
                    std::cout
                        << "SetLayeredWindowAttributes failed when increasing opacity."
                        << std::endl;

                    LogLastWindowsError();
                }

                Backdrop->BlurLastTimestamp = CurrentTime;
            }
            else
            {
                std::cout
                    << std::setprecision(4)
                    << "WM_TIMER came too soon, "
                    << CurrentTime
                    << " "
                    << Backdrop->BlurLastTimestamp
                    << std::endl;
            }
            return 0;
        case FadeTimerId:
            // std::cout
            //     << "WindowProc: FadeTimerId timer was called."
            //     << std::endl;

            Backdrop->Sigma = Backdrop->MinSigma;
            ElapsedTime = CurrentTime - Backdrop->FadeStartTime;
            if (ElapsedTime >= Backdrop->Duration)
            {
                // std::cout
                //     << std::setprecision(2)
                //     << "WindowProc: FadeTimerId: ElapsedTime ("
                //     << ElapsedTime
                //     << ") was at least Backdrop->Duration ("
                //     << Backdrop->Duration
                //     << ")."
                //     << std::endl;

                ShowWindow(hWnd, SW_HIDE);
                DestroyWindow(hWnd);
            }
            if (ElapsedTime == 0)
            {
                InvalidateRect(hWnd, nullptr, FALSE);
            }
            if (ElapsedTime >= Backdrop->Duration)
            {
                // std::cout
                //     << std::setprecision(2)
                //     << "For the Fade timer, elapsedTime >= Duration: "
                //     << std::to_string(static_cast<unsigned int>(ElapsedTime))
                //     << " >= "
                //     << Backdrop->Duration
                //     << std::endl;
                KillTimer(hWnd, FadeTimerId);
                SetLayeredWindowAttributes(hWnd, 0, 0, LWA_ALPHA);
                SetLayeredWindowAttributes(Backdrop->SorrellWmMainWindow, 0, 255, LWA_ALPHA);
                // Might not need this, and it is expensive...
                InvalidateRect(Backdrop->SorrellWmMainWindow, nullptr, FALSE);
            }
            else if (CurrentTime - Backdrop->FadeLastTimestamp >= Backdrop->MsPerFrame)
            {
                // std::cout
                //     << std::setprecision(2)
                //     << "WindowProc: FadeTimerId: The following case was true: CurrentTime - Backdrop->FadeLastTimestamp >= Backdrop->MsPerFrame"
                //     << std::endl;

                const float EasedAlpha = 1.f - std::pow(2, -10.f * ((float) ElapsedTime / (float) Backdrop->Duration));
                const float Alpha = ElapsedTime / (float) Backdrop->Duration;

                unsigned char Transparency = ClampTransparency(255.f - 255.f * EasedAlpha);
                unsigned char MainWindowTransparency = ClampTransparency(255.f - 255.f * Alpha);

                InvalidateRect(hWnd, nullptr, FALSE);

                SetLayeredWindowAttributes(hWnd, 0, Transparency, LWA_ALPHA);
                SetLayeredWindowAttributes(Backdrop->SorrellWmMainWindow, 0, MainWindowTransparency, LWA_ALPHA);

                Backdrop->FadeLastTimestamp = CurrentTime;
            }

            return 0;
        }
    }

    return DefWindowProc(hWnd, iMsg, wParam, lParam);
}

FBackdrop* GetBackdropToUnblur()
{
    FBackdrop* BackdropToUnblur = nullptr;

    if (Backdrops.size() == 0)
    {
        return nullptr;
    }

    std::cout
        << "Before getting the backdrop to unblur, the current BackdropsBeingUnblurred is:"
        << std::endl;
    for (FBackdrop* BackdropBeingUnblurred : BackdropsBeingUnblurred)
    {
        std::cout
            << "    "
            << BackdropBeingUnblurred->BackdropHandle
            << std::endl;
    }

    for (uint32_t Index = 0; Index < Backdrops.size(); Index++)
    {
        FBackdrop* Backdrop = &Backdrops[Index];
        bool IsNotAlreadyBeingUnblurred = true;
        for (FBackdrop* BackdropBeingUnblurred : BackdropsBeingUnblurred)
        {
            if (BackdropBeingUnblurred->BackdropHandle == Backdrop->BackdropHandle)
            {
                IsNotAlreadyBeingUnblurred = false;
                std::cout << "Backdrop " << Backdrop->BackdropHandle << " is already being unblurred." << std::endl;
                break;
            }
        }

        if (IsNotAlreadyBeingUnblurred)
        {
            BackdropToUnblur = Backdrop;
            break;
        }
    }

    if (BackdropToUnblur != nullptr)
    {
        BackdropsBeingUnblurred.push_back(BackdropToUnblur);

        std::cout << "BackdropToUnblur is " << BackdropToUnblur << std::endl;
    }
    else
    {
        std::cout
            << "BackdropToUnblur could not be determined!  Here are the Backdrops, ID'd by their BackdropHandles:"
            << std::endl;

        for (uint32_t Index = 0; Index < Backdrops.size(); Index++)
        {
            FBackdrop* Backdrop = &Backdrops[Index];
            std::cout
                << "    "
                << Backdrop->BackdropHandle
                << std::endl;
        }
    }

    return BackdropToUnblur;
}

Napi::Value UnblurBackground(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    std::cout << "Tearing down window!" << std::endl;

    FBackdrop* BackdropToUnblur = GetBackdropToUnblur();

    if (BackdropToUnblur == nullptr)
    {
        std::cout << "UnblurBackground was called before BlurBackground could construct a new blurred background." << std::endl;
        return Environment.Undefined();
    }

    BOOL Shadow = false;
    SystemParametersInfoA(SPI_GETDROPSHADOW, 0, &Shadow, 0);

    /* @TODO If this is called while the blur is still animating, then the fade
     * animation should only take the length of time that the blur animation
     * played. */

    KillTimer(BackdropToUnblur->BackdropHandle, BlurTimerId);

    BackdropToUnblur->FadeStartTime = GetTickCount();
    BackdropToUnblur->FadeLastTimestamp = BackdropToUnblur->FadeStartTime;
    UINT_PTR SetTimerResult = SetTimer(
        BackdropToUnblur->BackdropHandle,
        FadeTimerId,
        BackdropToUnblur->MsPerFrame,
        nullptr
    );

    std::cout
        << "UnblurBackground: SetTimerResult was "
        << SetTimerResult
        << "."
        << std::endl;

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

bool CreateBackdropWindow(FBackdrop* Backdrop)
{
    HINSTANCE ModuleHandle = GetModuleHandle(nullptr);
    WNDCLASSEXA WindowClass;
    char* WindowTitle = "SorrellWm Blurred Background";
    char* WindowClassName = WindowTitle;

    WindowClass.cbSize        = sizeof(WindowClass);
    WindowClass.style         = CS_VREDRAW | CS_HREDRAW;
    WindowClass.lpfnWndProc   = BlurWindowProc;
    WindowClass.cbClsExtra    = 0;
    WindowClass.cbWndExtra    = 0;
    WindowClass.hInstance     = ModuleHandle;
    WindowClass.hIcon         = LoadIcon(NULL, IDI_APPLICATION);
    WindowClass.hCursor       = LoadCursor(NULL, IDC_ARROW);
    WindowClass.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    WindowClass.lpszMenuName  = NULL;
    WindowClass.lpszClassName = WindowTitle;
    WindowClass.hIconSm       = LoadIcon(NULL, IDI_APPLICATION);

    ATOM RegisterClassResult = RegisterClassExA(&WindowClass);
    if (RegisterClassResult == 0)
    {
        std::cout
            << "RegisterClassExA failed."
            << std::endl;
    }

    Backdrop->BackdropHandle = CreateWindowExA(
        NULL,
        WindowClassName,
        nullptr,
        WS_EX_TOOLWINDOW | WS_POPUP | WS_EX_NOACTIVATE,
        Backdrop->Bounds.left,
        Backdrop->Bounds.top,
        Backdrop->Bounds.right - Backdrop->Bounds.left,
        Backdrop->Bounds.bottom - Backdrop->Bounds.top,
        nullptr,
        nullptr,
        ModuleHandle,
        nullptr
    );

    SetWindowLong(
        Backdrop->BackdropHandle,
        GWL_EXSTYLE,
        GetWindowLong(Backdrop->BackdropHandle, GWL_EXSTYLE) | WS_EX_LAYERED
    );

    BOOL Attribute = TRUE;
    DwmSetWindowAttribute(
        Backdrop->BackdropHandle,
        DWMWA_TRANSITIONS_FORCEDISABLED,
        &Attribute,
        sizeof(Attribute)
    );

    return true;
}

void SuperimposeBackdrop(FBackdrop* Backdrop)
{
    ShowWindow(Backdrop->BackdropHandle, SW_SHOWNOACTIVATE);
    UpdateWindow(Backdrop->BackdropHandle);
    SetWindowPos(Backdrop->BackdropHandle,
        GetNextWindow(Backdrop->SourceHandle, GW_HWNDPREV),
        0,
        0,
        0,
        0,
        SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE);

    SetLayeredWindowAttributes(Backdrop->BackdropHandle, 0, 255, LWA_ALPHA);
}

void SuperimposeMainWindow(FBackdrop* Backdrop)
{
    LPCSTR WindowName = "SorrellWm Main Window";
    Backdrop->SorrellWmMainWindow = GetMainWindow();
    SetWindowLong(
        Backdrop->SorrellWmMainWindow,
        GWL_EXSTYLE,
        GetWindowLong(Backdrop->SorrellWmMainWindow, GWL_EXSTYLE) | WS_EX_LAYERED
    );
    SetLayeredWindowAttributes(Backdrop->SorrellWmMainWindow, 0, 0, LWA_ALPHA);
    BOOL PositionSet = SetWindowPos(
        Backdrop->SorrellWmMainWindow,
        HWND_TOP,
        Backdrop->Bounds.left,
        Backdrop->Bounds.top,
        Backdrop->Bounds.right - Backdrop->Bounds.left,
        Backdrop->Bounds.bottom - Backdrop->Bounds.top,
        SWP_SHOWWINDOW
    );

    if (PositionSet)
    {
        std::cout
            << "MainWindow's position was set successfully."
            << std::endl;

        // std::cout
        //     << "MainWindow's position was set successfully.  Its bounds are ("
        //     << Backdrop->Bounds.left
        //     << ", "
        //     << Backdrop->Bounds.top
        //     << ", "
        //     << Backdrop->Bounds.right
        //     << ", "
        //     << Backdrop->Bounds.bottom
        //     << ")."
        //     << std::endl;
    }
    else
    {
        std::cout
            << "Failed to set MainWindow's position on top of blurred background."
            << std::endl;
    }

    StealFocus(Backdrop->SorrellWmMainWindow);
}

Napi::Value BlurBackground(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    FBackdrop* Backdrop = CreateNewBackdrop();

    Backdrop->Bounds = DecodeRect(CallbackInfo[0].As<Napi::Object>());
    Backdrop->Height = Backdrop->Bounds.bottom - Backdrop->Bounds.top;
    Backdrop->Width = Backdrop->Bounds.right - Backdrop->Bounds.left;

    Backdrop->SourceHandle = (HWND) DecodeHandle(CallbackInfo[1].As<Napi::Object>());

    const bool CreatedBackdrop = CreateBackdropWindow(Backdrop);
    if (!CreatedBackdrop)
    {
        return Environment.Undefined();
    }

    CaptureWindowScreenshot(Backdrop);

    SuperimposeBackdrop(Backdrop);
    SuperimposeMainWindow(Backdrop);

    return EncodeHandle(Environment, Backdrop->BackdropHandle);
}

Napi::Value KillOrphans(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env& Environment = CallbackInfo.Env();

    FBackdrop* BackdropToUnblur = GetBackdropToUnblur();

    BackdropsBeingUnblurred.empty();
    for (uint32_t Index = 0; Index < Backdrops.size(); Index++)
    {
        FBackdrop* Orphan = &Backdrops[Index];
        BackdropsBeingUnblurred.push_back(Orphan);
    }

    BOOL Shadow = false;
    SystemParametersInfoA(SPI_GETDROPSHADOW, 0, &Shadow, 0);

    for (FBackdrop* Orphan : BackdropsBeingUnblurred)
    {
        KillTimer(Orphan->BackdropHandle, BlurTimerId);

        Orphan->FadeStartTime = GetTickCount();
        Orphan->FadeLastTimestamp = BackdropToUnblur->FadeStartTime;
        UINT_PTR SetTimerResult = SetTimer(
            Orphan->BackdropHandle,
            FadeTimerId,
            Orphan->MsPerFrame,
            nullptr
        );
    }

    return Environment.Undefined();
}
