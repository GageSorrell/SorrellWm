/**
 * @file      spinner.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { isUnicodeSupported } from "@utils/index.js";

export class Spinner
{
    protected readonly spinner: Array<string> = !isUnicodeSupported()
        ? [ "-", "\\", "|", "/" ]
        : [ "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏" ];

    private id?: NodeJS.Timeout;

    private spinnerPosition: number = 0;

    public spin(): void
    {
        this.spinnerPosition = ++this.spinnerPosition % this.spinner.length;
    }

    public fetch(): string
    {
        return this.spinner[this.spinnerPosition];
    }

    public isRunning(): boolean
    {
        return !!this.id;
    }

    public start(cb?: () => void, interval: number = 100): void
    {
        this.id = setInterval(() =>
        {
            this.spin();

            if (cb)
            {
                cb();
            }
        }, interval);
    }

    public stop(): void
    {
        clearInterval(this.id);
        this.id = undefined;
    }
}
