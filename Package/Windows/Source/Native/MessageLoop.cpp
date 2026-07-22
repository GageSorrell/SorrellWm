/**
 *
 *
 * @module @sorrell/windows/Native/MessageLoop
 * @internal
 *
 * @file      MessageLoop.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./MessageLoop.h"
#include "./IntPoint.h"
#include "./Keyboard.h"
#include "./Result.h"

#include <cmath>
#include <condition_variable>
#include <cstdint>
#include <exception>
#include <limits>
#include <memory>
#include <mutex>
#include <new>
#include <string>
#include <thread>
#include <unordered_map>

namespace
{
    using SubscriptionIdentifier = std::uint32_t;

    struct MessageSubscription
    {
        MessageSubscription(
            UINT InChannel,
            napi_threadsafe_function InCallback
        ) : Channel(InChannel), Callback(InCallback) { }

        ~MessageSubscription()
        {
            Release(napi_tsfn_release);
        }

        void Release(napi_threadsafe_function_release_mode Mode)
        {
            if (!IsReleased)
            {
                napi_release_threadsafe_function(Callback, Mode);
                IsReleased = true;
            }
        }

        UINT Channel;
        napi_threadsafe_function Callback;
        bool IsActive = true;
        bool IsReleased = false;
    };

    std::condition_variable StateChanged;
    std::mutex StateMutex;
    std::thread MessageLoopThread;
    DWORD MessageLoopThreadIdentifier = 0;
    bool IsMessageLoopRunning = false;
    bool IsMessageLoopStarting = false;
    std::string MessageLoopStartError;

    std::mutex SubscriptionMutex;
    std::unordered_map<
        SubscriptionIdentifier,
        std::unique_ptr<MessageSubscription>
    > Subscriptions;
    SubscriptionIdentifier NextSubscriptionIdentifier = 1;

    Napi::Object MessageToNapi(
        const Napi::Env& Environment,
        const MSG& Message
    )
    {
        Napi::Object Out = Napi::Object::New(Environment);

        if (Message.hwnd == nullptr)
        {
            Out.Set("WindowHandle", Environment.Null());
        }
        else
        {
            const auto NumericHandle = static_cast<std::uint64_t>(
                reinterpret_cast<std::uintptr_t>(Message.hwnd)
            );
            Out.Set(
                "WindowHandle",
                Napi::BigInt::New(Environment, NumericHandle)
            );
        }

        Out.Set("Message", Napi::Number::New(Environment, Message.message));
        Out.Set(
            "WParameter",
            Napi::BigInt::New(
                Environment,
                static_cast<std::uint64_t>(Message.wParam)
            )
        );
        Out.Set(
            "LParameter",
            Napi::BigInt::New(
                Environment,
                static_cast<std::int64_t>(Message.lParam)
            )
        );
        Out.Set("Time", Napi::Number::New(Environment, Message.time));
        Out.Set(
            "Position",
            IntPoint(Message.pt.x, Message.pt.y).ToNapi(Environment)
        );

        return Out;
    }

    Napi::Value MessageArgumentToNapi(
        const Napi::Env& Environment,
        const MSG& Message
    )
    {
        switch (Message.message)
        {
            case WM_MOVE:
            {
                const int X = static_cast<short>(LOWORD(Message.lParam));
                const int Y = static_cast<short>(HIWORD(Message.lParam));
                return IntPoint(X, Y).ToNapi(Environment);
            }
            default:
                return MessageToNapi(Environment, Message);
        }
    }

    void CallJavaScript(
        napi_env RawEnvironment,
        napi_value JavaScriptCallback,
        void*,
        void* Data
    )
    {
        std::unique_ptr<MSG> Message(static_cast<MSG*>(Data));

        if (RawEnvironment == nullptr || JavaScriptCallback == nullptr)
        {
            return;
        }

        const Napi::Env Environment(RawEnvironment);
        const Napi::HandleScope Scope(Environment);
        const Napi::Function Callback(Environment, JavaScriptCallback);
        Callback.Call({ MessageArgumentToNapi(Environment, *Message) });
    }

    void DispatchToSubscribers(const MSG& Message)
    {
        const std::lock_guard Lock(SubscriptionMutex);

        for (const auto& [ Identifier, Subscription ] : Subscriptions)
        {
            static_cast<void>(Identifier);

            if (
                Subscription->IsActive
                && Subscription->Channel == Message.message
            )
            {
                MSG* MessageCopy = new (std::nothrow) MSG(Message);

                if (MessageCopy == nullptr)
                {
                    continue;
                }

                const napi_status Status = napi_call_threadsafe_function(
                    Subscription->Callback,
                    MessageCopy,
                    napi_tsfn_nonblocking
                );

                if (Status != napi_ok)
                {
                    delete MessageCopy;
                }
            }
        }
    }

    void ClearSubscriptions()
    {
        const std::lock_guard Lock(SubscriptionMutex);

        for (const auto& [ Identifier, Subscription ] : Subscriptions)
        {
            static_cast<void>(Identifier);
            Subscription->IsActive = false;
            Subscription->Release(napi_tsfn_abort);
        }

        Subscriptions.clear();
    }

    void RunMessageLoop()
    {
        MSG Message { };

        /* Calling PeekMessage creates this thread's message queue before Start
         * returns, so PostThreadMessage can be used without a startup race. */
        PeekMessageW(&Message, nullptr, WM_USER, WM_USER, PM_NOREMOVE);

        std::string KeyboardHookError;

        if (!StartKeyboardHook(KeyboardHookError))
        {
            {
                const std::lock_guard Lock(StateMutex);
                MessageLoopStartError = KeyboardHookError;
                IsMessageLoopStarting = false;
            }

            StateChanged.notify_all();
            return;
        }

        {
            const std::lock_guard Lock(StateMutex);
            MessageLoopThreadIdentifier = GetCurrentThreadId();
            IsMessageLoopRunning = true;
            IsMessageLoopStarting = false;
        }

        StateChanged.notify_all();

        int GetMessageResult = 0;

        while ((GetMessageResult = GetMessageW(&Message, nullptr, 0, 0)) > 0)
        {
            DispatchToSubscribers(Message);
            TranslateMessage(&Message);
            DispatchMessageW(&Message);
        }

        StopKeyboardHook();

        {
            const std::lock_guard Lock(StateMutex);
            MessageLoopThreadIdentifier = 0;
            IsMessageLoopRunning = false;
        }

        StateChanged.notify_all();
    }

    bool StopMessageLoopInternal(std::string& ErrorMessage)
    {
        DWORD ThreadIdentifier = 0;

        {
            std::unique_lock Lock(StateMutex);
            StateChanged.wait(Lock, []() -> bool
            {
                return !IsMessageLoopStarting;
            });

            if (!IsMessageLoopRunning || !MessageLoopThread.joinable())
            {
                if (MessageLoopThread.joinable())
                {
                    Lock.unlock();
                    MessageLoopThread.join();
                }

                ErrorMessage = "The native message loop is not running.";
                return false;
            }

            ThreadIdentifier = MessageLoopThreadIdentifier;
        }

        if (PostThreadMessageW(ThreadIdentifier, WM_QUIT, 0, 0) == FALSE)
        {
            ErrorMessage = "Could not post WM_QUIT to the native message loop.";
            return false;
        }

        MessageLoopThread.join();
        return true;
    }
}

