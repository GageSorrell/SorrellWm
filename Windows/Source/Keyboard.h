#pragma once

#include <napi.h>
#include <string>
#include <Windows.h>
#include <iostream>
#include "MessageLoop/MessageLoop.h"
#include "js_native_api_types.h"
#include "Core/Globals.h"
#include "Core/InterProcessCommunication.h"

void RegisterActivationKey();
