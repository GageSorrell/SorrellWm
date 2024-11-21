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
        // @TODO Go back to using F22 once Moonlander is flashed
        if (pKey->vkCode == VK_OEM_PLUS)
        {
            if (wParam == WM_KEYDOWN)
            {
                GGlobals::Ipc->Send("ActivationKeyDown");
            }
            else if (wParam == WM_KEYUP)
            {
                GGlobals::Ipc->Send("ActivationKeyUp");
            }
        }
    }
    return CallNextHookEx(ActivationKeyHook, nCode, wParam, lParam); // Pass the key event along
}

void RegisterActivationKey()
{
    // if (RegisterHotKey(nullptr, 1, 0, VK_F22))
    // if (RegisterHotKey(nullptr, 1, 0, VK_TAB))
    // {
    //     std::cout << "Registered activation key OEM_PLUS!" << std::endl;
    // }
    // ActivationKeyHook = SetWindowsHookEx(WH_KEYBOARD_LL, ActivationKeyProc, NULL, 0);

    ActivationKeyHook = GGlobals::Hook->Register(WH_KEYBOARD_LL, ActivationKeyProc, NULL, 0);
    if (!ActivationKeyHook)
    {
        std::cerr << "Failed to install activation key hook." << std::endl;
    }
}
