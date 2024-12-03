#pragma once

#include <napi.h>
#include "../Core/Dispatcher.h"
#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <dwmapi.h>
#include <Windows.h>
#include <codecvt>
#include <map>
#include "js_native_api_types.h"

/**
 * Allows any function to step into the Win32 message loop.
 *
 * Nothing is sent to Node via this class; the `Napi::AsyncProgressQueueWorker` class
 * is just a simple way of running a Win32 message loop via the `node-addon-api`.
 */
class FMessageLoop : public Napi::AsyncProgressQueueWorker<int>, public TDispatcher<MSG>
{
public:
    FMessageLoop(Napi::Function OkCallback);

    ~FMessageLoop() { }

    void RegisterHook(HHOOK Hook);

    virtual void Execute(const Napi::AsyncProgressQueueWorker<int>::ExecutionProgress& Progress) override;

    /** This must be overridden so that `AsyncProgressQueueWorker` can be extended, but we don't use it. */
    virtual void OnProgress(const int* _Data, size_t Count) override;
};
