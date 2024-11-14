#pragma once

#include <napi.h>
#include "../Core/EventDispatcher.h"
#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <dwmapi.h>
#include <Windows.h>
#include <codecvt>
#include <map>
#include "js_native_api_types.h"


typedef std::pair<MSG, const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress&> FMessage;
typedef std::function<void(FMessage)> FMessageCallback;

class FMessageLoop : public Napi::AsyncProgressQueueWorker<std::string>, public FEventDispatcher<FMessage>
{
public:
    FMessageLoop(
        Napi::Function& OkCallback,
        Napi::Function& ErrorCallback,
        Napi::Function& ProgressCallback,
        Napi::Env& Environment
    );

    ~FMessageLoop() { }

    void RegisterHook(HHOOK Hook);

    virtual void Execute(const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress& Progress) override;

    virtual void OnOK();

    virtual void OnProgress(const std::string* Data, size_t Count) override;
private:
    Napi::FunctionReference ProgressCallback;
    Napi::FunctionReference ErrorCallback;
    Napi::Env Environment;
    void UnhookHooks();
    std::vector<HHOOK> Hooks;
};
