/**
 * Handles to objects owned by the Windows API, typed via {@link effect/Brand},
 * and serialized as `bigint`s.
 *
 * @module @sorrell/windows/Handle
 *
 * @file      Handle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Brand } from "effect";

/* Win32 handle typedefs intentionally retain their SDK names. */
/* eslint-disable @typescript-eslint/naming-convention */

/** A generic pointer-sized Win32 object handle. */
export type HANDLE = Brand.Branded<bigint, "HANDLE">;

type _HANDLE<TagType extends string> = Brand.Branded<HANDLE, TagType>;

/** A handle to an accelerator table. */
export type HACCEL = _HANDLE<"HACCEL">;

/** A handle to a bitmap. */
export type HBITMAP = _HANDLE<"HBITMAP">;

/** A handle to a logical brush. */
export type HBRUSH = _HANDLE<"HBRUSH">;

/** A handle to a color space. */
export type HCOLORSPACE = _HANDLE<"HCOLORSPACE">;

/** A handle to a Dynamic Data Exchange conversation. */
export type HCONV = _HANDLE<"HCONV">;

/** A handle to a list of Dynamic Data Exchange conversations. */
export type HCONVLIST = _HANDLE<"HCONVLIST">;

/** A handle to a cursor. */
export type HCURSOR = _HANDLE<"HCURSOR">;

/** A handle to a device context. */
export type HDC = _HANDLE<"HDC">;

/** A handle to Dynamic Data Exchange data. */
export type HDDEDATA = _HANDLE<"HDDEDATA">;

/** A handle to a desktop. */
export type HDESK = _HANDLE<"HDESK">;

/** A handle to an internal shell drop structure. */
export type HDROP = _HANDLE<"HDROP">;

/** A handle to a deferred-window-position structure. */
export type HDWP = _HANDLE<"HDWP">;

/** A handle to an enhanced metafile. */
export type HENHMETAFILE = _HANDLE<"HENHMETAFILE">;

/**
 * A legacy integer handle to a file opened by `OpenFile`.
 *
 * Unlike files opened by `CreateFile`, an `HFILE` is not a pointer-sized
 * kernel-object handle.
 */
export type HFILE = Brand.Branded<number, "HFILE">;

/** A handle to a logical font. */
export type HFONT = _HANDLE<"HFONT">;

/** A handle to a GDI object. */
export type HGDIOBJ = _HANDLE<"HGDIOBJ">;

/** A handle to a global memory block. */
export type HGLOBAL = _HANDLE<"HGLOBAL">;

/** A handle to an installed hook. */
export type HHOOK = _HANDLE<"HHOOK">;

/** A handle to an icon. */
export type HICON = _HANDLE<"HICON">;

/** A handle to an application or module instance. */
export type HINSTANCE = _HANDLE<"HINSTANCE">;

/** A handle to a registry key. */
export type HKEY = _HANDLE<"HKEY">;

/** A handle identifying an input locale. */
export type HKL = _HANDLE<"HKL">;

/** A handle to a local memory block. */
export type HLOCAL = _HANDLE<"HLOCAL">;

/** A handle to a menu. */
export type HMENU = _HANDLE<"HMENU">;

/** A handle to a metafile. */
export type HMETAFILE = _HANDLE<"HMETAFILE">;

/** A handle to a loaded module. */
export type HMODULE = _HANDLE<"HMODULE">;

/** A handle to a monitor. */
export type HMONITOR = _HANDLE<"HMONITOR">;

/** A handle to a logical palette. */
export type HPALETTE = _HANDLE<"HPALETTE">;

/** A handle to a logical pen. */
export type HPEN = _HANDLE<"HPEN">;

/** A handle to a region. */
export type HRGN = _HANDLE<"HRGN">;

/** A handle to an application resource. */
export type HRSRC = _HANDLE<"HRSRC">;

/** A handle to a Dynamic Data Exchange string. */
export type HSZ = _HANDLE<"HSZ">;

/** A handle to a window station. */
export type HWINSTA = _HANDLE<"HWINSTA">;

/** A handle to a window. */
export type HWND = _HANDLE<"HWND">;

/** A handle to a resource whose access is managed by the Windows API. */
export type Any =
    | HACCEL
    | HBITMAP
    | HBRUSH
    | HCOLORSPACE
    | HCONV
    | HCONVLIST
    | HCURSOR
    | HDC
    | HDDEDATA
    | HDESK
    | HDROP
    | HDWP
    | HENHMETAFILE
    | HFILE
    | HFONT
    | HGDIOBJ
    | HGLOBAL
    | HHOOK
    | HICON
    | HINSTANCE
    | HKEY
    | HKL
    | HLOCAL
    | HMENU
    | HMETAFILE
    | HMODULE
    | HMONITOR
    | HPALETTE
    | HPEN
    | HRGN
    | HRSRC
    | HSZ
    | HWINSTA
    | HWND;
