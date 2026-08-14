
#include "./Window.h"

#include <algorithm>
#include <dwmapi.h>
#include <winternl.h>

namespace
{
    struct LanguageAndCodePage
    {
        WORD Language;
        WORD CodePage;
    };

    std::optional<HWND> GetWindowArgument(
        const Napi::CallbackInfo& CallbackInfo,
        std::size_t Index = 0
    )
    {
        if (CallbackInfo.Length() <= Index || !CallbackInfo[Index].IsBigInt())
        {
            return std::nullopt;
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = CallbackInfo[Index]
            .As<Napi::BigInt>()
            .Uint64Value(&IsLossless);
        const HWND WindowHandle = reinterpret_cast<HWND>(
            static_cast<std::uintptr_t>(NumericHandle)
        );

        if (!IsLossless || WindowHandle == nullptr || IsWindow(WindowHandle) == FALSE)
        {
            return std::nullopt;
        }

        return WindowHandle;
    }

    Napi::Object RectangleToNapi(const Napi::Env& Environment, const RECT& Rectangle)
    {
        Napi::Object Box = Napi::Object::New(Environment);
        Box.Set("Bottom", Rectangle.bottom);
        Box.Set("Left", Rectangle.left);
        Box.Set("Right", Rectangle.right);
        Box.Set("Top", Rectangle.top);
        return Box;
    }

    std::optional<RECT> GetRectangleArgument(const Napi::Value& Value)
    {
        if (!Value.IsObject())
        {
            return std::nullopt;
        }

        const Napi::Object Box = Value.As<Napi::Object>();
        const Napi::Value Bottom = Box.Get("Bottom");
        const Napi::Value Left = Box.Get("Left");
        const Napi::Value Right = Box.Get("Right");
        const Napi::Value Top = Box.Get("Top");

        if (!Bottom.IsNumber() || !Left.IsNumber() ||
            !Right.IsNumber() || !Top.IsNumber())
        {
            return std::nullopt;
        }

        RECT Rectangle {
            Left.As<Napi::Number>().Int32Value(),
            Top.As<Napi::Number>().Int32Value(),
            Right.As<Napi::Number>().Int32Value(),
            Bottom.As<Napi::Number>().Int32Value()
        };

        if (Rectangle.right <= Rectangle.left || Rectangle.bottom <= Rectangle.top)
        {
            return std::nullopt;
        }

        return Rectangle;
    }

    std::optional<std::wstring> GetExecutablePath(HWND WindowHandle)
    {
        DWORD ProcessId = 0;
        GetWindowThreadProcessId(WindowHandle, &ProcessId);
        if (ProcessId == 0)
        {
            return std::nullopt;
        }

        HANDLE Process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, ProcessId);
        if (Process == nullptr)
        {
            return std::nullopt;
        }

        std::wstring ExecutablePath(32768, L'\0');
        DWORD PathLength = static_cast<DWORD>(ExecutablePath.size());
        const BOOL QueryResult = QueryFullProcessImageNameW(
            Process,
            0,
            ExecutablePath.data(),
            &PathLength
        );
        CloseHandle(Process);

        if (QueryResult == FALSE || PathLength == 0)
        {
            return std::nullopt;
        }

        ExecutablePath.resize(PathLength);
        return ExecutablePath;
    }

    std::optional<std::wstring> GetVersionString(
        const std::vector<BYTE>& VersionInfo,
        const LanguageAndCodePage& Translation,
        const wchar_t* Name
    )
    {
        wchar_t Query[128] { };
        if (swprintf_s(
            Query,
            L"\\StringFileInfo\\%04x%04x\\%s",
            Translation.Language,
            Translation.CodePage,
            Name
        ) < 0)
        {
            return std::nullopt;
        }

        wchar_t* Value = nullptr;
        UINT ValueLength = 0;
        if (VerQueryValueW(
            VersionInfo.data(),
            Query,
            reinterpret_cast<void**>(&Value),
            &ValueLength
        ) == FALSE || Value == nullptr || ValueLength <= 1)
        {
            return std::nullopt;
        }

        std::wstring Result(Value, ValueLength - 1);
        const std::size_t First = Result.find_first_not_of(L" \t\r\n");
        if (First == std::wstring::npos)
        {
            return std::nullopt;
        }

        const std::size_t Last = Result.find_last_not_of(L" \t\r\n");
        return Result.substr(First, Last - First + 1);
    }

