/**
 * @file      Div.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    PAbbr,
    PAddress,
    PAnchor,
    PArea,
    PArticle,
    PAside,
    PAudio,
    PBase,
    PBdi,
    PBdo,
    PBig,
    PBlockquote,
    PBody,
    PBold,
    PBr,
    PButton,
    PCanvas,
    PCaption,
    PCenter,
    PCite,
    PCode,
    PCol,
    PColgroup,
    PData,
    PDatalist,
    PDd,
    PDel,
    PDetails,
    PDfn,
    PDialog,
    PDiv,
    PDl,
    PDt,
    PEm,
    PEmbed,
    PFieldset,
    PFigcaption,
    PFigure,
    PFooter,
    PForm,
    PH1,
    PH2,
    PH3,
    PH4,
    PH5,
    PH6,
    PHead,
    PHeader,
    PHgroup,
    PHr,
    PHtml,
    PIframe,
    PImg,
    PInput,
    PIns,
    PItalics,
    PKbd,
    PKeygen,
    PLabel,
    PLegend,
    PLi,
    PLink,
    PMain,
    PMap,
    PMark,
    PMenu,
    PMenuitem,
    PMeta,
    PMeter,
    PNav,
    PNoindex,
    PNoscript,
    PObject,
    POl,
    POptgroup,
    POption,
    POutput,
    PParagraph,
    PParam,
    PPicture,
    PPre,
    PProgress,
    PQuotation,
    PRp,
    PRt,
    PRuby,
    PSamp,
    PScript,
    PSearch,
    PSection,
    PSelect,
    PSlot,
    PSmall,
    PSource,
    PSpan,
    PStrikethrough,
    PStrong,
    PStyle,
    PSub,
    PSummary,
    PSup,
    PTable,
    PTbody,
    PTd,
    PTemplate,
    PTextarea,
    PTfoot,
    PTh,
    PThead,
    PTime,
    PTitle,
    PTr,
    PTrack,
    PUl,
    PUnderline,
    PVar,
    PVideo,
    PWbr,
    PWebview
} from "./Element.Types.js";
import type { ReactNode } from "react";

export function A(Props: PAnchor): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <a className={ NormalizedClassName }>
                { Tail.children }
            </a>
        );
    }
    else
    {
        return (
            <a className={ NormalizedClassName }>
            </a>
        );
    }
};

export function Abbr(Props: PAbbr): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <abbr className={ NormalizedClassName }>
                { Tail.children }
            </abbr>
        );
    }
    else
    {
        return (
            <abbr className={ NormalizedClassName }>
            </abbr>
        );
    }
};

export function Address(Props: PAddress): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <address className={ NormalizedClassName }>
                { Tail.children }
            </address>
        );
    }
    else
    {
        return (
            <address className={ NormalizedClassName }>
            </address>
        );
    }
};

export function Area(Props: PArea): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <area className={ NormalizedClassName }>
                { Tail.children }
            </area>
        );
    }
    else
    {
        return (
            <area className={ NormalizedClassName }>
            </area>
        );
    }
};

export function Article(Props: PArticle): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <article className={ NormalizedClassName }>
                { Tail.children }
            </article>
        );
    }
    else
    {
        return (
            <article className={ NormalizedClassName }>
            </article>
        );
    }
};

export function Aside(Props: PAside): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <aside className={ NormalizedClassName }>
                { Tail.children }
            </aside>
        );
    }
    else
    {
        return (
            <aside className={ NormalizedClassName }>
            </aside>
        );
    }
};

export function Audio(Props: PAudio): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <audio className={ NormalizedClassName }>
                { Tail.children }
            </audio>
        );
    }
    else
    {
        return (
            <audio className={ NormalizedClassName }>
            </audio>
        );
    }
};

export function B(Props: PBold): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <b className={ NormalizedClassName }>
                { Tail.children }
            </b>
        );
    }
    else
    {
        return (
            <b className={ NormalizedClassName }>
            </b>
        );
    }
};

export function Base(Props: PBase): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <base className={ NormalizedClassName }>
                { Tail.children }
            </base>
        );
    }
    else
    {
        return (
            <base className={ NormalizedClassName }>
            </base>
        );
    }
};

export function Bdi(Props: PBdi): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <bdi className={ NormalizedClassName }>
                { Tail.children }
            </bdi>
        );
    }
    else
    {
        return (
            <bdi className={ NormalizedClassName }>
            </bdi>
        );
    }
};

export function Bdo(Props: PBdo): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <bdo className={ NormalizedClassName }>
                { Tail.children }
            </bdo>
        );
    }
    else
    {
        return (
            <bdo className={ NormalizedClassName }>
            </bdo>
        );
    }
};

export function Big(Props: PBig): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <big className={ NormalizedClassName }>
                { Tail.children }
            </big>
        );
    }
    else
    {
        return (
            <big className={ NormalizedClassName }>
            </big>
        );
    }
};

export function Blockquote(Props: PBlockquote): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <blockquote className={ NormalizedClassName }>
                { Tail.children }
            </blockquote>
        );
    }
    else
    {
        return (
            <blockquote className={ NormalizedClassName }>
            </blockquote>
        );
    }
};

export function Body(Props: PBody): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <body className={ NormalizedClassName }>
                { Tail.children }
            </body>
        );
    }
    else
    {
        return (
            <body className={ NormalizedClassName }>
            </body>
        );
    }
};

export function Br(Props: PBr): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <br className={ NormalizedClassName }>
                { Tail.children }
            </br>
        );
    }
    else
    {
        return (
            <br className={ NormalizedClassName }>
            </br>
        );
    }
};

export function Button(Props: PButton): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <button className={ NormalizedClassName }>
                { Tail.children }
            </button>
        );
    }
    else
    {
        return (
            <button className={ NormalizedClassName }>
            </button>
        );
    }
};

export function Canvas(Props: PCanvas): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <canvas className={ NormalizedClassName }>
                { Tail.children }
            </canvas>
        );
    }
    else
    {
        return (
            <canvas className={ NormalizedClassName }>
            </canvas>
        );
    }
};

export function Caption(Props: PCaption): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <caption className={ NormalizedClassName }>
                { Tail.children }
            </caption>
        );
    }
    else
    {
        return (
            <caption className={ NormalizedClassName }>
            </caption>
        );
    }
};

export function Center(Props: PCenter): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <center className={ NormalizedClassName }>
                { Tail.children }
            </center>
        );
    }
    else
    {
        return (
            <center className={ NormalizedClassName }>
            </center>
        );
    }
};

export function Cite(Props: PCite): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <cite className={ NormalizedClassName }>
                { Tail.children }
            </cite>
        );
    }
    else
    {
        return (
            <cite className={ NormalizedClassName }>
            </cite>
        );
    }
};

export function Code(Props: PCode): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <code className={ NormalizedClassName }>
                { Tail.children }
            </code>
        );
    }
    else
    {
        return (
            <code className={ NormalizedClassName }>
            </code>
        );
    }
};

export function Col(Props: PCol): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <col className={ NormalizedClassName }>
                { Tail.children }
            </col>
        );
    }
    else
    {
        return (
            <col className={ NormalizedClassName }>
            </col>
        );
    }
};

export function Colgroup(Props: PColgroup): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <colgroup className={ NormalizedClassName }>
                { Tail.children }
            </colgroup>
        );
    }
    else
    {
        return (
            <colgroup className={ NormalizedClassName }>
            </colgroup>
        );
    }
};

export function Data(Props: PData): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <data className={ NormalizedClassName }>
                { Tail.children }
            </data>
        );
    }
    else
    {
        return (
            <data className={ NormalizedClassName }>
            </data>
        );
    }
};

export function Datalist(Props: PDatalist): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <datalist className={ NormalizedClassName }>
                { Tail.children }
            </datalist>
        );
    }
    else
    {
        return (
            <datalist className={ NormalizedClassName }>
            </datalist>
        );
    }
};

export function Dd(Props: PDd): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <dd className={ NormalizedClassName }>
                { Tail.children }
            </dd>
        );
    }
    else
    {
        return (
            <dd className={ NormalizedClassName }>
            </dd>
        );
    }
};

export function Del(Props: PDel): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <del className={ NormalizedClassName }>
                { Tail.children }
            </del>
        );
    }
    else
    {
        return (
            <del className={ NormalizedClassName }>
            </del>
        );
    }
};

export function Details(Props: PDetails): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <details className={ NormalizedClassName }>
                { Tail.children }
            </details>
        );
    }
    else
    {
        return (
            <details className={ NormalizedClassName }>
            </details>
        );
    }
};

export function Dfn(Props: PDfn): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <dfn className={ NormalizedClassName }>
                { Tail.children }
            </dfn>
        );
    }
    else
    {
        return (
            <dfn className={ NormalizedClassName }>
            </dfn>
        );
    }
};

export function Dialog(Props: PDialog): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <dialog className={ NormalizedClassName }>
                { Tail.children }
            </dialog>
        );
    }
    else
    {
        return (
            <dialog className={ NormalizedClassName }>
            </dialog>
        );
    }
};

export function Div(Props: PDiv): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <div className={ NormalizedClassName }>
                { Tail.children }
            </div>
        );
    }
    else
    {
        return (
            <div className={ NormalizedClassName }>
            </div>
        );
    }
};

export function Dl(Props: PDl): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <dl className={ NormalizedClassName }>
                { Tail.children }
            </dl>
        );
    }
    else
    {
        return (
            <dl className={ NormalizedClassName }>
            </dl>
        );
    }
};

export function Dt(Props: PDt): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <dt className={ NormalizedClassName }>
                { Tail.children }
            </dt>
        );
    }
    else
    {
        return (
            <dt className={ NormalizedClassName }>
            </dt>
        );
    }
};

export function Em(Props: PEm): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <em className={ NormalizedClassName }>
                { Tail.children }
            </em>
        );
    }
    else
    {
        return (
            <em className={ NormalizedClassName }>
            </em>
        );
    }
};

export function Embed(Props: PEmbed): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <embed className={ NormalizedClassName }>
                { Tail.children }
            </embed>
        );
    }
    else
    {
        return (
            <embed className={ NormalizedClassName }>
            </embed>
        );
    }
};

export function Fieldset(Props: PFieldset): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <fieldset className={ NormalizedClassName }>
                { Tail.children }
            </fieldset>
        );
    }
    else
    {
        return (
            <fieldset className={ NormalizedClassName }>
            </fieldset>
        );
    }
};

export function Figcaption(Props: PFigcaption): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <figcaption className={ NormalizedClassName }>
                { Tail.children }
            </figcaption>
        );
    }
    else
    {
        return (
            <figcaption className={ NormalizedClassName }>
            </figcaption>
        );
    }
};

export function Figure(Props: PFigure): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <figure className={ NormalizedClassName }>
                { Tail.children }
            </figure>
        );
    }
    else
    {
        return (
            <figure className={ NormalizedClassName }>
            </figure>
        );
    }
};

export function Footer(Props: PFooter): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <footer className={ NormalizedClassName }>
                { Tail.children }
            </footer>
        );
    }
    else
    {
        return (
            <footer className={ NormalizedClassName }>
            </footer>
        );
    }
};

export function Form(Props: PForm): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <form className={ NormalizedClassName }>
                { Tail.children }
            </form>
        );
    }
    else
    {
        return (
            <form className={ NormalizedClassName }>
            </form>
        );
    }
};

export function H1(Props: PH1): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <h1 className={ NormalizedClassName }>
                { Tail.children }
            </h1>
        );
    }
    else
    {
        return (
            <h1 className={ NormalizedClassName }>
            </h1>
        );
    }
};

export function H2(Props: PH2): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <h2 className={ NormalizedClassName }>
                { Tail.children }
            </h2>
        );
    }
    else
    {
        return (
            <h2 className={ NormalizedClassName }>
            </h2>
        );
    }
};

export function H3(Props: PH3): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <h3 className={ NormalizedClassName }>
                { Tail.children }
            </h3>
        );
    }
    else
    {
        return (
            <h3 className={ NormalizedClassName }>
            </h3>
        );
    }
};

export function H4(Props: PH4): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <h4 className={ NormalizedClassName }>
                { Tail.children }
            </h4>
        );
    }
    else
    {
        return (
            <h4 className={ NormalizedClassName }>
            </h4>
        );
    }
};

export function H5(Props: PH5): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <h5 className={ NormalizedClassName }>
                { Tail.children }
            </h5>
        );
    }
    else
    {
        return (
            <h5 className={ NormalizedClassName }>
            </h5>
        );
    }
};

export function H6(Props: PH6): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <h6 className={ NormalizedClassName }>
                { Tail.children }
            </h6>
        );
    }
    else
    {
        return (
            <h6 className={ NormalizedClassName }>
            </h6>
        );
    }
};

export function Head(Props: PHead): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <head className={ NormalizedClassName }>
                { Tail.children }
            </head>
        );
    }
    else
    {
        return (
            <head className={ NormalizedClassName }>
            </head>
        );
    }
};

export function Header(Props: PHeader): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <header className={ NormalizedClassName }>
                { Tail.children }
            </header>
        );
    }
    else
    {
        return (
            <header className={ NormalizedClassName }>
            </header>
        );
    }
};

export function Hgroup(Props: PHgroup): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <hgroup className={ NormalizedClassName }>
                { Tail.children }
            </hgroup>
        );
    }
    else
    {
        return (
            <hgroup className={ NormalizedClassName }>
            </hgroup>
        );
    }
};

export function Hr(Props: PHr): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <hr className={ NormalizedClassName }>
                { Tail.children }
            </hr>
        );
    }
    else
    {
        return (
            <hr className={ NormalizedClassName }>
            </hr>
        );
    }
};

export function Html(Props: PHtml): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <html className={ NormalizedClassName }>
                { Tail.children }
            </html>
        );
    }
    else
    {
        return (
            <html className={ NormalizedClassName }>
            </html>
        );
    }
};

export function I(Props: PItalics): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <i className={ NormalizedClassName }>
                { Tail.children }
            </i>
        );
    }
    else
    {
        return (
            <i className={ NormalizedClassName }>
            </i>
        );
    }
};

export function Iframe(Props: PIframe): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <iframe className={ NormalizedClassName }>
                { Tail.children }
            </iframe>
        );
    }
    else
    {
        return (
            <iframe className={ NormalizedClassName }>
            </iframe>
        );
    }
};

export function Img(Props: PImg): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <img className={ NormalizedClassName }>
                { Tail.children }
            </img>
        );
    }
    else
    {
        return (
            <img className={ NormalizedClassName }>
            </img>
        );
    }
};

export function Input(Props: PInput): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <input className={ NormalizedClassName }>
                { Tail.children }
            </input>
        );
    }
    else
    {
        return (
            <input className={ NormalizedClassName }>
            </input>
        );
    }
};

export function Ins(Props: PIns): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <ins className={ NormalizedClassName }>
                { Tail.children }
            </ins>
        );
    }
    else
    {
        return (
            <ins className={ NormalizedClassName }>
            </ins>
        );
    }
};

export function Kbd(Props: PKbd): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <kbd className={ NormalizedClassName }>
                { Tail.children }
            </kbd>
        );
    }
    else
    {
        return (
            <kbd className={ NormalizedClassName }>
            </kbd>
        );
    }
};

export function Keygen(Props: PKeygen): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <keygen className={ NormalizedClassName }>
                { Tail.children }
            </keygen>
        );
    }
    else
    {
        return (
            <keygen className={ NormalizedClassName }>
            </keygen>
        );
    }
};

export function Label(Props: PLabel): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <label className={ NormalizedClassName }>
                { Tail.children }
            </label>
        );
    }
    else
    {
        return (
            <label className={ NormalizedClassName }>
            </label>
        );
    }
};

export function Legend(Props: PLegend): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <legend className={ NormalizedClassName }>
                { Tail.children }
            </legend>
        );
    }
    else
    {
        return (
            <legend className={ NormalizedClassName }>
            </legend>
        );
    }
};

export function Li(Props: PLi): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <li className={ NormalizedClassName }>
                { Tail.children }
            </li>
        );
    }
    else
    {
        return (
            <li className={ NormalizedClassName }>
            </li>
        );
    }
};

export function Link(Props: PLink): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <link className={ NormalizedClassName }>
                { Tail.children }
            </link>
        );
    }
    else
    {
        return (
            <link className={ NormalizedClassName }>
            </link>
        );
    }
};

export function Main(Props: PMain): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <main className={ NormalizedClassName }>
                { Tail.children }
            </main>
        );
    }
    else
    {
        return (
            <main className={ NormalizedClassName }>
            </main>
        );
    }
};

export function Map(Props: PMap): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <map className={ NormalizedClassName }>
                { Tail.children }
            </map>
        );
    }
    else
    {
        return (
            <map className={ NormalizedClassName }>
            </map>
        );
    }
};

export function Mark(Props: PMark): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <mark className={ NormalizedClassName }>
                { Tail.children }
            </mark>
        );
    }
    else
    {
        return (
            <mark className={ NormalizedClassName }>
            </mark>
        );
    }
};

export function Menu(Props: PMenu): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <menu className={ NormalizedClassName }>
                { Tail.children }
            </menu>
        );
    }
    else
    {
        return (
            <menu className={ NormalizedClassName }>
            </menu>
        );
    }
};

export function Menuitem(Props: PMenuitem): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <menuitem className={ NormalizedClassName }>
                { Tail.children }
            </menuitem>
        );
    }
    else
    {
        return (
            <menuitem className={ NormalizedClassName }>
            </menuitem>
        );
    }
};

export function Meta(Props: PMeta): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <meta className={ NormalizedClassName }>
                { Tail.children }
            </meta>
        );
    }
    else
    {
        return (
            <meta className={ NormalizedClassName }>
            </meta>
        );
    }
};

export function Meter(Props: PMeter): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <meter className={ NormalizedClassName }>
                { Tail.children }
            </meter>
        );
    }
    else
    {
        return (
            <meter className={ NormalizedClassName }>
            </meter>
        );
    }
};

export function Nav(Props: PNav): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <nav className={ NormalizedClassName }>
                { Tail.children }
            </nav>
        );
    }
    else
    {
        return (
            <nav className={ NormalizedClassName }>
            </nav>
        );
    }
};

export function Noindex(Props: PNoindex): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <noindex className={ NormalizedClassName }>
                { Tail.children }
            </noindex>
        );
    }
    else
    {
        return (
            <noindex className={ NormalizedClassName }>
            </noindex>
        );
    }
};

export function Noscript(Props: PNoscript): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <noscript className={ NormalizedClassName }>
                { Tail.children }
            </noscript>
        );
    }
    else
    {
        return (
            <noscript className={ NormalizedClassName }>
            </noscript>
        );
    }
};

export function Object(Props: PObject): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <object className={ NormalizedClassName }>
                { Tail.children }
            </object>
        );
    }
    else
    {
        return (
            <object className={ NormalizedClassName }>
            </object>
        );
    }
};

export function Ol(Props: POl): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <ol className={ NormalizedClassName }>
                { Tail.children }
            </ol>
        );
    }
    else
    {
        return (
            <ol className={ NormalizedClassName }>
            </ol>
        );
    }
};

export function Optgroup(Props: POptgroup): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <optgroup className={ NormalizedClassName }>
                { Tail.children }
            </optgroup>
        );
    }
    else
    {
        return (
            <optgroup className={ NormalizedClassName }>
            </optgroup>
        );
    }
};

export function Option(Props: POption): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <option className={ NormalizedClassName }>
                { Tail.children }
            </option>
        );
    }
    else
    {
        return (
            <option className={ NormalizedClassName }>
            </option>
        );
    }
};

export function Output(Props: POutput): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <output className={ NormalizedClassName }>
                { Tail.children }
            </output>
        );
    }
    else
    {
        return (
            <output className={ NormalizedClassName }>
            </output>
        );
    }
};

export function P(Props: PParagraph): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <p className={ NormalizedClassName }>
                { Tail.children }
            </p>
        );
    }
    else
    {
        return (
            <p className={ NormalizedClassName }>
            </p>
        );
    }
};

export function Param(Props: PParam): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <param className={ NormalizedClassName }>
                { Tail.children }
            </param>
        );
    }
    else
    {
        return (
            <param className={ NormalizedClassName }>
            </param>
        );
    }
};

export function Picture(Props: PPicture): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <picture className={ NormalizedClassName }>
                { Tail.children }
            </picture>
        );
    }
    else
    {
        return (
            <picture className={ NormalizedClassName }>
            </picture>
        );
    }
};

export function Pre(Props: PPre): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <pre className={ NormalizedClassName }>
                { Tail.children }
            </pre>
        );
    }
    else
    {
        return (
            <pre className={ NormalizedClassName }>
            </pre>
        );
    }
};

export function Progress(Props: PProgress): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <progress className={ NormalizedClassName }>
                { Tail.children }
            </progress>
        );
    }
    else
    {
        return (
            <progress className={ NormalizedClassName }>
            </progress>
        );
    }
};

export function Q(Props: PQuotation): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <q className={ NormalizedClassName }>
                { Tail.children }
            </q>
        );
    }
    else
    {
        return (
            <q className={ NormalizedClassName }>
            </q>
        );
    }
};

export function Rp(Props: PRp): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <rp className={ NormalizedClassName }>
                { Tail.children }
            </rp>
        );
    }
    else
    {
        return (
            <rp className={ NormalizedClassName }>
            </rp>
        );
    }
};

export function Rt(Props: PRt): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <rt className={ NormalizedClassName }>
                { Tail.children }
            </rt>
        );
    }
    else
    {
        return (
            <rt className={ NormalizedClassName }>
            </rt>
        );
    }
};

export function Ruby(Props: PRuby): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <ruby className={ NormalizedClassName }>
                { Tail.children }
            </ruby>
        );
    }
    else
    {
        return (
            <ruby className={ NormalizedClassName }>
            </ruby>
        );
    }
};

export function S(Props: PStrikethrough): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <s className={ NormalizedClassName }>
                { Tail.children }
            </s>
        );
    }
    else
    {
        return (
            <s className={ NormalizedClassName }>
            </s>
        );
    }
};

export function Samp(Props: PSamp): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <samp className={ NormalizedClassName }>
                { Tail.children }
            </samp>
        );
    }
    else
    {
        return (
            <samp className={ NormalizedClassName }>
            </samp>
        );
    }
};

export function Search(Props: PSearch): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <search className={ NormalizedClassName }>
                { Tail.children }
            </search>
        );
    }
    else
    {
        return (
            <search className={ NormalizedClassName }>
            </search>
        );
    }
};

export function Slot(Props: PSlot): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <slot className={ NormalizedClassName }>
                { Tail.children }
            </slot>
        );
    }
    else
    {
        return (
            <slot className={ NormalizedClassName }>
            </slot>
        );
    }
};

export function Script(Props: PScript): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <script className={ NormalizedClassName }>
                { Tail.children }
            </script>
        );
    }
    else
    {
        return (
            <script className={ NormalizedClassName }>
            </script>
        );
    }
};

export function Section(Props: PSection): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <section className={ NormalizedClassName }>
                { Tail.children }
            </section>
        );
    }
    else
    {
        return (
            <section className={ NormalizedClassName }>
            </section>
        );
    }
};

export function Select(Props: PSelect): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <select className={ NormalizedClassName }>
                { Tail.children }
            </select>
        );
    }
    else
    {
        return (
            <select className={ NormalizedClassName }>
            </select>
        );
    }
};

export function Small(Props: PSmall): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <small className={ NormalizedClassName }>
                { Tail.children }
            </small>
        );
    }
    else
    {
        return (
            <small className={ NormalizedClassName }>
            </small>
        );
    }
};

export function Source(Props: PSource): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <source className={ NormalizedClassName }>
                { Tail.children }
            </source>
        );
    }
    else
    {
        return (
            <source className={ NormalizedClassName }>
            </source>
        );
    }
};

export function Span(Props: PSpan): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <span className={ NormalizedClassName }>
                { Tail.children }
            </span>
        );
    }
    else
    {
        return (
            <span className={ NormalizedClassName }>
            </span>
        );
    }
};

export function Strong(Props: PStrong): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <strong className={ NormalizedClassName }>
                { Tail.children }
            </strong>
        );
    }
    else
    {
        return (
            <strong className={ NormalizedClassName }>
            </strong>
        );
    }
};

export function Style(Props: PStyle): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <style className={ NormalizedClassName }>
                { Tail.children }
            </style>
        );
    }
    else
    {
        return (
            <style className={ NormalizedClassName }>
            </style>
        );
    }
};

export function Sub(Props: PSub): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <sub className={ NormalizedClassName }>
                { Tail.children }
            </sub>
        );
    }
    else
    {
        return (
            <sub className={ NormalizedClassName }>
            </sub>
        );
    }
};

export function Summary(Props: PSummary): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <summary className={ NormalizedClassName }>
                { Tail.children }
            </summary>
        );
    }
    else
    {
        return (
            <summary className={ NormalizedClassName }>
            </summary>
        );
    }
};

export function Sup(Props: PSup): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <sup className={ NormalizedClassName }>
                { Tail.children }
            </sup>
        );
    }
    else
    {
        return (
            <sup className={ NormalizedClassName }>
            </sup>
        );
    }
};

export function Table(Props: PTable): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <table className={ NormalizedClassName }>
                { Tail.children }
            </table>
        );
    }
    else
    {
        return (
            <table className={ NormalizedClassName }>
            </table>
        );
    }
};

export function Template(Props: PTemplate): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <template className={ NormalizedClassName }>
                { Tail.children }
            </template>
        );
    }
    else
    {
        return (
            <template className={ NormalizedClassName }>
            </template>
        );
    }
};

export function Tbody(Props: PTbody): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <tbody className={ NormalizedClassName }>
                { Tail.children }
            </tbody>
        );
    }
    else
    {
        return (
            <tbody className={ NormalizedClassName }>
            </tbody>
        );
    }
};

export function Td(Props: PTd): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <td className={ NormalizedClassName }>
                { Tail.children }
            </td>
        );
    }
    else
    {
        return (
            <td className={ NormalizedClassName }>
            </td>
        );
    }
};

export function Textarea(Props: PTextarea): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <textarea className={ NormalizedClassName }>
                { Tail.children }
            </textarea>
        );
    }
    else
    {
        return (
            <textarea className={ NormalizedClassName }>
            </textarea>
        );
    }
};

export function Tfoot(Props: PTfoot): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <tfoot className={ NormalizedClassName }>
                { Tail.children }
            </tfoot>
        );
    }
    else
    {
        return (
            <tfoot className={ NormalizedClassName }>
            </tfoot>
        );
    }
};

export function Th(Props: PTh): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <th className={ NormalizedClassName }>
                { Tail.children }
            </th>
        );
    }
    else
    {
        return (
            <th className={ NormalizedClassName }>
            </th>
        );
    }
};

export function Thead(Props: PThead): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <thead className={ NormalizedClassName }>
                { Tail.children }
            </thead>
        );
    }
    else
    {
        return (
            <thead className={ NormalizedClassName }>
            </thead>
        );
    }
};

export function Time(Props: PTime): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <time className={ NormalizedClassName }>
                { Tail.children }
            </time>
        );
    }
    else
    {
        return (
            <time className={ NormalizedClassName }>
            </time>
        );
    }
};

export function Title(Props: PTitle): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <title className={ NormalizedClassName }>
                { Tail.children }
            </title>
        );
    }
    else
    {
        return (
            <title className={ NormalizedClassName }>
            </title>
        );
    }
};

export function Tr(Props: PTr): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <tr className={ NormalizedClassName }>
                { Tail.children }
            </tr>
        );
    }
    else
    {
        return (
            <tr className={ NormalizedClassName }>
            </tr>
        );
    }
};

export function Track(Props: PTrack): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <track className={ NormalizedClassName }>
                { Tail.children }
            </track>
        );
    }
    else
    {
        return (
            <track className={ NormalizedClassName }>
            </track>
        );
    }
};

export function U(Props: PUnderline): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <u className={ NormalizedClassName }>
                { Tail.children }
            </u>
        );
    }
    else
    {
        return (
            <u className={ NormalizedClassName }>
            </u>
        );
    }
};

export function Ul(Props: PUl): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <ul className={ NormalizedClassName }>
                { Tail.children }
            </ul>
        );
    }
    else
    {
        return (
            <ul className={ NormalizedClassName }>
            </ul>
        );
    }
};

export function Var(Props: PVar): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <var className={ NormalizedClassName }>
                { Tail.children }
            </var>
        );
    }
    else
    {
        return (
            <var className={ NormalizedClassName }>
            </var>
        );
    }
};

export function Video(Props: PVideo): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <video className={ NormalizedClassName }>
                { Tail.children }
            </video>
        );
    }
    else
    {
        return (
            <video className={ NormalizedClassName }>
            </video>
        );
    }
};

export function Wbr(Props: PWbr): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <wbr className={ NormalizedClassName }>
                { Tail.children }
            </wbr>
        );
    }
    else
    {
        return (
            <wbr className={ NormalizedClassName }>
            </wbr>
        );
    }
};

export function Webview(Props: PWebview): ReactNode
{
    const { className, ...Tail } = Props;

    const NormalizedClassName: string | undefined =
        Array.isArray(className)
            ? className.join(" ")
            : (className as string);

    if ("children" in Tail)
    {
        return (
            <webview className={ NormalizedClassName }>
                { Tail.children }
            </webview>
        );
    }
    else
    {
        return (
            <webview className={ NormalizedClassName }>
            </webview>
        );
    }
};
