#include "Keyboard.h"

void RegisterActivationKey()
{
    // @TODO Go back to using F22 once Moonlander is flashed
    // if (RegisterHotKey(nullptr, 1, 0, VK_F22))
    if (RegisterHotKey(nullptr, 1, 0, VK_OEM_PLUS))
    {
        std::cout << "Registered activation key OEM_PLUS!" << std::endl;
    }
}

void KeyboardListener(std::pair<MSG, const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress&> MessageProgress)
{
    if (MessageProgress.first.message == WM_HOTKEY && MessageProgress.first.wParam == 1)
    {
        std::string ActivationHotKey = "ActivationHotKey";
        MessageProgress.second.Send(&ActivationHotKey, 1);
    }
}