    std::optional<std::wstring> GetExecutableApplicationName(
        const std::wstring& ExecutablePath
    )
    {
        DWORD IgnoredHandle = 0;
        const DWORD VersionInfoSize = GetFileVersionInfoSizeW(
            ExecutablePath.c_str(),
            &IgnoredHandle
        );
        if (VersionInfoSize == 0)
        {
            return std::nullopt;
        }

        std::vector<BYTE> VersionInfo(VersionInfoSize);
        if (GetFileVersionInfoW(
            ExecutablePath.c_str(),
            0,
            VersionInfoSize,
            VersionInfo.data()
        ) == FALSE)
        {
            return std::nullopt;
        }

        LanguageAndCodePage* Translations = nullptr;
        UINT TranslationsSize = 0;
        if (VerQueryValueW(
            VersionInfo.data(),
            L"\\VarFileInfo\\Translation",
            reinterpret_cast<void**>(&Translations),
            &TranslationsSize
        ) == FALSE || Translations == nullptr)
        {
            return std::nullopt;
        }

        const std::size_t TranslationCount = TranslationsSize
            / sizeof(LanguageAndCodePage);
        for (std::size_t Index = 0; Index < TranslationCount; ++Index)
        {
            const LanguageAndCodePage& Translation = Translations[Index];
            const std::optional<std::wstring> FileDescription = GetVersionString(
                VersionInfo,
                Translation,
                L"FileDescription"
            );
            if (FileDescription.has_value())
            {
                return FileDescription;
            }

            const std::optional<std::wstring> ProductName = GetVersionString(
                VersionInfo,
                Translation,
                L"ProductName"
            );
            if (ProductName.has_value())
            {
                return ProductName;
            }
        }

        return std::nullopt;
    }

    bool IsManageableTopLevelWindow(HWND WindowHandle)
    {
        if (WindowHandle == nullptr || WindowHandle == GetShellWindow() ||
            IsWindowVisible(WindowHandle) == FALSE || IsIconic(WindowHandle) != FALSE)
        {
            return false;
        }

        DWORD ProcessId = 0;
        GetWindowThreadProcessId(WindowHandle, &ProcessId);
        if (ProcessId == 0 || ProcessId == GetCurrentProcessId())
        {
            return false;
        }

        const LONG_PTR Style = GetWindowLongPtrW(WindowHandle, GWL_STYLE);
        const LONG_PTR ExtendedStyle = GetWindowLongPtrW(WindowHandle, GWL_EXSTYLE);
        if ((Style & WS_CHILD) != 0 || (Style & WS_DISABLED) != 0 ||
            (Style & WS_CAPTION) == 0 || (Style & WS_THICKFRAME) == 0 ||
            (ExtendedStyle & WS_EX_NOACTIVATE) != 0 ||
            (ExtendedStyle & WS_EX_TOOLWINDOW) != 0)
        {
            return false;
        }

        if (GetWindow(WindowHandle, GW_OWNER) != nullptr &&
            (ExtendedStyle & WS_EX_APPWINDOW) == 0)
        {
            return false;
        }

        DWORD Cloaked = 0;
        if (SUCCEEDED(DwmGetWindowAttribute(
            WindowHandle,
            DWMWA_CLOAKED,
            &Cloaked,
            sizeof(Cloaked)
        )) && Cloaked != 0)
        {
            return false;
        }

        RECT Bounds { };
        return GetWindowRect(WindowHandle, &Bounds) != FALSE &&
            Bounds.right > Bounds.left && Bounds.bottom > Bounds.top;
    }

    bool IsCloaked(HWND WindowHandle)
    {
        DWORD Cloaked = 0;
        return SUCCEEDED(DwmGetWindowAttribute(
            WindowHandle,
            DWMWA_CLOAKED,
            &Cloaked,
            sizeof(Cloaked)
        )) && Cloaked != 0;
    }

    bool ContainsWindow(
        const std::vector<HWND>& Windows,
        HWND Candidate
    )
    {
        return std::find(Windows.begin(), Windows.end(), Candidate) != Windows.end();
    }

    BOOL CALLBACK CollectManageableTopLevelWindow(HWND WindowHandle, LPARAM ContextValue)
    {
        if (IsManageableTopLevelWindow(WindowHandle))
        {
            auto* Windows = reinterpret_cast<std::vector<HWND>*>(ContextValue);
            Windows->push_back(WindowHandle);
        }

        return TRUE;
    }

