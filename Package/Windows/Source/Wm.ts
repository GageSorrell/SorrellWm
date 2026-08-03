/**
 * Windows message constants and their union type.
 *
 * @module @sorrell/windows/Wm
 *
 * @file      Wm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-jsdoc */

export const NULL = 0x0000 as const;
export const CREATE = 0x0001 as const;
export const DESTROY = 0x0002 as const;
export const MOVE = 0x0003 as const;
export const SIZE = 0x0005 as const;
export const ACTIVATE = 0x0006 as const;
export const SETFOCUS = 0x0007 as const;
export const KILLFOCUS = 0x0008 as const;
export const ENABLE = 0x000A as const;
export const SETREDRAW = 0x000B as const;
export const SETTEXT = 0x000C as const;
export const GETTEXT = 0x000D as const;
export const GETTEXTLENGTH = 0x000E as const;
export const PAINT = 0x000F as const;
export const CLOSE = 0x0010 as const;
export const QUERYENDSESSION = 0x0011 as const;
export const QUERYOPEN = 0x0013 as const;
export const ENDSESSION = 0x0016 as const;
export const QUIT = 0x0012 as const;
export const ERASEBKGND = 0x0014 as const;
export const SYSCOLORCHANGE = 0x0015 as const;
export const SHOWWINDOW = 0x0018 as const;
export const WININICHANGE = 0x001A as const;
export const SETTINGCHANGE = 0x001A as const;
export const DEVMODECHANGE = 0x001B as const;
export const ACTIVATEAPP = 0x001C as const;
export const FONTCHANGE = 0x001D as const;
export const TIMECHANGE = 0x001E as const;
export const CANCELMODE = 0x001F as const;
export const SETCURSOR = 0x0020 as const;
export const MOUSEACTIVATE = 0x0021 as const;
export const CHILDACTIVATE = 0x0022 as const;
export const QUEUESYNC = 0x0023 as const;
export const GETMINMAXINFO = 0x0024 as const;
export const PAINTICON = 0x0026 as const;
export const ICONERASEBKGND = 0x0027 as const;
export const NEXTDLGCTL = 0x0028 as const;
export const SPOOLERSTATUS = 0x002A as const;
export const DRAWITEM = 0x002B as const;
export const MEASUREITEM = 0x002C as const;
export const DELETEITEM = 0x002D as const;
export const VKEYTOITEM = 0x002E as const;
export const CHARTOITEM = 0x002F as const;
export const SETFONT = 0x0030 as const;
export const GETFONT = 0x0031 as const;
export const SETHOTKEY = 0x0032 as const;
export const GETHOTKEY = 0x0033 as const;
export const QUERYDRAGICON = 0x0037 as const;
export const COMPAREITEM = 0x0039 as const;
export const GETOBJECT = 0x003D as const;
export const COMPACTING = 0x0041 as const;
export const COMMNOTIFY = 0x0044 as const;
export const WINDOWPOSCHANGING = 0x0046 as const;
export const WINDOWPOSCHANGED = 0x0047 as const;
export const POWER = 0x0048 as const;
export const COPYDATA = 0x004A as const;
export const CANCELJOURNAL = 0x004B as const;
export const NOTIFY = 0x004E as const;
export const INPUTLANGCHANGEREQUEST = 0x0050 as const;
export const INPUTLANGCHANGE = 0x0051 as const;
export const TCARD = 0x0052 as const;
export const HELP = 0x0053 as const;
export const USERCHANGED = 0x0054 as const;
export const NOTIFYFORMAT = 0x0055 as const;
export const CONTEXTMENU = 0x007B as const;
export const STYLECHANGING = 0x007C as const;
export const STYLECHANGED = 0x007D as const;
export const DISPLAYCHANGE = 0x007E as const;
export const GETICON = 0x007F as const;
export const SETICON = 0x0080 as const;
export const NCCREATE = 0x0081 as const;
export const NCDESTROY = 0x0082 as const;
export const NCCALCSIZE = 0x0083 as const;
export const NCHITTEST = 0x0084 as const;
export const NCPAINT = 0x0085 as const;
export const NCACTIVATE = 0x0086 as const;
export const GETDLGCODE = 0x0087 as const;
export const SYNCPAINT = 0x0088 as const;
export const NCMOUSEMOVE = 0x00A0 as const;
export const NCLBUTTONDOWN = 0x00A1 as const;
export const NCLBUTTONUP = 0x00A2 as const;
export const NCLBUTTONDBLCLK = 0x00A3 as const;
export const NCRBUTTONDOWN = 0x00A4 as const;
export const NCRBUTTONUP = 0x00A5 as const;
export const NCRBUTTONDBLCLK = 0x00A6 as const;
export const NCMBUTTONDOWN = 0x00A7 as const;
export const NCMBUTTONUP = 0x00A8 as const;
export const NCMBUTTONDBLCLK = 0x00A9 as const;
export const NCXBUTTONDOWN = 0x00AB as const;
export const NCXBUTTONUP = 0x00AC as const;
export const NCXBUTTONDBLCLK = 0x00AD as const;
export const INPUT_DEVICE_CHANGE = 0x00FE as const;
export const INPUT = 0x00FF as const;
export const KEYFIRST = 0x0100 as const;
export const KEYDOWN = 0x0100 as const;
export const KEYUP = 0x0101 as const;
export const CHAR = 0x0102 as const;
export const DEADCHAR = 0x0103 as const;
export const SYSKEYDOWN = 0x0104 as const;
export const SYSKEYUP = 0x0105 as const;
export const SYSCHAR = 0x0106 as const;
export const SYSDEADCHAR = 0x0107 as const;
export const UNICHAR = 0x0109 as const;
export const KEYLAST = 0x0109 as const;
export const IME_STARTCOMPOSITION = 0x010D as const;
export const IME_ENDCOMPOSITION = 0x010E as const;
export const IME_COMPOSITION = 0x010F as const;
export const IME_KEYLAST = 0x010F as const;
export const INITDIALOG = 0x0110 as const;
export const COMMAND = 0x0111 as const;
export const SYSCOMMAND = 0x0112 as const;
export const TIMER = 0x0113 as const;
export const HSCROLL = 0x0114 as const;
export const VSCROLL = 0x0115 as const;
export const INITMENU = 0x0116 as const;
export const INITMENUPOPUP = 0x0117 as const;
export const GESTURE = 0x0119 as const;
export const GESTURENOTIFY = 0x011A as const;
export const MENUSELECT = 0x011F as const;
export const MENUCHAR = 0x0120 as const;
export const ENTERIDLE = 0x0121 as const;
export const MENURBUTTONUP = 0x0122 as const;
export const MENUDRAG = 0x0123 as const;
export const MENUGETOBJECT = 0x0124 as const;
export const UNINITMENUPOPUP = 0x0125 as const;
export const MENUCOMMAND = 0x0126 as const;
export const CHANGEUISTATE = 0x0127 as const;
export const UPDATEUISTATE = 0x0128 as const;
export const QUERYUISTATE = 0x0129 as const;
export const CTLCOLORMSGBOX = 0x0132 as const;
export const CTLCOLOREDIT = 0x0133 as const;
export const CTLCOLORLISTBOX = 0x0134 as const;
export const CTLCOLORBTN = 0x0135 as const;
export const CTLCOLORDLG = 0x0136 as const;
export const CTLCOLORSCROLLBAR = 0x0137 as const;
export const CTLCOLORSTATIC = 0x0138 as const;
export const MOUSEFIRST = 0x0200 as const;
export const MOUSEMOVE = 0x0200 as const;
export const LBUTTONDOWN = 0x0201 as const;
export const LBUTTONUP = 0x0202 as const;
export const LBUTTONDBLCLK = 0x0203 as const;
export const RBUTTONDOWN = 0x0204 as const;
export const RBUTTONUP = 0x0205 as const;
export const RBUTTONDBLCLK = 0x0206 as const;
export const MBUTTONDOWN = 0x0207 as const;
export const MBUTTONUP = 0x0208 as const;
export const MBUTTONDBLCLK = 0x0209 as const;
export const MOUSEWHEEL = 0x020A as const;
export const XBUTTONDOWN = 0x020B as const;
export const XBUTTONUP = 0x020C as const;
export const XBUTTONDBLCLK = 0x020D as const;
export const MOUSEHWHEEL = 0x020E as const;
export const MOUSELAST = 0x020E as const;
export const PARENTNOTIFY = 0x0210 as const;
export const ENTERMENULOOP = 0x0211 as const;
export const EXITMENULOOP = 0x0212 as const;
export const NEXTMENU = 0x0213 as const;
export const SIZING = 0x0214 as const;
export const CAPTURECHANGED = 0x0215 as const;
export const MOVING = 0x0216 as const;
export const POWERBROADCAST = 0x0218 as const;
export const DEVICECHANGE = 0x0219 as const;
export const MDICREATE = 0x0220 as const;
export const MDIDESTROY = 0x0221 as const;
export const MDIACTIVATE = 0x0222 as const;
export const MDIRESTORE = 0x0223 as const;
export const MDINEXT = 0x0224 as const;
export const MDIMAXIMIZE = 0x0225 as const;
export const MDITILE = 0x0226 as const;
export const MDICASCADE = 0x0227 as const;
export const MDIICONARRANGE = 0x0228 as const;
export const MDIGETACTIVE = 0x0229 as const;
export const MDISETMENU = 0x0230 as const;
export const ENTERSIZEMOVE = 0x0231 as const;
export const EXITSIZEMOVE = 0x0232 as const;
export const DROPFILES = 0x0233 as const;
export const MDIREFRESHMENU = 0x0234 as const;
export const POINTERDEVICECHANGE = 0x238 as const;
export const POINTERDEVICEINRANGE = 0x239 as const;
export const POINTERDEVICEOUTOFRANGE = 0x23A as const;
export const TOUCH = 0x0240 as const;
export const NCPOINTERUPDATE = 0x0241 as const;
export const NCPOINTERDOWN = 0x0242 as const;
export const NCPOINTERUP = 0x0243 as const;
export const POINTERUPDATE = 0x0245 as const;
export const POINTERDOWN = 0x0246 as const;
export const POINTERUP = 0x0247 as const;
export const POINTERENTER = 0x0249 as const;
export const POINTERLEAVE = 0x024A as const;
export const POINTERACTIVATE = 0x024B as const;
export const POINTERCAPTURECHANGED = 0x024C as const;
export const TOUCHHITTESTING = 0x024D as const;
export const POINTERWHEEL = 0x024E as const;
export const POINTERHWHEEL = 0x024F as const;
export const POINTERROUTEDTO = 0x0251 as const;
export const POINTERROUTEDAWAY = 0x0252 as const;
export const POINTERROUTEDRELEASED = 0x0253 as const;
export const IME_SETCONTEXT = 0x0281 as const;
export const IME_NOTIFY = 0x0282 as const;
export const IME_CONTROL = 0x0283 as const;
export const IME_COMPOSITIONFULL = 0x0284 as const;
export const IME_SELECT = 0x0285 as const;
export const IME_CHAR = 0x0286 as const;
export const IME_REQUEST = 0x0288 as const;
export const IME_KEYDOWN = 0x0290 as const;
export const IME_KEYUP = 0x0291 as const;
export const MOUSEHOVER = 0x02A1 as const;
export const MOUSELEAVE = 0x02A3 as const;
export const NCMOUSEHOVER = 0x02A0 as const;
export const NCMOUSELEAVE = 0x02A2 as const;
export const WTSSESSION_CHANGE = 0x02B1 as const;
export const TABLET_FIRST = 0x02c0 as const;
export const TABLET_LAST = 0x02df as const;
export const DPICHANGED = 0x02E0 as const;
export const DPICHANGED_BEFOREPARENT = 0x02E2 as const;
export const DPICHANGED_AFTERPARENT = 0x02E3 as const;
export const GETDPISCALEDSIZE = 0x02E4 as const;
export const CUT = 0x0300 as const;
export const COPY = 0x0301 as const;
export const PASTE = 0x0302 as const;
export const CLEAR = 0x0303 as const;
export const UNDO = 0x0304 as const;
export const RENDERFORMAT = 0x0305 as const;
export const RENDERALLFORMATS = 0x0306 as const;
export const DESTROYCLIPBOARD = 0x0307 as const;
export const DRAWCLIPBOARD = 0x0308 as const;
export const PAINTCLIPBOARD = 0x0309 as const;
export const VSCROLLCLIPBOARD = 0x030A as const;
export const SIZECLIPBOARD = 0x030B as const;
export const ASKCBFORMATNAME = 0x030C as const;
export const CHANGECBCHAIN = 0x030D as const;
export const HSCROLLCLIPBOARD = 0x030E as const;
export const QUERYNEWPALETTE = 0x030F as const;
export const PALETTEISCHANGING = 0x0310 as const;
export const PALETTECHANGED = 0x0311 as const;
export const HOTKEY = 0x0312 as const;
export const PRINT = 0x0317 as const;
export const PRINTCLIENT = 0x0318 as const;
export const APPCOMMAND = 0x0319 as const;
export const THEMECHANGED = 0x031A as const;
export const CLIPBOARDUPDATE = 0x031D as const;
export const DWMCOMPOSITIONCHANGED = 0x031E as const;
export const DWMNCRENDERINGCHANGED = 0x031F as const;
export const DWMCOLORIZATIONCOLORCHANGED = 0x0320 as const;
export const DWMWINDOWMAXIMIZEDCHANGE = 0x0321 as const;
export const DWMSENDICONICTHUMBNAIL = 0x0323 as const;
export const DWMSENDICONICLIVEPREVIEWBITMAP = 0x0326 as const;
export const GETTITLEBARINFOEX = 0x033F as const;
export const HANDHELDFIRST = 0x0358 as const;
export const HANDHELDLAST = 0x035F as const;
export const AFXFIRST = 0x0360 as const;
export const AFXLAST = 0x037F as const;
export const PENWINFIRST = 0x0380 as const;
export const PENWINLAST = 0x038F as const;
export const APP = 0x8000 as const;

