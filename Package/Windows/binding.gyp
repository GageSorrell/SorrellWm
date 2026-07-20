{
    "targets": [
        {
            "target_name": "SorrellWindows",
            "sources": [
                "Source/Native/*",
                "Source/Native/**/*"
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
                "user32.lib"
            ],
            "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
            "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
            "msvs_settings": {
                "VCCLCompilerTool": {
                    "AdditionalOptions": [
                        "/std:c++20"
                    ],
                    "WarningLevel": 4
                }
            }
        }
    ]
}