    std::optional<bool> IsProcessTokenElevated(HANDLE Process)
    {
        HANDLE Token = nullptr;
        if (OpenProcessToken(Process, TOKEN_QUERY, &Token) == FALSE)
        {
            return std::nullopt;
        }

        TOKEN_ELEVATION Elevation { };
        DWORD ReturnedSize = 0;
        const BOOL QueryResult = GetTokenInformation(
            Token,
            TokenElevation,
            &Elevation,
            sizeof(Elevation),
            &ReturnedSize
        );
        CloseHandle(Token);

        if (QueryResult == FALSE)
        {
            return std::nullopt;
        }

        return Elevation.TokenIsElevated != 0;
    }

    std::optional<bool> GetSnapWindowsEnabled()
    {
        BOOL IsEnabled = FALSE;
        if (SystemParametersInfoW(
            SPI_GETWINARRANGING,
            0,
            &IsEnabled,
            0
        ) == FALSE)
        {
            return std::nullopt;
        }

        return IsEnabled != FALSE;
    }

    std::optional<bool> IsWindows11OrLater()
    {
        using RtlGetVersionFunction = LONG (WINAPI*)(PRTL_OSVERSIONINFOW);

        const HMODULE NtDll = GetModuleHandleW(L"ntdll.dll");
        if (NtDll == nullptr)
        {
            return std::nullopt;
        }

        const auto RtlGetVersion = reinterpret_cast<RtlGetVersionFunction>(
            GetProcAddress(NtDll, "RtlGetVersion")
        );
        if (RtlGetVersion == nullptr)
        {
            return std::nullopt;
        }

        RTL_OSVERSIONINFOW Version { };
        Version.dwOSVersionInfoSize = sizeof(Version);
        if (RtlGetVersion(&Version) != 0)
        {
            return std::nullopt;
        }

        return Version.dwMajorVersion > 10 ||
            (Version.dwMajorVersion == 10 && Version.dwBuildNumber >= 22000);
    }

    std::optional<LRESULT> HitTestWindow(HWND WindowHandle, POINT Position)
    {
        DWORD_PTR HitTestResult = HTNOWHERE;
        SetLastError(ERROR_SUCCESS);
        if (SendMessageTimeoutW(
            WindowHandle,
            WM_NCHITTEST,
            0,
            MAKELPARAM(Position.x, Position.y),
            SMTO_ABORTIFHUNG | SMTO_BLOCK,
            50,
            &HitTestResult
        ) == 0)
        {
            return std::nullopt;
        }

        return static_cast<LRESULT>(HitTestResult);
    }
}

Napi::Value GetCursorPosition(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    POINT Position { };

    Result Out(Environment);

    if (GetCursorPos(&Position) == FALSE)
    {
        return Out.Fail("Could not get cursor position.");
    }

    return Out.Succeed(IntPoint(Position.x, Position.y).ToNapi(Environment));
}

Napi::Value GetMouseHoverTime(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    UINT HoverTimeMilliseconds = 0;

    if (SystemParametersInfoW(
        SPI_GETMOUSEHOVERTIME,
        0,
        &HoverTimeMilliseconds,
        0
    ) == FALSE)
    {
        return Out.Fail("Could not get the Windows mouse hover time.");
    }

    return Out.Succeed(Napi::Number::New(
        Environment,
        HoverTimeMilliseconds
    ));
}

Napi::Value GetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const HWND WindowHandle = GetForegroundWindow();

    if (WindowHandle == nullptr)
    {
        return Out.Fail("There is no foreground window.");
    }

    const auto NumericHandle = static_cast<std::uint64_t>(
        reinterpret_cast<std::uintptr_t>(WindowHandle)
    );

    return Out.Succeed(Napi::BigInt::New(Environment, NumericHandle));
}

namespace
{
Napi::Value GetHoveredCaptionButton(
    const Napi::CallbackInfo& CallbackInfo,
    const LRESULT HitCode,
    const LONG_PTR RequiredStyle,
    const std::string& ButtonName
)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    POINT Cursor { };

    if (GetCursorPos(&Cursor) == FALSE)
    {
        return Out.Fail("Could not get the cursor position.");
    }

    const HWND PointWindow = WindowFromPoint(Cursor);
    const HWND WindowHandle = PointWindow == nullptr
        ? nullptr
        : GetAncestor(PointWindow, GA_ROOT);
    if (WindowHandle == nullptr ||
        IsWindowVisible(WindowHandle) == FALSE ||
        IsIconic(WindowHandle) != FALSE)
    {
        return Out.Fail("The cursor is not over a visible top-level window.");
    }

    const LONG_PTR Style = GetWindowLongPtrW(WindowHandle, GWL_STYLE);
    if ((Style & WS_CAPTION) == 0 || (Style & RequiredStyle) == 0)
    {
        return Out.Fail("The hovered window does not have a " + ButtonName + " button.");
    }

