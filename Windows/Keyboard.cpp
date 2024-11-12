#include "Keyboard.h"

void RegisterActivationKey()
{
    if (RegisterHotKey(nullptr, 1, 0, VK_F22))
    {
        std::cout << "Registered activation key F22!" << std::endl;
    }
}

void KeyboardListener(MSG Message)
{

}
