/**
 * @file      Result.h
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include <napi.h>
#include <string>

/**
 * An error-as-value approach to C++ exported functions failing.
 *
 * All exported native functions should return a `Result`, and all
 * error values should be `string`s.
 */
class Result
{
public:
    explicit Result(const Napi::Env& InEnvironment) : Environment(InEnvironment) { }

    Napi::Object Succeed(const Napi::Value& Value) const
    {
        return Make(Environment, "Success", Value);
    }

    Napi::Object Fail(const std::string& Value) const
    {
        return Make(Environment, "Failure", Napi::String::New(Environment, Value));
    }

private:
    Napi::Env Environment;

    static Napi::Object Make(
        const Napi::Env& Environment,
        const std::string& Tag,
        const Napi::Value& Value
    )
    {
        Napi::Symbol TypeId = Napi::Symbol::For(
            Environment,
            "~sorrell/windows/Internal/Attempt"
        );
        Napi::Object Out = Napi::Object::New(Environment);
        Out.Set(TypeId, TypeId);
        Out.Set("_tag", Tag);
        Out.Set("Value", Value);
        return Out;
    }
};
