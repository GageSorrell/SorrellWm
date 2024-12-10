#include "BlurBackground.h"

// static char g_szAppName[] = "Example4";
// static char g_szAppTitle[] = "Example 4";
// static int DIB_DEPTH = 24;
// static int DIB_WIDTH = 320;
// static int DIB_HEIGHT = 240;

// BYTE* Screenshot = NULL;
// LPBITMAPINFO BitmapInfo = NULL;

// LPBITMAPINFO CreateDIB(int cx, int cy, int iBpp, BYTE* &pBits)
// {
// 	LPBITMAPINFO lpBmi;
// 	int iBmiSize;
// 	int iSurfaceSize;

// 	// Calculate the size of the bitmap info header.
// 	switch(iBpp) {
// 	case 8 :		// 8 bpp
// 		iBmiSize = sizeof(BITMAPINFO) + sizeof(RGBQUAD) * 256;
// 		iSurfaceSize = cx * cy * sizeof(BYTE);
// 		break;

// 	case 15 :	// 15/16 bpp
// 	case 16 :
// 		iBmiSize = sizeof(BITMAPINFO) + sizeof(DWORD) * 4;
// 		iSurfaceSize = cx * cy * sizeof(WORD);
// 		break;

// 	case 24 :	// 24 bpp
// 		iBmiSize = sizeof(BITMAPINFO);
// 		iSurfaceSize = cx * cy * (sizeof(BYTE) * 3);
// 		break;

// 	case 32 :	// 32 bpp
// 		iBmiSize = sizeof(BITMAPINFO) + sizeof(DWORD) * 4;
// 		iSurfaceSize = cx * cy * sizeof(DWORD);
// 		break;
// 	}

// 	// Allocate memory for the bitmap info header.
// 	if((lpBmi = (LPBITMAPINFO)malloc(iBmiSize)) == NULL){
// 		std::cout << "Error allocating BitmapInfo!\n";
// 		return NULL;
// 	}

// 	ZeroMemory(lpBmi, iBmiSize);

// 	// Allocate memory for the DIB surface.
// 	if((pBits = (BYTE*)malloc(iSurfaceSize)) == NULL) {
// 		std::cout << "Error allocating memory for bitmap bits\n";
// 		return NULL;
// 	}

// 	ZeroMemory(pBits, iSurfaceSize);

// 	// Initialize bitmap info header
// 	lpBmi->bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
// 	lpBmi->bmiHeader.biWidth = cx;
// 	lpBmi->bmiHeader.biHeight = -(signed)cy;		// <-- NEGATIVE MEANS TOP DOWN!!!
// 	lpBmi->bmiHeader.biPlanes = 1;
// 	lpBmi->bmiHeader.biSizeImage = 0;
// 	lpBmi->bmiHeader.biXPelsPerMeter = 0;
// 	lpBmi->bmiHeader.biYPelsPerMeter = 0;
// 	lpBmi->bmiHeader.biClrUsed = 0;
// 	lpBmi->bmiHeader.biClrImportant = 0;
// 	lpBmi->bmiHeader.biCompression = BI_RGB;

// 	// After initializing the bitmap info header we need to store some
// 	// more information depending on the bpp of the bitmap.
// 	switch(iBpp)
//     {
// 	case 8:
// 		{
// 			// For the 8bpp DIB we will create a simple grayscale palette.
// 			for(int i = 0; i < 256; i++) {
// 				lpBmi->bmiColors[i].rgbRed			= (BYTE)i;
// 				lpBmi->bmiColors[i].rgbGreen		= (BYTE)i;
// 				lpBmi->bmiColors[i].rgbBlue		= (BYTE)i;
// 				lpBmi->bmiColors[i].rgbReserved	= (BYTE)0;
// 			}

// 			//-- Set the bpp for this DIB to 8bpp.
// 			lpBmi->bmiHeader.biBitCount = 8;
// 		}
// 		break;

// 	case 15:
// 		{
// 			// This is where we will tell the DIB what bits represent what
// 			// data. This may look confusing at first but the representation
// 			// of the RGB data can be different on different devices. For
// 			// example you can have for Hicolor a 565 format. Meaning 5 bits
// 			// for red, 6 bits for green and 5 bits for blue or better stated
// 			// like RGB. But, the pixel data can also be the other way around,
// 			// for example BGR meaning, 5 bits for blue, 6 bits for green and
// 			// 5 bits for red. This piece of information will tell the bitmap
// 			// info header how the pixel data will be stored. In this case in
// 			// RGB format in 555 because this is a 15bpp DIB so the highest
// 			// bit (bit 15) will not be used.
// 			DWORD *pBmi = (DWORD*)lpBmi->bmiColors;

// 			pBmi[0] = 0x00007C00;	// Red mask
// 			pBmi[1] = 0x000003E0;	// Green mask
// 			pBmi[2] = 0x0000001F;	// Blue mask
// 			pBmi[3] = 0x00000000;	// Not used

// 			// 15bpp DIB also use 16 bits to store a pixel.
// 			lpBmi->bmiHeader.biBitCount = 16;
// 			lpBmi->bmiHeader.biCompression |= BI_BITFIELDS;
// 		}
// 		break;

// 	case 16:
// 		{
// 			// Take a look at the remarks written by 15bpp. For this format
// 			// it's the same thing, except in this case the mask's will be
// 			// different because our format will be 565 (RGB).
// 			DWORD *pBmi = (DWORD*)lpBmi->bmiColors;

// 			pBmi[0] = 0x0000F800;	// Red mask
// 			pBmi[1] = 0x000007E0;	// Green mask
// 			pBmi[2] = 0x0000001F;	// Blue mask
// 			pBmi[3] = 0x00000000;	// Not used

// 			lpBmi->bmiHeader.biBitCount = 16;
// 			lpBmi->bmiHeader.biCompression |= BI_BITFIELDS;
// 		}
// 		break;

// 	case 24:
// 		{
// 			// This is a 1:1 situation. There is no need to set any extra
// 			// information.
// 			lpBmi->bmiHeader.biBitCount = 24;
// 		}
// 		break;

// 	case 32:
// 		{
// 			// This may speak for it's self. In this case where using 32bpp.
// 			// The format will be ARGB. the Alpha (A) portion of the format
// 			// will not be used. The other mask's tell us where the bytes
// 			// for the R, G and B data will be stored in the DWORD.
// 			DWORD *pBmi = (DWORD*)lpBmi->bmiColors;

// 			pBmi[0] = 0x00FF0000;	// Red mask
// 			pBmi[1] = 0x0000FF00;	// Green mask
// 			pBmi[2] = 0x000000FF;	// Blue mask
// 			pBmi[3] = 0x00000000;	// Not used (Alpha?)

// 			lpBmi->bmiHeader.biBitCount = 32;
// 			lpBmi->bmiHeader.biCompression |= BI_BITFIELDS;
// 		}
// 		break;
// 	}

// 	return lpBmi;
// }

// void PutPixel(int x, int y, BYTE r, BYTE g, BYTE b, LPBITMAPINFO lpBmi, void* pBits)
// {
// 	int iOffset = lpBmi->bmiHeader.biWidth * y + x;

// 	switch(lpBmi->bmiHeader.biBitCount) {
// 	case 8:
// 		{
// 			// Cast void* to a BYTE* and write pixel to surface
// 			BYTE* p = (BYTE*)pBits;
// 			p[iOffset] = (BYTE)r;
// 		}
// 		break;