Napi::Value StartMessageLoop(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    std::unique_lock Lock(StateMutex);

    if (IsMessageLoopStarting || IsMessageLoopRunning)
    {
        return Out.Fail("The native message loop is already running.");
    }

    if (MessageLoopThread.joinable())
    {
        Lock.unlock();
        MessageLoopThread.join();
        Lock.lock();
    }

    IsMessageLoopStarting = true;
    MessageLoopStartError.clear();

    try
    {
        MessageLoopThread = std::thread(RunMessageLoop);
    }
    catch (const std::exception& Error)
    {
        IsMessageLoopStarting = false;
        StateChanged.notify_all();
        return Out.Fail(Error.what());
    }

    StateChanged.wait(Lock, []() -> bool
    {
        return !IsMessageLoopStarting;
    });

    if (!IsMessageLoopRunning)
    {
        const std::string ErrorMessage = MessageLoopStartError.empty()
            ? "The native message loop could not be started."
            : MessageLoopStartError;
        Lock.unlock();
        MessageLoopThread.join();
        return Out.Fail(ErrorMessage);
    }

    return Out.Succeed(Napi::Number::New(
        Environment,
        static_cast<double>(MessageLoopThreadIdentifier)
    ));
}

Napi::Value StopMessageLoop(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);
    std::string ErrorMessage;

    if (!StopMessageLoopInternal(ErrorMessage))
    {
        return Out.Fail(ErrorMessage);
    }

    return Out.Succeed(Environment.Undefined());
}

