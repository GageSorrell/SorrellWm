/* File:      DevSettings.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#include "./DevSettings.h"
#include <fstream>

FDevSettings GetDevSettings()
{
    const std::filesystem::path CurrentWorkingDirectory = std::filesystem::current_path();
    const std::filesystem::path& RelativePath("./DevSettings.json");
    const std::filesystem::path FullPath = CurrentWorkingDirectory / RelativePath;

    std::ifstream InputStream(FullPath, std::ios::binary);
    if (!InputStream.is_open())
    {
        std::cout << "Failed to open JSON file: " << FullPath.string() << std::endl;
    }

    FJson ParsedJson;
    InputStream >> ParsedJson;

    FDevSettings DevSettings;
    DevSettings.StaticMode.bEnabled = ParsedJson["StaticMode"]["Enabled"];
    DevSettings.StaticMode.WindowShape.left = ParsedJson["StaticMode"]["WindowShape"]["X"];
    DevSettings.StaticMode.WindowShape.top = ParsedJson["StaticMode"]["WindowShape"]["Y"];
    DevSettings.StaticMode.WindowShape.right = ParsedJson["StaticMode"]["WindowShape"]["X"] + ParsedJson["StaticMode"]["WindowShape"]["Width"];
    DevSettings.StaticMode.WindowShape.bottom = ParsedJson["StaticMode"]["WindowShape"]["Y"] + ParsedJson["StaticMode"]["WindowShape"]["Height"];

    return DevSettings;
}
