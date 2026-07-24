/**
 *
 *
 * @module @sorrell/log/native/include/sorrell/log
 *
 * @file      log.hpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#pragma once

#include "log_record.hpp"

#include <napi.h>

#include <atomic>
#include <cstddef>
#include <cstdint>
#include <iomanip>
#include <memory>
#include <sstream>
#include <string>
#include <thread>
#include <type_traits>
#include <utility>
#include <vector>

namespace Sorrell::Log
{
    namespace Detail
    {
        inline const char* ToString(const Level Value) noexcept
        {
            switch (Value)
            {
                case Level::Fatal: return "Fatal";
                case Level::Error: return "Error";
                case Level::Warn: return "Warn";
                case Level::Info: return "Info";
                case Level::Debug: return "Debug";
                case Level::Trace: return "Trace";
            }

            return "Info";
        }

        inline Napi::Value ToJavaScript(
            const Napi::Env Environment,
            const FieldValue& Value
        )
        {
            return std::visit(
                [Environment](const auto& Current) -> Napi::Value
                {
                    using ValueType = std::decay_t<decltype(Current)>;

                    if constexpr (std::is_same_v<ValueType, std::nullptr_t>)
                    {
                        return Environment.Null();
                    }
                    else if constexpr (std::is_same_v<ValueType, bool>)
                    {
                        return Napi::Boolean::New(Environment, Current);
                    }
                    else if constexpr (std::is_same_v<ValueType, std::int64_t>)
                    {
                        return Napi::BigInt::New(Environment, Current);
                    }
                    else if constexpr (std::is_same_v<ValueType, std::uint64_t>)
                    {
                        return Napi::BigInt::New(Environment, Current);
                    }
                    else if constexpr (std::is_same_v<ValueType, double>)
                    {
                        return Napi::Number::New(Environment, Current);
                    }
                    else
                    {
                        return Napi::String::New(Environment, Current);
                    }
                },
                Value
            );
        }

        inline void CallJavaScript(
            const Napi::Env Environment,
            const Napi::Function Callback,
            std::nullptr_t*,
            Record* Data
        )
        {
            const std::unique_ptr<Record> Owned(Data);

            if (Environment == nullptr || Callback.IsEmpty() || Owned == nullptr)
            {
                return;
            }

            const Napi::HandleScope Scope(Environment);
            Napi::Object Object = Napi::Object::New(Environment);
            Object.Set("Level", Napi::String::New(
                Environment,
                ToString(Owned->Severity)
            ));
            Object.Set("Category", Napi::String::New(
                Environment,
                Owned->Category
            ));
            Object.Set("Message", Napi::String::New(
                Environment,
                Owned->Message
            ));

            Napi::Object Fields = Napi::Object::New(Environment);
            for (const Field& Current : Owned->Fields)
            {
                Fields.Set(Current.Name, ToJavaScript(Environment, Current.Value));
            }
            Object.Set("Fields", Fields);

            if (Owned->ThreadIdentifier.has_value())
            {
                Object.Set("ThreadIdentifier", Napi::String::New(
                    Environment,
                    *Owned->ThreadIdentifier
                ));
            }

            Callback.Call({ Object });
        }
    }

    struct BridgeOptions
    {
        std::size_t MaximumQueueSize = 1024;
        std::string DefaultCategory = "Native";
    };

    class Bridge final
    {
    private:
        using ThreadSafeFunction = Napi::TypedThreadSafeFunction<
            std::nullptr_t,
            Record,
            Detail::CallJavaScript
        >;

        struct State final
        {
            explicit State(
                ThreadSafeFunction FunctionValue,
                std::string Category
            )
                : Function(std::move(FunctionValue)),
                  DefaultCategory(std::move(Category))
            {
            }

            ThreadSafeFunction Function;
            std::string DefaultCategory;
            std::atomic<bool> Accepting{ true };
            std::atomic<bool> Released{ false };
            std::atomic<std::size_t> InFlight{ 0 };
            std::atomic<std::uint64_t> Dropped{ 0 };
        };

    public:
        Bridge() = default;

        Bridge(const Bridge&) = delete;
        Bridge& operator=(const Bridge&) = delete;

        Bridge(Bridge&& Other) noexcept
            : StateValue(std::move(Other.StateValue))
        {
        }

        Bridge& operator=(Bridge&& Other) noexcept
        {
            if (this != &Other)
            {
                Close();
                StateValue = std::move(Other.StateValue);
            }
            return *this;
        }

        ~Bridge()
        {
            Close();
        }

        static Bridge Create(
            const Napi::Env Environment,
            const Napi::Function JavaScriptCallback,
            BridgeOptions Options = { }
        )
        {
            ThreadSafeFunction Function = ThreadSafeFunction::New(
                Environment,
                JavaScriptCallback,
                "SorrellLogBridge",
                Options.MaximumQueueSize,
                1
            );

            return Bridge(std::make_unique<State>(
                std::move(Function),
                std::move(Options.DefaultCategory)
            ));
        }

        void Fatal(
            std::string Category,
            std::string Message,
            std::vector<Field> Fields = { }
        ) const noexcept
        {
            Publish(Level::Fatal, std::move(Category), std::move(Message), std::move(Fields));
        }

        void Error(
            std::string Category,
            std::string Message,
            std::vector<Field> Fields = { }
        ) const noexcept
        {
            Publish(Level::Error, std::move(Category), std::move(Message), std::move(Fields));
        }

        void Warn(
            std::string Category,
            std::string Message,
            std::vector<Field> Fields = { }
        ) const noexcept
        {
            Publish(Level::Warn, std::move(Category), std::move(Message), std::move(Fields));
        }

        void Info(
            std::string Category,
            std::string Message,
            std::vector<Field> Fields = { }
        ) const noexcept
        {
            Publish(Level::Info, std::move(Category), std::move(Message), std::move(Fields));
        }

        void Debug(
            std::string Category,
            std::string Message,
            std::vector<Field> Fields = { }
        ) const noexcept
        {
            Publish(Level::Debug, std::move(Category), std::move(Message), std::move(Fields));
        }

        void Trace(
            std::string Category,
            std::string Message,
            std::vector<Field> Fields = { }
        ) const noexcept
        {
            Publish(Level::Trace, std::move(Category), std::move(Message), std::move(Fields));
        }

        void Close() noexcept
        {
            State* Current = StateValue.get();
            if (Current == nullptr || Current->Released.exchange(true))
            {
                return;
            }

            Current->Accepting.store(false, std::memory_order_release);
            while (Current->InFlight.load(std::memory_order_acquire) != 0)
            {
                std::this_thread::yield();
            }

            Current->Function.Release();
        }

        [[nodiscard]] std::uint64_t DroppedCount() const noexcept
        {
            return StateValue == nullptr
                ? 0
                : StateValue->Dropped.load(std::memory_order_relaxed);
        }

    private:
        explicit Bridge(std::unique_ptr<State> StateInput)
            : StateValue(std::move(StateInput))
        {
        }

        [[nodiscard]] bool QueueOne(std::unique_ptr<Record> Value) const noexcept
        {
            State* Current = StateValue.get();
            if (Current == nullptr
                || !Current->Accepting.load(std::memory_order_acquire))
            {
                return false;
            }

            Current->InFlight.fetch_add(1, std::memory_order_acq_rel);
            if (!Current->Accepting.load(std::memory_order_acquire))
            {
                Current->InFlight.fetch_sub(1, std::memory_order_acq_rel);
                return false;
            }

            Record* RawValue = Value.release();
            const napi_status Status = Current->Function.NonBlockingCall(RawValue);
            Current->InFlight.fetch_sub(1, std::memory_order_acq_rel);

            if (Status == napi_ok)
            {
                return true;
            }

            delete RawValue;
            if (Status == napi_queue_full)
            {
                Current->Dropped.fetch_add(1, std::memory_order_relaxed);
            }
            else if (Status == napi_closing)
            {
                Current->Accepting.store(false, std::memory_order_release);
            }

            return false;
        }

        void Publish(
            const Level Severity,
            std::string Category,
            std::string Message,
            std::vector<Field> Fields
        ) const noexcept
        {
            State* Current = StateValue.get();
            if (Current == nullptr
                || !Current->Accepting.load(std::memory_order_acquire))
            {
                return;
            }

            const std::uint64_t Dropped = Current->Dropped.exchange(
                0,
                std::memory_order_acq_rel
            );
            if (Dropped > 0)
            {
                auto Summary = std::make_unique<Record>();
                Summary->Severity = Level::Warn;
                Summary->Category = Current->DefaultCategory;
                Summary->Message = "Dropped native log records because the bridge queue was full.";
                Summary->Fields.emplace_back("Dropped", Dropped);

                if (!QueueOne(std::move(Summary)))
                {
                    Current->Dropped.fetch_add(Dropped, std::memory_order_relaxed);
                }
            }

            auto Value = std::make_unique<Record>();
            Value->Severity = Severity;
            Value->Category = Category.empty()
                ? Current->DefaultCategory
                : std::move(Category);
            Value->Message = std::move(Message);
            Value->Fields = std::move(Fields);
            static_cast<void>(QueueOne(std::move(Value)));
        }

        std::unique_ptr<State> StateValue;
    };

    inline Field WindowsErrorCode(const std::uint32_t ErrorCode)
    {
        return Field("WindowsErrorCode", static_cast<std::uint64_t>(ErrorCode));
    }

    inline std::string FormatPointer(const void* Value)
    {
        std::ostringstream Stream;
        Stream << "0x"
               << std::hex
               << std::uppercase
               << reinterpret_cast<std::uintptr_t>(Value);
        return Stream.str();
    }

    inline Field Pointer(std::string Name, const void* Value)
    {
        return Field(std::move(Name), FormatPointer(Value));
    }
}
