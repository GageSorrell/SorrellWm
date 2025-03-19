/* File:      Keyboard.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "Keyboard.h"

#include "Core/Hook.h"

HHOOK ActivationKeyHook = NULL;

LRESULT CALLBACK KeyProc(int nCode, WPARAM wParam, LPARAM lParam)
{
    Napi::Env Environment = GGlobals::Ipc->Env();
    Napi::HandleScope Scope(Environment);

    if (nCode == HC_ACTION)
    {
        KBDLLHOOKSTRUCT* Key = (KBDLLHOOKSTRUCT*) lParam;

        const double VkCode = static_cast<double>(Key->vkCode);
        Napi::Number VirtualKeyCode = Napi::Number::New(Environment, VkCode);
        Napi::Object KeyboardEventPayload = Napi::Object::New(Environment);

        const std::string State = wParam == WM_KEYDOWN
            ? "Down"
            : "Up";

        KeyboardEventPayload.Set("State", State);
        KeyboardEventPayload.Set("VkCode", VirtualKeyCode);

        GGlobals::Ipc->Send("Keyboard", KeyboardEventPayload);
    }

    return CallNextHookEx(ActivationKeyHook, nCode, wParam, lParam);
}

void RegisterActivationKey()
{
    ActivationKeyHook = GGlobals::Hook->Register(WH_KEYBOARD_LL, KeyProc, NULL, 0);

    if (ActivationKeyHook == nullptr)
    {
        std::cerr << "Failed to install activation key hook." << std::endl;
    }
}
