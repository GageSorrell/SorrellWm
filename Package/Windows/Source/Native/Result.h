/**
 * @file      Result.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include <napi.h>
#include <functional>

/**
 * An error-as-value approach to C++ exported functions failing.
 *
 * All exported native functions should return a `Result`, and all
 * error values should be `string`s.
 */
class Result
{
public:
    std::function<Napi::Object(Napi::Value)> Succeed;
    std::function<Napi::Object(Napi::Value)> Fail;

    Result(const Napi::Env Environment)
    {
        return Result{
            .Succeed =
                [Environment](const Napi::Value Value) -> Napi::Object
                {
                    return Make(Environment, "Success", Value);
                },

            .Fail =
                [Environment](std::string Value) -> Napi::Object
                {
                    return Make(Environment, "Failure", Napi::String::New(Environment, Value));
                }
        };
    }
private:
    static Napi::Object Make(const Napi::Env& Environment, std::string Tag, Napi::Value Value)
    {
        Napi::Symbol TypeId = Napi::Symbol::For(Environment, "~sorrell/windows/Internal/Result");
        Napi::Object Out = Napi::Object::New(Environment);
        Out.Set(TypeId, TypeId);
        Out.Set("_tag", Tag);
        Out.Set("Value", Value);
        return Out;
    }
}
