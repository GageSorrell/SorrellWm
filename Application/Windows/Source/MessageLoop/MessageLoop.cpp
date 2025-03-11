#include "MessageLoop.h"

FMessageLoop::FMessageLoop(Napi::Function OkCallback)
    : Napi::AsyncProgressQueueWorker<int>(OkCallback)
    , TDispatcher<MSG>()
{ }

std::vector<FWindowProc> FMessageLoop::WindowProcs;

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    for(FWindowProc& WindowProcFunction : FMessageLoop::WindowProcs)
    {
        WindowProcFunction(hwnd, uMsg, wParam, lParam);
    }

    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

void FMessageLoop::RegisterWindowProc(FWindowProc Callback)
{
    FMessageLoop::WindowProcs.push_back(Callback);
}

void FMessageLoop::Execute(const Napi::AsyncProgressQueueWorker<int>::ExecutionProgress& Progress)
{
    std::cout << "EXECUTED ASYNC WORKER" << std::endl;

    WNDCLASSA wc = { };
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "SorrellWm";

    RegisterClassA(&wc);

    HWND Handle = CreateWindowExA(
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
        Dispatch(Message);
        TranslateMessage(&Message);
        DispatchMessage(&Message);
    }
}

void FMessageLoop::OnProgress(const int* _Data, size_t Count)
{

}