// 	case 15:
// 		{
// 			// Cast void* to a WORD* and write pixel to surface
// 			WORD* p = (WORD*)pBits;
// 			p[iOffset] = (WORD)(((r & 0xF8) << 7) | ((g & 0xF8) << 2) | b >> 3);
// 		}
// 		break;

// 	case 16:
// 		{
// 			// Cast void* to a WORD* and write pixel to surface
// 			WORD* p = (WORD*)pBits;
// 			p[iOffset] = (WORD)(((r & 0xF8) << 8) | ((g & 0xFC) << 3) | b >> 3);
// 		}
// 		break;

// 	case 24:
// 		{
// 			// Cast void* to a BYTE* and write pixel to surface
// 			BYTE* p = (BYTE*)pBits;
// 			p[iOffset * 3 + 0] = r;
// 			p[iOffset * 3 + 1] = g;
// 			p[iOffset * 3 + 2] = b;
// 		}
// 		break;

// 	case 32:
// 		{
// 			// Cast void* to a DWORD* and write pixel to surface
// 			DWORD* p = (DWORD*)pBits;
// 			p[iOffset] = (DWORD)((r << 16) | (g << 8) | b);
// 		}
// 		break;
// 	}
// }

// void Render(HWND Handle, LPBITMAPINFO lpBmi, void* pBits)
// {
//     HDC ScreenDc = GetDC(NULL);
//     HDC WindowDc = GetDC(Handle);
//     HDC MemDc = CreateCompatibleDC(WindowDc);
//     HBITMAP ScreenBitmapHandle = NULL;
//     BITMAP ScreenBitmap = { 0 };

//     // BITMAPINFOHEADER bi = { 0 };
//     // bi.biSize = sizeof(BITMAPINFOHEADER);
//     // bi.biWidth = DIB_WIDTH;
//     // bi.biHeight = DIB_HEIGHT;
//     // bi.biPlanes = 1;
//     // bi.biBitCount = static_cast<WORD>(DIB_DEPTH);
//     // bi.biCompression = BI_RGB;
//     // bi.biSizeImage = 0;
//     // lpBmi->bmiHeader = bi;

//     BOOL CopiedToMemDc = BitBlt(
//         MemDc,
//         0,
//         0,
//         DIB_WIDTH,
//         DIB_HEIGHT,
//         ScreenDc,
//         0,
//         0,
//         SRCCOPY
//     );

//     if (!CopiedToMemDc)
//     {
//         std::cout << "BitBlt Failed" << std::endl;
//         std::cout << GetLastErrorAsString() << std::endl;
//     }

//     ScreenBitmapHandle = CreateCompatibleBitmap(MemDc, DIB_WIDTH, DIB_HEIGHT);
//     if (ScreenBitmapHandle == nullptr)
//     {
//         std::cout << "CreateCompatibleBitmap failed for ScreenBitmapHandle." << std::endl;
//     }

//     BOOL CopiedDiBits = GetDIBits(
//         MemDc,
//         ScreenBitmapHandle,
//         0,
//         DIB_HEIGHT,
//         Screenshot,
//         lpBmi,
//         DIB_RGB_COLORS
//     );

//     if (!CopiedDiBits)
//     {
//         ReleaseDC(nullptr, WindowDc);
//         std::cout << "GetDIBits Failed" << std::endl;
//         std::cout << GetLastErrorAsString() << std::endl;
//         // std::cout << hdcWindow << "\n" << hbmScreen << "\n" << height << "\n" << pixelData[0] << "\n" << bmpInfo.bmiHeader.biWidth << "\n" << DIB_RGB_COLORS << std::endl;
//     }

// 	InvalidateRect(Handle, NULL, FALSE);
// 	// // Get a random x- and y-coordinate and plot pixel
// 	// int x = rand() % lpBmi->bmiHeader.biWidth;
// 	// int y = rand() % lpBmi->bmiHeader.biHeight;

// 	// PutPixel(x, y, rand() % 256, rand() % 256, rand() % 256, lpBmi, pBits);

// 	// // Make sure OnPaint gets called.
// 	// InvalidateRect(Handle, NULL, FALSE);
// }

// BOOL OnCreate(HWND Handle, CREATESTRUCT FAR* lpCreateStruct)
// {
// 	// Create a new DIB
//     HWND BlurredWindow = FindWindowA(0, "SorrellWm");
//     RECT WindowRect;
//     GetDwmWindowRect(Handle, &WindowRect);
//     DIB_HEIGHT = WindowRect.bottom - WindowRect.top;
//     DIB_WIDTH = WindowRect.right - WindowRect.left;
// 	BitmapInfo = CreateDIB(DIB_WIDTH, DIB_HEIGHT, DIB_DEPTH, Screenshot);
//     return BitmapInfo != NULL;
// }

// void OnDestroy(HWND Handle)
// {
// 	if(Screenshot) {
// 		free(Screenshot);
// 	}

// 	if(BitmapInfo) {
// 		free(BitmapInfo);
// 	}

// 	PostQuitMessage(0);
// }

// void OnPaint(HWND Handle)
// {
// 	static PAINTSTRUCT ps;
// 	static HDC hDC;

// 	hDC = BeginPaint(Handle, &ps);

// 	// Use StretchDIBits to display the DIB in the window.
// 	RECT rc;
// 	GetClientRect(Handle, &rc);
// 	StretchDIBits(hDC, 0, 0, rc.right - rc.left, rc.bottom - rc.top, 0, 0, DIB_WIDTH, DIB_HEIGHT, (BYTE*)Screenshot, BitmapInfo, DIB_RGB_COLORS, SRCCOPY);

// 	EndPaint(Handle, &ps);
// }

// BOOL OnEraseBkgnd(HWND Handle, HDC hdc)
// {
// 	return TRUE;
// }

// LRESULT CALLBACK BlurWndProc(HWND Handle, UINT iMsg, WPARAM wParam, LPARAM lParam)
// {
// 	switch(iMsg) {
// 		HANDLE_MSG(Handle, WM_CREATE, OnCreate);
// 		HANDLE_MSG(Handle, WM_DESTROY, OnDestroy);
// 		HANDLE_MSG(Handle, WM_PAINT, OnPaint);
// 		HANDLE_MSG(Handle, WM_ERASEBKGND, OnEraseBkgnd);
// 	}

// 	return DefWindowProc(Handle, iMsg, wParam, lParam);
// }

// // int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PSTR szCmdLine, int iCmdShow)
// Napi::Value Blurr(const Napi::CallbackInfo& CallbackInfo)
// {
//     Napi::Env Environment = CallbackInfo.Env();
//     HINSTANCE hInstance = GetModuleHandle(NULL);

// 	MSG msg;
// 	HWND BlurHandle;
// 	WNDCLASSEXA wc;

// 	wc.cbSize = sizeof(wc);
// 	wc.style = CS_VREDRAW | CS_HREDRAW;
// 	wc.lpfnWndProc = BlurWndProc;
// 	wc.cbClsExtra = 0;
// 	wc.cbWndExtra = 0;
// 	wc.hInstance = hInstance;
// 	wc.hIcon = LoadIcon(NULL, MAKEINTRESOURCE(IDI_APPLICATION));
// 	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
// 	wc.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
// 	wc.lpszMenuName = NULL;
// 	wc.lpszClassName = g_szAppName;
// 	wc.hIconSm = LoadIcon(NULL, MAKEINTRESOURCE(IDI_APPLICATION));

