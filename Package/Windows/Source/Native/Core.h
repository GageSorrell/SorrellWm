
#pragma once

#include <napi.h>
#include <Windows.h>
#include <functional>
#include <optional>
#include <string>
#include <vector>
#include <unordered_map>
#include <psapi.h>
#include <winver.h>
#include <iostream>
#include "./Typedefs.h"
#include "./Result.h"

#pragma comment(lib, "Gdiplus.lib")
#pragma comment(lib, "dwmapi.lib")
#pragma comment(lib, "Version.lib")
