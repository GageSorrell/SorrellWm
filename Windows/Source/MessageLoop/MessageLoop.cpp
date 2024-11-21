#include "MessageLoop.h"

FMessageLoop::FMessageLoop(Napi::Function OkCallback)
    : Napi::AsyncProgressQueueWorker<int>(OkCallback)
    , TDispatcher<MSG>()
{ }

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

void FMessageLoop::Execute(const Napi::AsyncProgressQueueWorker<int>::ExecutionProgress& Progress)
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
        Dispatch(Message);
        TranslateMessage(&Message);
        DispatchMessage(&Message);
    }
}

void FMessageLoop::OnProgress(const int* _Data, size_t Count)
{

}
