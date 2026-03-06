/* File:      InterProcessCommunication.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include <iostream>

/**
 * @TODO 3/5/26 8PM: Extend this class via a function exposed to Node that allows main
 * to *send* events to C++, and extend this class to act as a basic event emitter,
 * such that functions can be passed to this class, and be called when main sends
 * an event of the channel associated with that function.
 */
class FIpc
{
public:
    FIpc(Napi::Env Environment, Napi::Function InCallback) : Environment(Environment)
    {
        Callback = Napi::Persistent(InCallback);
    }

    void Send(std::string Channel, Napi::Value Message)
    {
        Napi::HandleScope Scope(Environment);

        // std::cout << "Sending IPC " + Channel + " with message." << std::endl;
        Callback.Call({ Napi::String::New(Environment, Channel), Message });
    }

    void Send(std::string Channel)
    {
        Napi::HandleScope Scope(Environment);

        // std::cout << "Sending IPC with no message on channel " + Channel + "." << std::endl;
        Callback.Call({ Napi::String::New(Environment, Channel) });
    }

    Napi::Env Env() const
    {
        return Environment;
    }

  private:
    Napi::FunctionReference Callback;
    Napi::Env Environment = NULL;
};
