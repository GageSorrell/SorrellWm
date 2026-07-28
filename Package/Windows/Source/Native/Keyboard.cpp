/**
 *
 *
 * @module @sorrell/windows/Native/Keyboard
 * @internal
 *
 * @file      Keyboard.cpp
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

#include "./Keyboard.h"
#include "./Result.h"

#include <bitset>
#include <cmath>
#include <cstdint>
#include <limits>
#include <memory>
#include <mutex>
#include <new>
#include <string>
#include <unordered_map>

namespace
{
    enum class KeyboardState
    {
        Down,
        Up
    };

    using SubId = std::uint32_t;

    struct KeyboardEventPayload
    {
        DWORD VirtualKeyCode;
        DWORD ScanCode;
        DWORD Flags;
        DWORD Time;
        KeyboardState State;
        bool IsRepeat;
    };

    struct KeyboardSubscription
    {
        KeyboardSubscription(
            napi_threadsafe_function InCallback
        ) :
            Callback(InCallback) { }

        ~KeyboardSubscription()
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

        napi_threadsafe_function Callback;
        bool IsActive = true;
        bool IsReleased = false;
    };

    HHOOK KeyboardHook = nullptr;
    std::bitset<256> PressedVirtualKeys;

    /* The virtual keys currently reserved by SorrellWm's configured hotkeys.
     * Read on the message-loop thread inside the hook procedure and written
     * from JavaScript (via SetSuppressedKeys), so access is mutex-guarded. */
    std::bitset<256> SuppressedVirtualKeys;
    std::mutex SuppressionMutex;

    std::mutex SubscriptionMutex;
    std::unordered_map<
        SubId,
        std::unique_ptr<KeyboardSubscription>
    > Subscriptions;
    SubId NextSubId = 1;

    void CallJavaScript(
        napi_env RawEnvironment,
        napi_value JavaScriptCallback,
        void*,
        void* Data
    )
    {
        std::unique_ptr<KeyboardEventPayload> Event(
            static_cast<KeyboardEventPayload*>(Data)
        );

        if (RawEnvironment == nullptr || JavaScriptCallback == nullptr)
        {
            return;
        }

        const Napi::Env Environment(RawEnvironment);
        const Napi::HandleScope Scope(Environment);
        Napi::Object Argument = Napi::Object::New(Environment);
        Argument.Set(
            "Vk",
            Napi::Number::New(Environment, Event->VirtualKeyCode)
        );
        Argument.Set(
            "ScanCode",
            Napi::Number::New(Environment, Event->ScanCode)
        );
        Argument.Set("Time", Napi::Number::New(Environment, Event->Time));
        Argument.Set(
            "IsKeyDown",
            Napi::Boolean::New(
                Environment,
                Event->State == KeyboardState::Down
            )
        );
        Argument.Set(
            "IsRepeat",
            Napi::Boolean::New(Environment, Event->IsRepeat)
        );
        Argument.Set(
            "IsExtended",
            Napi::Boolean::New(
                Environment,
                (Event->Flags & LLKHF_EXTENDED) != 0
            )
        );
        Argument.Set(
            "IsInjected",
            Napi::Boolean::New(
                Environment,
                (Event->Flags & LLKHF_INJECTED) != 0
            )
        );
        Argument.Set(
            "IsLowerIntegrityInjected",
            Napi::Boolean::New(
                Environment,
                (Event->Flags & LLKHF_LOWER_IL_INJECTED) != 0
            )
        );
        Argument.Set(
            "IsAltPressed",
            Napi::Boolean::New(
                Environment,
                (Event->Flags & LLKHF_ALTDOWN) != 0
            )
        );

        const Napi::Function Callback(Environment, JavaScriptCallback);
        Callback.Call({ Argument });
    }

    void DispatchKeyboardEvent(
        KeyboardState State,
        const KBDLLHOOKSTRUCT& KeyboardEvent,
        bool IsRepeat
    )
    {
        const std::lock_guard Lock(SubscriptionMutex);

        for (const auto& [ Identifier, Subscription ] : Subscriptions)
        {
            static_cast<void>(Identifier);

            if (!Subscription->IsActive)
            {
                continue;
            }

            auto* Event = new (std::nothrow) KeyboardEventPayload {
                KeyboardEvent.vkCode,
                KeyboardEvent.scanCode,
                KeyboardEvent.flags,
                KeyboardEvent.time,
                State,
                IsRepeat
            };

            if (Event == nullptr)
            {
                continue;
            }

            const napi_status Status = napi_call_threadsafe_function(
                Subscription->Callback,
                Event,
                napi_tsfn_nonblocking
            );

            if (Status != napi_ok)
            {
                delete Event;
            }
        }
    }

    bool IsSuppressedKey(DWORD VkCode)
    {
        if (VkCode >= SuppressedVirtualKeys.size())
        {
            return false;
        }

        const std::lock_guard Lock(SuppressionMutex);
        return SuppressedVirtualKeys.test(VkCode);
    }

    /* A hotkey should still reach the currently focused application when that
     * application is one of SorrellWm's own windows (e.g. typing normally in
     * the Settings window), so suppression only ever applies to some other,
     * unrelated foreground application. */
    bool IsForegroundWindowOwnedBySelf()
    {
        const HWND ForegroundWindow = GetForegroundWindow();

        if (ForegroundWindow == nullptr)
        {
            return false;
        }

        DWORD ForegroundProcessId = 0;
        GetWindowThreadProcessId(ForegroundWindow, &ForegroundProcessId);

        return ForegroundProcessId == GetCurrentProcessId();
    }

    LRESULT CALLBACK KeyboardHookProcedure(
        int Code,
        WPARAM WParameter,
        LPARAM LParameter
    )
    {
        bool ShouldSuppress = false;

        if (Code == HC_ACTION)
        {
            const auto* KeyboardEvent = reinterpret_cast<KBDLLHOOKSTRUCT*>(
                LParameter
            );

            if (WParameter == WM_KEYDOWN || WParameter == WM_SYSKEYDOWN)
            {
                const bool IsRepeat = PressedVirtualKeys.test(
                    KeyboardEvent->vkCode
                );
                PressedVirtualKeys.set(KeyboardEvent->vkCode);
                ShouldSuppress = IsSuppressedKey(KeyboardEvent->vkCode);
                DispatchKeyboardEvent(
                    KeyboardState::Down,
                    *KeyboardEvent,
                    IsRepeat
                );
            }
            else if (WParameter == WM_KEYUP || WParameter == WM_SYSKEYUP)
            {
                PressedVirtualKeys.reset(KeyboardEvent->vkCode);
                ShouldSuppress = IsSuppressedKey(KeyboardEvent->vkCode);
                DispatchKeyboardEvent(
                    KeyboardState::Up,
                    *KeyboardEvent,
                    false
                );
            }
        }

        if (ShouldSuppress && !IsForegroundWindowOwnedBySelf())
        {
            return 1;
        }

        return CallNextHookEx(
            KeyboardHook,
            Code,
            WParameter,
            LParameter
        );
    }
}