// 	RegisterClassExA(&wc);

// 	BlurHandle = CreateWindowExA(
// 		NULL,
// 		g_szAppName,
// 		g_szAppTitle,
// 		WS_OVERLAPPEDWINDOW,
// 		CW_USEDEFAULT,
// 		CW_USEDEFAULT,
// 		CW_USEDEFAULT,
// 		CW_USEDEFAULT,
// 		NULL,
// 		NULL,
// 		hInstance,
// 		NULL
// 	);

// 	ShowWindow(BlurHandle, SW_SHOW);
// 	UpdateWindow(BlurHandle);

// 	Render(BlurHandle, BitmapInfo, Screenshot);
// 	// while(1) {
// 	// 	if(PeekMessage(&msg, NULL, 0, 0, PM_NOREMOVE)) {
// 	// 		if(!GetMessage(&msg, NULL, 0, 0))
// 	// 			break;

// 	// 		TranslateMessage(&msg);
// 	// 		DispatchMessage(&msg);
// 	// 	}
// 	// 	else
// 	// 	if(TRUE) {
// 	// 	}
// 	// 	else {
// 	// 		WaitMessage();
// 	// 	}
// 	// }

// 	// return msg.wParam;
//     return Environment.Undefined();
// }

static char g_szAppName[] = "Example4";
static char g_szAppTitle[] = "Example 4";

static int DIB_DEPTH = 24;
static int DIB_WIDTH = 320;
static int DIB_HEIGHT = 240;
static RECT WindowRect;
static HWND Handle;
static float MinSigma = 1.f;
static float Sigma = MinSigma;
static float MaxSigma = 10.f;
static constexpr std::size_t FairlyHighResolution = 3840 * 2160 * 3;
static std::vector<BYTE> BlurredScreenshotData(FairlyHighResolution);
static std::vector<BYTE> ScreenshotData(FairlyHighResolution);
static BYTE* BlurredScreenshot;
static BYTE* Screenshot;
static bool CalledOnce = false;
static double Luminance = 0.f;
static double BrightnessScalar = 1.f;
static std::string ThemeMode = "Indeterminate";
static bool ScalesBrightness = false;
static HWND SorrellWmMainWindow = nullptr;

// BYTE* g_pBits = NULL;
// BYTE* Screenshot = NULL;
LPBITMAPINFO ScreenshotBmi = NULL;
LPBITMAPINFO BlurredBmi = NULL;

double CalculateScalingFactor(double averageLuminance)
{
    double d_dark = std::abs(averageLuminance - 85.0);
    double d_light = std::abs(170.0 - averageLuminance);

    if (d_dark < d_light) {
        if (averageLuminance <= 85.0) {
            return 1.0; // No scaling needed
        } else {
            return 85.0 / averageLuminance; // Scale down
        }
    } else {
        if (averageLuminance >= 170.0) {
            return 1.0; // No scaling needed
        } else {
            return 170.0 / averageLuminance; // Scale up
        }
    }
}

// Function to apply scaling factor to the pixel array
void ApplyScalingFactor(BYTE* pixelData, int width, int height, int channelsNum, double scalingFactor)
{
    if (!pixelData || width <= 0 || height <= 0 || (channelsNum != 3 && channelsNum != 4))
    {
        return; // Invalid input
    }

    size_t totalPixels = static_cast<size_t>(width) * height;

    for (size_t i = 0; i < totalPixels; ++i) {
        size_t index = i * channelsNum;

        // Extract original color channels
        BYTE blue = pixelData[index];
        BYTE green = pixelData[index + 1];
        BYTE red = pixelData[index + 2];
        // BYTE alpha = (channelsNum == 4) ? pixelData[index + 3] : 255; // Optional

        // Apply scaling factor
        int scaled_red = static_cast<int>(red * scalingFactor);
        int scaled_green = static_cast<int>(green * scalingFactor);
        int scaled_blue = static_cast<int>(blue * scalingFactor);

        // Clamp the values to [0, 255]
        pixelData[index + 2] = static_cast<BYTE>(std::clamp(scaled_red, 0, 255));
        pixelData[index + 1] = static_cast<BYTE>(std::clamp(scaled_green, 0, 255));
        pixelData[index]     = static_cast<BYTE>(std::clamp(scaled_blue, 0, 255));
        // pixelData[index + 3] = alpha; // Preserve alpha if present
    }
}

// Function to calculate average luminance
double CalculateAverageLuminance(const BYTE* pixelData, int width, int height, int channelsNum)
{
    if (!pixelData || width <= 0 || height <= 0 || (channelsNum != 3 && channelsNum != 4)) {
        return -1.0; // Indicates an error
    }

    double totalLuminance = 0.0;
    size_t totalPixels = static_cast<size_t>(width) * height;

    for (size_t i = 0; i < totalPixels; ++i) {
        size_t index = i * channelsNum;

        BYTE blue = pixelData[index];
        BYTE green = pixelData[index + 1];
        BYTE red = pixelData[index + 2];
        // BYTE alpha = (channelsNum == 4) ? pixelData[index + 3] : 255;

        // Calculate luminance using Rec. 709
        double luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

        totalLuminance += luminance;
    }

    double averageLuminance = totalLuminance / static_cast<double>(totalPixels);
    return averageLuminance;
}


LPBITMAPINFO CreateDIB(int cx, int cy, int iBpp, BYTE* &pBits)
{
	LPBITMAPINFO lpBmi;
	int iBmiSize = sizeof(BITMAPINFO);
	int iSurfaceSize = cx * cy * (sizeof(BYTE) * 3);

	// Allocate memory for the bitmap info header.
	if((lpBmi = (LPBITMAPINFO)malloc(iBmiSize)) == NULL){
		// std::cout << "Error allocating BitmapInfo!\n";
		return NULL;
	}

	ZeroMemory(lpBmi, iBmiSize);

	// Allocate memory for the DIB surface.
	if((pBits = (BYTE*)malloc(iSurfaceSize)) == NULL) {
		// std::cout << "Error allocating memory for bitmap bits\n";
		return NULL;
	}

	ZeroMemory(pBits, iSurfaceSize);

	// Initialize bitmap info header
	lpBmi->bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	lpBmi->bmiHeader.biWidth = cx;
	// lpBmi->bmiHeader.biHeight = -(signed)cy;		// <-- NEGATIVE MEANS TOP DOWN!!!
	lpBmi->bmiHeader.biHeight = (signed)cy;
	lpBmi->bmiHeader.biPlanes = 1;
	lpBmi->bmiHeader.biSizeImage = 0;
	lpBmi->bmiHeader.biXPelsPerMeter = 0;
	lpBmi->bmiHeader.biYPelsPerMeter = 0;
	lpBmi->bmiHeader.biClrUsed = 0;
	lpBmi->bmiHeader.biClrImportant = 0;
	lpBmi->bmiHeader.biCompression = BI_RGB;

	lpBmi->bmiHeader.biBitCount = 24;

	return lpBmi;
}

void PutPixel(int x, int y, BYTE r, BYTE g, BYTE b, LPBITMAPINFO lpBmi, void* pBits)
{
	int iOffset = lpBmi->bmiHeader.biWidth * y + x;

	// Cast void* to a BYTE* and write pixel to surface
	BYTE* p = (BYTE*)pBits;
	p[iOffset * 3 + 0] = r;
	p[iOffset * 3 + 1] = g;
	p[iOffset * 3 + 2] = b;
}

