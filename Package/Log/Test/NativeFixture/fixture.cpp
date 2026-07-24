/**
 *
 *
 * @module @sorrell/log/Test/NativeFixture/fixture
 *
 * @file      fixture.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include <napi.h>
#include <sorrell/log.hpp>

#include <cstdint>
#include <string>
#include <thread>
#include <vector>

namespace
{
    Napi::Value Emit(const Napi::CallbackInfo& Info)
    {
        const Napi::Env Environment = Info.Env();
        if (Info.Length() < 4
            || !Info[0].IsFunction()
            || !Info[1].IsNumber()
            || !Info[2].IsNumber()
            || !Info[3].IsNumber())
        {
            Napi::TypeError::New(
                Environment,
                "Emit requires callback, count, thread count, and queue size."
            ).ThrowAsJavaScriptException();
            return Environment.Undefined();
        }

        const std::uint32_t Count = Info[1].As<Napi::Number>().Uint32Value();
        const std::uint32_t ThreadCount = Info[2].As<Napi::Number>().Uint32Value();
        const std::uint32_t QueueSize = Info[3].As<Napi::Number>().Uint32Value();
        Sorrell::Log::Bridge Logger = Sorrell::Log::Bridge::Create(
            Environment,
            Info[0].As<Napi::Function>(),
            {
                .MaximumQueueSize = QueueSize,
                .DefaultCategory = "Native"
            }
        );

        auto Publish = [&Logger, Count](const std::uint32_t ThreadIndex)
        {
            for (std::uint32_t Index = 0; Index < Count; ++Index)
            {
                Logger.Info(
                    "Fixture.Worker",
                    "Native worker record",
                    {
                        Sorrell::Log::Field(
                            "Index",
                            static_cast<std::uint64_t>(Index)
                        ),
                        Sorrell::Log::Field(
                            "Thread",
                            static_cast<std::uint64_t>(ThreadIndex)
                        )
                    }
                );
            }
        };

        if (ThreadCount == 0)
        {
            Publish(0);
        }
        else
        {
            std::vector<std::thread> Threads;
            Threads.reserve(ThreadCount);
            for (std::uint32_t Index = 0; Index < ThreadCount; ++Index)
            {
                Threads.emplace_back(Publish, Index);
            }

            for (std::thread& Thread : Threads)
            {
                Thread.join();
            }
        }

        const std::uint64_t Dropped = Logger.DroppedCount();
        Logger.Close();
        return Napi::BigInt::New(Environment, Dropped);
    }

    Napi::Object Initialize(
        const Napi::Env Environment,
        Napi::Object Exports
    )
    {
        Exports.Set("Emit", Napi::Function::New(Environment, Emit));
        return Exports;
    }
}

NODE_API_MODULE(SorrellLogNativeFixture, Initialize)