export type NULL = typeof NULL;
export type CREATE = typeof CREATE;
export type DESTROY = typeof DESTROY;
export type MOVE = typeof MOVE;
export type SIZE = typeof SIZE;
export type ACTIVATE = typeof ACTIVATE;
export type SETFOCUS = typeof SETFOCUS;
export type KILLFOCUS = typeof KILLFOCUS;
export type ENABLE = typeof ENABLE;
export type SETREDRAW = typeof SETREDRAW;
export type SETTEXT = typeof SETTEXT;
export type GETTEXT = typeof GETTEXT;
export type GETTEXTLENGTH = typeof GETTEXTLENGTH;
export type PAINT = typeof PAINT;
export type CLOSE = typeof CLOSE;
export type QUERYENDSESSION = typeof QUERYENDSESSION;
export type QUERYOPEN = typeof QUERYOPEN;
export type ENDSESSION = typeof ENDSESSION;
export type QUIT = typeof QUIT;
export type ERASEBKGND = typeof ERASEBKGND;
export type SYSCOLORCHANGE = typeof SYSCOLORCHANGE;
export type SHOWWINDOW = typeof SHOWWINDOW;
export type WININICHANGE = typeof WININICHANGE;
export type SETTINGCHANGE = typeof SETTINGCHANGE;
export type DEVMODECHANGE = typeof DEVMODECHANGE;
export type ACTIVATEAPP = typeof ACTIVATEAPP;
export type FONTCHANGE = typeof FONTCHANGE;
export type TIMECHANGE = typeof TIMECHANGE;
export type CANCELMODE = typeof CANCELMODE;
export type SETCURSOR = typeof SETCURSOR;
export type MOUSEACTIVATE = typeof MOUSEACTIVATE;
export type CHILDACTIVATE = typeof CHILDACTIVATE;
export type QUEUESYNC = typeof QUEUESYNC;
export type GETMINMAXINFO = typeof GETMINMAXINFO;
export type PAINTICON = typeof PAINTICON;
export type ICONERASEBKGND = typeof ICONERASEBKGND;
export type NEXTDLGCTL = typeof NEXTDLGCTL;
export type SPOOLERSTATUS = typeof SPOOLERSTATUS;
export type DRAWITEM = typeof DRAWITEM;
export type MEASUREITEM = typeof MEASUREITEM;
export type DELETEITEM = typeof DELETEITEM;
export type VKEYTOITEM = typeof VKEYTOITEM;
export type CHARTOITEM = typeof CHARTOITEM;
export type SETFONT = typeof SETFONT;
export type GETFONT = typeof GETFONT;
export type SETHOTKEY = typeof SETHOTKEY;
export type GETHOTKEY = typeof GETHOTKEY;
export type QUERYDRAGICON = typeof QUERYDRAGICON;
export type COMPAREITEM = typeof COMPAREITEM;
export type GETOBJECT = typeof GETOBJECT;
export type COMPACTING = typeof COMPACTING;
export type COMMNOTIFY = typeof COMMNOTIFY;
export type WINDOWPOSCHANGING = typeof WINDOWPOSCHANGING;
export type WINDOWPOSCHANGED = typeof WINDOWPOSCHANGED;
export type POWER = typeof POWER;
export type COPYDATA = typeof COPYDATA;
export type CANCELJOURNAL = typeof CANCELJOURNAL;
export type NOTIFY = typeof NOTIFY;
export type INPUTLANGCHANGEREQUEST = typeof INPUTLANGCHANGEREQUEST;
export type INPUTLANGCHANGE = typeof INPUTLANGCHANGE;
export type TCARD = typeof TCARD;
export type HELP = typeof HELP;
export type USERCHANGED = typeof USERCHANGED;
export type NOTIFYFORMAT = typeof NOTIFYFORMAT;
export type CONTEXTMENU = typeof CONTEXTMENU;
export type STYLECHANGING = typeof STYLECHANGING;
export type STYLECHANGED = typeof STYLECHANGED;
export type DISPLAYCHANGE = typeof DISPLAYCHANGE;
export type GETICON = typeof GETICON;
export type SETICON = typeof SETICON;
export type NCCREATE = typeof NCCREATE;
export type NCDESTROY = typeof NCDESTROY;
export type NCCALCSIZE = typeof NCCALCSIZE;
export type NCHITTEST = typeof NCHITTEST;
export type NCPAINT = typeof NCPAINT;
export type NCACTIVATE = typeof NCACTIVATE;
export type GETDLGCODE = typeof GETDLGCODE;
export type SYNCPAINT = typeof SYNCPAINT;
export type NCMOUSEMOVE = typeof NCMOUSEMOVE;
export type NCLBUTTONDOWN = typeof NCLBUTTONDOWN;
export type NCLBUTTONUP = typeof NCLBUTTONUP;
export type NCLBUTTONDBLCLK = typeof NCLBUTTONDBLCLK;
export type NCRBUTTONDOWN = typeof NCRBUTTONDOWN;
export type NCRBUTTONUP = typeof NCRBUTTONUP;
export type NCRBUTTONDBLCLK = typeof NCRBUTTONDBLCLK;
export type NCMBUTTONDOWN = typeof NCMBUTTONDOWN;
export type NCMBUTTONUP = typeof NCMBUTTONUP;
export type NCMBUTTONDBLCLK = typeof NCMBUTTONDBLCLK;
export type NCXBUTTONDOWN = typeof NCXBUTTONDOWN;
export type NCXBUTTONUP = typeof NCXBUTTONUP;
export type NCXBUTTONDBLCLK = typeof NCXBUTTONDBLCLK;
export type INPUT_DEVICE_CHANGE = typeof INPUT_DEVICE_CHANGE;
export type INPUT = typeof INPUT;
export type KEYFIRST = typeof KEYFIRST;
export type KEYDOWN = typeof KEYDOWN;
export type KEYUP = typeof KEYUP;
export type CHAR = typeof CHAR;
export type DEADCHAR = typeof DEADCHAR;
export type SYSKEYDOWN = typeof SYSKEYDOWN;
export type SYSKEYUP = typeof SYSKEYUP;
export type SYSCHAR = typeof SYSCHAR;
export type SYSDEADCHAR = typeof SYSDEADCHAR;
export type UNICHAR = typeof UNICHAR;
export type KEYLAST = typeof KEYLAST;
export type IME_STARTCOMPOSITION = typeof IME_STARTCOMPOSITION;
export type IME_ENDCOMPOSITION = typeof IME_ENDCOMPOSITION;
export type IME_COMPOSITION = typeof IME_COMPOSITION;
export type IME_KEYLAST = typeof IME_KEYLAST;
export type INITDIALOG = typeof INITDIALOG;
export type COMMAND = typeof COMMAND;
export type SYSCOMMAND = typeof SYSCOMMAND;
export type TIMER = typeof TIMER;
export type HSCROLL = typeof HSCROLL;
export type VSCROLL = typeof VSCROLL;
export type INITMENU = typeof INITMENU;
export type INITMENUPOPUP = typeof INITMENUPOPUP;
export type GESTURE = typeof GESTURE;
export type GESTURENOTIFY = typeof GESTURENOTIFY;
export type MENUSELECT = typeof MENUSELECT;
export type MENUCHAR = typeof MENUCHAR;
export type ENTERIDLE = typeof ENTERIDLE;
export type MENURBUTTONUP = typeof MENURBUTTONUP;
export type MENUDRAG = typeof MENUDRAG;
export type MENUGETOBJECT = typeof MENUGETOBJECT;
export type UNINITMENUPOPUP = typeof UNINITMENUPOPUP;
export type MENUCOMMAND = typeof MENUCOMMAND;
export type CHANGEUISTATE = typeof CHANGEUISTATE;
export type UPDATEUISTATE = typeof UPDATEUISTATE;
export type QUERYUISTATE = typeof QUERYUISTATE;
export type CTLCOLORMSGBOX = typeof CTLCOLORMSGBOX;
export type CTLCOLOREDIT = typeof CTLCOLOREDIT;
export type CTLCOLORLISTBOX = typeof CTLCOLORLISTBOX;
export type CTLCOLORBTN = typeof CTLCOLORBTN;
export type CTLCOLORDLG = typeof CTLCOLORDLG;
export type CTLCOLORSCROLLBAR = typeof CTLCOLORSCROLLBAR;
export type CTLCOLORSTATIC = typeof CTLCOLORSTATIC;
export type MOUSEFIRST = typeof MOUSEFIRST;
export type MOUSEMOVE = typeof MOUSEMOVE;
export type LBUTTONDOWN = typeof LBUTTONDOWN;
export type LBUTTONUP = typeof LBUTTONUP;
export type LBUTTONDBLCLK = typeof LBUTTONDBLCLK;
export type RBUTTONDOWN = typeof RBUTTONDOWN;
export type RBUTTONUP = typeof RBUTTONUP;
export type RBUTTONDBLCLK = typeof RBUTTONDBLCLK;
export type MBUTTONDOWN = typeof MBUTTONDOWN;
export type MBUTTONUP = typeof MBUTTONUP;
export type MBUTTONDBLCLK = typeof MBUTTONDBLCLK;
export type MOUSEWHEEL = typeof MOUSEWHEEL;
export type XBUTTONDOWN = typeof XBUTTONDOWN;
export type XBUTTONUP = typeof XBUTTONUP;
export type XBUTTONDBLCLK = typeof XBUTTONDBLCLK;
export type MOUSEHWHEEL = typeof MOUSEHWHEEL;
export type MOUSELAST = typeof MOUSELAST;
export type PARENTNOTIFY = typeof PARENTNOTIFY;
export type ENTERMENULOOP = typeof ENTERMENULOOP;
export type EXITMENULOOP = typeof EXITMENULOOP;
export type NEXTMENU = typeof NEXTMENU;
export type SIZING = typeof SIZING;
export type CAPTURECHANGED = typeof CAPTURECHANGED;
export type MOVING = typeof MOVING;
export type POWERBROADCAST = typeof POWERBROADCAST;
export type DEVICECHANGE = typeof DEVICECHANGE;
export type MDICREATE = typeof MDICREATE;
export type MDIDESTROY = typeof MDIDESTROY;
export type MDIACTIVATE = typeof MDIACTIVATE;
export type MDIRESTORE = typeof MDIRESTORE;
export type MDINEXT = typeof MDINEXT;
export type MDIMAXIMIZE = typeof MDIMAXIMIZE;
export type MDITILE = typeof MDITILE;
export type MDICASCADE = typeof MDICASCADE;
export type MDIICONARRANGE = typeof MDIICONARRANGE;
export type MDIGETACTIVE = typeof MDIGETACTIVE;
export type MDISETMENU = typeof MDISETMENU;
export type ENTERSIZEMOVE = typeof ENTERSIZEMOVE;
export type EXITSIZEMOVE = typeof EXITSIZEMOVE;
export type DROPFILES = typeof DROPFILES;
export type MDIREFRESHMENU = typeof MDIREFRESHMENU;
export type POINTERDEVICECHANGE = typeof POINTERDEVICECHANGE;
export type POINTERDEVICEINRANGE = typeof POINTERDEVICEINRANGE;
export type POINTERDEVICEOUTOFRANGE = typeof POINTERDEVICEOUTOFRANGE;
export type TOUCH = typeof TOUCH;
export type NCPOINTERUPDATE = typeof NCPOINTERUPDATE;
export type NCPOINTERDOWN = typeof NCPOINTERDOWN;
export type NCPOINTERUP = typeof NCPOINTERUP;
export type POINTERUPDATE = typeof POINTERUPDATE;
export type POINTERDOWN = typeof POINTERDOWN;
export type POINTERUP = typeof POINTERUP;
export type POINTERENTER = typeof POINTERENTER;
export type POINTERLEAVE = typeof POINTERLEAVE;
export type POINTERACTIVATE = typeof POINTERACTIVATE;
export type POINTERCAPTURECHANGED = typeof POINTERCAPTURECHANGED;
export type TOUCHHITTESTING = typeof TOUCHHITTESTING;
export type POINTERWHEEL = typeof POINTERWHEEL;
export type POINTERHWHEEL = typeof POINTERHWHEEL;
export type POINTERROUTEDTO = typeof POINTERROUTEDTO;
export type POINTERROUTEDAWAY = typeof POINTERROUTEDAWAY;
export type POINTERROUTEDRELEASED = typeof POINTERROUTEDRELEASED;
export type IME_SETCONTEXT = typeof IME_SETCONTEXT;
export type IME_NOTIFY = typeof IME_NOTIFY;
export type IME_CONTROL = typeof IME_CONTROL;
export type IME_COMPOSITIONFULL = typeof IME_COMPOSITIONFULL;
export type IME_SELECT = typeof IME_SELECT;
export type IME_CHAR = typeof IME_CHAR;
export type IME_REQUEST = typeof IME_REQUEST;
export type IME_KEYDOWN = typeof IME_KEYDOWN;
export type IME_KEYUP = typeof IME_KEYUP;
export type MOUSEHOVER = typeof MOUSEHOVER;
export type MOUSELEAVE = typeof MOUSELEAVE;
export type NCMOUSEHOVER = typeof NCMOUSEHOVER;
export type NCMOUSELEAVE = typeof NCMOUSELEAVE;
export type WTSSESSION_CHANGE = typeof WTSSESSION_CHANGE;
export type TABLET_FIRST = typeof TABLET_FIRST;
export type TABLET_LAST = typeof TABLET_LAST;
export type DPICHANGED = typeof DPICHANGED;
export type DPICHANGED_BEFOREPARENT = typeof DPICHANGED_BEFOREPARENT;
export type DPICHANGED_AFTERPARENT = typeof DPICHANGED_AFTERPARENT;
export type GETDPISCALEDSIZE = typeof GETDPISCALEDSIZE;
export type CUT = typeof CUT;
export type COPY = typeof COPY;
export type PASTE = typeof PASTE;
export type CLEAR = typeof CLEAR;
export type UNDO = typeof UNDO;
export type RENDERFORMAT = typeof RENDERFORMAT;
export type RENDERALLFORMATS = typeof RENDERALLFORMATS;
export type DESTROYCLIPBOARD = typeof DESTROYCLIPBOARD;
export type DRAWCLIPBOARD = typeof DRAWCLIPBOARD;
export type PAINTCLIPBOARD = typeof PAINTCLIPBOARD;
export type VSCROLLCLIPBOARD = typeof VSCROLLCLIPBOARD;
export type SIZECLIPBOARD = typeof SIZECLIPBOARD;
export type ASKCBFORMATNAME = typeof ASKCBFORMATNAME;
export type CHANGECBCHAIN = typeof CHANGECBCHAIN;
export type HSCROLLCLIPBOARD = typeof HSCROLLCLIPBOARD;
export type QUERYNEWPALETTE = typeof QUERYNEWPALETTE;
export type PALETTEISCHANGING = typeof PALETTEISCHANGING;
export type PALETTECHANGED = typeof PALETTECHANGED;
export type HOTKEY = typeof HOTKEY;
export type PRINT = typeof PRINT;
export type PRINTCLIENT = typeof PRINTCLIENT;
export type APPCOMMAND = typeof APPCOMMAND;
export type THEMECHANGED = typeof THEMECHANGED;
export type CLIPBOARDUPDATE = typeof CLIPBOARDUPDATE;
export type DWMCOMPOSITIONCHANGED = typeof DWMCOMPOSITIONCHANGED;
export type DWMNCRENDERINGCHANGED = typeof DWMNCRENDERINGCHANGED;
export type DWMCOLORIZATIONCOLORCHANGED = typeof DWMCOLORIZATIONCOLORCHANGED;
export type DWMWINDOWMAXIMIZEDCHANGE = typeof DWMWINDOWMAXIMIZEDCHANGE;
export type DWMSENDICONICTHUMBNAIL = typeof DWMSENDICONICTHUMBNAIL;
export type DWMSENDICONICLIVEPREVIEWBITMAP = typeof DWMSENDICONICLIVEPREVIEWBITMAP;
export type GETTITLEBARINFOEX = typeof GETTITLEBARINFOEX;
export type HANDHELDFIRST = typeof HANDHELDFIRST;
export type HANDHELDLAST = typeof HANDHELDLAST;
export type AFXFIRST = typeof AFXFIRST;
export type AFXLAST = typeof AFXLAST;
export type PENWINFIRST = typeof PENWINFIRST;
export type PENWINLAST = typeof PENWINLAST;
export type APP = typeof APP;

