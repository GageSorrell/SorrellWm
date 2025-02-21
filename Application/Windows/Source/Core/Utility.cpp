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
    gmtime_s(&tm_utc, &time); // Windows-specific
#else
    gmtime_r(&time, &tm_utc); // POSIX-specific
#endif
    return tm_utc;
}

std::wstring GetFileNameTimestamp()
{
    auto now = std::chrono::system_clock::now();
        std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
        std::tm tm_now;

        // Use localtime_s for thread safety on Windows, or localtime_r on POSIX
    #ifdef _WIN32
        localtime_s(&tm_now, &now_time_t);
    #else
        localtime_r(&now_time_t, &tm_now);
    #endif

        std::wstringstream wss;
        wss << std::put_time(&tm_now, L"%Y%m%d%H%M%S");
        return wss.str();
}

std::wstring GetTimestamp()
{
    // Get current time
    auto now = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(now);
    auto now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
                      now.time_since_epoch()) %
                  1000;

    // Convert to UTC time
    std::tm tm_utc = convertToUTC(now_time_t);

    // Format as ISO 8601
    std::wstringstream wss;
    wss << std::put_time(&tm_utc, L"%Y-%m-%dT%H:%M:%S");
    wss << L"." << std::setfill(L'0') << std::setw(3) << now_ms.count() << L"Z";
    return wss.str();
}

std::wstring GetTempPath()
{
    const DWORD bufferSize = MAX_PATH;
    wchar_t tempPathBuffer[bufferSize];
    DWORD tempPathLength = GetEnvironmentVariableW(L"TEMP", tempPathBuffer, bufferSize);

    if (tempPathLength == 0 || tempPathLength > bufferSize) {
        std::wcerr << L"Error: Unable to retrieve %TEMP% environment variable. Error code: " << GetLastError() << std::endl;
    }

    std::wstring tempPath(tempPathBuffer, tempPathLength);

    std::wstring targetPath = tempPath + L"\\SorrellWm";
    return targetPath;
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