// void CaptureForegroundWindowPixels()
// {
//     HWND windowHandle = FindWindowA(0, "SorrellWm");
//     if (!windowHandle)
//     {
//         return;
//     }

//     int width = WindowRect.right - WindowRect.left;
//     int height = WindowRect.bottom - WindowRect.top;

//     HDC windowDeviceContext = GetDC(NULL);
//     if (!windowDeviceContext)
//     {
//         return;
//     }

//     BITMAPINFO bitmapInfo = { 0 };
//     bitmapInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
//     bitmapInfo.bmiHeader.biWidth = width;
//     bitmapInfo.bmiHeader.biHeight = -height; // top-down DIB
//     bitmapInfo.bmiHeader.biPlanes = 1;
//     bitmapInfo.bmiHeader.biBitCount = 24; // 24-bit pixels
//     bitmapInfo.bmiHeader.biCompression = BI_RGB;

//     VOID* bitsPointer = NULL;
//     HDC memoryDeviceContext = CreateCompatibleDC(windowDeviceContext);
//     if (!memoryDeviceContext)
//     {
//         ReleaseDC(windowHandle, windowDeviceContext);
//         return;
//     }

//     HBITMAP bitmapHandle = CreateDIBSection(memoryDeviceContext, &bitmapInfo, DIB_RGB_COLORS, &bitsPointer, NULL, 0);
//     if (!bitmapHandle)
//     {
//         DeleteDC(memoryDeviceContext);
//         ReleaseDC(windowHandle, windowDeviceContext);
//         return;
//     }

//     HGDIOBJ oldObject = SelectObject(memoryDeviceContext, bitmapHandle);

//     // Transfer the window's image into the DIB section
//     // BitBlt(memoryDeviceContext, 0, 0, width, height, windowDeviceContext, 0, 0, SRCCOPY);
//     BOOL CopiedDiBits = GetDIBits(
//         memoryDeviceContext,
//         bitmapHandle,
//         0,
//         DIB_HEIGHT,
//         Screenshot,
//         g_lpBmi,
//         DIB_RGB_COLORS
//     );

//     if (CopiedDiBits)
//     {
//         std::cout << "Copied Screenshot!" << std::endl;
//     }
//     else
//     {
//         std::cout << "Did NOT Copy Screenshot!" << std::endl;
//         LogLastWindowsError();
//     }

//     // // Calculate the row size with padding
//     // int rowSize = ((width * 24 + 31) / 32) * 4;

//     // // Allocate the output array
//     // BYTE* outputPixels = new BYTE[width * height * 3];

//     // // Copy line by line, removing padding
//     // for (int y = 0; y < height; y++)
//     // {
//     //     BYTE* sourceLine = static_cast<BYTE*>(bitsPointer) + y * rowSize;
//     //     BYTE* destinationLine = outputPixels + y * width * 3;
//     //     memcpy(destinationLine, sourceLine, width * 3);
//     // }

//     // Cleanup
//     SelectObject(memoryDeviceContext, oldObject);
//     DeleteObject(bitmapHandle);
//     DeleteDC(memoryDeviceContext);
//     ReleaseDC(windowHandle, windowDeviceContext);

//     // Return the pixel array (B, G, R order)
// }

