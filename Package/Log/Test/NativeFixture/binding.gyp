{
    "targets": [
        {
            "target_name": "SorrellLogNativeFixture",
            "sources": [
                "fixture.cpp"
            ],
            "defines": [
                "NAPI_VERSION=10",
                "NAPI_DISABLE_CPP_EXCEPTIONS"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")",
                "../../native/include"
            ],
            "dependencies": [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            "cflags_cc": [
                "-std=c++20"
            ],
            "xcode_settings": {
                "CLANG_CXX_LANGUAGE_STANDARD": "c++20",
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            },
            "msvs_settings": {
                "VCCLCompilerTool": {
                    "AdditionalOptions": [
                        "/std:c++20"
                    ],
                    "ExceptionHandling": 0,
                    "WarningLevel": 4
                }
            }
        }
    ]
}
