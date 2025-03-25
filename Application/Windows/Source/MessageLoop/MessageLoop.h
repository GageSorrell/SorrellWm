#pragma once

#include "../Core/Core.h"
#include <iostream>
#include "../Core/Dispatcher.h"
#include <sstream>
#include <iomanip>
#include <codecvt>
#include <map>

// DEFINE_LOG_CATEGORY(MessageLoop)

typedef std::function<void(HWND, UINT, WPARAM, LPARAM)> FWindowProc;

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

    void RegisterWindowProc(FWindowProc Callback);

    virtual void Execute(const Napi::AsyncProgressQueueWorker<int>::ExecutionProgress& Progress) override;

    /** This must be overridden so that `AsyncProgressQueueWorker` can be extended, but we don't use it. */
    virtual void OnProgress(const int* _Data, size_t Count) override;

    static std::vector<FWindowProc> WindowProcs;
};

