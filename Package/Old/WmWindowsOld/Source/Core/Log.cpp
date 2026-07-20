/* File:      Log.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#include "Log.h"
#include <map>

std::string GetLastWindowsError()
{
    DWORD ErrorMessageID = ::GetLastError();

    if(ErrorMessageID == 0)
    {
        return std::string();
    }

    LPSTR MessageBuffer = nullptr;

    size_t Size = FormatMessageA(
        FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS,
        NULL,
        ErrorMessageID,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
        (LPSTR) &MessageBuffer,
        0,
        NULL
    );

    std::string Message(MessageBuffer, Size);

    LocalFree(MessageBuffer);

    return Message;
}

#include "Log.h"

static unsigned int SimpleHash(const std::string &S)
{
    unsigned int H = 5381;
    for (unsigned char C : S)
    {
        H = ((H << 5) + H) + C; // H * 33 + C
    }
    return H;
}

// We define a small palette of background+foreground pairs (for 8 standard ANSI colors).
// The index 0..7 corresponds to the 8 typical ANSI colors: black, red, green, yellow, blue, magenta, cyan, white.
struct FColorCodes
{
    const char* Foreground;
    const char* Background;
};

static const FColorCodes COLOR_PALETTE[] =
{
    // black background => white text
    { "\033[37m", "\033[40m" },
    // red background => black text
    { "\033[30m", "\033[45m" },
    // green background => black text
    { "\033[30m", "\033[42m" },
    // yellow background => black text
    { "\033[30m", "\033[43m" },
    // blue background => white text
    { "\033[97m", "\033[44m" },
    // magenta background => white text
    { "\033[97m", "\033[45m" },
    // cyan background => white text
    { "\033[30m", "\033[44m" },
    // white background => black text
    { "\033[30m", "\033[47m" }
};

std::string FLogMessage::ColorizeTextBackground(const std::string& Text)
{
    unsigned int HashValue = SimpleHash(Text);
    unsigned int Index = HashValue % 8; // pick from 0..7

    const FColorCodes &Codes = COLOR_PALETTE[Index];

    std::ostringstream Oss;
    Oss << Codes.Foreground << Codes.Background
        << Text
        << "\033[0m"; // reset
    return Oss.str();
}

std::string FLogMessage::ColorizeLogLevelBackground(ELogLevel L)
{
    const char* LevelStr = ToString(L);
    unsigned int HashValue = SimpleHash(LevelStr);

    std::map<ELogLevel, unsigned int> ColorMap{
        { ELogLevel::Error,   1 },
        { ELogLevel::Warn,    3 },
        { ELogLevel::Normal,  6 },
        { ELogLevel::Verbose, 7 }
    };

    unsigned int LevelColorIndex = ColorMap[L];

    const FColorCodes& Codes = COLOR_PALETTE[LevelColorIndex];
    std::ostringstream Oss;
    Oss << Codes.Foreground << Codes.Background
        << LevelStr
        << "\033[0m";
    return Oss.str();
}

FLogMessage::FLogMessage(const std::string& InCategory)
    : Category(InCategory)
    , Level(ELogLevel::Normal)
{ }

FLogMessage& FLogMessage::operator<<(ELogLevel InLevel)
{
    Level = InLevel;
    return *this;
}

FLogMessage& FLogMessage::operator<<(RECT Rect)
{
    Stream
        << "Top: "
        << Rect.top
        << ", Bottom: "
        << Rect.bottom
        << ", Left: "
        << Rect.left
        << ", Right: "
        << Rect.right;
    return *this;
}

FLogMessage& FLogMessage::operator<<(std::ostream &(*Manipulator)(std::ostream&))
{
    Stream << Manipulator;
    return *this;
}

std::string GetNativeLabel()
{
    FColorCodes Codes = COLOR_PALETTE[3];
    std::ostringstream Oss;
    Oss << Codes.Foreground << Codes.Background
        << " 💪 "
        << "\033[0m";
    return Oss.str();
}

FLogMessage::~FLogMessage()
{
    std::lock_guard<std::mutex> Lock(GetMutex());

    std::string CategoryColored = ColorizeTextBackground(" " + Category + " ");
    std::string LevelColored = ColorizeLogLevelBackground(Level);
    std::string NativeLabel = GetNativeLabel();

    std::cout
        << NativeLabel
        << LevelColored
        << CategoryColored
        << " "
        << Stream.str()
        << std::endl;
}

std::mutex& FLogMessage::GetMutex()
{
    static std::mutex Mutex;
    return Mutex;
}
