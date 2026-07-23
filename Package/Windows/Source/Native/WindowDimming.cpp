/**
 *
 *
 * @module @sorrell/windows/Native/WindowDimming
 *
 * @file      WindowDimming.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./WindowDimming.h"

#include <cmath>
#include <dwmapi.h>
#include <exception>
#include <limits>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace
{
    constexpr BYTE DefaultDimmingAlpha = 128;
    constexpr UINT FadeTimerIntervalMilliseconds = 16;
    constexpr UINT_PTR FadeTimerId = 1;
    constexpr const wchar_t* DimmingWindowClassName =
        L"SorrellWm.WindowDimmingOverlay";

    struct FadeAnimation
    {
        DWORD DurationMilliseconds;
        ULONGLONG StartedAt;
        BYTE TargetAlpha;
    };

    std::vector<HWND> DimmingWindows;
    std::unordered_map<HWND, FadeAnimation> FadeAnimations;
    HINSTANCE DimmingInstance = nullptr;
    bool OwnsDimmingWindowClass = false;

    struct EnumerationContext
    {
        const std::unordered_set<HWND>& ExcludedWindows;
        std::vector<HWND> Windows;
        bool Failed = false;
    };

    LRESULT CALLBACK DimmingWindowProcedure(
        HWND Window,
        UINT Message,
        WPARAM WParameter,
        LPARAM LParameter
    )
    {
        switch (Message)
        {
            case WM_DESTROY:
                KillTimer(Window, FadeTimerId);
                FadeAnimations.erase(Window);
                return 0;

            case WM_MOUSEACTIVATE:
                return MA_NOACTIVATE;

            case WM_NCHITTEST:
                return HTTRANSPARENT;

            case WM_PAINT:
            {
                PAINTSTRUCT Paint { };
                const HDC DeviceContext = BeginPaint(Window, &Paint);
                FillRect(
                    DeviceContext,
                    &Paint.rcPaint,
                    static_cast<HBRUSH>(GetStockObject(BLACK_BRUSH))
                );
                EndPaint(Window, &Paint);
                return 0;
            }

            case WM_TIMER:
            {
                if (WParameter != FadeTimerId)
                {
                    return DefWindowProcW(Window, Message, WParameter, LParameter);
                }

                const auto Animation = FadeAnimations.find(Window);

                if (Animation == FadeAnimations.end())
                {
                    KillTimer(Window, FadeTimerId);
                    return 0;
                }

                const ULONGLONG Elapsed = GetTickCount64() - Animation->second.StartedAt;
                const bool IsComplete = Elapsed >= Animation->second.DurationMilliseconds;
                const BYTE Alpha = IsComplete
                    ? Animation->second.TargetAlpha
                    : static_cast<BYTE>(
                        static_cast<ULONGLONG>(Animation->second.TargetAlpha)
                        * Elapsed
                        / Animation->second.DurationMilliseconds
                    );

                if (SetLayeredWindowAttributes(Window, 0, Alpha, LWA_ALPHA) == FALSE)
                {
                    KillTimer(Window, FadeTimerId);
                    FadeAnimations.erase(Animation);
                    return 0;
                }

                if (IsComplete)
                {
                    KillTimer(Window, FadeTimerId);
                    FadeAnimations.erase(Animation);
                }

                return 0;
            }

            default:
                return DefWindowProcW(Window, Message, WParameter, LParameter);
        }
    }

    bool DestroyDimmingWindows()
    {
        bool Succeeded = true;

        for (const HWND Window : DimmingWindows)
        {
            if (IsWindow(Window) != FALSE && DestroyWindow(Window) == FALSE)
            {
                Succeeded = false;
            }
        }

        DimmingWindows.clear();
        FadeAnimations.clear();
        return Succeeded;
    }

    bool EnsureDimmingWindowClass(std::string& ErrorMessage)
    {
        if (DimmingInstance != nullptr)
        {
            return true;
        }

        DimmingInstance = GetModuleHandleW(nullptr);

        if (DimmingInstance == nullptr)
        {
            ErrorMessage = "Could not get the application module handle.";
            return false;
        }

        WNDCLASSEXW WindowClass { };
        WindowClass.cbSize = sizeof(WindowClass);
        WindowClass.hbrBackground = static_cast<HBRUSH>(
            GetStockObject(BLACK_BRUSH)
        );
        WindowClass.hInstance = DimmingInstance;
        WindowClass.lpfnWndProc = DimmingWindowProcedure;
        WindowClass.lpszClassName = DimmingWindowClassName;
        WindowClass.style = CS_HREDRAW | CS_VREDRAW;

        if (RegisterClassExW(&WindowClass) == 0)
        {
            if (GetLastError() != ERROR_CLASS_ALREADY_EXISTS)
            {
                DimmingInstance = nullptr;
                ErrorMessage = "Could not register the dimming-window class.";
                return false;
            }
        }
        else
        {
            OwnsDimmingWindowClass = true;
        }

        return true;
    }

    bool IsCloaked(HWND Window)
    {
        DWORD Cloaked = 0;
        return SUCCEEDED(DwmGetWindowAttribute(
            Window,
            DWMWA_CLOAKED,
            &Cloaked,
            sizeof(Cloaked)
        )) && Cloaked != 0;
    }

    BOOL CALLBACK CollectWindow(HWND Window, LPARAM ContextParameter)
    {
        auto& Context = *reinterpret_cast<EnumerationContext*>(ContextParameter);

        if (
            Context.ExcludedWindows.contains(Window)
            || IsWindowVisible(Window) == FALSE
            || IsIconic(Window) != FALSE
            || IsCloaked(Window)
        )
        {
            return TRUE;
        }

        RECT Bounds { };

        if (
            GetWindowRect(Window, &Bounds) == FALSE
            || Bounds.right <= Bounds.left
            || Bounds.bottom <= Bounds.top
        )
        {
            return TRUE;
        }

        try
        {
            Context.Windows.push_back(Window);
        }
        catch (const std::exception&)
        {
            Context.Failed = true;
            return FALSE;
        }

        return TRUE;
    }

    bool DecodeExcludedWindows(
        const Napi::Array& Values,
        std::unordered_set<HWND>& Out
    )
    {
        try
        {
            Out.reserve(Values.Length());

            for (std::uint32_t Index = 0; Index < Values.Length(); ++Index)
            {
                const Napi::Value Value = Values.Get(Index);

                if (!Value.IsBigInt())
                {
                    return false;
                }

                bool IsLossless = false;
                const std::uint64_t NumericHandle = Value
                    .As<Napi::BigInt>()
                    .Uint64Value(&IsLossless);
                const HWND Window = reinterpret_cast<HWND>(
                    static_cast<std::uintptr_t>(NumericHandle)
                );

                if (!IsLossless || Window == nullptr)
                {
                    return false;
                }

                Out.insert(Window);
            }
        }
        catch (const std::exception&)
        {
            return false;
        }

        return true;
    }

    bool CreateDimmingWindow(
        HWND TargetWindow,
        BYTE Alpha,
        DWORD FadeDurationMilliseconds
    )
    {
        RECT Bounds { };

        if (GetWindowRect(TargetWindow, &Bounds) == FALSE)
        {
            return true;
        }

        const LONG_PTR TargetExtendedStyle = GetWindowLongPtrW(
            TargetWindow,
            GWL_EXSTYLE
        );
        DWORD ExtendedStyle = WS_EX_LAYERED
            | WS_EX_NOACTIVATE
            | WS_EX_TOOLWINDOW
            | WS_EX_TRANSPARENT;

        if ((TargetExtendedStyle & WS_EX_TOPMOST) != 0)
        {
            ExtendedStyle |= WS_EX_TOPMOST;
        }

        const HWND DimmingWindow = CreateWindowExW(
            ExtendedStyle,
            DimmingWindowClassName,
            L"",
            WS_POPUP,
            Bounds.left,
            Bounds.top,
            Bounds.right - Bounds.left,
            Bounds.bottom - Bounds.top,
            TargetWindow,
            nullptr,
            DimmingInstance,
            nullptr
        );

        if (DimmingWindow == nullptr)
        {
            return false;
        }

        DimmingWindows.push_back(DimmingWindow);

        if (SetLayeredWindowAttributes(
            DimmingWindow,
            0,
            FadeDurationMilliseconds == 0 ? Alpha : 0,
            LWA_ALPHA
        ) == FALSE)
        {
            return false;
        }

        HWND InsertAfter = GetWindow(TargetWindow, GW_HWNDPREV);

        if (InsertAfter == nullptr)
        {
            InsertAfter = (TargetExtendedStyle & WS_EX_TOPMOST) != 0
                ? HWND_TOPMOST
                : HWND_TOP;
        }

        if (SetWindowPos(
            DimmingWindow,
            InsertAfter,
            Bounds.left,
            Bounds.top,
            Bounds.right - Bounds.left,
            Bounds.bottom - Bounds.top,
            SWP_NOACTIVATE | SWP_SHOWWINDOW
        ) == FALSE)
        {
            return false;
        }

        if (FadeDurationMilliseconds == 0)
        {
            return true;
        }

        try
        {
            FadeAnimations.emplace(DimmingWindow, FadeAnimation {
                FadeDurationMilliseconds,
                GetTickCount64(),
                Alpha
            });
        }
        catch (const std::exception&)
        {
            return false;
        }

        if (SetTimer(
            DimmingWindow,
            FadeTimerId,
            FadeTimerIntervalMilliseconds,
            nullptr
        ) == 0)
        {
            FadeAnimations.erase(DimmingWindow);
            return false;
        }

        return true;
    }

    bool DecodeWindowHandle(const Napi::Value& Value, HWND& Out)
    {
        if (!Value.IsBigInt())
        {
            return false;
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = Value
            .As<Napi::BigInt>()
            .Uint64Value(&IsLossless);
        const HWND Window = reinterpret_cast<HWND>(
            static_cast<std::uintptr_t>(NumericHandle)
        );

        if (!IsLossless || Window == nullptr || IsWindow(Window) == FALSE)
        {
            return false;
        }

        Out = Window;
        return true;
    }

    bool DecodeUnsignedInteger(const Napi::Value& Value, DWORD& Out)
    {
        if (!Value.IsNumber())
        {
            return false;
        }

        const double Number = Value.As<Napi::Number>().DoubleValue();

        if (
            !std::isfinite(Number)
            || std::floor(Number) != Number
            || Number < 0
            || Number > std::numeric_limits<DWORD>::max()
        )
        {
            return false;
        }

        Out = static_cast<DWORD>(Number);
        return true;
    }

    BYTE IntensityToAlpha(DWORD Intensity)
    {
        return static_cast<BYTE>((Intensity * 255 + 50) / 100);
    }
}

Napi::Value ClearWindowDimming(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 0)
    {
        return Out.Fail("ClearWindowDimming does not accept arguments.");
    }

    if (!DestroyDimmingWindows())
    {
        return Out.Fail("Could not destroy every dimming window.");
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value DimWindowsExcept(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsArray())
    {
        return Out.Fail("DimWindowsExcept requires an array of window handles.");
    }

    std::unordered_set<HWND> ExcludedWindows;

    if (!DecodeExcludedWindows(
        CallbackInfo[0].As<Napi::Array>(),
        ExcludedWindows
    ))
    {
        return Out.Fail("Every excluded window handle must be a nonzero bigint.");
    }

    EnumerationContext Context { ExcludedWindows };

    if (EnumWindows(CollectWindow, reinterpret_cast<LPARAM>(&Context)) == FALSE)
    {
        return Out.Fail(Context.Failed
            ? "Could not store every top-level window."
            : "Could not enumerate top-level windows.");
    }

    std::string ErrorMessage;

    if (!EnsureDimmingWindowClass(ErrorMessage))
    {
        return Out.Fail(ErrorMessage);
    }

    if (!DestroyDimmingWindows())
    {
        return Out.Fail("Could not replace the existing dimming windows.");
    }

    try
    {
        DimmingWindows.reserve(Context.Windows.size());
    }
    catch (const std::exception& Error)
    {
        return Out.Fail(Error.what());
    }

    for (const HWND Window : Context.Windows)
    {
        if (!CreateDimmingWindow(Window, DefaultDimmingAlpha, 0))
        {
            DestroyDimmingWindows();
            return Out.Fail("Could not create every dimming window.");
        }
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value ShowBackdrop(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 3)
    {
        return Out.Fail(
            "ShowBackdrop requires a window handle, intensity, and fade duration."
        );
    }

    HWND TargetWindow = nullptr;
    DWORD Intensity = 0;
    DWORD FadeDurationMilliseconds = 0;

    if (!DecodeWindowHandle(CallbackInfo[0], TargetWindow))
    {
        return Out.Fail("ShowBackdrop requires a valid top-level window handle.");
    }

    if ((GetWindowLongPtrW(TargetWindow, GWL_STYLE) & WS_CHILD) != 0)
    {
        return Out.Fail("ShowBackdrop requires a top-level window handle.");
    }

    if (!DecodeUnsignedInteger(CallbackInfo[1], Intensity) || Intensity > 100)
    {
        return Out.Fail("ShowBackdrop intensity must be an integer from 0 to 100.");
    }

    if (!DecodeUnsignedInteger(CallbackInfo[2], FadeDurationMilliseconds))
    {
        return Out.Fail("ShowBackdrop fade duration must be a nonnegative integer.");
    }

    std::string ErrorMessage;

    if (!EnsureDimmingWindowClass(ErrorMessage))
    {
        return Out.Fail(ErrorMessage);
    }

    if (!DestroyDimmingWindows())
    {
        return Out.Fail("Could not replace the existing backdrop.");
    }

    if (Intensity == 0)
    {
        return Out.Succeed(Environment.Undefined());
    }

    if (!CreateDimmingWindow(
        TargetWindow,
        IntensityToAlpha(Intensity),
        FadeDurationMilliseconds
    ))
    {
        DestroyDimmingWindows();
        return Out.Fail("Could not create the window backdrop.");
    }

    return Out.Succeed(Environment.Undefined());
}

void CleanupWindowDimming(void*)
{
    DestroyDimmingWindows();

    if (OwnsDimmingWindowClass && DimmingInstance != nullptr)
    {
        UnregisterClassW(DimmingWindowClassName, DimmingInstance);
    }

    DimmingInstance = nullptr;
    OwnsDimmingWindowClass = false;
}
