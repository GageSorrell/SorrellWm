/* File:      InterProcessCommunication.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"
#include <iostream>

DECLARE_NAPI_FUNCTION(SendNativeIpc, void, Channel, string, Payload, FRecord | undefined);
DECLARE_NAPI_FUNCTION(InitializeIpc, void, OnMessage, FOnIpcMessage);
DECLARE_NAPI_FUNCTION(TestIpc, void);

struct FDelegateHandle
{
public:
    FDelegateHandle(int HandleId) : Id(HandleId) { }
    FDelegateHandle() : Id(0) { }

    operator int() const
    {
        return Id;
    }

    operator bool() const
    {
        return Id == 0;
    }

    bool operator ==(const FDelegateHandle& Other) const
    {
        return Get() == Other.Get();
    }

    int Get() const
    {
        return Id;
    }
private:
    int Id;
};

typedef std::function<void (const Napi::Env&, const Napi::Value&)> FIpcCallback;

class FIpc
{
public:
    FIpc(Napi::Env Environment, Napi::Function InOnMessage);

    struct FCallbackWrapper
    {
        FCallbackWrapper(bool bInCallOnce, const FIpcCallback& InCallback);

        bool bCallOnce;
        FIpcCallback Callback;
        FDelegateHandle Handle;
    };

    typedef TMap<FString, std::vector<FCallbackWrapper>> FBoundFunctions;

    void Send(const FString& Channel, const Napi::Value& Payload);
    void Send(const FString& Channel);

    FDelegateHandle Bind(const FString& Channel, const FIpcCallback& Callback);
    FDelegateHandle BindOnce(const FString& Channel, const FIpcCallback& Callback);
    void Unbind(const FDelegateHandle& Handle);

    bool IsBound(const FDelegateHandle& Handle) const;

    Napi::Env Env() const;

    void Broadcast(const FString& Channel, const Napi::Value& Payload);
private:
    Napi::FunctionReference OnMessage;
    Napi::Env Environment = NULL;
    FBoundFunctions BoundFunctions;
    FDelegateHandle BindBase(const FString& Channel, const FIpcCallback& Callback, bool bCallOnce);
};