    const std::optional<LRESULT> CurrentHit = HitTestWindow(WindowHandle, Cursor);
    if (!CurrentHit.has_value() || CurrentHit.value() != HitCode)
    {
        return Out.Fail("The cursor is not over a " + ButtonName + " button.");
    }

    RECT WindowBounds { };
    if (GetWindowRect(WindowHandle, &WindowBounds) == FALSE)
    {
        return Out.Fail("Could not get the hovered window bounds.");
    }

    RECT ButtonBounds {
        Cursor.x,
        Cursor.y,
        Cursor.x + 1,
        Cursor.y + 1
    };
    POINT Probe = Cursor;
    constexpr int MaximumHorizontalProbes = 256;
    constexpr int MaximumVerticalProbes = 128;
    int ProbeCount = 0;

    while (ButtonBounds.left > WindowBounds.left &&
        ProbeCount++ < MaximumHorizontalProbes)
    {
        Probe.x = ButtonBounds.left - 1;
        const std::optional<LRESULT> Hit = HitTestWindow(WindowHandle, Probe);
        if (!Hit.has_value() || Hit.value() != HitCode)
        {
            break;
        }
        --ButtonBounds.left;
    }

    Probe = Cursor;
    ProbeCount = 0;
    while (ButtonBounds.right < WindowBounds.right &&
        ProbeCount++ < MaximumHorizontalProbes)
    {
        Probe.x = ButtonBounds.right;
        const std::optional<LRESULT> Hit = HitTestWindow(WindowHandle, Probe);
        if (!Hit.has_value() || Hit.value() != HitCode)
        {
            break;
        }
        ++ButtonBounds.right;
    }

    Probe = Cursor;
    ProbeCount = 0;
    while (ButtonBounds.top > WindowBounds.top &&
        ProbeCount++ < MaximumVerticalProbes)
    {
        Probe.y = ButtonBounds.top - 1;
        const std::optional<LRESULT> Hit = HitTestWindow(WindowHandle, Probe);
        if (!Hit.has_value() || Hit.value() != HitCode)
        {
            break;
        }
        --ButtonBounds.top;
    }

    Probe = Cursor;
    ProbeCount = 0;
    while (ButtonBounds.bottom < WindowBounds.bottom &&
        ProbeCount++ < MaximumVerticalProbes)
    {
        Probe.y = ButtonBounds.bottom;
        const std::optional<LRESULT> Hit = HitTestWindow(WindowHandle, Probe);
        if (!Hit.has_value() || Hit.value() != HitCode)
        {
            break;
        }
        ++ButtonBounds.bottom;
    }

    const auto NumericHandle = static_cast<std::uint64_t>(
        reinterpret_cast<std::uintptr_t>(WindowHandle)
    );
    Napi::Object Hover = Napi::Object::New(Environment);
    Hover.Set("Bounds", RectangleToNapi(Environment, ButtonBounds));
    Hover.Set("Window", Napi::BigInt::New(Environment, NumericHandle));
    return Out.Succeed(Hover);
}
}

Napi::Value GetHoveredMaximizeButton(const Napi::CallbackInfo& CallbackInfo)
{
    return GetHoveredCaptionButton(
        CallbackInfo,
        HTMAXBUTTON,
        WS_MAXIMIZEBOX,
        "maximize"
    );
}

Napi::Value GetHoveredMinimizeButton(const Napi::CallbackInfo& CallbackInfo)
{
    return GetHoveredCaptionButton(
        CallbackInfo,
        HTMINBUTTON,
        WS_MINIMIZEBOX,
        "minimize"
    );
}

Napi::Value GetManageableTopLevelWindows(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    std::vector<HWND> Windows;

    SetLastError(ERROR_SUCCESS);
    if (EnumWindows(
        CollectManageableTopLevelWindow,
        reinterpret_cast<LPARAM>(&Windows)
    ) == FALSE)
    {
        return Out.Fail("Could not enumerate top-level windows.");
    }

    Napi::Array Handles = Napi::Array::New(Environment, Windows.size());
    for (std::size_t Index = 0; Index < Windows.size(); ++Index)
    {
        const auto NumericHandle = static_cast<std::uint64_t>(
            reinterpret_cast<std::uintptr_t>(Windows[Index])
        );
        Handles.Set(
            static_cast<std::uint32_t>(Index),
            Napi::BigInt::New(Environment, NumericHandle)
        );
    }

    return Out.Succeed(Handles);
}

