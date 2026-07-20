/**
 * @file      static-fallback.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

"use client";

import { type JSX, useEffect, useLayoutEffect, useState } from "react";

const useIsomorphicLayoutEffect: typeof useEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

let suffixCounter: number = 0;
const PrefersStaticKey: string = "ch-prefers-static";

export function toggleStatic()
{
    localStorage.setItem(
        "ch-prefers-static",
        localStorage.getItem("ch-prefers-static") === "true" ? "false" : "true"
    );
    window.dispatchEvent(
        new StorageEvent("storage", {
            key: "ch-prefers-static"
        })
    );
}

export function StaticToggle({
    viewDynamicText = "View dynamic version",
    viewStaticText = "View static version",
    className
}: {
    viewDynamicText?: string
    viewStaticText?: string
    className?: string
})
{
    const [ ForceStatic, ToggleStatic ] = useStaticToggle();
    return (
        <button
            className={ className }
            data-ch-static={ ForceStatic }
            onClick={ ToggleStatic }>
            { ForceStatic ? viewDynamicText : viewStaticText }
        </button>
    );
}

export function useStaticToggle()
{
    const { showStatic: forceStatic } = useMedia("screen and (max-width: 0px)");

    const [ firstRender, setFirstRender ] = useState<boolean>(true);

    useIsomorphicLayoutEffect(() =>
    {
        if (forceStatic)
        {
            setFirstRender(false);
        }
    }, []);

    return [ firstRender ? false : forceStatic, toggleStatic ] as const;
}

/**
 * @typedef SwapProps
 * @prop {[string, JSX.Element][]} match
 */

/**
 * Swap between different components depending on the media queries
 * @param {SwapProps} props
 */

export function StaticFallback({
    query = "not screen, (max-width: 768px)",
    fallback,
    children
}: {
    query?: string
    fallback: JSX.Element
    children: JSX.Element
})
{
    const dynamicElement = children;

    const { isServer, showStatic } = useMedia(query);
    const mainClassName = isServer ? "ssmq-" + suffixCounter++ : "";
    return isServer ? (
        <>
            <style
                className={ mainClassName }
                dangerouslySetInnerHTML={ {
                    __html: getStyle(query, mainClassName)
                } }
            />
            <div className={ `${mainClassName} ssmq-static` }>{fallback}</div>
            <div className={ `${mainClassName} ssmq-dynamic` }>{dynamicElement}</div>
            <script
                className={ mainClassName }
                dangerouslySetInnerHTML={ {
                    __html: getScript(query, mainClassName)
                } }
            />
        </>
    ) : (
        <>
            <div>{ showStatic ? fallback : dynamicElement }</div>
        </>
    );
}

function getStyle(query: string, mainClass: string)
{
    return `.${mainClass}.ssmq-dynamic { display: block; }
.${mainClass}.ssmq-static { display: none; }
@media ${query} {
  .${mainClass}.ssmq-dynamic { display: none; }
  .${mainClass}.ssmq-static { display: block; }
}
`;
}

function getScript(query: string, mainClass: string)
{
    return `(function() {
  var q = ${JSON.stringify(query)};
  var mainCls = "${mainClass}";

  var dynamicEl = document.querySelector(
    "." + mainCls + ".ssmq-dynamic"
  )
  var staticEl = document.querySelector(
    "." + mainCls + ".ssmq-static"
  )
  var parent = dynamicEl.parentNode

  if (window.matchMedia(q).matches || localStorage.getItem("${PrefersStaticKey}") === 'true') {
    staticEl.removeAttribute("class")
  } else {
    dynamicEl.removeAttribute("class")
  }

  parent
    .querySelectorAll(":scope > ." + mainCls)
    .forEach(function (e) {
      parent.removeChild(e)
    })
})();`;
}

function useMedia(query: string)
{
    const isServer: boolean = typeof window === "undefined";

    if (isServer)
    {
        return { isServer, showStatic: false };
    }

    const [ , setValue ] = useState<number>(0);

    const mql = window.matchMedia(query);
    useEffect(() =>
    {
        const handler = () => setValue((x) => x + 1);
        mql.addEventListener("change", handler);
        window.addEventListener("storage", (event) =>
        {
            if (event.key === PrefersStaticKey)
            {
                handler();
            }
        });
        return () =>
        {
            mql.removeEventListener("change", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    const showStatic =
        mql.matches || localStorage.getItem(PrefersStaticKey) === "true";

    return {
        isServer,
        showStatic
    };
}
