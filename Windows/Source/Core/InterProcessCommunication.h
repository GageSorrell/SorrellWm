#pragma once

#include "Core.h"
#include <iostream>

class FIpc
{
public:
    FIpc(Napi::Env Environment, Napi::Function InCallback) : Environment(Environment)
    {
        Callback = Napi::Persistent(InCallback);
    }

    void Send(std::string Channel, Napi::Object Message)
    {
        Napi::HandleScope Scope(Environment);

        std::cout << "Sending IPC " + Channel + " with message." << std::endl;
        Callback.Call({Napi::String::New(Environment, Channel), Message});
    }

    void Send(std::string Channel)
    {
        Napi::HandleScope Scope(Environment);

        std::cout << "Sending IPC with no message on channel " + Channel + "." << std::endl;
        Callback.Call({ Napi::String::New(Environment, Channel) });
    }

  private:
    Napi::FunctionReference Callback;
    Napi::Env Environment = NULL;
};