bool CaptureWindowScreenshot(HWND SourceHandle)
{
    // if (!OutBuffer || !outWidth || !outHeight) {
    //     return false;
    // }

    // if (!GetDwmWindowRect(SourceHandle, &WindowRect))
    // {
    //     std::cout << "Failed to get window rectangle." << std::endl;
    //     return false;
    // }

    std::cout << "Left: " << WindowRect.left << "\nRight: " << WindowRect.right << "\nTop: " << WindowRect.top << "\nBottom: " << WindowRect.bottom << std::endl;

    const int Width = WindowRect.right - WindowRect.left;
    const int Height = WindowRect.bottom - WindowRect.top;
    DIB_WIDTH = Width;
    DIB_HEIGHT = Height;
    const int ChannelsNum = 3;

    // Get the device context of the window
    // HDC hdcWindow = GetDC(SourceHandle);
    HDC ScreenDc = GetDC(NULL);
    // if (hdcWindow == nullptr)
    // {
    //     std::cout << "Failed to get window device context." << std::endl;
    //     return false;
    // }

    // Create a compatible device context
    HDC hdcMemDC = CreateCompatibleDC(ScreenDc);
    if (!hdcMemDC)
    {
        std::cout << "Failed to create compatible DC." << std::endl;
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }

    // BITMAPINFO bmi = { 0 };
    // bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    // bmi.bmiHeader.biWidth = Width;
    // bmi.bmiHeader.biHeight = -Height;
    // bmi.bmiHeader.biPlanes = 1;
    // bmi.bmiHeader.biBitCount = 24;
    // bmi.bmiHeader.biCompression = BI_RGB;
    // std::cout << "Made bmi." << std::endl;

    // Create a DIB section
    // void* pvBits = NULL;
    // HBITMAP hBitmap = CreateDIBSection(ScreenDc, g_lpBmi, DIB_RGB_COLORS, &pvBits, NULL, 0);
    ScreenshotData.reserve(DIB_WIDTH * DIB_HEIGHT * 3);
    Screenshot = ScreenshotData.data();
    HBITMAP hBitmap = CreateDIBSection(ScreenDc, ScreenshotBmi, DIB_RGB_COLORS, (void**) Screenshot, NULL, 0);
    if (!hBitmap)
    {
        std::cout << "Failed to create DIB section." << std::endl;
        LogLastWindowsError();
        DeleteDC(hdcMemDC);
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "Made DIB Section." << std::endl;
    }

    // Select the bitmap into the memory DC
    HGDIOBJ hOld = SelectObject(hdcMemDC, hBitmap);
    if (!hOld)
    {
        std::cout << "Failed to select bitmap into DC." << std::endl;
        LogLastWindowsError();
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "hOld has been selected." << std::endl;
    }

    // Bit-block transfer into our compatible memory DC
    if (!BitBlt(hdcMemDC, 0, 0, Width, Height, ScreenDc, WindowRect.left, WindowRect.top, SRCCOPY))
    {
        std::cout << "BitBlt failed." << std::endl;
        SelectObject(hdcMemDC, hOld);
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(SourceHandle, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "CaptureWindowScreenshot: BitBlt call is GOOD." << std::endl;
    }

    // // Allocate memory for the pixel data
    SIZE_T bufferSize = static_cast<SIZE_T>(Width) * Height * ChannelsNum;
    ScreenshotData.reserve(bufferSize);
    // Screenshot = new (std::nothrow) BYTE[bufferSize];
    if (!Screenshot)
    {
        std::cout << "Failed to allocate memory for screenshot." << std::endl;
        LogLastWindowsError();
        SelectObject(hdcMemDC, hOld);
        DeleteObject(hBitmap);
        DeleteDC(hdcMemDC);
        ReleaseDC(NULL, ScreenDc);
        return false;
    }
    else
    {
        // std::cout << "Screenshot is GOOD!" << std::endl;
    }

    // // Retrieve the bitmap bits
    // BITMAPINFO bmiGet = {0};
    // bmiGet.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    // bmiGet.bmiHeader.biWidth = Width;
    // bmiGet.bmiHeader.biHeight = -Height;  // Top-down
    // bmiGet.bmiHeader.biPlanes = 1;
    // bmiGet.bmiHeader.biBitCount = ChannelsNum * 8;
    // bmiGet.bmiHeader.biCompression = BI_RGB;

    // g_lpBmi->bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    // g_lpBmi->bmiHeader.biWidth = Width;
    // g_lpBmi->bmiHeader.biHeight = -Height;  // Top-down
    // g_lpBmi->bmiHeader.biPlanes = 1;
    // g_lpBmi->bmiHeader.biBitCount = 24;
    // g_lpBmi->bmiHeader.biCompression = BI_RGB;

    int scanLines = GetDIBits(ScreenDc, hBitmap, 0, Height, Screenshot, ScreenshotBmi, DIB_RGB_COLORS);
    if (scanLines == 0)
    {
        std::cout << "GetDIBits failed." << std::endl;
        LogLastWindowsError();
        // delete[] Screenshot;
        Screenshot = nullptr;
    }
    else
    {
        // std::cout << "There are " << scanLines << " scanLines!" << std::endl;
    }

    //     // // Optional: Add a newline every 10 bytes for better readability
    //     // if ((i + 1) % 24 == 0)
    //     // {
    //     //     std::cout << std::endl;
    //     // }
    // }
    // std::cout << std::endl;

    Screenshot = ScreenshotData.data();
    Luminance = CalculateAverageLuminance(Screenshot, DIB_WIDTH, DIB_HEIGHT, 3);
    BrightnessScalar = CalculateScalingFactor(Luminance);
    ScalesBrightness = BrightnessScalar != 1.f;
    // std::cout << "BrightnessScalar " << std::setprecision(4) << BrightnessScalar << ", Luminance is" << Luminance << std::endl;

    // Clean up GDI objects
    SelectObject(hdcMemDC, hOld);
    DeleteObject(hBitmap);
    DeleteDC(hdcMemDC);
    ReleaseDC(nullptr, ScreenDc);

    if (scanLines == 0)
    {
        return false;
    }

    // Screenshot = (BYTE*) pvBits;
    return true;
}

// int CaptureAnImage(HWND SourceHandle)
// {
//     HDC hdcScreen;
//     HDC hdcWindow;
//     HDC hdcMemDC = NULL;
//     HBITMAP hbmScreen = NULL;
//     BITMAP bmpScreen;
//     DWORD dwBytesWritten = 0;
//     DWORD dwSizeofDIB = 0;
//     HANDLE hFile = NULL;
//     char* lpbitmap = NULL;
//     HANDLE hDIB = NULL;
//     DWORD dwBmpSize = 0;

//     // Retrieve the handle to a display device context for the client
//     // area of the window.
//     hdcScreen = GetDC(NULL);
//     hdcWindow = GetDC(SourceHandle);

//     // Create a compatible DC, which is used in a BitBlt from the window DC.
//     hdcMemDC = CreateCompatibleDC(hdcWindow);

//     if (!hdcMemDC)
//     {
//         // std::cout << "CreateCompatibleDC has failed" << std::endl;
//         goto done;
//     }

//     // // Get the client area for size calculation.
//     // RECT rcClient;
//     // GetClientRect(SourceHandle, &rcClient);

//     // This is the best stretch mode.
//     SetStretchBltMode(hdcWindow, HALFTONE);

//     // The source DC is the entire screen, and the destination DC is the current window (HWND).
//     // if (!StretchBlt(hdcWindow,
//     //     0, 0,
//     //     rcClient.right, rcClient.bottom,
//     //     hdcScreen,
//     //     0, 0,
//     //     GetSystemMetrics(SM_CXSCREEN),
//     //     GetSystemMetrics(SM_CYSCREEN),
//     //     SRCCOPY))
//     // {
//     //     MessageBox(SourceHandle, L"StretchBlt has failed", L"Failed", MB_OK);
//     //     goto done;
//     // }
//     if (!BitBlt(
//         hdcWindow,
//         WindowRect.left,
//         WindowRect.top,
//         WindowRect.right,
//         WindowRect.bottom,
//         hdcScreen,
//         0,
//         0,
//         SRCCOPY))
//     {
//         std::cout << "StretchBlt has failed" << std::endl;
//         goto done;
//     }

//     // Create a compatible bitmap from the Window DC.
//     hbmScreen = CreateCompatibleBitmap(hdcWindow, WindowRect.right - WindowRect.left, WindowRect.bottom - WindowRect.top);

//     if (!hbmScreen)
//     {
//         std::cout << "CreateCompatibleBitmap Failed" << std::endl;
//         goto done;
//     }

//     // Select the compatible bitmap into the compatible memory DC.
//     SelectObject(hdcMemDC, hbmScreen);

//     // Bit block transfer into our compatible memory DC.
//     if (!BitBlt(hdcMemDC,
//         0, 0,
//         WindowRect.right - WindowRect.left, WindowRect.bottom - WindowRect.top,
//         hdcWindow,
//         0, 0,
//         SRCCOPY))
//     {
//         std::cout << "BitBlt has failed" << std::endl;
//         LogLastWindowsError();
//         goto done;
//     }

//     GetObject(hbmScreen, sizeof(BITMAP), &bmpScreen);

//     BITMAPFILEHEADER bmfHeader;
//     BITMAPINFOHEADER bi;

//     bi.biSize = sizeof(BITMAPINFOHEADER);
//     bi.biWidth = bmpScreen.bmWidth;
//     bi.biHeight = bmpScreen.bmHeight;
//     bi.biPlanes = 1;
//     bi.biBitCount = 24;
//     bi.biCompression = BI_RGB;
//     bi.biSizeImage = 0;
//     bi.biXPelsPerMeter = 0;
//     bi.biYPelsPerMeter = 0;
//     bi.biClrUsed = 0;
//     bi.biClrImportant = 0;

//     dwBmpSize = ((bmpScreen.bmWidth * bi.biBitCount + 31) / 32) * 4 * bmpScreen.bmHeight;

//     // Starting with 32-bit Windows, GlobalAlloc and LocalAlloc are implemented as wrapper functions that
//     // call HeapAlloc using a handle to the process's default heap. Therefore, GlobalAlloc and LocalAlloc
//     // have greater overhead than HeapAlloc.
//     hDIB = GlobalAlloc(GHND, dwBmpSize);
//     lpbitmap = (char*)GlobalLock(hDIB);

//     // Gets the "bits" from the bitmap, and copies them into a buffer
//     // that's pointed to by lpbitmap.
//     GetDIBits(hdcWindow, hbmScreen, 0,
//         (UINT)bmpScreen.bmHeight,
//         lpbitmap,
//         (BITMAPINFO*)&bi, DIB_RGB_COLORS);

//     Screenshot = (BYTE*) lpbitmap;

//     // // A file is created, this is where we will save the screen capture.
//     // hFile = CreateFile(L"captureqwsx.bmp",
//     //     GENERIC_WRITE,
//     //     0,
//     //     NULL,
//     //     CREATE_ALWAYS,
//     //     FILE_ATTRIBUTE_NORMAL, NULL);

//     // // Add the size of the headers to the size of the bitmap to get the total file size.
//     // dwSizeofDIB = dwBmpSize + sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);

//     // // Offset to where the actual bitmap bits start.
//     // bmfHeader.bfOffBits = (DWORD)sizeof(BITMAPFILEHEADER) + (DWORD)sizeof(BITMAPINFOHEADER);

//     // // Size of the file.
//     // bmfHeader.bfSize = dwSizeofDIB;

//     // // bfType must always be BM for Bitmaps.
//     // bmfHeader.bfType = 0x4D42; // BM.

//     // WriteFile(hFile, (LPSTR)&bmfHeader, sizeof(BITMAPFILEHEADER), &dwBytesWritten, NULL);
//     // WriteFile(hFile, (LPSTR)&bi, sizeof(BITMAPINFOHEADER), &dwBytesWritten, NULL);
//     // WriteFile(hFile, (LPSTR)lpbitmap, dwBmpSize, &dwBytesWritten, NULL);

//     // Unlock and Free the DIB from the heap.
//     GlobalUnlock(hDIB);
//     GlobalFree(hDIB);

//     // Close the handle for the file that was created.
//     // CloseHandle(hFile);

//     // Clean up.
// done:
//     DeleteObject(hbmScreen);
//     DeleteObject(hdcMemDC);
//     ReleaseDC(NULL, hdcScreen);
//     ReleaseDC(SourceHandle, hdcWindow);

//     return 0;
// }

void Render(HWND hWnd, HWND SourceHandle)
{
    // // Get a random x- and y-coordinate and plot pixel
    // int x = rand() % lpBmi->bmiHeader.biWidth;
    // int y = rand() % lpBmi->bmiHeader.biHeight;

    // PutPixel(x, y, rand() % 256, rand() % 256, rand() % 256, lpBmi, pBits);

    // CaptureForegroundWindowPixels();
    BOOL Captured = CaptureWindowScreenshot(SourceHandle);
    if (Captured)
    {
        std::cout << "CapturedWindowScreenshot Successfully." << std::endl;
    }
    else
    {
        std::cout << "CapturedWindowScreenshot FAILED." << std::endl;
    }

	// Make sure OnPaint gets called.
	InvalidateRect(hWnd, NULL, FALSE);
}

static DWORD BlurStartTime = 0;
static DWORD FadeStartTime = 0;
static DWORD BlurLastTimestamp = 0;
static DWORD FadeLastTimestamp = 0;
static const UINT_PTR BlurTimerId = 1;
static const UINT_PTR FadeTimerId = 2;
static const int Duration = 200;
static const int MsPerFrame = static_cast<int>(1000 / 90);

BOOL OnCreate(HWND hWnd, CREATESTRUCT FAR* lpCreateStruct)
{
    BlurLastTimestamp = BlurStartTime;
    SetTimer(hWnd, BlurTimerId, MsPerFrame, NULL);
	// Create a new DIB
	if((ScreenshotBmi = CreateDIB(DIB_WIDTH, DIB_HEIGHT, DIB_DEPTH, Screenshot)) == NULL)
    {
        std::cout << "g_lpBmi COULD NOT BE CREATED" << std::endl;
		return FALSE;
	}
    else
    {
        std::cout << "g_lpBmi WAS CREATED ! ! !" << std::endl;
    }
	if((BlurredBmi = CreateDIB(DIB_WIDTH, DIB_HEIGHT, DIB_DEPTH, BlurredScreenshot)) == NULL)
    {
        std::cout << "BlurredBmi COULD NOT BE CREATED" << std::endl;
		return FALSE;
	}
    else
    {
        std::cout << "BlurredBmi was created." << std::endl;
    }

	return TRUE;
}

// Where to pick up...
// Currently, activating the WM works correctly when the SourceHandle
// is the window created by Electron at launch.
// Otherwise, for any other window, it works right the first time, but
// then only shows SorrellWmMainWindow when fading to zero opacity.

void OnDestroy(HWND hWnd)
{
	if(ScreenshotBmi)
    {
		free(ScreenshotBmi);
	}
	if(BlurredBmi)
    {
		free(BlurredBmi);
	}

    WindowRect = RECT();
    Handle = nullptr;
    Sigma = MinSigma;
    // BlurredScreenshotData(FairlyHighResolution);
    // ScreenshotData(FairlyHighResolution);
    CalledOnce = false;
    Luminance = 0.f;
    BrightnessScalar = 1.f;
    ThemeMode = "Indeterminate";
    ScalesBrightness = false;
    BlurStartTime = 0;
    FadeStartTime = 0;
    BlurLastTimestamp = 0;
    FadeLastTimestamp = 0;
    BOOL Here = SetWindowPos(SorrellWmMainWindow, HWND_TOP, 2000, 2000, 0, 0, SWP_NOSIZE);
    if (Here)
    {
        std::cout << "Here was true." << std::endl;
    }
    else
    {
        std::cout << "Here was false." << std::endl;
    }
}

void GetBackgroundMode()
{
    double d_dark = std::abs(Luminance - 85.0);
    double d_light = std::abs(170.0 - Luminance);

    if (d_dark < d_light) {
        ThemeMode = "Dark";
        // if (averageLuminance <= 85.0)
        // {
        //     ThemeMode = "Dark";
        // }
        // else
        // {
        //     ThemeMode = "Dark Mode Target: Scale Down";
        // }
    }
    else
    {
        ThemeMode = "Light";
        // if (averageLuminance >= 170.0)
        // {
        //     return "Light Mode Background";
        // }
        // else
        // {
        //     return "Light Mode Target: Scale Up";
        // }
    }
}
static bool PaintedOnce = false;

void OnPaint(HWND hWnd)
{
	static PAINTSTRUCT ps;
	static HDC hDC;

    // if (CalledOnce)
    // {
    //     return;
    // }

	hDC = BeginPaint(hWnd, &ps);

    BITMAPINFO bmi;
    ZeroMemory(&bmi, sizeof(BITMAPINFO));
    bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
    bmi.bmiHeader.biWidth = DIB_WIDTH;
    bmi.bmiHeader.biHeight = -DIB_HEIGHT; // Negative to indicate a top-down DIB
    bmi.bmiHeader.biPlanes = 1;
    bmi.bmiHeader.biBitCount = 24;
    bmi.bmiHeader.biCompression = BI_RGB;
    // std::cout << "OnPaint: Made BITMAPINFO" << std::endl;

    // for (LONG Index = 0; Index < DIB_WIDTH * DIB_HEIGHT * 3; Index++)
    // {
    //     Screenshot[Index] = Index % 3 == 0 ? 255 : 0;
    // }
    // std::cout << "OnPaint: Made Screenshot red." << std::endl;

    // std::cout << "DIB_WIDTH and height are " << DIB_WIDTH << ", " << DIB_HEIGHT << std::endl;

    std::cout << "Blur is being called with Sigma " << std::setprecision(4) << Sigma << std::endl;
    // CalledOnce = true;
    SIZE_T bufferSize = static_cast<SIZE_T>(DIB_WIDTH) * DIB_HEIGHT * 3;
    // BYTE* BlurredScreenshot = new (std::nothrow) BYTE[bufferSize];
    BlurredScreenshotData.reserve(bufferSize);
    BlurredScreenshot = BlurredScreenshotData.data();
    // TestScreenshotData = std::vector<BYTE>(ScreenshotData);
    // TestScreenshotData(ScreenshotData);
    // TestScreenshotData.reserve(bufferSize);
    // copy(ScreenshotData, TestScreenshotData, back_inserter());
    // TestScreenshot = TestScreenshotData.data();
    Screenshot = ScreenshotData.data();
    if (Sigma < MaxSigma)
    {
        Blur(Screenshot, BlurredScreenshot, DIB_WIDTH, DIB_HEIGHT, 3, Sigma, 3, kExtend);

        int result =
            SetDIBitsToDevice(hDC, 0, 0, DIB_WIDTH, DIB_HEIGHT, 0, 0, 0, DIB_HEIGHT,
                            BlurredScreenshot, BlurredBmi, DIB_RGB_COLORS);

        BlurredScreenshot = BlurredScreenshotData.data();
        if (ScalesBrightness)
        {
            const float Alpha = Sigma / MaxSigma;
            const float Brightness = BrightnessScalar * Alpha;
            // const float Brightness = 0.25f;
            // std::cout << "Scaling Factor is " << std::setprecision(4) << Brightness << std::endl;
            ApplyScalingFactor(BlurredScreenshot, DIB_WIDTH, DIB_HEIGHT, 3, Brightness);
        }
    }

    // std::cout << "PAINT result is " << result << std::endl;

    if (!PaintedOnce)
    {
        PaintedOnce = true;
        ShowWindow(hWnd, SW_SHOW);
        ShowWindow(SorrellWmMainWindow, SW_SHOW);
        SetForegroundWindow(SorrellWmMainWindow);
    }

    // SetDIBitsToDevice(
    //     hDC,
    //     0,
    //     0,
    //     DIB_WIDTH,
    //     DIB_HEIGHT,
    //     0,
    //     0,
    //     0,
    //     DIB_HEIGHT,
    //     (BYTE*) Screenshot,
    //     g_lpBmi,
    //     DIB_RGB_COLORS
    // );

	// // Use StretchDIBits to display the DIB in the window.
	// RECT rc;
	// GetClientRect(hWnd, &rc);
	// StretchDIBits(hDC, 0, 0, rc.right - rc.left, rc.bottom - rc.top, 0, 0, DIB_WIDTH, DIB_HEIGHT, (BYTE*)g_pBits, g_lpBmi, DIB_RGB_COLORS, SRCCOPY);

    // std::cout << "Finished paint" << std::endl;
	EndPaint(hWnd, &ps);
}

BOOL OnEraseBkgnd(HWND hWnd, HDC hdc)
{
	return TRUE;
}

LRESULT CALLBACK BlurWndProc(HWND hWnd, UINT iMsg, WPARAM wParam, LPARAM lParam)
{
	switch(iMsg)
    {
		HANDLE_MSG(hWnd, WM_CREATE, OnCreate);
		HANDLE_MSG(hWnd, WM_DESTROY, OnDestroy);
		HANDLE_MSG(hWnd, WM_PAINT, OnPaint);
		// HANDLE_MSG(hWnd, WM_TIMER, OnTimer);
		HANDLE_MSG(hWnd, WM_ERASEBKGND, OnEraseBkgnd);
        case WM_TIMER:
        {
            DWORD currentTime = GetTickCount();
            DWORD elapsedTime = 0;
            switch (wParam)
            {
                case BlurTimerId:
                    if (BlurStartTime == 0)
                    {
                        BlurStartTime = GetTickCount();
                        InvalidateRect(SorrellWmMainWindow, NULL, FALSE);
                    }
                    elapsedTime = currentTime - BlurStartTime;
                    if (elapsedTime == 0)
                    {
                        InvalidateRect(hWnd, NULL, FALSE);
                    }
                    // std::cout << "WM_TIMER Fired! " << std::endl;
                    if (elapsedTime >= Duration)
                    {
                        std::cout << std::setprecision(10) << "For the blur timer, elapsedTime >= Duration: " << +(elapsedTime) << " >= " << Duration << " and a final Sigma of " << Sigma << std::endl;
                        Sigma = MaxSigma;
                        BOOL PostTimerRes = SetLayeredWindowAttributes(SorrellWmMainWindow, 0, 255, LWA_ALPHA);
                        if (PostTimerRes)
                        {
                            std::cout << "PostTimerRes was true." << std::endl;
                        }
                        else
                        {
                            std::cout << "PostTimerRes was false." << std::endl;
                        }
                        InvalidateRect(hWnd, NULL, FALSE);
                        KillTimer(hWnd, BlurTimerId);
                    }
                    else if (currentTime - BlurLastTimestamp >= MsPerFrame)
                    {
                        const float Alpha = static_cast<float>((float) elapsedTime / (float) Duration);
                        // const float Factor = 1.f - std::exp(-2.f * (elapsedTime / Duration));
                        const float Factor = 1 - std::pow(2, -10.f * Alpha);
                        Sigma = MinSigma + (MaxSigma - MinSigma) * Factor;
                        InvalidateRect(hWnd, NULL, FALSE);

                        // std::cout << std::setprecision(4) << "Sigma is " << Sigma << " at time " << currentTime << " with Factor " << Factor << " and Alpha " << Alpha << std::endl;

                        unsigned char Transparency = static_cast<unsigned char>(std::clamp(std::round(255.f * Alpha), 0.f, 255.f));
                        // unsigned char Transparency = static_cast<unsigned char>(std::round(255 * Alpha));
                        BOOL Res = SetLayeredWindowAttributes(SorrellWmMainWindow, 0, Transparency, LWA_ALPHA);
                        if (!Res)
                        {
                            std::cout << "SetLayeredWindowAttributes failed when increasing opacity." << std::endl;
                            LogLastWindowsError();
                        }
                        // std::cout << static_cast<int>(Transparency) << " " << Alpha << " " << Res << std::endl;

                        BlurLastTimestamp = currentTime;
                    }
                    else
                    {
                        std::cout << std::setprecision(4) << "WM_TIMER came too soon, " << currentTime << " " << BlurLastTimestamp << std::endl;
                    }
                    return 0;
                case FadeTimerId:
                    Sigma = MinSigma;
                    elapsedTime = currentTime - FadeStartTime;
                    if (elapsedTime >= Duration)
                    {
                        std::cout << "Destroying window..." << std::endl;
                        ShowWindow(hWnd, SW_HIDE);
                        DestroyWindow(hWnd);
                    }
                    // InvalidateRect(hWnd, NULL, FALSE);
                    if (elapsedTime == 0)
                    {
                        InvalidateRect(hWnd, NULL, FALSE);
                    }
                    if (elapsedTime >= Duration)
                    {
                        std::cout << std::setprecision(2) << "For the Fade timer, elapsedTime >= Duration: " << std::to_string(static_cast<unsigned int>(elapsedTime)) << " >= " << Duration << std::endl;
                        KillTimer(hWnd, FadeTimerId);
                        SetLayeredWindowAttributes(Handle, 0, 0, LWA_ALPHA);
                        SetLayeredWindowAttributes(SorrellWmMainWindow, 0, 255, LWA_ALPHA);
                        // Might not need this, and it is expensive...
                        InvalidateRect(SorrellWmMainWindow, NULL, FALSE);
                    }
                    else if (currentTime - FadeLastTimestamp >= MsPerFrame)
                    {
                        // const float EasedAlpha = std::exp(-2.f * (1.f - (elapsedTime / Duration)));
                        const float EasedAlpha = 1.f - std::pow(2, -10.f * ((float) elapsedTime / (float) Duration));
                        const float Alpha = elapsedTime / (float) Duration;
                        unsigned char Transparency = static_cast<unsigned char>(std::clamp(std::round(255.f - 255.f * EasedAlpha), 0.f, 255.f));
                        unsigned char MainWindowTransparency = static_cast<unsigned char>(std::clamp(std::round(255.f - 255.f * Alpha), 0.f, 255.f));
                        InvalidateRect(hWnd, NULL, FALSE);
                        std::cout << std::setprecision(4) << "Transparency is " << +(Transparency) << " at time " << currentTime << " with EasedAlpha " << EasedAlpha << std::endl;

                        SetLayeredWindowAttributes(Handle, 0, Transparency, LWA_ALPHA);
                        SetLayeredWindowAttributes(SorrellWmMainWindow, 0, MainWindowTransparency, LWA_ALPHA);

                        FadeLastTimestamp = currentTime;
                    }
                    else
                    {
                        std::cout << "WM_TIMER came too soon, " << currentTime << " " << FadeLastTimestamp << std::endl;
                    }
                    return 0;
            }
        }
	}

	return DefWindowProc(hWnd, iMsg, wParam, lParam);
}

Napi::Value TearDown(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();

    std::cout << "Tearing down window!" << std::endl;

    BOOL Shadow = false;
    BOOL SystemSuccess = SystemParametersInfoA(SPI_GETDROPSHADOW, 0, &Shadow, 0);
    if (Shadow)
    {
        std::cout << "Shadow is TRUE" << std::endl;
    }
    else
    {
        std::cout << "Shadow is FALSE" << std::endl;
    }
    if (SystemSuccess)
    {
        std::cout << "SystemSuccess is TRUE" << std::endl;
    }
    else
    {
        std::cout << "SystemSuccess is FALSE" << std::endl;
    }

    /* @TODO If this is called while the blur is still animating, then the fade animation should only take the length of time that the blur animation played. */

    BOOL KillResult = KillTimer(Handle, BlurTimerId);
    if (!KillResult)
    {
        std::cout << "KillTimer for BlurTimerId returned " << KillResult << std::endl;
        LogLastWindowsError();
    }

    FadeStartTime = GetTickCount();
    FadeLastTimestamp = FadeStartTime;
    int SetTimerResult = SetTimer(Handle, FadeTimerId, MsPerFrame, NULL);
    // std::cout << "SetTimer for FadeTimerId returned " << SetTimerResult << std::endl;
    // std::cout << "Called everything!" << std::endl;
    // LogLastWindowsError();

    return Environment.Undefined();
}

#include <cstdint>
#include <cstddef>

std::string GetDerivedThemeMode(double Luminance)
{
    if (Luminance <= 85.0)
    {
        return "Dark";
    }
    else if (Luminance >= 170.0)
    {
        return "Light";
    }
    else
    {
        return "Indeterminate";
    }
}

Napi::Value MyBlur(const Napi::CallbackInfo& CallbackInfo)
{
    Napi::Env Environment = CallbackInfo.Env();
    HINSTANCE hInstance = GetModuleHandle(NULL);

    // HWND SourceHandle = FindWindowA(0, "SorrellWm");
    // if (SourceHandle == nullptr)
    // {
    //     // std::cout << "SourceHandle was the nullptr." << std::endl;
    // }

	MSG msg;
	WNDCLASSEXA WindowClass;

	WindowClass.cbSize = sizeof(WindowClass);
	WindowClass.style = CS_VREDRAW | CS_HREDRAW;
	WindowClass.lpfnWndProc = BlurWndProc;
	WindowClass.cbClsExtra = 0;
	WindowClass.cbWndExtra = 0;
	WindowClass.hInstance = hInstance;
	WindowClass.lpszMenuName = NULL;
	WindowClass.lpszClassName = g_szAppName;

    HWND SourceHandle = GetForegroundWindow();
    if (SourceHandle == nullptr || SourceHandle == SorrellWmMainWindow)
    {
        std::cout << "MyBlur was called, but GetForegroundWindow gave the nullptr." << std::endl;
        return Environment.Undefined();
    }

    GetDwmWindowRect(SourceHandle, &WindowRect);
    DIB_HEIGHT = WindowRect.bottom - WindowRect.top;
    DIB_WIDTH = WindowRect.right - WindowRect.left;

	RegisterClassExA(&WindowClass);
	// std::cout << "Registered window class!" << std::endl;

	Handle = CreateWindowExA(
		NULL,
		g_szAppName,
		NULL,
		// WS_OVERLAPPEDWINDOW,
        WS_EX_TOOLWINDOW | WS_POPUP | WS_EX_NOACTIVATE,
        WindowRect.left,
        WindowRect.top,
		WindowRect.right - WindowRect.left,
		WindowRect.bottom - WindowRect.top,
		NULL,
		NULL,
		hInstance,
		NULL
	);

    SetWindowLong(Handle, GWL_EXSTYLE, GetWindowLong(Handle, GWL_EXSTYLE) | WS_EX_LAYERED);

    BOOL attrib = TRUE;
    DwmSetWindowAttribute(Handle, DWMWA_TRANSITIONS_FORCEDISABLED, &attrib, sizeof(attrib));

    // SetWindowLong(Handle, GWL_STYLE, 0);

	Render(Handle, SourceHandle);

	ShowWindow(Handle, SW_SHOWNOACTIVATE);
	UpdateWindow(Handle);
    SetWindowPos(
        Handle,
        GetNextWindow(SourceHandle, GW_HWNDPREV),
        0, 0, 0, 0,
        SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE
    );

    BOOL LayeredSuccess = SetLayeredWindowAttributes(Handle, 0, 255, LWA_ALPHA);
    if (LayeredSuccess)
    {
        std::cout << "SetLayeredWindowAttributes was SUCCESSFUL." << std::endl;
    }
    else
    {
        std::cout << "SetLayeredWindowAttributes FAILED." << std::endl;
        LogLastWindowsError();
    }

    LPCSTR WindowName = "SorrellWm Main Window";
    SorrellWmMainWindow = FindWindow(NULL, WindowName);
    SetWindowLong(SorrellWmMainWindow, GWL_EXSTYLE, GetWindowLong(SorrellWmMainWindow, GWL_EXSTYLE) | WS_EX_LAYERED);
    SetLayeredWindowAttributes(SorrellWmMainWindow, 0, 0, LWA_ALPHA);
    BOOL MyRes = SetWindowPos(
        SorrellWmMainWindow,
        Handle,
        WindowRect.left,
        WindowRect.top,
        WindowRect.right - WindowRect.left,
        WindowRect.bottom - WindowRect.top,
        // clientRect.left + topLeft.x - FrameWidth,
        // clientRect.top + topLeft.y - TitleBarHeight - FrameHeight,
        // clientRect.right - clientRect.left + 2 * FrameWidth,
        // clientRect.bottom - clientRect.top + TitleBarHeight + 2 * FrameHeight,
        SWP_SHOWWINDOW
    );
    BOOL SetFore = SetForegroundWindow(SorrellWmMainWindow);
    std::cout << "SetFore " << SetFore << std::endl;
    if (MyRes)
    {
        std::cout << "MyRes was true" << std::endl;
    }
    else
    {
        std::cout << "MyRes was false" << std::endl;
    }

    GetBackgroundMode();
    Napi::Object OutObject = Napi::Object::New(Environment);
    OutObject.Set("BackgroundWindow", EncodeHandle(Environment, SourceHandle));
    OutObject.Set("ThemeMode", ThemeMode);
    return OutObject;
}
