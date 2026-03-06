/* File:      Border.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "Core/Core.h"
#include "Core/Hook.h"
#include "Core/WindowUtilities.h"
#include "WindowTracker.h"

struct FBorder
{
    HWINEVENTHOOK PositionHook;
    HWINEVENTHOOK FocusHook;
    HWND Overlay;
};

typedef std::unordered_map<HWND, FBorder> FBorderMap;

static FBorderMap BorderMap = FBorderMap();
static int BorderWidth = 1;
static WNDCLASSEXW WindowClass{ };
static const wchar_t* OverlayWindowClassName = L"FBorderOverlayWindowClass";

static void UpdateOverlayToMatchTarget(HWND Target)
{
    if (!BorderMap.contains(Target))
    {
        return;
    }

    HWND Overlay = BorderMap[Target].Overlay;

    if (Target == nullptr || Overlay == nullptr)
    {
        return;
    }

    RECT TargetRectangle{};
    if (!GetDwmWindowRect(Target, &TargetRectangle))
    {
        return;
    }

    const int Width = TargetRectangle.right - TargetRectangle.left;
    const int Height = TargetRectangle.bottom - TargetRectangle.top;

    std::cout
        << "Setting overlay position to: ("
        << TargetRectangle.left
        << ", "
        << TargetRectangle.top
        << ") with Width = "
        << Width
        << " and Height = "
        << Height
        << "."
        << std::endl;

    SetWindowPos(
        Overlay,
        HWND_TOPMOST,
        TargetRectangle.left,
        TargetRectangle.top,
        Width,
        Height,
        SWP_NOACTIVATE | SWP_SHOWWINDOW
    );

    /* Create a "ring" region: outer rect minus inner rect. */
    HRGN OuterRegion = CreateRectRgn(0, 0, Width, Height);
    HRGN InnerRegion = CreateRectRgn(
        BorderWidth,
        BorderWidth,
        Width - BorderWidth,
        Height - BorderWidth
    );

    CombineRgn(OuterRegion, OuterRegion, InnerRegion, RGN_DIFF);
    DeleteObject(InnerRegion);

    /* Do not DeleteObject(OuterRegion) after SetWindowRgn on success; the system owns it. */
    SetWindowRgn(Overlay, OuterRegion, TRUE);
}

static LRESULT CALLBACK OverlayWindowProcedure(
    HWND WindowHandle,
    UINT Message,
    WPARAM WParameter,
    LPARAM LParameter
)
{
    switch (Message)
    {
        case WM_NCHITTEST:
        {
            /* Click-through. */
            return HTTRANSPARENT;
        }
        case WM_ERASEBKGND:
        {
            /* We paint the whole region in WM_PAINT. */
            return 1;
        }
        case WM_PAINT:
        {
            // PAINTSTRUCT PaintStruct{};
            // HDC DeviceContext = BeginPaint(WindowHandle, &PaintStruct);
            HWND Target = nullptr;
            for (auto Border : BorderMap)
            {
                if (Border.second.Overlay == WindowHandle)
                {
                    std::cout << "Found match!\n" << std::endl;
                    Target = Border.first;
                }
            }
            if (Target == nullptr)
            {
                std::cout << "Did NOT find match!" << std::endl;
            }


            // RECT ClientRectangle{};
            // GetClientRect(WindowHandle, &ClientRectangle);

            // const HBRUSH BrushHandle = CreateSolidBrush(RGB(0, 255, 0));
            // FillRect(DeviceContext, &ClientRectangle, BrushHandle);
            // DeleteObject(BrushHandle);

            // EndPaint(WindowHandle, &PaintStruct);
            // return 0;

            PAINTSTRUCT PaintStruct{};
            HDC DeviceContext = BeginPaint(WindowHandle, &PaintStruct);

            COLORREF FocusedColor = RGB(0, 255, 0);
            COLORREF BlurredColor = RGB(0, 100, 0);

            RECT ClientRectangle{};
            GetClientRect(WindowHandle, &ClientRectangle);

            const COLORREF BorderColor = Target == GetForegroundWindow()
                ? FocusedColor
                : BlurredColor;

            std::cout << "Target:\n\t" << Target << "\nForeground Window:\n\t" << GetForegroundWindow() << std::endl;

            const HBRUSH BrushHandle = CreateSolidBrush(BorderColor);
            FillRect(DeviceContext, &ClientRectangle, BrushHandle);
            DeleteObject(BrushHandle);

            EndPaint(WindowHandle, &PaintStruct);
            return 0;

        }
    }

    return DefWindowProc(WindowHandle, Message, WParameter, LParameter);
}

static void StopTrackingWindow(HWND Window)
{
    if (BorderMap.contains(Window))
    {
        HWINEVENTHOOK PositionHook = BorderMap[Window].PositionHook;
        if (PositionHook != nullptr)
        {
            GGlobals::Hook->UnregisterWinEvent(PositionHook);
            BorderMap.erase(Window);
        }

        HWINEVENTHOOK FocusHook = BorderMap[Window].FocusHook;
        if (FocusHook != nullptr)
        {
            GGlobals::Hook->UnregisterWinEvent(FocusHook);
            BorderMap.erase(Window);
        }
    }
}

