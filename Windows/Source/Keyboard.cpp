#include "Keyboard.h"

void RegisterActivationKey()
{
    if (RegisterHotKey(nullptr, 1, 0, VK_F22))
    {
        std::cout << "Registered activation key F22!" << std::endl;
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
