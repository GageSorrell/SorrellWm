/* File:      InterProcessCommunication.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include <iostream>

DECLARE_NAPI_FUNCTION(SendNativeIpc, void, Channel, string, Payload, FRecord | undefined);

typedef std::function<void (const Napi::Env&, const Napi::Value&)> FIpcCallback;
typedef std::unordered_map<int, FIpcCallback> FIpcCallbacks;
typedef std::unordered_map<std::string, FIpcCallbacks> FBoundFunctions;

/**
 * @TODO 3/5/26 8PM: Extend this class via a function exposed to Node that allows main
 * to *send* events to C++, and extend this class to act as a basic event emitter,
 * such that functions can be passed to this class, and be called when main sends
 * an event of the channel associated with that function.
 */
class FIpc
{
public:
    FIpc(Napi::Env Environment, Napi::Function InCallback);

    int Bind(const std::string& Channel, const FIpcCallback& Callback);
    void Unbind(int Id);
    void Broadcast(const std::string& Channel, const Napi::Env& InEnvironment, const Napi::Value& Payload);

    void Send(const std::string& Channel, const Napi::Value& Message);
    void Send(const std::string& Channel);

    Napi::Env Env() const;
private:
    Napi::FunctionReference Callback;
    Napi::Env Environment = NULL;
    FBoundFunctions BoundFunctions;
};
