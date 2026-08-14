{
    "targets": [
        {
            "target_name": "SorrellWindows",
            "sources": [
                "Source/Native/Initialization.cpp",
                "Source/Native/Isolate.cpp",
                "Source/Native/Keyboard.cpp",
                "Source/Native/MessageLoop.cpp",
                "Source/Native/Monitor.cpp",
                "Source/Native/Mouse.cpp",
                "Source/Native/ScreenCapture.cpp",
                "Source/Native/Theme.cpp",
                "Source/Native/Utility.cpp",
                "Source/Native/Window.cpp",
                "Source/Native/WindowDimming.cpp"
            ],
            "defines": [
                "NAPI_VERSION=10",
                "NAPI_DISABLE_CPP_EXCEPTIONS",
                "NOMINMAX",
                "UNICODE",
                "WIN32_LEAN_AND_MEAN",
                "_UNICODE"
            ],
            "libraries": [
                "advapi32.lib",
                "gdi32.lib",
                "ole32.lib",
                "propsys.lib",
                "setupapi.lib",
                "shell32.lib",
                "shlwapi.lib",
                "windowscodecs.lib",
                "user32.lib"
            ],
            "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
            "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
            "msvs_settings": {
                "VCCLCompilerTool": {
                    "AdditionalOptions": [
                        "/EHsc",
                        "/std:c++20"
                    ],
                    "WarningLevel": 4
                }
            }
        }
    ]
}
