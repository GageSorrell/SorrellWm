/**
 * @file      Settings.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import {
    BoardColor,
    type FluentIcon,
    type FluentIconsProps,
    InfoFilled,
    InfoRegular,
    KeyboardFilled,
    KeyboardRegular,
    SettingsFilled,
    SettingsRegular,
    bundleIcon
} from "@fluentui/react-icons";
import {
    type CSSProperties,
    type FC,
    type ReactElement,
    type ReactNode,
    type RefObject,
    useCallback,
    useRef,
    useState
} from "react";
import {
    Caption1,
    Hamburger,
    NavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
    NavItem,
    type OnNavItemSelectData,
    tokens
} from "@fluentui/react-components";
import type {
    FNavDrawerType,
    FSettingsScreen,
    FSettingsScreenKey,
    FSettingsScreens,
    PSettingsNavDrawer,
    PTitlebar
} from "./Settings.Types";
import { GetFlexStyle, UseState, UseWindowEffect } from "@sorrell/react";
import { About } from "./About";
import type { FLogger } from "../../../../Shared/Log.Types";
import { General } from "./General/General";
import { GetLogger } from "@/Log";
import { Keyboard } from "./Keyboard";
import { MapRecord } from "@sorrell/utilities/record";
import type { TFunction } from "@sorrell/utilities/functional";
import { Tokens } from "../../../../Shared/Tokens";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

const Titlebar = ({ OnClickHamburger, ShowHamburger }: PTitlebar): ReactNode =>
{
    const RootStyle: CSSProperties =
        {
            ...GetFlexStyle("row", "flex-start", "center"),
            gap: 12,
            height: Tokens.TitlebarHeight,
            minHeight: Tokens.TitlebarHeight,
            minWidth: "100%",
            paddingLeft: 32,
            width: "100%"
        };

    const HamburgerButton = (): ReactNode =>
    {
        const HamburgerStyle: CSSProperties =
            {
                cursor: "pointer"
            };

        return ShowHamburger && (
            <Hamburger
                className="TitlebarNoDrag"
                onMouseDown={ OnClickHamburger }
                style={ HamburgerStyle }
            />
        );
    };

    return (
        <div
            className="Titlebar"
            style={ RootStyle }>
            <HamburgerButton />
            <BoardColor fontSize="1.5rem" />
            <Caption1>
                SorrellWM Settings
            </Caption1>
        </div>
    );
};

const SettingsNavDrawer = (Props: PSettingsNavDrawer): ReactNode =>
{
    const {
        OnClickHamburger,
        ShowHamburger,
        IsNavOpen,
        SelectedScreen,
        OnChangeSelectedScreen,
        NavType,
        Screens
    } = Props;

    const NavDrawerStyle: CSSProperties =
        {
            backgroundColor: NavType === "inline" ? "#00000000" : undefined
        };

    const GetNavItemStyle = (Value: FSettingsScreenKey): CSSProperties =>
    {
        return SelectedScreen === Value
            ? { }
            : NavDrawerStyle;
    };

    const NavDrawerHeaderStyle: CSSProperties =
        {
            ...GetFlexStyle("row", "flex-start", "center"),
            gap: 12,
            height: Tokens.TitlebarHeight,
            marginTop: -5,
            minHeight: Tokens.TitlebarHeight,
            minWidth: "100%",
            paddingLeft: 2,
            width: "100%"
        };

    const NavItems = (): ReactNode =>
    {
        const GetScreen = (
            Key: FSettingsScreenKey,
            { Icon }: FSettingsScreen,
            Index: number
        ): ReactNode =>
        {
            return (
                <NavItem
                    icon={ <Icon /> }
                    key={ `${ Key }-${ Index }` }
                    style={ GetNavItemStyle(Key) }
                    value={ Key }>
                    { Key }
                </NavItem>
            );
        };

        return (
            <>
                { MapRecord(Screens, GetScreen) }
            </>
        );
    };

    const OnNavSelect = (_Event: unknown, Data: OnNavItemSelectData): void =>
    {
        OnChangeSelectedScreen(Data.value as FSettingsScreenKey);
    };

    const HamburgerStyle: CSSProperties =
        {
            cursor: "pointer"
        };

    return (
        <NavDrawer
            className="TitlebarNoDrag"
            defaultSelectedValue="General"
            multiple={ false }
            onNavItemSelect={ OnNavSelect }
            open={ IsNavOpen }
            style={ NavDrawerStyle }
            type={ NavType }>
            { ShowHamburger && (
                <NavDrawerHeader className="Titlebar">
                    <div style={ NavDrawerHeaderStyle }>
                        <Hamburger
                            className="TitlebarNoDrag"
                            onMouseDown={ OnClickHamburger }
                            style={ HamburgerStyle }
                        />
                        <BoardColor fontSize="1.5rem" />
                        <Caption1>
                            SorrellWm Settings
                        </Caption1>
                    </div>
                </NavDrawerHeader>
            ) }
            <NavDrawerBody>
                <NavItems />
            </NavDrawerBody>
        </NavDrawer>
    );
};

export const Settings = (): ReactElement =>
{
    const RootStyle: CSSProperties =
        {
            ...GetFlexStyle("column", "flex-start", "center"),
            height: "100vh",
            maxHeight: "100vh",
            maxWidth: "100vw",
            overflow: "hidden",
            width: "100vw"
        };

    const [ SelectedScreen, OnChangeSelectedScreen ] = UseState<FSettingsScreenKey>("General");

    type FGetBundledIcon = (
        Value: FSettingsScreenKey,
        FilledIcon: FluentIcon,
        RegularIcon: FluentIcon
    ) => FC<FluentIconsProps>;

    const GetBundledIcon: FGetBundledIcon = useCallback((
        Value: FSettingsScreenKey,
        FilledIcon: FluentIcon,
        RegularIcon: FluentIcon
    ): FC<FluentIconsProps> =>
    {
        const BundledIcon: FluentIcon = bundleIcon(FilledIcon, RegularIcon);
        return (Props: FluentIconsProps): ReactNode =>
        {
            const color: string = SelectedScreen === Value
                ? tokens.colorBrandForeground1
                : tokens.colorNeutralForeground1;

            return <BundledIcon { ...{ ...Props, color } }/>;
        };
    }, [ SelectedScreen ]);

    const [ Height, SetHeight ] = useState<number>(window.innerHeight);
    UseWindowEffect("resize", useCallback((): void =>
    {
        SetHeight((_Old: number): number =>
        {
            return window.innerHeight;
        });
    }, [ SetHeight ]));

    const BodyStyle: CSSProperties =
        {
            ...GetFlexStyle("row", "flex-start", "flex-start"),
            // flex: 1,
            gap: 16,
            height: Height - Tokens.TitlebarHeight,
            maxHeight: "100%",
            width: "100%"
        };

    const GetNavType: (() => FNavDrawerType) = useCallback((): FNavDrawerType =>
    {
        return (window.innerWidth <= 800)
            ? "overlay"
            : "inline";
    }, [ ]);

    const [ NavType, SetNavType ] = useState<"inline" | "overlay">(GetNavType());

    const [ IsNavOpen, SetIsNavOpen ] = useState<boolean>(NavType === "inline");

    const PreviousNavType: RefObject<FNavDrawerType> = useRef<FNavDrawerType>(NavType);

    const HandleWindowResize: TFunction = useCallback((): void =>
    {
        const NewNavType: FNavDrawerType = GetNavType();

        if (NewNavType !== PreviousNavType.current)
        {
            PreviousNavType.current = NewNavType;

            SetNavType((_Old: FNavDrawerType): FNavDrawerType =>
            {
                return GetNavType();
            });

            SetIsNavOpen((_Old: boolean): boolean =>
            {
                return NewNavType === "inline";
            });
        }
    }, [ GetNavType, SetNavType, SetIsNavOpen ]);

    UseWindowEffect("resize", HandleWindowResize);

    const OnChangeIsNavOpen = (): void =>
    {
        SetIsNavOpen((Old: boolean): boolean =>
        {
            return !Old;
        });
    };

    const TitlebarProps: PTitlebar =
        {
            OnClickHamburger: OnChangeIsNavOpen,
            ShowHamburger: NavType === "overlay"
        };

    /* eslint-disable sort-keys */
    const Screens: FSettingsScreens =
        {
            General:
        {
            Component: General,
            Icon: GetBundledIcon("General", SettingsFilled, SettingsRegular)
        },
            Keyboard:
        {
            Component: Keyboard,
            Icon: GetBundledIcon("Keyboard", KeyboardFilled, KeyboardRegular)
        },
            About:
        {
            Component: About,
            Icon: GetBundledIcon("About", InfoFilled, InfoRegular)
        }
        };
    /* eslint-enable sort-keys */

    const SettingsNavDrawerProps: PSettingsNavDrawer =
        {
            IsNavOpen,
            NavType,
            OnChangeSelectedScreen,
            OnClickHamburger: OnChangeIsNavOpen,
            Screens,
            SelectedScreen,
            ShowHamburger: NavType === "overlay"
        };

    const SelectedSettingsScreen: FC = (): ReactNode =>
    {
        const SettingsScreenContainerStyle: CSSProperties =
            {
                flex: 1,
                maxHeight: "100%",
                overflowY: [ "Keyboard" ].includes(SelectedScreen) ? "scroll" : "auto",
                paddingLeft: 16,
                width: "100%"
            };
        const SettingsScreen: FC = Screens[SelectedScreen].Component;
        return (
            <div style={ SettingsScreenContainerStyle }>
                <SettingsScreen />
            </div>
        );
    };

    return (
        <div style={ RootStyle }>
            <Titlebar { ...TitlebarProps } />
            <div style={ BodyStyle }>
                <SettingsNavDrawer { ...SettingsNavDrawerProps }/>
                <SelectedSettingsScreen />
            </div>
        </div>
    );
};
