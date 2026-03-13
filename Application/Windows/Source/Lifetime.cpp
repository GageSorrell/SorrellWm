/* File:      Lifetime.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#define _WIN32_DCOM

#include "Lifetime.h"
#include <stdio.h>
#include <comdef.h>
#include <combaseapi.h>
#include <oleauto.h>
#include <taskschd.h>
#include <security.h>

#include <mutex>
#include <sstream>

#pragma comment(lib, "taskschd.lib")
#pragma comment(lib, "Ole32.lib")
#pragma comment(lib, "OleAut32.lib")
#pragma comment(lib, "comsupp.lib")
#pragma comment(lib, "Secur32.lib")

using namespace std;

namespace
{
    std::once_flag ComSecurityInitializationFlag;
    HRESULT ComSecurityInitializationResult = S_OK;

    std::string WideToUtf8(const std::wstring& Value)
    {
        if (Value.empty())
        {
            return std::string();
        }

        int RequiredLength = WideCharToMultiByte(
            CP_UTF8,
            0,
            Value.c_str(),
            static_cast<int>(Value.size()),
            nullptr,
            0,
            nullptr,
            nullptr
        );

        if (RequiredLength <= 0)
        {
            return std::string();
        }

        std::string Result;
        Result.resize(static_cast<size_t>(RequiredLength));

        WideCharToMultiByte(
            CP_UTF8,
            0,
            Value.c_str(),
            static_cast<int>(Value.size()),
            Result.data(),
            RequiredLength,
            nullptr,
            nullptr
        );

        return Result;
    }

    std::string FormatHresultMessage(const std::string& Prefix, HRESULT Result)
    {
        std::ostringstream Stream;
        Stream << Prefix << " (HRESULT 0x"
               << std::hex
               << std::uppercase
               << static_cast<unsigned long>(Result)
               << ")";
        return Stream.str();
    }

    template <typename InterfaceType>
    void SafeRelease(InterfaceType*& InterfacePointer)
    {
        if (InterfacePointer != nullptr)
        {
            InterfacePointer->Release();
            InterfacePointer = nullptr;
        }
    }

    class TBstrScope
    {
    public:
        explicit TBstrScope(const std::wstring& Value)
            : ValuePointer(SysAllocStringLen(Value.data(), static_cast<UINT>(Value.size())))
        {
        }

        ~TBstrScope()
        {
            if (ValuePointer != nullptr)
            {
                SysFreeString(ValuePointer);
                ValuePointer = nullptr;
            }
        }

        BSTR Get() const
        {
            return ValuePointer;
        }

        bool IsValid() const
        {
            return ValuePointer != nullptr;
        }

    private:
        BSTR ValuePointer;
    };

    HRESULT EnsureComSecurityInitialized()
    {
        std::call_once(
            ComSecurityInitializationFlag,
            []()
            {
                ComSecurityInitializationResult = CoInitializeSecurity(
                    nullptr,
                    -1,
                    nullptr,
                    nullptr,
                    RPC_C_AUTHN_LEVEL_PKT_PRIVACY,
                    RPC_C_IMP_LEVEL_IMPERSONATE,
                    nullptr,
                    0,
                    nullptr
                );
            }
        );

        if (ComSecurityInitializationResult == RPC_E_TOO_LATE)
        {
            return S_OK;
        }

        return ComSecurityInitializationResult;
    }

    std::wstring Utf8ToWide(const std::string& Value)
    {
        if (Value.empty())
        {
            return std::wstring();
        }

        int RequiredLength = MultiByteToWideChar(
            CP_UTF8,
            0,
            Value.c_str(),
            static_cast<int>(Value.size()),
            nullptr,
            0
        );

        if (RequiredLength <= 0)
        {
            return std::wstring();
        }

        std::wstring Result;
        Result.resize(static_cast<size_t>(RequiredLength));

        MultiByteToWideChar(
            CP_UTF8,
            0,
            Value.c_str(),
            static_cast<int>(Value.size()),
            Result.data(),
            RequiredLength
        );

        return Result;
    }

    std::wstring QuoteIfNeeded(const std::wstring& Value)
    {
        if (Value.find(L" ") != std::wstring::npos && (Value.size() < 2 || Value.front() != L'"' || Value.back() != L'"'))
        {
            return L"\"" + Value + L"\"";
        }

        return Value;
    }

    void ThrowLastError(const Napi::Env& Environment, const char* MessagePrefix, LONG ErrorCode)
    {
        LPWSTR Buffer = nullptr;

        DWORD Flags =
            FORMAT_MESSAGE_ALLOCATE_BUFFER |
            FORMAT_MESSAGE_FROM_SYSTEM |
            FORMAT_MESSAGE_IGNORE_INSERTS;

        DWORD Length = FormatMessageW(
            Flags,
            nullptr,
            static_cast<DWORD>(ErrorCode),
            MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
            reinterpret_cast<LPWSTR>(&Buffer),
            0,
            nullptr
        );

        std::string Message = MessagePrefix;
        Message += " (error ";
        Message += std::to_string(ErrorCode);
        Message += ")";

        if (Length > 0 && Buffer != nullptr)
        {
            int Utf8Length = WideCharToMultiByte(
                CP_UTF8,
                0,
                Buffer,
                static_cast<int>(Length),
                nullptr,
                0,
                nullptr,
                nullptr
            );

            if (Utf8Length > 0)
            {
                std::string ErrorText;
                ErrorText.resize(static_cast<size_t>(Utf8Length));

                WideCharToMultiByte(
                    CP_UTF8,
                    0,
                    Buffer,
                    static_cast<int>(Length),
                    ErrorText.data(),
                    Utf8Length,
                    nullptr,
                    nullptr
                );

                Message += ": ";
                Message += ErrorText;
            }
        }

        if (Buffer != nullptr)
        {
            LocalFree(Buffer);
        }

        Napi::Error::New(Environment, Message).ThrowAsJavaScriptException();
    }
}

void GetRunOnStartup(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    class TGetTaskExistsWorker : public Napi::AsyncWorker
    {
    public:
        TGetTaskExistsWorker(
            Napi::Function& CallbackFunction,
            const std::wstring& InExecutablePath
        )
            : Napi::AsyncWorker(CallbackFunction)
            , ExecutablePath(InExecutablePath)
            , Success(false)
        { }

        void Execute() override
        {
            Success = false;
            HRESULT ApartmentInitializationResult = CoInitializeEx(
                nullptr,
                COINIT_MULTITHREADED
            );

            bool ShouldUninitialize = SUCCEEDED(ApartmentInitializationResult);

            if (FAILED(ApartmentInitializationResult))
            {
                std::cout << "CoInitializeEx failed: " << ApartmentInitializationResult << std::endl;
                return;
            }

            ITaskService *pService = NULL;
            HRESULT hr = CoCreateInstance(
                CLSID_TaskScheduler,
                NULL,
                CLSCTX_INPROC_SERVER,
                IID_ITaskService,
                (void**)&pService
            );
            std::cout << "UnregisterTask: This far" << std::endl;

            if (FAILED(hr))
            {
                std::cout << "Failed to create an instance of ITaskService: " << hr << std::endl;
                CoUninitialize();
            }

            ITaskFolder *pRootFolder = NULL;
            hr = pService->GetFolder( _bstr_t( L"\\") , &pRootFolder );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get Root Folder pointer: " << hr << std::endl;
                pService->Release();
                CoUninitialize();
            }

            IRegisteredTask* RegisteredTaskPointer = nullptr;

            HRESULT Result = pRootFolder->GetTask(
                _bstr_t(TaskName),
                &RegisteredTaskPointer
            );

            if (SUCCEEDED(Result))
            {
                Success = true;
                RegisteredTaskPointer->Release();
            }

            pRootFolder->Release();
            pService->Release();

            if (ShouldUninitialize)
            {
                CoUninitialize();
            }
        }

        void OnOK() override
        {
            Napi::HandleScope HandleScope(Env());

            std::cout << "OnOK: Calling Callback" << std::endl;
            Callback().Call({ Napi::Boolean::New(Env(), Success) });
        }

        void OnError(const Napi::Error& Error) override
        {
            Napi::HandleScope HandleScope(Env());

            std::cout << "OnError: Calling Callback" << std::endl;
            Callback().Call({ Error.Value() });
        }

    private:
        LPCWSTR TaskName = L"Launch SorrellWm on Login";
        std::wstring ExecutablePath;
        bool Success;
        bool NewState;
    };

    std::wstring ExecutablePath = Utf8ToWide(CallbackInfo[0].As<Napi::String>());
    Napi::Function CallbackFunction = CallbackInfo[1].As<Napi::Function>();

    TGetTaskExistsWorker* Worker = new TGetTaskExistsWorker(
        CallbackFunction,
        ExecutablePath
    );

    Worker->Queue();

    // std::wstring ApplicationName = Utf8ToWide("SorrellWm");
    // std::wstring OptionalArguments;

    // if (ExecutablePath.empty())
    // {
    //     Napi::TypeError::New(Environment, "Executable path must not be empty.").ThrowAsJavaScriptException();
    //     return Environment.Undefined();
    // }

    // std::wstring ExpectedCommandLine = QuoteIfNeeded(ExecutablePath) + L" --launch-at-startup";

    // if (!OptionalArguments.empty())
    // {
    //     ExpectedCommandLine += L" ";
    //     ExpectedCommandLine += OptionalArguments;
    // }

    // HKEY StartupKey = nullptr;

    // LONG OpenResult = RegOpenKeyExW(
    //     HKEY_CURRENT_USER,
    //     L"Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    //     0,
    //     KEY_QUERY_VALUE,
    //     &StartupKey
    // );

    // if (OpenResult == ERROR_FILE_NOT_FOUND || OpenResult == ERROR_PATH_NOT_FOUND)
    // {
    //     return Napi::Boolean::New(Environment, false);
    // }

    // if (OpenResult != ERROR_SUCCESS)
    // {
    //     ThrowLastError(Environment, "Failed to open HKCU Run key", OpenResult);
    //     return Environment.Undefined();
    // }

    // DWORD ValueType = 0;
    // DWORD ValueSizeInBytes = 0;

    // LONG QuerySizeResult = RegGetValueW(
    //     StartupKey,
    //     nullptr,
    //     ApplicationName.c_str(),
    //     RRF_RT_REG_SZ,
    //     &ValueType,
    //     nullptr,
    //     &ValueSizeInBytes
    // );

    // if (QuerySizeResult == ERROR_FILE_NOT_FOUND || QuerySizeResult == ERROR_PATH_NOT_FOUND)
    // {
    //     RegCloseKey(StartupKey);
    //     return Napi::Boolean::New(Environment, false);
    // }

    // if (QuerySizeResult != ERROR_SUCCESS)
    // {
    //     RegCloseKey(StartupKey);
    //     ThrowLastError(Environment, "Failed to query startup value size", QuerySizeResult);
    //     return Environment.Undefined();
    // }

    // if (ValueSizeInBytes == 0)
    // {
    //     RegCloseKey(StartupKey);
    //     return Napi::Boolean::New(Environment, false);
    // }

    // std::vector<wchar_t> ValueBuffer(ValueSizeInBytes / sizeof(wchar_t));

    // LONG QueryValueResult = RegGetValueW(
    //     StartupKey,
    //     nullptr,
    //     ApplicationName.c_str(),
    //     RRF_RT_REG_SZ,
    //     nullptr,
    //     ValueBuffer.data(),
    //     &ValueSizeInBytes
    // );

    // RegCloseKey(StartupKey);

    // if (QueryValueResult == ERROR_FILE_NOT_FOUND || QueryValueResult == ERROR_PATH_NOT_FOUND)
    // {
    //     return Napi::Boolean::New(Environment, false);
    // }

    // if (QueryValueResult != ERROR_SUCCESS)
    // {
    //     ThrowLastError(Environment, "Failed to read startup value", QueryValueResult);
    //     return Environment.Undefined();
    // }

    // std::wstring RegisteredCommandLine(ValueBuffer.data());

    // bool IsRegistered = (RegisteredCommandLine == ExpectedCommandLine);

    // return Napi::Boolean::New(Environment, IsRegistered);
}

std::wstring GetUserName()
{
    ULONG BufferLength = 0;

    std::cout << "GetUserName: Going to call GetUserNameExW!" << std::endl;

    GetUserNameExW(
        NameSamCompatible,
        nullptr,
        &BufferLength
    );

    std::cout << "GetUserName: Called GetUserNameExW!" << std::endl;

    DWORD InitialError = GetLastError();

    std::cout << "GetUserName: GetLastError() == " << GetLastError() << std::endl;

    if (InitialError != ERROR_MORE_DATA || BufferLength == 0)
    {
        return L"rip";
    }

    std::vector<wchar_t> Buffer(BufferLength);

    std::cout << "GetUserName: Initialized Buffer!" << std::endl;

    if (!GetUserNameExW(
            NameSamCompatible,
            Buffer.data(),
            &BufferLength
        ))
    {
        std::cout << "GetUserName return rip" << std::endl;
        return L"rip";
    }

    std::cout << "GetUserName Again: GetLastError() == " << GetLastError() << std::endl;

    std::cout << "GetUserName: Made it!" << std::endl;
    std::wstring UserName(Buffer.data(), BufferLength);
    return UserName;
}

Napi::Value GetIsElevated(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    HANDLE ProcessTokenHandle = nullptr;

    if (!OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &ProcessTokenHandle))
    {
        ThrowLastError(Environment, "OpenProcessToken failed", 0);
        return Environment.Undefined();
    }

    TOKEN_ELEVATION TokenElevationInformation {};
    DWORD ReturnLength = 0;

    BOOL GetTokenInformationResult = GetTokenInformation(
        ProcessTokenHandle,
        TokenElevation,
        &TokenElevationInformation,
        static_cast<DWORD>(sizeof(TokenElevationInformation)),
        &ReturnLength
    );

    CloseHandle(ProcessTokenHandle);

    if (!GetTokenInformationResult)
    {
        ThrowLastError(Environment, "GetTokenInformation(TokenElevation) failed", 0);
        return Environment.Undefined();
    }

    bool IsElevated = (TokenElevationInformation.TokenIsElevated != 0);

    return Napi::Boolean::New(Environment, IsElevated);
}

void SetRunOnStartup(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    class TGetTaskExistsWorker : public Napi::AsyncWorker
    {
    public:
        TGetTaskExistsWorker(
            Napi::Function& CallbackFunction,
            const std::wstring& InExecutablePath,
            bool InNewState
        )
            : Napi::AsyncWorker(CallbackFunction)
            , ExecutablePath(InExecutablePath)
            , NewState(InNewState)
            , Success(true)
        { }

        void RegisterTask()
        {
            Success = true;
            std::cout << "Execute..." << std::endl;
            HRESULT ApartmentInitializationResult = CoInitializeEx(
                nullptr,
                COINIT_MULTITHREADED
            );

            std::cout << "Before ShouldInitialize..." << std::endl;
            bool ShouldUninitialize = SUCCEEDED(ApartmentInitializationResult);
            std::cout << "ShouldUninitialize: " << ShouldUninitialize << std::endl;

            if (FAILED(ApartmentInitializationResult))
            {
                std::cout << "CoInitializeEx failed: " << ApartmentInitializationResult << std::endl;
                return;
            }

            std::wstring wstrExecutablePath = ExecutablePath;

            ITaskService *pService = NULL;
            HRESULT hr = CoCreateInstance(
                CLSID_TaskScheduler,
                NULL,
                CLSCTX_INPROC_SERVER,
                IID_ITaskService,
                (void**)&pService
            );

            if (FAILED(hr))
            {
                std::cout << "Failed to create an instance of ITaskService: " << hr << std::endl;
                CoUninitialize();
                Success = false;
            }

            //  Connect to the task service.
            hr = pService->Connect(
                _variant_t(),
                _variant_t(),
                _variant_t(),
                _variant_t()
            );

            if( FAILED(hr) )
            {
                std::cout << "ITaskService::Connect failed: " << hr << std::endl;
                pService->Release();
                CoUninitialize();
                Success = false;
            }

            //  ------------------------------------------------------
            //  Get the pointer to the root task folder.  This folder will hold the
            //  new task that is registered.
            ITaskFolder *pRootFolder = NULL;
            hr = pService->GetFolder( _bstr_t( L"\\") , &pRootFolder );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get Root Folder pointer: " << hr << std::endl;
                pService->Release();
                CoUninitialize();
                Success = false;
            }

            //  If the same task exists, remove it.
            pRootFolder->DeleteTask( _bstr_t(TaskName), 0  );

            //  Create the task builder object to create the task.
            ITaskDefinition *pTask = NULL;
            hr = pService->NewTask( 0, &pTask );

            pService->Release();  // COM clean up.  Pointer is no longer used.
            if (FAILED(hr))
            {
                std::cout << "Failed to create a task definition: " << hr << std::endl;
                pRootFolder->Release();
                CoUninitialize();
                Success = false;
            }

            //  ------------------------------------------------------
            //  Get the registration info for setting the identification.
            IRegistrationInfo *pRegInfo= NULL;
            hr = pTask->get_RegistrationInfo( &pRegInfo );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get identification pointer: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            hr = pRegInfo->put_Author( _bstr_t(L"SorrellWm") );
            pRegInfo->Release();
            if( FAILED(hr) )
            {
                std::cout << "Cannot put identification info: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            //  Create the settings for the task
            ITaskSettings *pSettings = NULL;
            hr = pTask->get_Settings( &pSettings );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get settings pointer: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            hr = pSettings->put_StartWhenAvailable(VARIANT_TRUE);
            pSettings->Release();
            if( FAILED(hr) )
            {
                std::cout << "Cannot put setting info: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            std::cout << "put_StartWhenAvailable" << std::endl;

            ITriggerCollection *pTriggerCollection = NULL;
            hr = pTask->get_Triggers( &pTriggerCollection );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get trigger collection: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            std::cout << "Created ITriggerCollection*" << std::endl;

            ITrigger *pTrigger = NULL;
            hr = pTriggerCollection->Create( TASK_TRIGGER_LOGON, &pTrigger );
            pTriggerCollection->Release();
            if( FAILED(hr) )
            {
                std::cout << "Cannot create the trigger: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            ILogonTrigger *pLogonTrigger = NULL;
            hr = pTrigger->QueryInterface(
                    IID_ILogonTrigger, (void**) &pLogonTrigger );
            pTrigger->Release();
            if( FAILED(hr) )
            {
                std::cout << "QueryInterface call failed for ILogonTrigger: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            hr = pLogonTrigger->put_Id( _bstr_t( L"Trigger1" ) );
            if( FAILED(hr) )
            {
                std::cout << "Cannot put the trigger ID: " << hr << std::endl;
            }

            hr = pLogonTrigger->put_StartBoundary( _bstr_t(L"2005-01-01T12:05:00") );
            if( FAILED(hr) )
            {
                std::cout << "Cannot put the start boundary: " << hr << std::endl;
            }

            hr = pLogonTrigger->put_EndBoundary( _bstr_t(L"2028-05-02T08:00:00") );
            if( FAILED(hr) )
            {
                std::cout << "Cannot put the end boundary: " << hr << std::endl;
            }

            // const wchar_t* UserName = GetUserName().c_str();
            std::wstring UserName = GetUserName();
            const wchar_t* pUserName = UserName.c_str();
            hr = pLogonTrigger->put_UserId( _bstr_t( pUserName ) );
            pLogonTrigger->Release();
            if( FAILED(hr) )
            {
                std::cout << "Cannot add user ID to logon trigger: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            IActionCollection *pActionCollection = NULL;

            hr = pTask->get_Actions( &pActionCollection );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get Task collection pointer: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            IPrincipal* Principal = NULL;
            hr = pTask->get_Principal(&Principal);
            if(FAILED(hr))
            {
                std::cout << "Could not get principal: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            hr = Principal->put_RunLevel(TASK_RUNLEVEL_HIGHEST);
            if(FAILED(hr))
            {
                std::cout << "Could not set run level: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            hr = pTask->put_Principal(Principal);
            if(FAILED(hr))
            {
                std::cout << "Could not set principal: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            //  Create the action, specifying that it is an executable action.
            IAction *pAction = NULL;
            hr = pActionCollection->Create( TASK_ACTION_EXEC, &pAction );
            pActionCollection->Release();
            if( FAILED(hr) )
            {
                std::cout << "Cannot create the action: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            IExecAction *pExecAction = NULL;
            //  QI for the executable task pointer.
            hr = pAction->QueryInterface(
                IID_IExecAction, (void**) &pExecAction );
            pAction->Release();
            if( FAILED(hr) )
            {
                std::cout << "QueryInterface call failed for IExecAction: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            /* Set the path of the executable. */
            hr = pExecAction->put_Path( _bstr_t( wstrExecutablePath.c_str() ) );
            pExecAction->Release();
            if( FAILED(hr) )
            {
                std::cout << "Cannot set path of executable: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                // return Napi::Boolean::New(Environment, false);
                Success = false;
            }

            /* Save the task in the root folder. */
            IRegisteredTask *pRegisteredTask = NULL;

            hr = pRootFolder->RegisterTaskDefinition(
                    _bstr_t(TaskName),
                    pTask,
                    TASK_CREATE_OR_UPDATE,
                    _variant_t(L"S-1-5-32-544"),
                    _variant_t(),
                    TASK_LOGON_GROUP,
                    _variant_t(L""),
                    &pRegisteredTask);
            if( FAILED(hr) )
            {
                std::cout << "Error saving the Task: " << hr << std::endl;
                pRootFolder->Release();
                pTask->Release();
                CoUninitialize();
                Success = false;
            }

            std::cout << "Success! Task successfully registered." << hr << std::endl;

            pRootFolder->Release();
            pTask->Release();
            pRegisteredTask->Release();

            if (ShouldUninitialize)
            {
                CoUninitialize();
            }
        }

        void UnregisterTask()
        {
            HRESULT ApartmentInitializationResult = CoInitializeEx(
                nullptr,
                COINIT_MULTITHREADED
            );

            std::cout << "Before ShouldInitialize..." << std::endl;
            bool ShouldUninitialize = SUCCEEDED(ApartmentInitializationResult);
            std::cout << "ShouldUninitialize: " << ShouldUninitialize << std::endl;

            if (FAILED(ApartmentInitializationResult))
            {
                std::cout << "CoInitializeEx failed: " << ApartmentInitializationResult << std::endl;
                return;
            }

            // Napi::Env Environment = CallbackInfo.Env();
            //  ------------------------------------------------------
            //  Create a name for the task.
            ITaskService *pService = NULL;
            HRESULT hr = CoCreateInstance(
                CLSID_TaskScheduler,
                NULL,
                CLSCTX_INPROC_SERVER,
                IID_ITaskService,
                (void**)&pService
            );
            std::cout << "UnregisterTask: This far" << std::endl;

            if (FAILED(hr))
            {
                std::cout << "Failed to create an instance of ITaskService: " << hr << std::endl;
                CoUninitialize();
                Success = false;
                return;
                // return Napi::Boolean::New(Environment, false);
            }
            ITaskFolder *pRootFolder = NULL;
            hr = pService->GetFolder( _bstr_t( L"\\") , &pRootFolder );
            if( FAILED(hr) )
            {
                std::cout << "Cannot get Root Folder pointer: " << hr << std::endl;
                pService->Release();
                CoUninitialize();
                Success = false;
                return;
                // return Napi::Boolean::New(Environment, false);
            }

            IRegisteredTask* RegisteredTaskPointer = nullptr;
            hr = pRootFolder->GetTask(
                _bstr_t(TaskName),
                &RegisteredTaskPointer
            );

            if (FAILED(hr))
            {
                pRootFolder->Release();
                pService->Release();
                CoUninitialize();
                Success = false;
                return;
            }

            std::cout << "Going to delete task." << std::endl;
            //  If the same task exists, remove it.
            hr = pRootFolder->DeleteTask(_bstr_t(TaskName), 0);

            Success = SUCCEEDED(hr);

            pRootFolder->Release();
            pService->Release();

            if (ShouldUninitialize)
            {
                CoUninitialize();
            }
        }

        void Execute() override
        {
            if (NewState)
            {
                RegisterTask();
            }
            else
            {
                UnregisterTask();
            }
        }

        void OnOK() override
        {
            Napi::HandleScope HandleScope(Env());

            std::cout << "OnOK: Calling Callback" << std::endl;
            Callback().Call({ Napi::Boolean::New(Env(), Success) });
        }

        void OnError(const Napi::Error& Error) override
        {
            Napi::HandleScope HandleScope(Env());

            std::cout << "OnError: Calling Callback" << std::endl;
            Callback().Call({ Error.Value() });
        }

    private:
        LPCWSTR TaskName = L"Launch SorrellWm on Login";
        std::wstring ExecutablePath;
        bool Success;
        bool NewState;
    };

    bool NewState = CallbackInfo[0].As<Napi::Boolean>();
    std::wstring ExecutablePath = Utf8ToWide(CallbackInfo[1].As<Napi::String>());
    Napi::Function CallbackFunction = CallbackInfo[2].As<Napi::Function>();

    TGetTaskExistsWorker* Worker = new TGetTaskExistsWorker(
        CallbackFunction,
        ExecutablePath,
        NewState
    );

    Worker->Queue();
}