Napi::Value GetMovingWindow(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    GUITHREADINFO Information { };
    Information.cbSize = sizeof(GUITHREADINFO);

    if (GetGUIThreadInfo(0, &Information) == FALSE)
    {
        return Out.Fail("Could not inspect the foreground GUI thread.");
    }

    if (
        (Information.flags & GUI_INMOVESIZE) == 0
        || Information.hwndMoveSize == nullptr
        || IsWindow(Information.hwndMoveSize) == FALSE
    )
    {
        return Out.Fail("No top-level window is being moved or resized.");
    }

    const auto NumericHandle = static_cast<std::uint64_t>(
        reinterpret_cast<std::uintptr_t>(Information.hwndMoveSize)
    );
    return Out.Succeed(Napi::BigInt::New(Environment, NumericHandle));
}

// `GetGUIThreadInfo`'s GUI_INMOVESIZE flag is a cross-process snapshot of the
// foreground thread's state, and can be observed as momentarily cleared for a
// poll or two in the middle of an otherwise-continuous drag. The left mouse
// button's physical state doesn't share that flicker, so callers use this
// alongside `GetMovingWindow` to tell a genuine drag release apart from a
// stale read.
Napi::Value IsLeftMouseButtonDown(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const bool IsDown = (GetAsyncKeyState(VK_LBUTTON) & 0x8000) != 0;
    return Out.Succeed(Napi::Boolean::New(Environment, IsDown));
}

Napi::Value GetApplicationName(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    const std::optional<std::wstring> ExecutablePath = GetExecutablePath(
        WindowHandle.value()
    );
    if (!ExecutablePath.has_value())
    {
        return Out.Fail("Could not get the window application's executable path.");
    }

    const std::optional<std::wstring> ApplicationName = GetExecutableApplicationName(
        ExecutablePath.value()
    );
    if (!ApplicationName.has_value())
    {
        return Out.Fail("Could not get the window application's display name.");
    }

    return Out.Succeed(Napi::String::New(
        Environment,
        reinterpret_cast<const char16_t*>(ApplicationName->data()),
        ApplicationName->size()
    ));
}

Napi::Value GetApplicationNameFromPath(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() < 1 || !CallbackInfo[0].IsString())
    {
        return Out.Fail("Expected an executable path.");
    }

    const std::u16string Path = CallbackInfo[0].As<Napi::String>().Utf16Value();
    if (Path.empty())
    {
        return Out.Fail("Expected a non-empty executable path.");
    }

    const std::wstring ExecutablePath(
        reinterpret_cast<const wchar_t*>(Path.data()),
        Path.size()
    );
    const std::optional<std::wstring> ApplicationName = GetExecutableApplicationName(
        ExecutablePath
    );
    if (!ApplicationName.has_value())
    {
        return Out.Fail("Could not get the executable's display name.");
    }

    return Out.Succeed(Napi::String::New(
        Environment,
        reinterpret_cast<const char16_t*>(ApplicationName->data()),
        ApplicationName->size()
    ));
}

Napi::Value GetExecutablePath_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    const std::optional<std::wstring> ExecutablePath = GetExecutablePath(
        WindowHandle.value()
    );
    if (!ExecutablePath.has_value())
    {
        return Out.Fail("Could not get the window application's executable path.");
    }

    return Out.Succeed(Napi::String::New(
        Environment,
        reinterpret_cast<const char16_t*>(ExecutablePath->data()),
        ExecutablePath->size()
    ));
}

Napi::Value GetWindowRect_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    RECT Rectangle { };

    if (GetWindowRect(WindowHandle.value(), &Rectangle) == FALSE)
    {
        return Out.Fail("Could not get the window rectangle.");
    }

    return Out.Succeed(RectangleToNapi(Environment, Rectangle));
}

Napi::Value GetWindowFrameRect(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    RECT Rectangle { };
    if (FAILED(DwmGetWindowAttribute(
        WindowHandle.value(),
        DWMWA_EXTENDED_FRAME_BOUNDS,
        &Rectangle,
        sizeof(Rectangle)
    )) && GetWindowRect(WindowHandle.value(), &Rectangle) == FALSE)
    {
        return Out.Fail("Could not get the visible window frame rectangle.");
    }

    return Out.Succeed(RectangleToNapi(Environment, Rectangle));
}

