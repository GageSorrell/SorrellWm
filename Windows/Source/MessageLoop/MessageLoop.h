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

class FMessageLoop : public Napi::AsyncProgressQueueWorker<std::string>, public FEventDispatcher<std::pair<MSG, const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress&>>
{
public:
    FMessageLoop(
        Napi::Function& OkCallback,
        Napi::Function& ErrorCallback,
        Napi::Function& ProgressCallback,
        Napi::Env& Environment
    );

    ~FMessageLoop() { }

    virtual void Execute(const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress& Progress) override;

    virtual void OnOK();

    virtual void OnProgress(const std::string* Data, size_t Count) override;
private:
    Napi::FunctionReference ProgressCallback;
    Napi::FunctionReference ErrorCallback;
    Napi::Env Environment;
};
