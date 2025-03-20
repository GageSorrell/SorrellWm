/* File:      Utility.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "Utility.h"

std::tm convertToUTC(std::time_t time)
{
    std::tm tm_utc;
    #ifdef _WIN32
        gmtime_s(&tm_utc, &time);
    #else
        gmtime_r(&time, &tm_utc);
    #endif
    return tm_utc;
}

std::wstring GetFileNameTimestamp()
{
    auto Now = std::chrono::system_clock::now();
    std::time_t NowTimeT = std::chrono::system_clock::to_time_t(Now);
    std::tm TmNow;

    #ifdef _WIN32
        localtime_s(&TmNow, &NowTimeT);
    #else
        localtime_r(&NowTimeT, &TmNow);
    #endif

    std::wstringstream WideStringStream;
    WideStringStream << std::put_time(&TmNow, L"%Y%m%d%H%M%S");
    return WideStringStream.str();
}

std::wstring GetTimestamp()
{
    auto Now = std::chrono::system_clock::now();
    std::time_t NowTimeT = std::chrono::system_clock::to_time_t(Now);
    auto NowMs = std::chrono::duration_cast<std::chrono::milliseconds>(Now.time_since_epoch()) % 1000;

    std::tm TmUtc = convertToUTC(NowTimeT);

    std::wstringstream WideStringStream;
    WideStringStream << std::put_time(&TmUtc, L"%Y-%m-%dT%H:%M:%S");
    WideStringStream
        << L"."
        << std::setfill(L'0')
        << std::setw(3)
        << NowMs.count()
        << L"Z";

    return WideStringStream.str();
}

std::wstring GetTempPath()
{
    const DWORD BufferSize = MAX_PATH;
    wchar_t TempPathBuffer[BufferSize];
    DWORD TempPathLength = GetEnvironmentVariableW(L"TEMP", TempPathBuffer, BufferSize);

    if (TempPathLength == 0 || TempPathLength > BufferSize)
    {
        std::wcerr << L"Error: Unable to retrieve %TEMP% environment variable. Error code: " << GetLastError() << std::endl;
    }

    std::wstring TempPath(TempPathBuffer, TempPathLength);

    std::wstring TargetPath = TempPath + L"\\SorrellWm";
    return TargetPath;
}

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
        std::cout << "Got WindowRect via GetWindowRect: " << std::hex << Result << std::endl;
        return GetWindowRect(Handle, Rect);
    }
    else
    {
        std::cout << "Got WindowRect via DwmGetWindowAttribute." << std::endl;
        return TRUE;
    }
    return TRUE;
}

template <typename THandle>
std::string HandleToString(THandle Handle)
{
    std::stringstream StringStream;
    StringStream << std::hex << reinterpret_cast<uintptr_t>(Handle);
    return StringStream.str();
}

Napi::Object EncodeHandle(const Napi::Env& Environment, void* Handle)
{
    std::string HandleString = HandleToString((HWND) Handle);
    Napi::Object OutObject = Napi::Object::New(Environment);
    OutObject.Set("Handle", Napi::String::New(Environment, HandleString));
    return OutObject;
}

void* DecodeHandle(const Napi::Object& Object)
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
    return (void*) HandleInt;
}

RECT DecodeRect(const Napi::Object& Object)
{
    LONG Left = Object.Get("X").As<Napi::Number>().Uint32Value();
    LONG Top = Object.Get("Y").As<Napi::Number>().Uint32Value();
    LONG Bottom = Object.Get("Height").As<Napi::Number>().Uint32Value() + Top;
    LONG Right = Object.Get("Width").As<Napi::Number>().Uint32Value() + Left;

    RECT OutRect;
    OutRect.top = Top;
    OutRect.bottom = Bottom;
    OutRect.left = Left;
    OutRect.right = Right;

    return OutRect;
}

Napi::Object EncodeRect(const Napi::Env& Environment, RECT InRect)
{
    Napi::Object OutObject = Napi::Object::New(Environment);

    OutObject.Set("X", InRect.left);
    OutObject.Set("Y", InRect.top);
    OutObject.Set("Width", InRect.right - InRect.left);
    OutObject.Set("Height", InRect.bottom - InRect.top);

    return OutObject;
}

RECT GetRectArgument(const Napi::CallbackInfo& CallbackInfo, int32_t Index)
{
    Napi::Object RectObject = CallbackInfo[Index].As<Napi::Object>();
    RECT OutRect;

    LONG X = RectObject.Get("X").As<Napi::Number>().Uint32Value();
    LONG Y = RectObject.Get("Y").As<Napi::Number>().Uint32Value();
    LONG Width = RectObject.Get("Width").As<Napi::Number>().Uint32Value();
    LONG Height = RectObject.Get("Height").As<Napi::Number>().Uint32Value();

    OutRect.left = X;
    OutRect.right = X + Width;
    OutRect.top = Y;
    OutRect.bottom = Y + Height;

    return OutRect;
}

FBox GetBoxArgument(const Napi::CallbackInfo& CallbackInfo, int32_t Index)
{
    Napi::Object RectObject = CallbackInfo[Index].As<Napi::Object>();

    int32_t X = RectObject.Get("X").As<Napi::Number>().Uint32Value();
    int32_t Y = RectObject.Get("Y").As<Napi::Number>().Uint32Value();
    int32_t Width = RectObject.Get("Width").As<Napi::Number>().Uint32Value();
    int32_t Height = RectObject.Get("Height").As<Napi::Number>().Uint32Value();

    return FBox(X, Y, Width, Height);
}