Napi::Value IsWindowObscured(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> TargetWindow = GetWindowArgument(CallbackInfo);

    if (!TargetWindow.has_value())
    {
        return Out.Fail("Expected a valid target window handle.");
    }

    if (CallbackInfo.Length() < 2 || !CallbackInfo[1].IsArray())
    {
        return Out.Fail("Expected an array of excluded window handles.");
    }

    const Napi::Array ExcludedValues = CallbackInfo[1].As<Napi::Array>();
    std::vector<HWND> ExcludedWindows;
    ExcludedWindows.reserve(ExcludedValues.Length());

    for (std::uint32_t Index = 0; Index < ExcludedValues.Length(); ++Index)
    {
        const Napi::Value Value = ExcludedValues.Get(Index);
        if (!Value.IsBigInt())
        {
            return Out.Fail("Excluded windows must be valid window handles.");
        }

        bool IsLossless = false;
        const std::uint64_t NumericHandle = Value
            .As<Napi::BigInt>()
            .Uint64Value(&IsLossless);
        const HWND WindowHandle = reinterpret_cast<HWND>(
            static_cast<std::uintptr_t>(NumericHandle)
        );

        if (!IsLossless || WindowHandle == nullptr)
        {
            return Out.Fail("Excluded windows must be valid window handles.");
        }

        ExcludedWindows.push_back(WindowHandle);
    }

    RECT TargetBounds { };
    if (GetWindowRect(TargetWindow.value(), &TargetBounds) == FALSE)
    {
        return Out.Fail("Could not get the target window rectangle.");
    }

    HRGN VisibleRegion = CreateRectRgnIndirect(&TargetBounds);
    if (VisibleRegion == nullptr)
    {
        return Out.Fail("Could not create the target visibility region.");
    }

    bool IsObscured = false;
    bool Failed = false;

    for (
        HWND Candidate = GetWindow(TargetWindow.value(), GW_HWNDPREV);
        Candidate != nullptr;
        Candidate = GetWindow(Candidate, GW_HWNDPREV)
    )
    {
        const LONG_PTR ExtendedStyle = GetWindowLongPtrW(Candidate, GWL_EXSTYLE);
        if (
            ContainsWindow(ExcludedWindows, Candidate)
            || IsWindowVisible(Candidate) == FALSE
            || IsIconic(Candidate) != FALSE
            || IsCloaked(Candidate)
            || (ExtendedStyle & WS_EX_TRANSPARENT) != 0
        )
        {
            continue;
        }

        RECT CandidateBounds { };
        if (GetWindowRect(Candidate, &CandidateBounds) == FALSE)
        {
            continue;
        }

        HRGN CandidateRegion = CreateRectRgnIndirect(&CandidateBounds);
        if (CandidateRegion == nullptr)
        {
            Failed = true;
            break;
        }

        const int RegionResult = CombineRgn(
            VisibleRegion,
            VisibleRegion,
            CandidateRegion,
            RGN_DIFF
        );
        DeleteObject(CandidateRegion);

        if (RegionResult == ERROR)
        {
            Failed = true;
            break;
        }

        if (RegionResult == NULLREGION)
        {
            IsObscured = true;
            break;
        }
    }

    DeleteObject(VisibleRegion);

    return Failed
        ? Out.Fail("Could not calculate the target window's visible region.")
        : Out.Succeed(Napi::Boolean::New(Environment, IsObscured));
}

Napi::Value GetWindowText_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    SetLastError(ERROR_SUCCESS);
    const int TextLength = GetWindowTextLengthW(WindowHandle.value());

    if (TextLength == 0 && GetLastError() != ERROR_SUCCESS)
    {
        return Out.Fail("Could not get the window title length.");
    }

    if (TextLength == 0)
    {
        return Out.Succeed(Napi::String::New(Environment, ""));
    }

    std::wstring WindowText(static_cast<std::size_t>(TextLength) + 1, L'\0');
    SetLastError(ERROR_SUCCESS);
    const int CopiedLength = GetWindowTextW(
        WindowHandle.value(),
        WindowText.data(),
        TextLength + 1
    );

    if (CopiedLength == 0 && GetLastError() != ERROR_SUCCESS)
    {
        return Out.Fail("Could not get the window title.");
    }

    return Out.Succeed(Napi::String::New(
        Environment,
        reinterpret_cast<const char16_t*>(WindowText.data()),
        static_cast<std::size_t>(CopiedLength)
    ));
}

