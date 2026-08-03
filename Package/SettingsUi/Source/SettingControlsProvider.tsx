/**
 * Provides the registry behind {@link UseSettingControls}.
 *
 * @module @sorrell/settings-ui/SettingControlsProvider
 *
 * @file      SettingControlsProvider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import
{
    type ReactNode,
    useCallback,
    useMemo,
    useRef,
    useState
} from "react";
import { motionTokens } from "@fluentui/react-motion";
import
{
    type SettingControlEntry,
    SettingControlsContext,
    type SettingControlsContextValue
} from "./SettingControlsContext.js";

/** {@inheritDoc SettingControlsProvider} */
export interface SettingControlsProviderProps
{
    readonly children?: ReactNode;
}

/**
 * Tracks every {@link Setting} and {@link SettingGroup} beneath it that has an `Id`, so that
 * {@link UseSettingControls} can list and jump to them. Components without an `Id` never
 * register and are unaffected by whether this provider is present.
 */
export function SettingControlsProvider({ children }: SettingControlsProviderProps): React.JSX.Element
{
    const [ Entries, SetEntries ] = useState<Record<string, SettingControlEntry>>({});
    const ElementsRef = useRef(new Map<string, HTMLElement | null>());
    const PulseListenersRef = useRef(new Map<string, Set<() => void>>());

    const Register = useCallback((
        Id: string,
        Entry: SettingControlEntry,
        Element: HTMLElement | null
    ): (() => void) =>
    {
        ElementsRef.current.set(Id, Element);
        SetEntries((Previous) => ({ ...Previous, [ Id ]: Entry }));

        return () =>
        {
            ElementsRef.current.delete(Id);
            PulseListenersRef.current.delete(Id);
            SetEntries((Previous) =>
            {
                const { [ Id ]: _, ...Rest } = Previous;
                return Rest;
            });
        };
    }, []);

    const SubscribePulse = useCallback((Id: string, Listener: () => void): (() => void) =>
    {
        const Listeners = PulseListenersRef.current.get(Id) ?? new Set<() => void>();
        PulseListenersRef.current.set(Id, Listeners);
        Listeners.add(Listener);

        return () =>
        {
            Listeners.delete(Listener);
        };
    }, []);

    const ScrollToAndPulse = useCallback((Id: string): void =>
    {
        const Element = ElementsRef.current.get(Id);

        if (Element === undefined || Element === null)
        {
            return;
        }

        Element.scrollIntoView({ behavior: "smooth", block: "center" });

        // A fixed delay is simpler and more robust across browsers than the "scrollend" event,
        // which never fires when the element was already in view.
        setTimeout(() =>
        {
            for (const Listener of PulseListenersRef.current.get(Id) ?? [ ])
            {
                Listener();
            }
        }, motionTokens.durationSlower);
    }, []);

    const Value = useMemo<SettingControlsContextValue>(() => ({
        Entries,
        Register,
        ScrollToAndPulse,
        SubscribePulse
    }), [ Entries, Register, ScrollToAndPulse, SubscribePulse ]);

    return (
        <SettingControlsContext.Provider value={ Value }>
            { children }
        </SettingControlsContext.Provider>
    );
}
