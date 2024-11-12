class FMessageLoop : public Napi::AsyncProgressQueueWorker<std::string>, public FEventDispatcher<MSG>
{
public:
    FMessageLoop(
        Napi::Function& OkCallback,
        Napi::Function& ErrorCallback,
        Napi::Function& ProgressCallback,
        Napi::Env& Environment
    )
    : Napi::AsyncProgressQueueWorker<std::string>(OkCallback)
    , Environment(Environment)
    {
        this->ErrorCallback.Reset(ErrorCallback, 1);
        this->ProgressCallback.Reset(ProgressCallback, 1);
    }

    ~FMessageLoop() { }

    virtual void Execute(const Napi::AsyncProgressQueueWorker<std::string>::ExecutionProgress& Progress) override
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

        RegisterHotKeys();

        MSG msg;
        while (GetMessage(&msg, NULL, 0, 0) > 0)
        {
            std::cout << "Message received by Win32" << std::endl;
            DispatchEvent(msg);
            std::string Dummy = "Dummy Message";
            if (msg.message == WM_HOTKEY && msg.wParam == 1)
            {
                std::string ActivationHotKey = "ActivationHotKey";
                Progress.Send(&ActivationHotKey, 1);
            }
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }

        UnregisterHotKey(NULL, 1);
    }

    virtual void OnOK()
    {
        Napi::HandleScope Scope(Napi::Env());

        std::string Foo = "OnOK";
        Callback().Call({ Napi::String::New(Environment, Foo) });
    }

    virtual void OnProgress(const std::string* Data, size_t Count) override
    {
        Napi::HandleScope Scope(Napi::Env());

        if (!this->ProgressCallback.IsEmpty())
        {
            ProgressCallback.Call(Receiver().Value(), { Napi::String::New(Environment, *Data) });
        }
    }
private:
    Napi::FunctionReference ProgressCallback;
    Napi::FunctionReference ErrorCallback;
    Napi::Env Environment;
    std::vector Listeners;
};