Napi::Value HasRoundedCorners(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid top-level window handle.");
    }

    if ((GetWindowLongPtrW(WindowHandle.value(), GWL_STYLE) & WS_CHILD) != 0)
    {
        return Out.Fail("Expected a top-level window handle.");
    }

    DWM_WINDOW_CORNER_PREFERENCE CornerPreference = DWMWCP_DEFAULT;
    const HRESULT QueryResult = DwmGetWindowAttribute(
        WindowHandle.value(),
        DWMWA_WINDOW_CORNER_PREFERENCE,
        &CornerPreference,
        sizeof(CornerPreference)
    );

    if (FAILED(QueryResult))
    {
        return Out.Fail("Could not query the window corner preference.");
    }

    switch (CornerPreference)
    {
        case DWMWCP_DONOTROUND:
            return Out.Succeed(Napi::Boolean::New(Environment, false));

        case DWMWCP_ROUND:
        case DWMWCP_ROUNDSMALL:
            return Out.Succeed(Napi::Boolean::New(Environment, true));

        case DWMWCP_DEFAULT:
        default:
            return Out.Fail("The window corner preference is indeterminate.");
    }
}

Napi::Value IsSnapWindowsEnabled(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<bool> IsEnabled = GetSnapWindowsEnabled();

    if (!IsEnabled.has_value())
    {
        return Out.Fail("Could not query whether Snap windows is enabled.");
    }

    return Out.Succeed(Napi::Boolean::New(Environment, IsEnabled.value()));
}

Napi::Value IsSnapLayoutsOnHoverEnabled(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<bool> IsSnapEnabled = GetSnapWindowsEnabled();

    if (!IsSnapEnabled.has_value())
    {
        return Out.Fail("Could not query whether Snap windows is enabled.");
    }

    if (!IsSnapEnabled.value())
    {
        return Out.Succeed(Napi::Boolean::New(Environment, false));
    }

    const std::optional<bool> IsWindows11 = IsWindows11OrLater();
    if (!IsWindows11.has_value())
    {
        return Out.Fail("Could not determine the Windows version.");
    }

    if (!IsWindows11.value())
    {
        return Out.Succeed(Napi::Boolean::New(Environment, false));
    }

    DWORD IsEnabled = 0;
    DWORD ValueSize = sizeof(IsEnabled);
    const LSTATUS QueryStatus = RegGetValueW(
        HKEY_CURRENT_USER,
        L"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced",
        L"EnableSnapAssistFlyout",
        RRF_RT_REG_DWORD,
        nullptr,
        &IsEnabled,
        &ValueSize
    );

    if (QueryStatus == ERROR_FILE_NOT_FOUND ||
        QueryStatus == ERROR_PATH_NOT_FOUND)
    {
        // Windows 11 enables this feature when no explicit preference is stored.
        return Out.Succeed(Napi::Boolean::New(Environment, true));
    }

    if (QueryStatus != ERROR_SUCCESS)
    {
        return Out.Fail(
            "Could not query whether maximize-button Snap layouts are enabled."
        );
    }

    return Out.Succeed(Napi::Boolean::New(Environment, IsEnabled != 0));
}

Napi::Value IsWindowElevated(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    DWORD ProcessId = 0;
    GetWindowThreadProcessId(WindowHandle.value(), &ProcessId);
    if (ProcessId == 0)
    {
        return Out.Fail("Could not get the window's owning process.");
    }

    const HANDLE Process = OpenProcess(
        PROCESS_QUERY_LIMITED_INFORMATION,
        FALSE,
        ProcessId
    );
    if (Process == nullptr)
    {
        return Out.Fail("Could not open the window's owning process.");
    }

    const std::optional<bool> IsElevated = IsProcessTokenElevated(Process);
    CloseHandle(Process);

    if (!IsElevated.has_value())
    {
        return Out.Fail("Could not query the window's owning process token.");
    }

    return Out.Succeed(Napi::Boolean::New(Environment, IsElevated.value()));
}

Napi::Value IsCurrentProcessElevated(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<bool> IsElevated = IsProcessTokenElevated(GetCurrentProcess());

    if (!IsElevated.has_value())
    {
        return Out.Fail("Could not query the current process token.");
    }

    return Out.Succeed(Napi::Boolean::New(Environment, IsElevated.value()));
}

Napi::Value GetWindowWorkArea(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid top-level window handle.");
    }

    const HMONITOR Monitor = MonitorFromWindow(
        WindowHandle.value(),
        MONITOR_DEFAULTTONEAREST
    );
    MONITORINFO Information { };
    Information.cbSize = sizeof(Information);

    if (Monitor == nullptr || GetMonitorInfoW(Monitor, &Information) == FALSE)
    {
        return Out.Fail("Could not get the window monitor work area.");
    }

    return Out.Succeed(RectangleToNapi(Environment, Information.rcWork));
}

