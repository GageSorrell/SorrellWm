/**
 * MathJax declarations for rendering LaTeX in Ink.
 *
 * @module @sorrell/ink-ui/Latex/MathJax
 *
 * @file      MathJax.d.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

declare module "mathjax"
{
    /**
     * The API provided by MathJax.
     *
     * @category Internal
     * @since 1.0.0
     */
    export interface MathJaxApi
    {
        readonly startup:
        {
            readonly adaptor:
            {
                firstChild(Node: unknown): unknown | null;
                serializeXML(Node: unknown): string;
            };
        };

        tex2svgPromise(
            Source: string,
            Options: { readonly display: boolean }
        ): Promise<unknown>;
    }

    const MathJax:
    {
        init(Options:
        {
            readonly loader:
            {
                readonly load: ReadonlyArray<string>;
                readonly require: (Specifier: string) => Promise<unknown>;
            };
            readonly svg:
            {
                readonly fontCache: "local"
            };
            readonly tex:
            {
                readonly formatError: (Jax: unknown, ErrorValue: Error) => never;
            };
        }): Promise<MathJaxApi>;
    };

    export default MathJax;
}