bool StartKeyboardHook(std::string& ErrorMessage)
{
    if (KeyboardHook != nullptr)
    {
        return true;
    }

    PressedVirtualKeys.reset();

    HMODULE Module = nullptr;
    const auto ProcedureAddress = reinterpret_cast<LPCWSTR>(
        reinterpret_cast<std::uintptr_t>(&KeyboardHookProcedure)
    );

    if (
        GetModuleHandleExW(
            GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS
                | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
            ProcedureAddress,
            &Module
        ) == FALSE
    )
    {
        ErrorMessage = "Could not locate the native keyboard-hook module: "
            + std::to_string(GetLastError());
        return false;
    }

    KeyboardHook = SetWindowsHookExW(
        WH_KEYBOARD_LL,
        KeyboardHookProcedure,
        Module,
        0
    );

    if (KeyboardHook == nullptr)
    {
        ErrorMessage = "Could not install the low-level keyboard hook: "
            + std::to_string(GetLastError());
        return false;
    }

    return true;
}

void StopKeyboardHook()
{
    if (KeyboardHook != nullptr)
    {
        UnhookWindowsHookEx(KeyboardHook);
        KeyboardHook = nullptr;
    }

    PressedVirtualKeys.reset();

    const std::lock_guard Lock(SuppressionMutex);
    SuppressedVirtualKeys.reset();
}