Napi::Value GetRefreshRate(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid top-level window handle.");
    }

    const HMONITOR Monitor = MonitorFromWindow(
        WindowHandle.value(),
        MONITOR_DEFAULTTONEAREST
    );
    MONITORINFOEXW Information { };
    Information.cbSize = sizeof(Information);

    if (Monitor == nullptr || GetMonitorInfoW(Monitor, &Information) == FALSE)
    {
        return Out.Fail("Could not get the window's monitor.");
    }

    DEVMODEW DeviceMode { };
    DeviceMode.dmSize = sizeof(DeviceMode);

    if (
        EnumDisplaySettingsW(Information.szDevice, ENUM_CURRENT_SETTINGS, &DeviceMode) == FALSE
        || DeviceMode.dmDisplayFrequency <= 1
    )
    {
        return Out.Fail("Could not get the monitor's refresh rate.");
    }

    return Out.Succeed(Napi::Number::New(Environment, DeviceMode.dmDisplayFrequency));
}

Napi::Value SetForegroundWindow_Node(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);

    if (!WindowHandle.has_value())
    {
        return Out.Fail("Expected a valid window handle.");
    }

    // Windows normally refuses to let a background process steal the
    // foreground away from whatever currently has it, and silently or
    // explicitly fails SetForegroundWindow as a result -- this is common
    // whenever this is called shortly after the overlay itself (also this
    // process) just had focus, which is exactly the case when restoring
    // focus to an activation window after the overlay closes. Briefly
    // attaching this thread's input state to the current foreground window's
    // thread is the standard, sanctioned way around that restriction: it
    // borrows that thread's standing permission to change focus instead of
    // fighting the OS's anti focus-stealing heuristic outright.
    const HWND CurrentForeground = GetForegroundWindow();
    const DWORD CurrentThreadId = GetCurrentThreadId();
    DWORD ForegroundThreadId = 0;
    bool Attached = false;

    if (CurrentForeground != nullptr && CurrentForeground != WindowHandle.value())
    {
        ForegroundThreadId = GetWindowThreadProcessId(CurrentForeground, nullptr);

        if (ForegroundThreadId != 0 && ForegroundThreadId != CurrentThreadId)
        {
            Attached = AttachThreadInput(CurrentThreadId, ForegroundThreadId, TRUE) != FALSE;
        }
    }

    const BOOL Succeeded = SetForegroundWindow(WindowHandle.value());

    if (Attached)
    {
        AttachThreadInput(CurrentThreadId, ForegroundThreadId, FALSE);
    }

    if (Succeeded == FALSE)
    {
        return Out.Fail("Windows did not allow the window to become foreground.");
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value SetWindowZOrderAfter(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);
    const std::optional<HWND> PrecedingWindow = GetWindowArgument(CallbackInfo, 1);

    if (!WindowHandle.has_value() || !PrecedingWindow.has_value())
    {
        return Out.Fail("Expected two valid window handles.");
    }

    const UINT Flags = SWP_NOMOVE | SWP_NOACTIVATE |
        SWP_NOOWNERZORDER | SWP_NOSIZE;

    if (SetWindowPos(
        WindowHandle.value(),
        PrecedingWindow.value(),
        0,
        0,
        0,
        0,
        Flags
    ) == FALSE)
    {
        return Out.Fail("Could not set the window z-order.");
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value SetWindowRect(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 2)
    {
        return Out.Fail("Expected a window handle and a nonempty rectangle.");
    }

    const std::optional<HWND> WindowHandle = GetWindowArgument(CallbackInfo);
    const std::optional<RECT> Rectangle = GetRectangleArgument(CallbackInfo[1]);
    if (!WindowHandle.has_value() || !Rectangle.has_value())
    {
        return Out.Fail("Expected a valid window handle and a nonempty rectangle.");
    }

    if (IsZoomed(WindowHandle.value()) != FALSE)
    {
        ShowWindowAsync(WindowHandle.value(), SW_RESTORE);
    }

    const int Width = Rectangle->right - Rectangle->left;
    const int Height = Rectangle->bottom - Rectangle->top;
    const UINT Flags = SWP_ASYNCWINDOWPOS | SWP_NOACTIVATE |
        SWP_NOOWNERZORDER | SWP_NOZORDER;

    if (SetWindowPos(
        WindowHandle.value(),
        nullptr,
        Rectangle->left,
        Rectangle->top,
        Width,
        Height,
        Flags
    ) == FALSE)
    {
        return Out.Fail("Could not set the window rectangle.");
    }

    return Out.Succeed(Environment.Undefined());
}
