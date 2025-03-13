/* File:      CaptureImage.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#include "CaptureImage.h"
#include "Core/WindowUtilities.h"

#define MAX_LOADSTRING 100

bool HasDrawn = false;

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
        std::cout << GetLastWindowsError() << std::endl;
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

    HDC ScreenDc = GetDC(NULL);

    BITMAP structBitmapHeader;
    memset( &structBitmapHeader, 0, sizeof(BITMAP) );

    HGDIOBJ hBitmap = GetCurrentObject(ScreenDc, OBJ_BITMAP);
    GetObject(hBitmap, sizeof(BITMAP), &structBitmapHeader);

    std::cout << "Init: " << structBitmapHeader.bmWidth << " " << structBitmapHeader.bmHeight << std::endl;

    HWND hWnd = CreateWindowA(
        szWindowClass,
        "CaptureImageWindow",
        WS_OVERLAPPEDWINDOW,
        0,
        0,
        structBitmapHeader.bmWidth,
        structBitmapHeader.bmHeight,
        nullptr,
        nullptr,
        hInstance,
        nullptr
    );

    if (!hWnd)
    {
        std::cout << "InitInstance failed up here." << std::endl;
        std::cout << GetLastWindowsError() << std::endl;
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

void MultiplyPixelsWithColor(const char* HexColor, unsigned char* PixelArray, int Width, int Height)
{
    if (!HexColor || !PixelArray || Width <= 0 || Height <= 0)
    {
        std::cout << "Invalid arguments!!" << std::endl;
    }

    // Skip leading '#' if present
    const char* colorStr = HexColor;
    if (*colorStr == '#')
    {
        colorStr++;
    }

    // Ensure the length is at least 6 for RRGGBB
    // We do not strictly validate beyond that here, but this can be extended.
    // If not properly formatted, sscanf will fail to parse.
    if (std::strlen(colorStr) < 6)
    {
        std::cout << "Hex color string is too short." << std::endl;
    }

    unsigned int red = 0, green = 0, blue = 0;

    // Parse the RRGGBB hex color. Example: "FFA07A"
    // %2x reads two hex chars as one byte
    int result = std::sscanf(colorStr, "%2x%2x%2x", &red, &green, &blue);
    if (result != 3)
    {
        std::cout << "Failed to parse hex color string." << std::endl;
    }

    // For each pixel, we have B, G, R in PixelArray:
    // PixelArray[i+0] = Blue
    // PixelArray[i+1] = Green
    // PixelArray[i+2] = Red

    // We must multiply:
    // Blue component by (blue/255)
    // Green component by (green/255)
    // Red component by (red/255)

    int totalPixels = Width * Height;
    for (int p = 0; p < totalPixels; p++)
    {
        int i = p * 4;

        // Multiply and scale each channel
        unsigned char originalRed = PixelArray[i + 0];
        unsigned char originalGreen = PixelArray[i + 1];
        unsigned char originalBlue = PixelArray[i + 2];

        PixelArray[i + 0] = static_cast<unsigned char>((originalRed  * red)  / 255);
        PixelArray[i + 1] = static_cast<unsigned char>((originalGreen * green) / 255);
        PixelArray[i + 2] = static_cast<unsigned char>((originalBlue   * blue)   / 255);
        // PixelArray[i] = static_cast<unsigned char>(originalRed / 2);
        // PixelArray[i + 1] = static_cast<unsigned char>(originalGreen / 2);
    }
}

void DrawSorrellWindow(HWND MainWindow, HDC HdcTarget)
{
    // Find the target window named "SorrellWm"
    HWND SorrellWnd = FindWindowA(NULL, "SorrellWm");
    if (!SorrellWnd)
    {
        // If window not found, do nothing
        std::cout << "Test window not found." << std::endl;
        return;
    }

    // Get device contexts
    // HDC HdcTarget = GetDC(SorrellWnd);
    HDC HdcMain = GetDC(MainWindow);

    if (!HdcTarget || !HdcMain)
    {
        std::cout << "Something is wrong here." << std::endl;
        if (HdcTarget) ReleaseDC(SorrellWnd, HdcTarget);
        if (HdcMain) ReleaseDC(MainWindow, HdcMain);
        return;
    }

    // Get the size of the target window
    RECT TargetRect;
    GetClientRect(SorrellWnd, &TargetRect);
    int Width = TargetRect.right - TargetRect.left;
    int Height = TargetRect.bottom - TargetRect.top;
    std::cout << "At line 217, Width is " << Width << " and Height is " << Height << std::endl;

    // Create a compatible DC and bitmap for the target content
    HDC HdcMem = CreateCompatibleDC(HdcTarget);
    std::cout << "Line 222" << std::endl;
    HBITMAP HbmScreen = CreateCompatibleBitmap(HdcTarget, Width, Height);
    std::cout << "Line 223" << std::endl;
    SelectObject(HdcMem, HbmScreen);
    std::cout << "Line 224" << std::endl;

    // BitBlt the target window into the memory DC
    BitBlt(HdcMem, 0, 0, Width, Height, HdcTarget, 0, 0, SRCCOPY);

    // Now BitBlt the memory DC onto the main window
    RECT ClientRect;
    GetClientRect(MainWindow, &ClientRect);
    int MainWidth = ClientRect.right - ClientRect.left;
    int MainHeight = ClientRect.bottom - ClientRect.top;

    // Center the captured image in the main window (optional)
    // int DestX = (MainWidth - Width) / 2;
    // int DestY = (MainHeight - Height) / 2;

    std::cout << "Line 241" << std::endl;
    BitBlt(HdcMain, 0, 0, Width, Height, HdcMem, 0, 0, SRCCOPY);
    std::cout << "Line 243" << std::endl;

    // Cleanup
    DeleteObject(HbmScreen);
    DeleteDC(HdcMem);
    ReleaseDC(SorrellWnd, HdcTarget);
    ReleaseDC(MainWindow, HdcMain);
    std::cout << "Line 250" << std::endl;
}

int CaptureImageInternal(HWND hWnd)
{
    HDC hdcScreen;
    HDC hdcWindow;
    HDC hdcMemDC = NULL;
    HBITMAP hbmScreen = NULL;
    BITMAP bmpScreen = { 0 };
    DWORD dwBytesWritten = 0;
    DWORD dwSizeofDIB = 0;
    // HANDLE hFile = NULL;
    char* lpbitmap = NULL;
    HANDLE hDIB = NULL;
    HANDLE hDIBOther = NULL;
    DWORD dwBmpSize = 0;

    if (HasDrawn)
    {
        return 0;
    }

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

    if (!BitBlt(hdcWindow, 0, 0, (rcClient.right - rcClient.left) / 2, (rcClient.bottom - rcClient.top) / 2, hdcScreen, 0, 0, SRCCOPY))
    {
        std::cout << "BitBlt Failed" << std::endl;
        std::cout << GetLastWindowsError() << std::endl;
    }
    // // This is the best stretch mode.
    // SetStretchBltMode(hdcWindow, HALFTONE);

    // // The source DC is the entire screen, and the destination DC is the current window (HWND).
    // if (!StretchBlt(hdcWindow,
    //     0, 0,
    //     rcClient.right, rcClient.bottom,
    //     hdcScreen,
    //     0, 0,
    //     GetSystemMetrics(SM_CXSCREEN),
    //     GetSystemMetrics(SM_CYSCREEN),
    //     SRCCOPY))
    // {
    //     std::cout << "StretchBlt has failed" << std::endl;
    //     goto done;
    // }

    // Create a compatible bitmap from the Window DC.
    hbmScreen = CreateCompatibleBitmap(hdcWindow, (rcClient.right - rcClient.left) / 2, (rcClient.bottom - rcClient.top) / 2);

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
        (rcClient.right - rcClient.left) / 2, (rcClient.bottom - rcClient.top) / 2,
        hdcWindow,
        0, 0,
        SRCCOPY))
    {
        std::cout << "BitBlt has Failed." << std::endl;
        goto done;
    }

    // Get the BITMAP from the HBITMAP.
    GetObject(hbmScreen, sizeof(BITMAP), &bmpScreen);

    int width = bmpScreen.bmWidth / 2;
    int height = bmpScreen.bmHeight / 2;
    int bitCount = 24; // 24 bits means 3 bytes per pixel: B, G, R
    int bytesPerPixel = bitCount / 8;
    // int imageSize = width * height * bytesPerPixel;

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
    bi.biSizeImage = 0;
    BITMAPINFO bmpInfo = { 0 };
    bmpInfo.bmiHeader = bi;

    dwBmpSize = (((bmpScreen.bmWidth / 2) * bi.biBitCount + 31) / 32) * 4 * (bmpScreen.bmHeight / 2);

    std::cout << "bmpScreen.bmHeight is " << bmpScreen.bmHeight << std::endl;
    std::cout << "bmpScreen.bmWidth is " << bmpScreen.bmWidth << std::endl;
    std::cout << "bit.biBitCount is " << bi.biBitCount << std::endl;

    // hDIB = GlobalAlloc(GHND, dwBmpSize);
    // hDIBOther = GlobalAlloc(GHND, dwBmpSize);
    hDIB = GlobalAlloc(GPTR, dwBmpSize);
    hDIBOther = GlobalAlloc(GPTR, dwBmpSize);
    // lpbitmap = (char*)GlobalLock(hDIB);
    unsigned char* pixelData = (unsigned char*) GlobalLock(hDIB);
    unsigned char* BlurredImage = (unsigned char*) GlobalLock(hDIB);
    std::cout << "After GlobalAlloc calls" << std::endl;

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
        std::cout << GetLastWindowsError() << std::endl;
        std::cout << hdcWindow << "\n" << hbmScreen << "\n" << height << "\n" << pixelData[0] << "\n" << bmpInfo.bmiHeader.biWidth << "\n" << DIB_RGB_COLORS << std::endl;
    }
    std::cout << "After First GetDIBits call" << std::endl;

    // Blur(
    //     pixelData,
    //     BlurredImage,
    //     width,
    //     height,
    //     3,
    //     2,
    //     3,
    //     kExtend
    // );
    BlurredImage = pixelData;

    MultiplyPixelsWithColor("#00FAFF", BlurredImage, width, height);

    int xDest = 0;
    int yDest = 0;
    int xSrc = 0;
    int ySrc = 0;

    if (SetDIBitsToDevice(hdcWindow,
                          0,
                          0,
                          static_cast<DWORD>(width),
                          static_cast<DWORD>(height),
                          0,
                          0,
                          0,
                          static_cast<UINT>(height),
                          BlurredImage,
                          &bmpInfo,
                          DIB_RGB_COLORS) == 0)
    {
        delete[] BlurredImage;
        std::cout << "SetDIBitsToDevice failed." << std::endl;
        std::cout << GetLastWindowsError() << std::endl;
    }

    HasDrawn = true;
    std::cout << "After HasDrawn" << std::endl;

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
    std::cout << "Immediately before Global calls." << std::endl;
    GlobalUnlock(hDIB);
    GlobalFree(hDIB);
    GlobalUnlock(hDIBOther);
    GlobalFree(hDIBOther);
    std::cout << "After Global calls." << std::endl;

    // Close the handle for the file that was created.
    // CloseHandle(hFile);

    // Clean up.
done:
    DeleteObject(hbmScreen);
    DeleteObject(hdcMemDC);
    ReleaseDC(NULL, hdcScreen);
    ReleaseDC(hWnd, hdcWindow);

    std::cout << "Made it through CaptureImageInternal" << std::endl;

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
        if (hdc == nullptr)
        {
            std::cout << "WM_PAINT NULLPTR" << std::endl;
        }
        else
        {
            std::cout << "wm_paint NOT nullptr" << std::endl;
        }

        // CaptureImageInternal(hWnd);
        DrawSorrellWindow(hWnd, hdc);
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