static void UpdateFocusStateFromForeground(HWND ForegroundWindowHandle)
{
    if (!BorderMap.contains(ForegroundWindowHandle))
    {
        for (auto& Border : BorderMap)
        {
            InvalidateRect(Border.second.Overlay, nullptr, TRUE);
        }

        return;
    }

    FBorder Border = BorderMap[ForegroundWindowHandle];

    InvalidateRect(Border.Overlay, nullptr, TRUE);

    // // Foreground can be NULL briefly while activation is transitioning. */
    // if (ForegroundWindowHandle == nullptr)
    // {
    //     return;
    // }

    // // const HWND ForegroundRoot = GetAncestor(ForegroundWindowHandle, GA_ROOT);
    // // const HWND TargetRoot = GetAncestor(GlobalTargetWindowHandle, GA_ROOT);

    // // const bool IsNowFocused = (ForegroundRoot != nullptr && ForegroundRoot == TargetRoot);

    // // if (IsNowFocused != GlobalIsTargetFocused)
    // // {
    // //     GlobalIsTargetFocused = IsNowFocused;
    // //     InvalidateRect(GlobalOverlayWindowHandle, nullptr, TRUE);
    // // }
}

static void CALLBACK WinEventProcedure(
    HWINEVENTHOOK,
    DWORD Event,
    HWND WindowHandle,
    LONG ObjectIdentifier,
    LONG ChildIdentifier,
    DWORD,
    DWORD
)
{
    if (Event == EVENT_SYSTEM_FOREGROUND)
    {
        UpdateFocusStateFromForeground(WindowHandle);
        return;
    }

    if (!BorderMap.contains(WindowHandle))
    {
        return;
    }

    if (ObjectIdentifier != OBJID_WINDOW || ChildIdentifier != CHILDID_SELF)
    {
        return;
    }

    if (Event == EVENT_OBJECT_DESTROY)
    {
        StopTrackingWindow(WindowHandle);
        return;
    }

    if (Event == EVENT_OBJECT_LOCATIONCHANGE)
    {
        HWND Overlay = BorderMap[WindowHandle].Overlay;
        UpdateOverlayToMatchTarget(WindowHandle);
        InvalidateRect(Overlay, nullptr, TRUE);
    }
}

void CreateBorder(HWND TargetWindowHandle)
{
    if (BorderMap.contains(TargetWindowHandle))
    {
        std::cout
            << BorderMap[TargetWindowHandle].Overlay
            << " "
            << BorderMap[TargetWindowHandle].PositionHook
            << " "
            << BorderMap[TargetWindowHandle].FocusHook
            << std::endl;
        return;
    }

    const int BorderThicknessPixels = 1;
    if (TargetWindowHandle == nullptr || BorderThicknessPixels <= 0)
    {
        std::cout << "TargetWindowHandle was the nullptr." << std::endl;
        return;
    }

    UpdateOverlayToMatchTarget(TargetWindowHandle);

    DWORD ProcessIdentifier = 0;
    const DWORD ThreadIdentifier = GetWindowThreadProcessId(TargetWindowHandle, &ProcessIdentifier);

    HWINEVENTHOOK PositionHook = GGlobals::Hook->RegisterWinEventHook(
        EVENT_OBJECT_LOCATIONCHANGE,
        EVENT_OBJECT_LOCATIONCHANGE,
        nullptr,
        WinEventProcedure,
        ProcessIdentifier,
        ThreadIdentifier,
        WINEVENT_OUTOFCONTEXT
    );

    HWINEVENTHOOK FocusHook = GGlobals::Hook->RegisterWinEventHook(
        EVENT_SYSTEM_FOREGROUND,
        EVENT_SYSTEM_FOREGROUND,
        nullptr,
        WinEventProcedure,
        0,
        0,
        WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS
    );

    HWND Overlay = CreateWindowExW(
        WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
        OverlayWindowClassName,
        L"",
        WS_POPUP,
        0, 0, 0, 0,
        nullptr,
        nullptr,
        GetModuleHandleW(nullptr),
        nullptr
    );

    FBorder OutBorder;
    OutBorder.Overlay = Overlay;
    OutBorder.PositionHook = PositionHook;
    OutBorder.FocusHook = FocusHook;
    BorderMap[TargetWindowHandle] = OutBorder;

    UpdateOverlayToMatchTarget(TargetWindowHandle);

    std::cout << "SetBorderColorTest was successful." << std::endl;
}

Napi::Value InitializeBorderManager(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    WindowClass.cbSize = sizeof(WindowClass);
    WindowClass.lpfnWndProc = OverlayWindowProcedure;
    WindowClass.hInstance = GetModuleHandleW(nullptr);
    WindowClass.lpszClassName = OverlayWindowClassName;

    RegisterClassExW(&WindowClass);

    std::vector<HWND> TileableWindows = GetTileableWindows();
    for (HWND Window : TileableWindows)
    {
        if (!IsTiledWindow(Window))
        {
            CreateBorder(Window);
        }
    }

    RETURN_NAPI();
}
