/**
 * @file      Element.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ComponentProps, DetailedHTMLProps, ElementType, JSX, PropsWithoutRef } from "react";

export type FHtmlElementRecord =
    {
        a: DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
        abbr: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        address: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        area: DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
        article: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        aside: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        audio: DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
        b: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        base: DetailedHTMLProps<React.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
        bdi: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        bdo: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        big: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        blockquote: DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        body: DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
        br: DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
        button: DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        canvas: DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
        caption: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        center: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        cite: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        code: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        col: DetailedHTMLProps<React.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        colgroup: DetailedHTMLProps<React.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        data: DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
        datalist: DetailedHTMLProps<React.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
        dd: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        del: DetailedHTMLProps<React.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
        details: DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
        dfn: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        dialog: DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
        div: DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        dl: DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
        dt: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        em: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        embed: DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
        fieldset: DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
        figcaption: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        figure: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        footer: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        form: DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
        h1: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h2: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h3: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h4: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h5: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h6: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        head: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
        header: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        hgroup: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        hr: DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
        html: DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
        i: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        iframe: DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
        img: DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
        input: DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        ins: DetailedHTMLProps<React.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
        kbd: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        keygen: DetailedHTMLProps<React.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
        label: DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
        legend: DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
        li: DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
        link: DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
        main: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        map: DetailedHTMLProps<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
        mark: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        menu: DetailedHTMLProps<React.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
        menuitem: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        meta: DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
        meter: DetailedHTMLProps<React.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
        nav: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        noindex: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        noscript: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        object: DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
        ol: DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
        optgroup: DetailedHTMLProps<React.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
        option: DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
        output: DetailedHTMLProps<React.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
        p: DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
        param: DetailedHTMLProps<React.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
        picture: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        pre: DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
        progress: DetailedHTMLProps<React.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
        q: DetailedHTMLProps<React.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        rp: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        rt: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        ruby: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        s: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        samp: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        search: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        slot: DetailedHTMLProps<React.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
        script: DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
        section: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        select: DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
        small: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        source: DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
        span: DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
        strong: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        style: DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
        sub: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        summary: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        sup: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        table: DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
        template: DetailedHTMLProps<React.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
        tbody: DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        td: DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
        textarea: DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
        tfoot: DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        th: DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
        thead: DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        time: DetailedHTMLProps<React.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
        title: DetailedHTMLProps<React.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
        tr: DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
        track: DetailedHTMLProps<React.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
        u: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        ul: DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
        "var": DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        video: DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
        wbr: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        webview: DetailedHTMLProps<React.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;
    };

export type FHtmlElement = keyof FHtmlElementRecord;

export type TElementProps<Type extends ElementType> =
    Omit<PropsWithoutRef<ComponentProps<Type>>, "className"> &
    Partial<{
        className?: string | ReadonlyArray<string>;
    }>;

export type TElementFromType<Type extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Type];