void CleanupKeyboardSubscriptions()
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

Napi::Value SubscribeToKeyboard(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (
        CallbackInfo.Length() != 1
        || !CallbackInfo[0].IsFunction()
    )
    {
        return Out.Fail(
            "Keyboard.Subscribe requires one callback."
        );
    }

    napi_value ResourceName = nullptr;
    napi_status Status = napi_create_string_utf8(
        Environment,
        "~sorrell/windows/Keyboard",
        NAPI_AUTO_LENGTH,
        &ResourceName
    );

    if (Status != napi_ok)
    {
        return Out.Fail("Could not create the keyboard callback resource.");
    }

    napi_threadsafe_function ThreadSafeCallback = nullptr;
    Status = napi_create_threadsafe_function(
        Environment,
        CallbackInfo[0],
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
        return Out.Fail("Could not create the keyboard callback.");
    }

    Status = napi_unref_threadsafe_function(Environment, ThreadSafeCallback);

    if (Status != napi_ok)
    {
        napi_release_threadsafe_function(
            ThreadSafeCallback,
            napi_tsfn_abort
        );
        return Out.Fail("Could not detach the keyboard callback.");
    }

    SubId Identifier = 0;
    std::unique_ptr<KeyboardSubscription> Subscription;

    try
    {
        Subscription = std::make_unique<KeyboardSubscription>(
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
            Identifier = NextSubId++;
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

Napi::Value UnsubscribeFromKeyboard(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsNumber())
    {
        return Out.Fail("Keyboard.Unsubscribe requires one subscription ID.");
    }

    const double NumId = CallbackInfo[0]
        .As<Napi::Number>()
        .DoubleValue();

    if (
        !std::isfinite(NumId)
        || std::trunc(NumId) != NumId
        || NumId <= 0
        || NumId > std::numeric_limits<SubId>::max()
    )
    {
        return Out.Fail("The keyboard subscription identifier is invalid.");
    }

    const auto Identifier = static_cast<SubId>(NumId);
    std::unique_ptr<KeyboardSubscription> RemovedSubscription;

    {
        const std::lock_guard Lock(SubscriptionMutex);
        const auto Subscription = Subscriptions.find(Identifier);

        if (Subscription == Subscriptions.end())
        {
            return Out.Fail("The keyboard subscription does not exist.");
        }

        Subscription->second->IsActive = false;
        RemovedSubscription = std::move(Subscription->second);
        Subscriptions.erase(Subscription);
    }

    RemovedSubscription->Release(napi_tsfn_abort);
    return Out.Succeed(Environment.Undefined());
}

Napi::Value SetSuppressedKeys(const Napi::CallbackInfo& CallbackInfo)
{
    const Napi::Env Environment = CallbackInfo.Env();
    Result Out(Environment);

    if (CallbackInfo.Length() != 1 || !CallbackInfo[0].IsArray())
    {
        return Out.Fail(
            "Keyboard.SetSuppressedKeys requires an array of virtual-key codes."
        );
    }

    const Napi::Array Keys = CallbackInfo[0].As<Napi::Array>();
    std::bitset<256> NewSuppressedKeys;

    for (std::uint32_t Index = 0; Index < Keys.Length(); ++Index)
    {
        const Napi::Value Element = Keys.Get(Index);

        if (!Element.IsNumber())
        {
            return Out.Fail("Every suppressed key must be a virtual-key code.");
        }

        const double NumericKey = Element.As<Napi::Number>().DoubleValue();

        if (
            !std::isfinite(NumericKey)
            || std::trunc(NumericKey) != NumericKey
            || NumericKey < 0
            || NumericKey >= static_cast<double>(NewSuppressedKeys.size())
        )
        {
            return Out.Fail("Every suppressed key must be a valid virtual-key code.");
        }

        NewSuppressedKeys.set(static_cast<std::size_t>(NumericKey));
    }

    {
        const std::lock_guard Lock(SuppressionMutex);
        SuppressedVirtualKeys = NewSuppressedKeys;
    }

    return Out.Succeed(Environment.Undefined());
}
