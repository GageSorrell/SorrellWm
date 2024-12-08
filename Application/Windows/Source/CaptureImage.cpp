/* File:      CaptureImage.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "CaptureImage.h"

#define MAX_LOADSTRING 100

HINSTANCE hInst;
// WCHAR szTitle[MAX_LOADSTRING] = L"CaptureImageTitle";
// WCHAR szWindowClass[MAX_LOADSTRING] = L"CaptureImageClass";
const char szWindowClass[MAX_LOADSTRING] = "CaptureImageClass";

ATOM                MyRegisterClass(HINSTANCE hInstance);
BOOL                InitInstance(HINSTANCE);
LRESULT CALLBACK    WndProc(HWND, UINT, WPARAM, LPARAM);
INT_PTR CALLBACK    About(HWND, UINT, WPARAM, LPARAM);

Napi::Value CaptureImage(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
// int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
//     _In_opt_ HINSTANCE hPrevInstance,
//     _In_ LPWSTR    lpCmdLine,
//     _In_ int       nCmdShow)
// {
    // UNREFERENCED_PARAMETER(hPrevInstance);
    // UNREFERENCED_PARAMETER(lpCmdLine);

    // LoadStringW(hInstance, IDS_APP_TITLE, szTitle, MAX_LOADSTRING);
    // LoadStringW(hInstance, IDC_GDICAPTURINGANIMAGE, szWindowClass, MAX_LOADSTRING);

    std::cout << "Called CaptureImage" << std::endl;
    HINSTANCE hInstance = GetModuleHandle(NULL);
    std::cout << "Got hInstance!" << std::endl;
    if (MyRegisterClass(hInstance) == 0)
    {
        std::cout << GetLastErrorAsString() << std::endl;
    };

    std::cout << "Registered Class!" << std::endl;

    if (!InitInstance(hInstance))
    {
        std::cout << "InitInstance failed." << std::endl;
    }

    return Environment.Undefined();
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//
//   PURPOSE: Saves instance handle and creates main window
//
//   COMMENTS:
//
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance)
{
    hInst = hInstance;

    HWND hWnd = CreateWindowA(
        szWindowClass,
        "CaptureImageWindow",
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT,
        0,
        CW_USEDEFAULT,
        0,
        nullptr,
        nullptr,
        hInstance,
        nullptr
    );

    if (!hWnd)
    {
        std::cout << "InitInstance failed up here." << std::endl;
        std::cout << GetLastErrorAsString() << std::endl;
        return FALSE;
    }
    else
    {
        std::cout << "InitInstance SUCCEEDED." << std::endl;
    }

    ShowWindow(hWnd, SW_SHOW);
    UpdateWindow(hWnd);

    std::cout << "Showed and updated window." << std::endl;

    return TRUE;
}

// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

//
//   FUNCTION: CaptureImageInternal(HWND hWnd)
//
//   PURPOSE: Captures a screenshot into a window ,and then saves it in a .bmp file.
//
//   COMMENTS:
//
//      Note: This function attempts to create a file called captureqwsx.bmp
//

int CaptureImageInternal(HWND hWnd)
{
    HDC hdcScreen;
    HDC hdcWindow;
    HDC hdcMemDC = NULL;
    HBITMAP hbmScreen = NULL;
    BITMAP bmpScreen;
    DWORD dwBytesWritten = 0;
    DWORD dwSizeofDIB = 0;
    HANDLE hFile = NULL;
    char* lpbitmap = NULL;
    HANDLE hDIB = NULL;
    DWORD dwBmpSize = 0;

    // Retrieve the handle to a display device context for the client
    // area of the window.
    hdcScreen = GetDC(NULL);
    hdcWindow = GetDC(hWnd);

    // Create a compatible DC, which is used in a BitBlt from the window DC.
    hdcMemDC = CreateCompatibleDC(hdcWindow);

    if (!hdcMemDC)
    {
        std::cout << "CreateCompatibleDC has failed" << std::endl;
        goto done;
    }

    // Get the client area for size calculation.
    RECT rcClient;
    GetClientRect(hWnd, &rcClient);

    // This is the best stretch mode.
    SetStretchBltMode(hdcWindow, HALFTONE);

    // The source DC is the entire screen, and the destination DC is the current window (HWND).
    if (!StretchBlt(hdcWindow,
        0, 0,
        rcClient.right, rcClient.bottom,
        hdcScreen,
        0, 0,
        GetSystemMetrics(SM_CXSCREEN),
        GetSystemMetrics(SM_CYSCREEN),
        SRCCOPY))
    {
        std::cout << "StretchBlt has failed" << std::endl;
        goto done;
    }

    // Create a compatible bitmap from the Window DC.
    hbmScreen = CreateCompatibleBitmap(hdcWindow, rcClient.right - rcClient.left, rcClient.bottom - rcClient.top);

    if (!hbmScreen)
    {
        std::cout << "CreateCompatibleBitmap Failed" << std::endl;
        goto done;
    }

    // Select the compatible bitmap into the compatible memory DC.
    SelectObject(hdcMemDC, hbmScreen);

    // Bit block transfer into our compatible memory DC.
    if (!BitBlt(hdcMemDC,
        0, 0,
        rcClient.right - rcClient.left, rcClient.bottom - rcClient.top,
        hdcWindow,
        0, 0,
        SRCCOPY))
    {
        std::cout << "BitBlt has Failed." << std::endl;
        goto done;
    }

    // Get the BITMAP from the HBITMAP.
    GetObject(hbmScreen, sizeof(BITMAP), &bmpScreen);

    int width = bmpScreen.bmWidth;
    int height = bmpScreen.bmHeight;
    int bitCount = 24; // 24 bits means 3 bytes per pixel: B, G, R
    int bytesPerPixel = bitCount / 8;
    int imageSize = width * height * bytesPerPixel;
    unsigned char* pixelData = new unsigned char[imageSize];
    unsigned char* BlurredImage = new unsigned char[imageSize];

    // BITMAPFILEHEADER   bmfHeader;
    // BITMAPINFOHEADER   bi;

    // bi.biSize = sizeof(BITMAPINFOHEADER);
    // bi.biWidth = bmpScreen.bmWidth;
    // bi.biHeight = bmpScreen.bmHeight;
    // bi.biPlanes = 1;
    // bi.biBitCount = 32;
    // bi.biCompression = BI_RGB;
    // bi.biSizeImage = 0;
    // bi.biXPelsPerMeter = 0;
    // bi.biYPelsPerMeter = 0;
    // bi.biClrUsed = 0;
    // bi.biClrImportant = 0;

    BITMAPINFOHEADER bi = { 0 };
    bi.biSize = sizeof(BITMAPINFOHEADER);
    bi.biWidth = width;
    bi.biHeight = height;
    bi.biPlanes = 1;
    bi.biBitCount = static_cast<WORD>(bitCount);
    bi.biCompression = BI_RGB;
    bi.biSizeImage = imageSize;
    BITMAPINFO bmpInfo = { 0 };
    bmpInfo.bmiHeader = bi;

    dwBmpSize = ((bmpScreen.bmWidth * bi.biBitCount + 31) / 32) * 4 * bmpScreen.bmHeight;

    // Starting with 32-bit Windows, GlobalAlloc and LocalAlloc are implemented as wrapper functions that
    // call HeapAlloc using a handle to the process's default heap. Therefore, GlobalAlloc and LocalAlloc
    // have greater overhead than HeapAlloc.
    hDIB = GlobalAlloc(GHND, dwBmpSize);
    lpbitmap = (char*)GlobalLock(hDIB);

    // // Gets the "bits" from the bitmap, and copies them into a buffer
    // // that's pointed to by lpbitmap.
    // GetDIBits(hdcWindow, hbmScreen, 0,
    //     (UINT)bmpScreen.bmHeight,
    //     lpbitmap,
    //     (BITMAPINFO*)&bi, DIB_RGB_COLORS);
    if (!GetDIBits(hdcWindow, hbmScreen, 0, height, pixelData, &bmpInfo, DIB_RGB_COLORS))
    {
        ReleaseDC(nullptr, hdcWindow);
        std::cout << "GetDIBits Failed" << std::endl;
        std::cout << GetLastErrorAsString() << std::endl;
        std::cout << hdcWindow << "\n" << hbmScreen << "\n" << height << "\n" << pixelData[0] << "\n" << bmpInfo.bmiHeader.biWidth << "\n" << DIB_RGB_COLORS << std::endl;
    }

    Blur(
        pixelData,
        BlurredImage,
        width,
        height,
        3,
        10,
        3,
        kExtend
    );

    int xDest = 0;
    int yDest = 0;
    int xSrc = 0;
    int ySrc = 0;

    if (SetDIBitsToDevice(hdcWindow,
                          xDest,
                          yDest,
                          static_cast<DWORD>(width),
                          static_cast<DWORD>(height),
                          xSrc,
                          ySrc,
                          0,
                          static_cast<UINT>(height),
                          BlurredImage,
                          &bmpInfo,
                          DIB_RGB_COLORS) == 0)
    {
        delete[] BlurredImage;
        std::cout << "SetDIBitsToDevice failed." << std::endl;
        std::cout << GetLastErrorAsString() << std::endl;
    }

    // // A file is created, this is where we will save the screen capture.
    // hFile = CreateFile("captureqwsx.bmp",
    //     GENERIC_WRITE,
    //     0,
    //     NULL,
    //     CREATE_ALWAYS,
    //     FILE_ATTRIBUTE_NORMAL, NULL);

    // // Add the size of the headers to the size of the bitmap to get the total file size.
    // dwSizeofDIB = dwBmpSize + sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);

    // // Offset to where the actual bitmap bits start.
    // bmfHeader.bfOffBits = (DWORD)sizeof(BITMAPFILEHEADER) + (DWORD)sizeof(BITMAPINFOHEADER);

    // // Size of the file.
    // bmfHeader.bfSize = dwSizeofDIB;

    // // bfType must always be BM for Bitmaps.
    // bmfHeader.bfType = 0x4D42; // BM.

    // WriteFile(hFile, (LPSTR)&bmfHeader, sizeof(BITMAPFILEHEADER), &dwBytesWritten, NULL);
    // WriteFile(hFile, (LPSTR)&bi, sizeof(BITMAPINFOHEADER), &dwBytesWritten, NULL);
    // WriteFile(hFile, (LPSTR)lpbitmap, dwBmpSize, &dwBytesWritten, NULL);

    // Unlock and Free the DIB from the heap.
    GlobalUnlock(hDIB);
    GlobalFree(hDIB);

    // Close the handle for the file that was created.
    CloseHandle(hFile);

    // Clean up.
done:
    DeleteObject(hbmScreen);
    DeleteObject(hdcMemDC);
    ReleaseDC(NULL, hdcScreen);
    ReleaseDC(hWnd, hdcWindow);

    return 0;
}
// Message handler for about box.
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
    case WM_INITDIALOG:
        return (INT_PTR)TRUE;

    case WM_COMMAND:
        if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
        {
            EndDialog(hDlg, LOWORD(wParam));
            return (INT_PTR)TRUE;
        }
        break;
    }
    return (INT_PTR)FALSE;
}

//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEXA ClassEx = { 0 };
    ClassEx.cbSize = sizeof(WNDCLASSEX);

    if (hInstance == nullptr)
    {
        std::cout << "Oh nooooo" << std::endl;
    }

    ClassEx.style = CS_HREDRAW | CS_VREDRAW;
    ClassEx.lpfnWndProc = WndProc;
    ClassEx.cbClsExtra = 0;
    ClassEx.cbWndExtra = 0;
    ClassEx.hInstance = hInstance;
    // ClassEx.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_GDICAPTURINGANIMAGE));
    ClassEx.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    // ClassEx.lpszMenuName = MAKEINTRESOURCEW(IDC_GDICAPTURINGANIMAGE);
    ClassEx.lpszClassName = szWindowClass;
    // ClassEx.hIconSm = LoadIcon(ClassEx.hInstance, MAKEINTRESOURCE(IDI_SMALL));

    return RegisterClassExA(&ClassEx);
}
BOOL             InitInstance(HINSTANCE);
INT_PTR CALLBACK About(HWND, UINT, WPARAM, LPARAM);

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//
//  PURPOSE: Processes messages for the main window.
//
//  WM_COMMAND  - process the application menu
//  WM_PAINT    - Paint the main window
//  WM_DESTROY  - post a quit message and return
//
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    // case WM_COMMAND:
    // {
    //     int wmId = LOWORD(wParam);
    //     // Parse the menu selections:
    //     switch (wmId)
    //     {
    //     case IDM_ABOUT:
    //         DialogBox(hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), hWnd, About);
    //         break;
    //     case IDM_EXIT:
    //         DestroyWindow(hWnd);
    //         break;
    //     default:
    //         return DefWindowProc(hWnd, message, wParam, lParam);
    //     }
    // }
    // break;
    case WM_PAINT:
    {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hWnd, &ps);
        CaptureImageInternal(hWnd);
        EndPaint(hWnd, &ps);
    }
    break;
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}