export const WM =
    [
        NULL,
        CREATE,
        DESTROY,
        MOVE,
        SIZE,
        ACTIVATE,
        SETFOCUS,
        KILLFOCUS,
        ENABLE,
        SETREDRAW,
        SETTEXT,
        GETTEXT,
        GETTEXTLENGTH,
        PAINT,
        CLOSE,
        QUERYENDSESSION,
        QUERYOPEN,
        ENDSESSION,
        QUIT,
        ERASEBKGND,
        SYSCOLORCHANGE,
        SHOWWINDOW,
        WININICHANGE,
        SETTINGCHANGE,
        DEVMODECHANGE,
        ACTIVATEAPP,
        FONTCHANGE,
        TIMECHANGE,
        CANCELMODE,
        SETCURSOR,
        MOUSEACTIVATE,
        CHILDACTIVATE,
        QUEUESYNC,
        GETMINMAXINFO,
        PAINTICON,
        ICONERASEBKGND,
        NEXTDLGCTL,
        SPOOLERSTATUS,
        DRAWITEM,
        MEASUREITEM,
        DELETEITEM,
        VKEYTOITEM,
        CHARTOITEM,
        SETFONT,
        GETFONT,
        SETHOTKEY,
        GETHOTKEY,
        QUERYDRAGICON,
        COMPAREITEM,
        GETOBJECT,
        COMPACTING,
        COMMNOTIFY,
        WINDOWPOSCHANGING,
        WINDOWPOSCHANGED,
        POWER,
        COPYDATA,
        CANCELJOURNAL,
        NOTIFY,
        INPUTLANGCHANGEREQUEST,
        INPUTLANGCHANGE,
        TCARD,
        HELP,
        USERCHANGED,
        NOTIFYFORMAT,
        CONTEXTMENU,
        STYLECHANGING,
        STYLECHANGED,
        DISPLAYCHANGE,
        GETICON,
        SETICON,
        NCCREATE,
        NCDESTROY,
        NCCALCSIZE,
        NCHITTEST,
        NCPAINT,
        NCACTIVATE,
        GETDLGCODE,
        SYNCPAINT,
        NCMOUSEMOVE,
        NCLBUTTONDOWN,
        NCLBUTTONUP,
        NCLBUTTONDBLCLK,
        NCRBUTTONDOWN,
        NCRBUTTONUP,
        NCRBUTTONDBLCLK,
        NCMBUTTONDOWN,
        NCMBUTTONUP,
        NCMBUTTONDBLCLK,
        NCXBUTTONDOWN,
        NCXBUTTONUP,
        NCXBUTTONDBLCLK,
        INPUT_DEVICE_CHANGE,
        INPUT,
        KEYFIRST,
        KEYDOWN,
        KEYUP,
        CHAR,
        DEADCHAR,
        SYSKEYDOWN,
        SYSKEYUP,
        SYSCHAR,
        SYSDEADCHAR,
        UNICHAR,
        KEYLAST,
        IME_STARTCOMPOSITION,
        IME_ENDCOMPOSITION,
        IME_COMPOSITION,
        IME_KEYLAST,
        INITDIALOG,
        COMMAND,
        SYSCOMMAND,
        TIMER,
        HSCROLL,
        VSCROLL,
        INITMENU,
        INITMENUPOPUP,
        GESTURE,
        GESTURENOTIFY,
        MENUSELECT,
        MENUCHAR,
        ENTERIDLE,
        MENURBUTTONUP,
        MENUDRAG,
        MENUGETOBJECT,
        UNINITMENUPOPUP,
        MENUCOMMAND,
        CHANGEUISTATE,
        UPDATEUISTATE,
        QUERYUISTATE,
        CTLCOLORMSGBOX,
        CTLCOLOREDIT,
        CTLCOLORLISTBOX,
        CTLCOLORBTN,
        CTLCOLORDLG,
        CTLCOLORSCROLLBAR,
        CTLCOLORSTATIC,
        MOUSEFIRST,
        MOUSEMOVE,
        LBUTTONDOWN,
        LBUTTONUP,
        LBUTTONDBLCLK,
        RBUTTONDOWN,
        RBUTTONUP,
        RBUTTONDBLCLK,
        MBUTTONDOWN,
        MBUTTONUP,
        MBUTTONDBLCLK,
        MOUSEWHEEL,
        XBUTTONDOWN,
        XBUTTONUP,
        XBUTTONDBLCLK,
        MOUSEHWHEEL,
        MOUSELAST,
        PARENTNOTIFY,
        ENTERMENULOOP,
        EXITMENULOOP,
        NEXTMENU,
        SIZING,
        CAPTURECHANGED,
        MOVING,
        POWERBROADCAST,
        DEVICECHANGE,
        MDICREATE,
        MDIDESTROY,
        MDIACTIVATE,
        MDIRESTORE,
        MDINEXT,
        MDIMAXIMIZE,
        MDITILE,
        MDICASCADE,
        MDIICONARRANGE,
        MDIGETACTIVE,
        MDISETMENU,
        ENTERSIZEMOVE,
        EXITSIZEMOVE,
        DROPFILES,
        MDIREFRESHMENU,
        POINTERDEVICECHANGE,
        POINTERDEVICEINRANGE,
        POINTERDEVICEOUTOFRANGE,
        TOUCH,
        NCPOINTERUPDATE,
        NCPOINTERDOWN,
        NCPOINTERUP,
        POINTERUPDATE,
        POINTERDOWN,
        POINTERUP,
        POINTERENTER,
        POINTERLEAVE,
        POINTERACTIVATE,
        POINTERCAPTURECHANGED,
        TOUCHHITTESTING,
        POINTERWHEEL,
        POINTERHWHEEL,
        POINTERROUTEDTO,
        POINTERROUTEDAWAY,
        POINTERROUTEDRELEASED,
        IME_SETCONTEXT,
        IME_NOTIFY,
        IME_CONTROL,
        IME_COMPOSITIONFULL,
        IME_SELECT,
        IME_CHAR,
        IME_REQUEST,
        IME_KEYDOWN,
        IME_KEYUP,
        MOUSEHOVER,
        MOUSELEAVE,
        NCMOUSEHOVER,
        NCMOUSELEAVE,
        WTSSESSION_CHANGE,
        TABLET_FIRST,
        TABLET_LAST,
        DPICHANGED,
        DPICHANGED_BEFOREPARENT,
        DPICHANGED_AFTERPARENT,
        GETDPISCALEDSIZE,
        CUT,
        COPY,
        PASTE,
        CLEAR,
        UNDO,
        RENDERFORMAT,
        RENDERALLFORMATS,
        DESTROYCLIPBOARD,
        DRAWCLIPBOARD,
        PAINTCLIPBOARD,
        VSCROLLCLIPBOARD,
        SIZECLIPBOARD,
        ASKCBFORMATNAME,
        CHANGECBCHAIN,
        HSCROLLCLIPBOARD,
        QUERYNEWPALETTE,
        PALETTEISCHANGING,
        PALETTECHANGED,
        HOTKEY,
        PRINT,
        PRINTCLIENT,
        APPCOMMAND,
        THEMECHANGED,
        CLIPBOARDUPDATE,
        DWMCOMPOSITIONCHANGED,
        DWMNCRENDERINGCHANGED,
        DWMCOLORIZATIONCOLORCHANGED,
        DWMWINDOWMAXIMIZEDCHANGE,
        DWMSENDICONICTHUMBNAIL,
        DWMSENDICONICLIVEPREVIEWBITMAP,
        GETTITLEBARINFOEX,
        HANDHELDFIRST,
        HANDHELDLAST,
        AFXFIRST,
        AFXLAST,
        PENWINFIRST,
        PENWINLAST,
        APP
    ] as const;

export type WM = typeof WM[number];