Napi::Value SubscribeToMessageLoop(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (
        CallbackInfo.Length() != 2
        || !CallbackInfo[0].IsNumber()
        || !CallbackInfo[1].IsFunction()
    )
    {
        return Out.Fail(
            "Subscribe requires a message identifier and a callback function."
        );
    }

    const double NumericChannel = CallbackInfo[0]
        .As<Napi::Number>()
        .DoubleValue();

    if (
        !std::isfinite(NumericChannel)
        || std::trunc(NumericChannel) != NumericChannel
        || NumericChannel < 0
        || NumericChannel > std::numeric_limits<UINT>::max()
    )
    {
        return Out.Fail(
            "The message identifier must be a valid Win32 message value."
        );
    }

    const auto Channel = static_cast<UINT>(NumericChannel);

    napi_value ResourceName = nullptr;
    napi_status Status = napi_create_string_utf8(
        Environment,
        "@sorrell/windows/MessageLoop",
        NAPI_AUTO_LENGTH,
        &ResourceName
    );

    if (Status != napi_ok)
    {
        return Out.Fail("Could not create the message-loop callback resource.");
    }

    napi_threadsafe_function ThreadSafeCallback = nullptr;
    Status = napi_create_threadsafe_function(
        Environment,
        CallbackInfo[1],
        nullptr,
        ResourceName,
        0,
        1,
        nullptr,
        nullptr,
        nullptr,
        CallJavaScript,
        &ThreadSafeCallback
    );

    if (Status != napi_ok)
    {
        return Out.Fail("Could not create the message-loop callback.");
    }

    Status = napi_unref_threadsafe_function(Environment, ThreadSafeCallback);

    if (Status != napi_ok)
    {
        napi_release_threadsafe_function(
            ThreadSafeCallback,
            napi_tsfn_abort
        );
        return Out.Fail("Could not detach the message-loop callback.");
    }

    SubscriptionIdentifier Identifier = 0;
    std::unique_ptr<MessageSubscription> Subscription;

    try
    {
        Subscription = std::make_unique<MessageSubscription>(
            Channel,
            ThreadSafeCallback
        );
    }
    catch (const std::exception& Error)
    {
        napi_release_threadsafe_function(
            ThreadSafeCallback,
            napi_tsfn_abort
        );
        return Out.Fail(Error.what());
    }

    try
    {
        const std::lock_guard Lock(SubscriptionMutex);

        do
        {
            Identifier = NextSubscriptionIdentifier++;
        }
        while (Identifier == 0 || Subscriptions.contains(Identifier));

        Subscriptions.emplace(Identifier, std::move(Subscription));
    }
    catch (const std::exception& Error)
    {
        return Out.Fail(Error.what());
    }

    return Out.Succeed(Napi::Number::New(Environment, Identifier));
}

Napi::Value UnsubscribeFromMessageLoop(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsNumber())
    {
        return Out.Fail("Unsubscribe requires one subscription identifier.");
    }

    const double NumericIdentifier = CallbackInfo[0]
        .As<Napi::Number>()
        .DoubleValue();

    if (
        !std::isfinite(NumericIdentifier)
        || std::trunc(NumericIdentifier) != NumericIdentifier
        || NumericIdentifier <= 0
        || NumericIdentifier > std::numeric_limits<SubscriptionIdentifier>::max()
    )
    {
        return Out.Fail("The message-loop subscription identifier is invalid.");
    }

    const auto Identifier = static_cast<SubscriptionIdentifier>(
        NumericIdentifier
    );
    std::unique_ptr<MessageSubscription> RemovedSubscription;

    {
        const std::lock_guard Lock(SubscriptionMutex);
        const auto Subscription = Subscriptions.find(Identifier);

        if (Subscription == Subscriptions.end())
        {
            return Out.Fail("The message-loop subscription does not exist.");
        }

        Subscription->second->IsActive = false;
        RemovedSubscription = std::move(Subscription->second);
        Subscriptions.erase(Subscription);
    }

    RemovedSubscription->Release(napi_tsfn_abort);
    return Out.Succeed(Environment.Undefined());
}

void CleanupMessageLoop(void*)
{
    std::string ErrorMessage;
    StopMessageLoopInternal(ErrorMessage);
    CleanupKeyboardSubscriptions();
    ClearSubscriptions();
}
