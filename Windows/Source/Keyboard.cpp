/* File:      Keyboard.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#include "Keyboard.h"

HHOOK ActivationKeyHook = NULL;

LRESULT CALLBACK ActivationKeyProc(int nCode, WPARAM wParam, LPARAM lParam)
{
    if (nCode == HC_ACTION)
    {
        KBDLLHOOKSTRUCT *pKey = (KBDLLHOOKSTRUCT *)lParam;
        if (wParam == WM_KEYDOWN && pKey->vkCode == VK_OEM_PLUS)
        {
            std::cout << "Activation key pressed." << std::endl;
            // Perform your action here without consuming the key
        }
    }
    return CallNextHookEx(ActivationKeyHook, nCode, wParam, lParam); // Pass the key event along
}

HHOOK RegisterActivationKey()
{
    // @TODO Go back to using F22 once Moonlander is flashed
    // if (RegisterHotKey(nullptr, 1, 0, VK_F22))
    // if (RegisterHotKey(nullptr, 1, 0, VK_TAB))
    // {
    //     std::cout << "Registered activation key OEM_PLUS!" << std::endl;
    // }
    ActivationKeyHook = SetWindowsHookEx(WH_KEYBOARD_LL, ActivationKeyProc, NULL, 0);

    if (!ActivationKeyHook)
    {
        std::cerr << "Failed to install activation key hook." << std::endl;
    }

    return ActivationKeyHook;
}

void KeyboardListener(FMessage MessageProgress)
{
    if (MessageProgress.first.message == WM_HOTKEY && MessageProgress.first.wParam == 1)
    {
        std::string ActivationHotKey = "ActivationHotKey";
        MessageProgress.second.Send(&ActivationHotKey, 1);
    }
}
