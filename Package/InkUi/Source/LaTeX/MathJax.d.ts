/**
 *
 *
 * @module @sorrell/ink-ui/LaTeX/MathJax.d
 *
 * @file      MathJax.d.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

declare module "mathjax"
{
    export interface MathJaxApi
    {
        readonly startup: {
            readonly adaptor: {
                firstChild(Node: unknown): unknown | null;
                serializeXML(Node: unknown): string;
            };
        };
        tex2svgPromise(
            Source: string,
            Options: { readonly display: boolean }
        ): Promise<unknown>;
    }

    const MathJax: {
        init(Options: {
            readonly loader: {
                readonly load: ReadonlyArray<string>;
                readonly require: (Specifier: string) => Promise<unknown>;
            };
            readonly svg: { readonly fontCache: "local" };
            readonly tex: {
                readonly formatError: (Jax: unknown, ErrorValue: Error) => never;
            };
        }): Promise<MathJaxApi>;
    };

    export default MathJax;
}
