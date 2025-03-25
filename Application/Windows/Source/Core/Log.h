/* File:      Log.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <sstream>
#include <string>
#include <iostream>
#include <Windows.h>
#include <mutex>

std::string GetLastWindowsError();

enum class ELogLevel
{
    Verbose,
    Normal,
    Success,
    Warn,
    Error
};

inline const char* ToString(ELogLevel Level)
{
    switch (Level)
    {
        case ELogLevel::Normal:  return " Normal ";
        case ELogLevel::Verbose: return " Verbose";
        case ELogLevel::Warn:    return " Warn   ";
        case ELogLevel::Error:   return " Error  ";
    }

    return " Normal ";
}

class FLogMessage
{
public:
    FLogMessage(const std::string& InCategory);

    FLogMessage& operator<<(ELogLevel InLevel);

    template <typename T>
    FLogMessage& operator<<(const T& Value)
    {
        Stream << Value;
        return *this;
    }

    FLogMessage& operator<<(RECT Rect);

    FLogMessage& operator<<(std::ostream& (*Manipulator)(std::ostream&));

    ~FLogMessage();

private:
    std::string Category;
    ELogLevel Level;
    std::ostringstream Stream;

    static std::string ColorizeTextBackground(const std::string& Text);
    static std::string ColorizeLogLevelBackground(ELogLevel L);

    static std::mutex &GetMutex();
};

#define DEFINE_LOG_CATEGORY(CategoryName) \
    static const std::string Category##CategoryName = #CategoryName;

#define DECLARE_LOG_CATEGORY(CategoryName) \
    static const std::string LogCategory = #CategoryName; \
    inline FLogMessage LogHelper() { return FLogMessage(LogCategory); };

#define LOG LogHelper()

#define LogLastWindowsError() \
    ([]() -> void { std::string ErrorMessage = GetLastWindowsError(); std::cout << ErrorMessage << std::endl; })();
