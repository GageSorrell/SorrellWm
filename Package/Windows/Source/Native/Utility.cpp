
#include "./Utility.h"

std::optional<std::string> GetTag(const Napi::Object& Value)
{
    const Napi::Value TagValue = Value.Get("_tag");

    if (!Value.Has("_tag") || !TagValue.IsString())
    {
        return std::nullopt;
    }

    return TagValue.As<Napi::String>().Utf8Value();
}

bool IsTagged(std::string Tag, const Napi::Object& Value)
{
    if (!Value.Has("_tag"))
    {
        return false;
    }

    const Napi::Value TagValue = Value.Get("_tag");

    if (!TagValue.IsString())
    {
        return false;
    }

    return TagValue.As<Napi::String>().Utf8Value() == Tag;
}
