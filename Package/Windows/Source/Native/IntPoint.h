
#pragma once

#include "./Core.h"

class IntPoint
{
public:
    IntPoint(int InX, int InY) : X(InX), Y(InY) { }

    Napi::Object ToNapi(const Napi::Env& Environment) const
    {
        Napi::Object Out = Napi::Object::New(Environment);
        Napi::Symbol TypeId = Napi::Symbol::For(Environment, TypeIdKey);

        Out.Set(TypeId, TypeId);
        Out.Set("X", X);
        Out.Set("Y", Y);

        return Out;
    }

    int X;
    int Y;
private:
    static constexpr const char* TypeIdKey = "~sorrell/math/Point/IntPoint";
};
