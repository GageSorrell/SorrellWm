/* File:      String.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "String.h"

std::wstring StringToWString(const std::string& str)
{
    if (str.empty()) {
        return std::wstring();
    }

    // Calculate the length of the wide string
    int size_needed = MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), NULL, 0);

    // Allocate the wide string
    std::wstring wstr(size_needed, 0);

    // Perform the conversion
    MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), &wstr[0], size_needed);

    return wstr;
}

std::string WStringToString(const std::wstring& wstr)
{
    if (wstr.empty()) return std::string();

    // Calculate the size of the buffer needed
    int size_needed = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(),
                                          NULL, 0, NULL, NULL);
    std::string strTo(size_needed, 0);

    // Perform the conversion
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(),
                        &strTo[0], size_needed, NULL, NULL);
    return strTo;
}
