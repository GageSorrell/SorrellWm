#include "MessageLoop.h"

FMessageLoop::FMessageLoop(
    Napi::Function& OkCallback,
    Napi::Function& ErrorCallback,
    Napi::Function& ProgressCallback,
    Napi::Env& Environment
)
: Napi::AsyncProgressQueueWorker<std::string>(OkCallback)
, FEventDispatcher<std::pair<MSG, const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress&>>()
, Environment(Environment)
{
    this->ErrorCallback.Reset(ErrorCallback, 1);
    this->ProgressCallback.Reset(ProgressCallback, 1);
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    // switch (uMsg)
    // {
    //     // Handle different messages here
    //     case WM_DESTROY:
    //         return 0;
    //     // More cases as needed...
    // }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

void FMessageLoop::Execute(const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress& Progress)
{
    std::cout << "EXECUTED ASYNC WORKER" << std::endl;

    WNDCLASS wc = {};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "SorrellWm";

    RegisterClass(&wc);

    HWND Handle = CreateWindowEx(
        0,
        wc.lpszClassName,
        "SorrellWm",
        0,
        0,
        0,
        0,
        0,
        HWND_MESSAGE,
        nullptr,
        wc.hInstance,
        nullptr
    );

    MSG Message;
    while (GetMessage(&Message, NULL, 0, 0) > 0)
    {
        std::cout << "Message received by Win32" << std::endl;
        Dispatch(std::pair<MSG, const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress&>(Message, Progress));
        TranslateMessage(&Message);
        DispatchMessage(&Message);
    }

    UnregisterHotKey(NULL, 1);
}

void FMessageLoop::OnOK()
{
    Napi::HandleScope Scope(Napi::Env());

    std::string Foo = "OnOK";
    Callback().Call({ Napi::String::New(Environment, Foo) });
}

void FMessageLoop::OnProgress(const std::string* Data, size_t Count)
{
    Napi::HandleScope Scope(Napi::Env());

    if (!this->ProgressCallback.IsEmpty())
    {
        ProgressCallback.Call(Receiver().Value(), { Napi::String::New(Environment, *Data) });
    }
}
