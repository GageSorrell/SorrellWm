
#pragma once

#include "./Core.h"

std::optional<std::string> GetTag(const Napi::Object& Value);
bool IsTagged(std::string Tag, const Napi::Object& Value);
