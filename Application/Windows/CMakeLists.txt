# File:      CMakeLists.txt
# Author:    Gage Sorrell <gage@sorrell.sh>
# Copyright: (c) 2026 Gage Sorrell
# License:   MIT

cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project (SorrellWm)
set(CMAKE_CXX_STANDARD 20)

set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

FetchContent_Declare(nlohmann_json URL https://github.com/nlohmann/json/releases/download/v3.12.0/json.tar.xz)
FetchContent_MakeAvailable(nlohmann_json)

include_directories(${CMAKE_JS_INC})

file(GLOB SOURCE_FILES "Source/**/*.cpp" "Source/**/*.h" "Source/*.cpp" "Source/*.h" "ThirdParty/**/*.cpp" "ThirdParty/**/*.h")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} nlohmann_json::nlohmann_json)

if (MSVC)
    target_compile_options(SorrellWm PRIVATE /Zc:preprocessor)
endif ()

execute_process(COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
)

string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
add_definitions(-DNAPI_VERSION=4)
