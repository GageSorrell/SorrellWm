/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console, sort-keys */

import type { Spinner, SpinnerName } from "cli-spinners";
import ora, { type Ora as IOra, spinners } from "ora";
import Readline from "readline";
// import { spinners, type Spinner } from "ora";
import Chalk from "chalk";

// type OraOptions = Extract<Parameters<typeof ora>[0], object>;

// type SpinnerProp = NonNullable<Extract<OraOptions, object>["spinner"]>;

// type SpinnerName = Extract<SpinnerProp, string>;

// const Spinners: ReadonlyArray<SpinnerName> =
//     [
//         "dots",
//         "dots2",
//         "dots3",
//         "dots4",
//         "dots5",
//         "dots6",
//         "dots7",
//         "dots8",
//         "dots9",
//         "dots10",
//         "dots11",
//         "dots12",
//         "dots13",
//         "dots14",
//         "dots8Bit",
//         "dotsCircle",
//         "sand",
//         "line",
//         "line2",
//         "rollingLine",
//         "pipe",
//         "simpleDots",
//         "simpleDotsScrolling",
//         "star",
//         "star2",
//         "flip",
//         "hamburger",
//         "growVertical",
//         "growHorizontal",
//         "balloon",
//         "balloon2",
//         "noise",
//         "bounce",
//         "boxBounce",
//         "boxBounce2",
//         "binary",
//         "triangle",
//         "arc",
//         "circle",
//         "squareCorners",
//         "circleQuarters",
//         "circleHalves",
//         "squish",
//         "toggle",
//         "toggle2",
//         "toggle3",
//         "toggle4",
//         "toggle5",
//         "toggle6",
//         "toggle7",
//         "toggle8",
//         "toggle9",
//         "toggle10",
//         "toggle11",
//         "toggle12",
//         "toggle13",
//         "arrow",
//         "arrow2",
//         "arrow3",
//         "bouncingBar",
//         "bouncingBall",
//         "smiley",
//         "monkey",
//         "hearts",
//         "clock",
//         "earth",
//         "material",
//         "moon",
//         "runner",
//         "pong",
//         "shark",
//         "dqpb",
//         "weather",
//         "christmas",
//         "grenade",
//         "point",
//         "layer",
//         "betaWave",
//         "fingerDance",
//         "fistBump",
//         "soccerHeader",
//         "mindblown",
//         "speaker",
//         "orangePulse",
//         "bluePulse",
//         "orangeBluePulse",
//         "timeTravel",
//         "aesthetic",
//         "dwarfFortress"
//     ] as const;

// // function MakeSpinner(Name: SpinnerName): IOra
// // {
// //     const Options: OraOptions =
// //         {
// //             hideCursor: true,
// //             spinner: Name,
// //             text: Name
// //         };

// //     return ora(Options).start();
// // }

// // function ShowSpinners(Page: number, NumRows: number): void
// // {
// //     Spinners.slice(Page * NumRows, NumRows + 1).forEach(MakeSpinner);
// // }

function Gcd(GcdA: number, GcdB: number): number
{
    return !GcdB ? GcdA : Gcd(GcdB, GcdA % GcdB);
}

// function Lcm(A: number, B: number): number
// {
//     return (A * B) / Gcd(A, B);
// }

// const SpinnerValues: Record<SpinnerName, string> =
// {
//     dots: "",
//     dots2: "",
//     dots3: "",
//     dots4: "",
//     dots5: "",
//     dots6: "",
//     dots7: "",
//     dots8: "",
//     dots9: "",
//     dots10: "",
//     dots11: "",
//     dots12: "",
//     dots13: "",
//     dots14: "",
//     dots8Bit: "",
//     dotsCircle: "",
//     sand: "",
//     line: "",
//     line2: "",
//     rollingLine: "",
//     pipe: "",
//     simpleDots: "",
//     simpleDotsScrolling: "",
//     star: "",
//     star2: "",
//     flip: "",
//     hamburger: "",
//     growVertical: "",
//     growHorizontal: "",
//     balloon: "",
//     balloon2: "",
//     noise: "",
//     bounce: "",
//     boxBounce: "",
//     boxBounce2: "",
//     binary: "",
//     triangle: "",
//     arc: "",
//     circle: "",
//     squareCorners: "",
//     circleQuarters: "",
//     circleHalves: "",
//     squish: "",
//     toggle: "",
//     toggle2: "",
//     toggle3: "",
//     toggle4: "",
//     toggle5: "",
//     toggle6: "",
//     toggle7: "",
//     toggle8: "",
//     toggle9: "",
//     toggle10: "",
//     toggle11: "",
//     toggle12: "",
//     toggle13: "",
//     arrow: "",
//     arrow2: "",
//     arrow3: "",
//     bouncingBar: "",
//     bouncingBall: "",
//     smiley: "",
//     monkey: "",
//     hearts: "",
//     clock: "",
//     earth: "",
//     material: "",
//     moon: "",
//     runner: "",
//     pong: "",
//     shark: "",
//     dqpb: "",
//     weather: "",
//     christmas: "",
//     grenade: "",
//     point: "",
//     layer: "",
//     betaWave: "",
//     fingerDance: "",
//     fistBump: "",
//     soccerHeader: "",
//     mindblown: "",
//     speaker: "",
//     orangePulse: "",
//     bluePulse: "",
//     orangeBluePulse: "",
//     timeTravel: "",
//     aesthetic: "",
//     dwarfFortress: "",
// };

// type FSpinnerIntervalRecord = Readonly<Record<SpinnerName, number>>;

// function GetIntervals(): FSpinnerIntervalRecord
// {
//     const Out: Partial<Record<SpinnerName, number>> = { };

//     const GetInterval = (Spinner: SpinnerName): void =>
//     {
//         Out[Spinner] = spinners[Spinner].interval;
//     };

//     Spinners.forEach(GetInterval);

//     return Out as Readonly<Record<SpinnerName, number>>;
// }

// const Intervals: FSpinnerIntervalRecord = GetIntervals();

// function SpinRow(Names: ReadonlyArray<SpinnerName>): void
// {
//     const GetAnimateFrame = (Name: SpinnerName): (() => void) =>
//     {
//         return (): void =>
//         {
//     	    const { frames: Frames } = spinners[Name];
//             const OldIndex: number = Frames.indexOf(SpinnerValues[Name]);
//             const NewIndex: number = (OldIndex + 1) % Frames.length;
//             const NewState: string = Frames[NewIndex] || "";
//             SpinnerValues[Name] = `${ NewState }`;
//         };

//     setInterval(AnimateFrame, spinner.interval);
// }

// function Main()
// {
//     let TotalNumRows: number = process.stdout.rows;
//     let TotalNumColumns: number = process.stdout.columns;

//     const GetNumRows = (): number =>
//     {
//         return TotalNumRows - 2;
//     };

//     // const MaxNumColumns: 3 = 3 as const;

//     const GetNumColumns = (): number =>
//     {
//         return Math.floor(TotalNumColumns / SpinnerWidth);
//         // return Math.min(Math.floor(TotalNumColumns / SpinnerWidth), MaxNumColumns);
//     };

//     const SpinnerWidth: 22 = 22 as const;

//     // const TotalNumSpinners: number = Object.keys(spinners).length;

//     const GetMaxNumSpinnersPerPage = (): number =>
//     {
//         return GetNumRows() * GetNumColumns();
//     };

//     let PageIndex: number = 0;

//     function GetGroupSpinners(): Record<number, Array<SpinnerName>>
//     {
//         const Out: Record<number, Array<SpinnerName>> = { };

//         type FEntry = [ string, Spinner ];
//         Object.entries(spinners).forEach(([ InName, { interval: Interval } ]: FEntry): void =>
//         {
//             const Name: SpinnerName = InName as SpinnerName;
//             if (!(Interval in Out))
//             {
//                 Out[Interval] = [ ];
//             }

//             Out[Interval].push(Name);
//         });

//         return Out;
//     }

//     const GroupedSpinners: Record<number, Array<SpinnerName>> = GetGroupSpinners();

//     // console.log("GroupedSpinners", GroupedSpinners);
//     const SpinnerPages: Array<Array<SpinnerName>> = [ ];

//     function UpdateSpinnerPages(): void
//     {
//         SpinnerPages.splice(0, SpinnerPages.length);
//         const MaxNumPerPage: number = GetMaxNumSpinnersPerPage();
//         const NumPagesIntervalRecord: Record<number, number> = { };
//         // console.log(`UpdateSpinnerPages: MaxNumPerPage === ${ MaxNumPerPage }`);
//         Intervals.forEach((Interval: number): void =>
//         {
//             const TheSpinners: Array<SpinnerName> = GroupedSpinners[Interval];
//             const NumPages: number = Math.ceil(TheSpinners.length / MaxNumPerPage);
//             NumPagesIntervalRecord[Interval] = NumPages;
//         });

//         // console.log(JSON.stringify(NumPagesIntervalRecord, null, 4));

//         Object.entries(NumPagesIntervalRecord).forEach(([ InInterval, NumPages ]: [ string, number ]): void =>
//         {
//             const Interval: number = parseInt(InInterval);
//             for (let Index: number = 0; Index < NumPages; Index++)
//             {
//                 const Start: number = Index * MaxNumPerPage;
//                 const End: number = 1 + Math.min(
//                     (Index + 1) * MaxNumPerPage,
//                     GroupedSpinners[Interval].length
//                 );

//                 SpinnerPages[SpinnerPages.length] = GroupedSpinners[Interval].slice(Start, End);
//             }
//         });

//         // for (let Index: number = 0; Index < GetNumPages(); Index++)
//         // {
//         //     const Interval: number = spinners[SpinnerPages[Index][0]].interval;
//         //     const Start: number = Index * GetMaxNumSpinnersPerPage();
//         //     const End: number = Math.min(
//         //         (Index + 1) * GetMaxNumSpinnersPerPage() + 1,
//         //         GroupedSpinners[Interval].length
//         //     );

//         //     SpinnerPages[Index] = GroupedSpinners[Interval].slice(Start, End);
//         // }
//     }

//     const Intervals: ReadonlyArray<number> = Array.from(
//         new Set<number>(Object.values(spinners).map((spin: Spinner): number => spin.interval as number))
//     );

//     UpdateSpinnerPages();

//     function GetNumPages(): number
//     {
//         let NumPages: number = 0;

//         const GetNumPagesFromInterval = (Interval: number): void =>
//         {
//             const SpinnerNames: Array<SpinnerName> = GroupedSpinners[Interval];
//             const NumSpinners: number = SpinnerNames.length;

//             NumPages += Math.ceil(NumSpinners / GetMaxNumSpinnersPerPage());
//         };

//         Intervals.forEach(GetNumPagesFromInterval);

//         return NumPages;
//     }

//     // const SpinnersShown: Array<SpinnerName> = [ ];
//     // function UpdateSpinnersShown(): void
//     // {
//     //     const Min: number = PageIndex * GetMaxNumSpinnersPerPage();
//     //     const TotalRemainingSpinners: number = TotalNumSpinners - Min;
//     //     const NumSpinners: number = Math.min(GetMaxNumSpinnersPerPage(), TotalRemainingSpinners);
//     //     const Max: number = Min + NumSpinners;
//     //     SpinnersShown.splice(0, SpinnersShown.length);
//     //     SpinnersShown.push(...Object.keys(spinners).slice(Min, Max + 1) as Array<SpinnerName>);
//     // }

//     const State: Record<SpinnerName, string> =
//         {
//             dots: "",
//             dots2: "",
//             dots3: "",
//             dots4: "",
//             dots5: "",
//             dots6: "",
//             dots7: "",
//             dots8: "",
//             dots9: "",
//             dots10: "",
//             dots11: "",
//             dots12: "",
//             dots13: "",
//             dots14: "",
//             dots8Bit: "",
//             dotsCircle: "",
//             sand: "",
//             line: "",
//             line2: "",
//             rollingLine: "",
//             pipe: "",
//             simpleDots: "",
//             simpleDotsScrolling: "",
//             star: "",
//             star2: "",
//             flip: "",
//             hamburger: "",
//             growVertical: "",
//             growHorizontal: "",
//             balloon: "",
//             balloon2: "",
//             noise: "",
//             bounce: "",
//             boxBounce: "",
//             boxBounce2: "",
//             binary: "",
//             triangle: "",
//             arc: "",
//             circle: "",
//             squareCorners: "",
//             circleQuarters: "",
//             circleHalves: "",
//             squish: "",
//             toggle: "",
//             toggle2: "",
//             toggle3: "",
//             toggle4: "",
//             toggle5: "",
//             toggle6: "",
//             toggle7: "",
//             toggle8: "",
//             toggle9: "",
//             toggle10: "",
//             toggle11: "",
//             toggle12: "",
//             toggle13: "",
//             arrow: "",
//             arrow2: "",
//             arrow3: "",
//             bouncingBar: "",
//             bouncingBall: "",
//             smiley: "",
//             monkey: "",
//             hearts: "",
//             clock: "",
//             earth: "",
//             material: "",
//             moon: "",
//             runner: "",
//             pong: "",
//             shark: "",
//             dqpb: "",
//             weather: "",
//             christmas: "",
//             grenade: "",
//             point: "",
//             layer: "",
//             betaWave: "",
//             fingerDance: "",
//             fistBump: "",
//             soccerHeader: "",
//             mindblown: "",
//             speaker: "",
//             orangePulse: "",
//             bluePulse: "",
//             orangeBluePulse: "",
//             timeTravel: "",
//             aesthetic: "",
//             dwarfFortress: ""
//         };

//     let Timer: NodeJS.Timeout | undefined = undefined;
//     function UpdateTimer(): void
//     {
//         if (Timer !== undefined)
//         {
//             clearInterval(Timer);
//         }

//         const Page: Array<SpinnerName> | undefined = SpinnerPages[PageIndex];
//         // console.log("UpdateTimer::SpinnerPages", SpinnerPages);
//         if (Page !== undefined && Page.length > 0)
//         {
//             const Interval: number | undefined = spinners[Page[0]].interval;
//             if (Interval !== undefined)
//             {
//                 setInterval(AnimateFrame, Interval);
//             }
//         }

//     }

//     function HandleResize(): void
//     {
//         TotalNumRows = process.stdout.rows;
//         TotalNumColumns = process.stdout.columns;
//         const NumPages: number = GetNumPages();
//         if (PageIndex >= NumPages)
//         {
//             PageIndex = NumPages - 1;
//         }

//         // UpdateSpinnersShown();
//         UpdateSpinnerPages();
//         FrameIndex = 0;
//         UpdateTimer();
//     }

//     function OnLeftArrow(): void
//     {
//         PageIndex = (PageIndex === 0)
//             ? (GetNumPages() - 1)
//             : (PageIndex - 1);

//         // UpdateSpinnersShown();
//         FrameIndex = 0;
//         UpdateTimer();
//     }

//     function OnRightArrow(): void
//     {
//         PageIndex = (PageIndex === GetNumPages() - 1)
//             ? 0
//             : (PageIndex + 1);

//         // UpdateSpinnersShown();
//         FrameIndex = 0;
//         UpdateTimer();
//     }

//     let FrameIndex: number = 0;
//     function UpdateFrameIndex(Interval: number): void
//     {
//         const Modulus: number = Interval;
//         if (Modulus !== undefined)
//         {
//             FrameIndex = (FrameIndex + 1) % Modulus;
//         }
//     }

//     const Durations: Record<SpinnerName, number> =
//         {
//             dots: 0,
//             dots2: 0,
//             dots3: 0,
//             dots4: 0,
//             dots5: 0,
//             dots6: 0,
//             dots7: 0,
//             dots8: 0,
//             dots9: 0,
//             dots10: 0,
//             dots11: 0,
//             dots12: 0,
//             dots13: 0,
//             dots14: 0,
//             dots8Bit: 0,
//             dotsCircle: 0,
//             sand: 0,
//             line: 0,
//             line2: 0,
//             rollingLine: 0,
//             pipe: 0,
//             simpleDots: 0,
//             simpleDotsScrolling: 0,
//             star: 0,
//             star2: 0,
//             flip: 0,
//             hamburger: 0,
//             growVertical: 0,
//             growHorizontal: 0,
//             balloon: 0,
//             balloon2: 0,
//             noise: 0,
//             bounce: 0,
//             boxBounce: 0,
//             boxBounce2: 0,
//             binary: 0,
//             triangle: 0,
//             arc: 0,
//             circle: 0,
//             squareCorners: 0,
//             circleQuarters: 0,
//             circleHalves: 0,
//             squish: 0,
//             toggle: 0,
//             toggle2: 0,
//             toggle3: 0,
//             toggle4: 0,
//             toggle5: 0,
//             toggle6: 0,
//             toggle7: 0,
//             toggle8: 0,
//             toggle9: 0,
//             toggle10: 0,
//             toggle11: 0,
//             toggle12: 0,
//             toggle13: 0,
//             arrow: 0,
//             arrow2: 0,
//             arrow3: 0,
//             bouncingBar: 0,
//             bouncingBall: 0,
//             smiley: 0,
//             monkey: 0,
//             hearts: 0,
//             clock: 0,
//             earth: 0,
//             material: 0,
//             moon: 0,
//             runner: 0,
//             pong: 0,
//             shark: 0,
//             dqpb: 0,
//             weather: 0,
//             christmas: 0,
//             grenade: 0,
//             point: 0,
//             layer: 0,
//             betaWave: 0,
//             fingerDance: 0,
//             fistBump: 0,
//             soccerHeader: 0,
//             mindblown: 0,
//             speaker: 0,
//             orangePulse: 0,
//             bluePulse: 0,
//             orangeBluePulse: 0,
//             timeTravel: 0,
//             aesthetic: 0,
//             dwarfFortress: 0
//         };

//     const SetDurations = (): void =>
//     {
//         const SetDuration = (Name: SpinnerName): void =>
//         {
//             Durations[Name] = spinners[Name].frames.length * spinners[Name].interval;
//         };

//         (Object.keys(Durations) as Array<SpinnerName>).forEach(SetDuration);
//     };

//     SetDurations();

//     const AnimateFrame = (): void =>
//     {
//         const CurrentSpinners: Array<SpinnerName> = SpinnerPages[PageIndex];
//         const Interval: number = spinners[CurrentSpinners[0]].interval || 10000;

//         const AnimateSpinner = (Name: SpinnerName): void =>
//         {
//             const AdjustedFrameIndex: number =
//                 Math.floor((FrameIndex % Durations[Name]) / Interval);
//                 // Math.floor((FrameIndex % Durations[Name]) / spinners[Name].interval);

//             State[Name] = spinners[Name].frames[AdjustedFrameIndex] || " ";
//         };

//         CurrentSpinners.forEach(AnimateSpinner);
//         // SpinnersShown.forEach(AnimateSpinner);

//         // Draw();

//         UpdateFrameIndex(Interval);
//     };

//     function ClearTerminal(): void
//     {
//         process.stdout.write("\x1Bc");
//     }

//     function Draw(): void
//     {
//         ClearTerminal();
//         let Out: string = "";
//         /* eslint-disable @typescript-eslint/naming-convention */
//         for (let Index_Y: number = 0; Index_Y < GetNumRows(); Index_Y++)
//         {
//             for (let Index_X: number = 0; Index_X < GetNumColumns(); Index_X++)
//             {
//                 const SpinnerIndex: number = (Index_Y * GetNumColumns()) + Index_X;
//                 if (SpinnerIndex >= SpinnerPages[PageIndex].length)
//                 {
//                     continue;
//                 }

//                 // const Spinner: SpinnerName | undefined = SpinnersShown[SpinnerIndex];
//                 const Spinner: SpinnerName | undefined = SpinnerPages[PageIndex][SpinnerIndex];
//                 if (Spinner === undefined)
//                 {
//                     Out += " ".repeat(SpinnerWidth);
//                     continue;
//                 }

//                 const NumSpaces: number = SpinnerWidth - (2 + Spinner.length);
//                 const Frame: string = State[Spinner];
//                 Out += `${ Frame } ${ Spinner }` + " ".repeat(NumSpaces);
//             }

//             Out += "\n";
//         }
//         /* eslint-enable @typescript-eslint/naming-convention */

//         const IsAtFirstLastPage: boolean = (
//             PageIndex === 0 ||
//             PageIndex === (GetNumPages() - 1)
//         );

//         const PageIndexFormatted: string = Chalk.whiteBright(PageIndex);
//         const NumPagesFormatted: string = Chalk.whiteBright(GetNumPages());

//         const NavigationControlsPlain: string =
//             `← • Page ${ PageIndexFormatted } / ${ NumPagesFormatted } • →`;

//         const NavigationControls: string =
//             Chalk.gray(`← • Page ${ PageIndexFormatted } / ${ NumPagesFormatted } • →`);

//         const ExitMessage: string = `Press ${ Chalk.red("any other key") } to exit.`;

//         const ExitMessagePlain: string = "Press any other key to exit.";

//         const FooterContentLength: number = NavigationControlsPlain.length + ExitMessagePlain.length;

//         const MaxPadding: number = 4;
//         const FreeSpace: number = TotalNumColumns - FooterContentLength;
//         const Padding: number = Math.min(Math.floor(FreeSpace / 2), MaxPadding);
//         const MiddleSpace: number = FreeSpace - (2 * Padding);
//         // console.log(
//         //     `NumColumns: ${ TotalNumColumns }\n`,
//         //     `MaxPadding: ${ MaxPadding }\n`,
//         //     `FreeSpace: ${ FreeSpace }\n`,
//         //     `Padding: ${ Padding }\n`,
//         //     `MiddleSpace: ${ MiddleSpace }\n`
//         // );

//         const Spaces = (Num: number): string =>
//         {
//             return " ".repeat(Num);
//         };

//         const Footer: string =
//             [
//                 Spaces(Padding),
//                 NavigationControls,
//                 Spaces(MiddleSpace),
//                 ExitMessage + Spaces(Padding)
//             ].join("");

//         Out += Footer;

//         process.stdout.write(Out);
//     }

//     if (!process.stdin.isTTY || !process.stdout.isTTY)
//     {
//         throw new Error("This script requires an interactive TTY.");
//     }

//     const Cleanup = (): void =>
//     {
//         process.stdout.off("resize", HandleResize);
//         process.stdin.off("keypress", HandleKeypress);

//         if (process.stdin.isTTY)
//         {
//             process.stdin.setRawMode(false);
//         }

//         process.stdin.pause();
//     };

//     const Exit = (ExitCode: number = 0): never =>
//     {
//         Cleanup();
//         process.exit(ExitCode);
//     };

//     const HandleKeypress = (_Character: string, Key: Readline.Key): void =>
//     {
//         if (Key.name === "left")
//         {
//             OnLeftArrow();
//             return;
//         }

//         if (Key.name === "right")
//         {
//             OnRightArrow();
//             return;
//         }

//         Exit(0);
//     };

//     Readline.emitKeypressEvents(process.stdin);
//     process.stdin.setRawMode(true);
//     process.stdin.resume();

//     process.stdout.on("resize", HandleResize);
//     process.stdin.on("keypress", HandleKeypress);

//     HandleResize();
// }

// Main();

// // const Foo = (): void =>
// // {
// //     const Intervals: ReadonlyArray<number> = Array.from(
// //         new Set<number>(Object.values(spinners).map((spin: Spinner): number => spin.interval as number))
// //     );

// //     const CartesianProduct: ReadonlyArray<[ number, number ]> =
// //         Intervals.flatMap((A: number): ReadonlyArray<[ number, number ]> =>
// //         {
// //             return Intervals.map((B: number): [ number, number ] =>
// //             {
// //                 return [ A, B ];
// //             });
// //         });

// //     const Gcds: ReadonlyArray<number> = CartesianProduct.map(([ A, B ]: [ number, number ]): number =>
// //     {
// //         return Gcd(A, B);
// //     });

// //     console.log(Intervals, "\n", Gcds);
// // };

// // Foo();

function Main(): void
{
    let Timer: NodeJS.Timeout | undefined = undefined;
    // const NumRows: number = process.stdout.rows;
    // const SpinnerNames: Array<SpinnerName> = Object.keys(spinners) as Array<SpinnerName>;
    // const Page: Array<IOra> = [ ];
    // for (let Index: number = 0; Index < NumRows; Index++)
    // {
    //     const Start: number = Index * NumRows;
    //     const End: number = Math.min(((Index + 1) * NumRows), SpinnerNames.length - 1) + 1;
    //     const Names: Array<SpinnerName> =
    //         SpinnerNames.slice(Start, End);

    //     // Page.push(...Names.map((Name: SpinnerName): IOra => ora({
    //     //     hideCursor: true,
    //     //     spinner: Name,
    //     //     text: Name
    //     // })));
    // }

    // const Out: Array<string> = [ ];
    let AnimationIndex: number = 0;

    function GetGroupSpinners(): Record<number, Array<SpinnerName>>
    {
        const Out: Record<number, Array<SpinnerName>> = { };

        type FEntry = [ string, Spinner ];
        Object.entries(spinners).forEach(([ InName, { interval: Interval } ]: FEntry): void =>
        {
            const Name: SpinnerName = InName as SpinnerName;
            if (!(Interval in Out))
            {
                Out[Interval] = [ ];
            }

            Out[Interval].push(Name);
        });

        return Out;
    }

    const GroupedSpinners: Record<number, Array<SpinnerName>> = GetGroupSpinners();

    type FPage =
        {
            Names: Array<SpinnerName>;
            NumFrames: number;
            Interval: number;
        };

    type FSpinner =
        {
            Interval: number;
            Name: SpinnerName;
            NumFrames: number;
        };

    const Pages: Array<FPage> = ((): Array<FPage> =>
    {
        const TheSpinners: Array<FSpinner> =
            Object.entries(spinners).map(([ Key, Value ]: [ string, Spinner ]): FSpinner =>
            {
                const Name: SpinnerName = Key as SpinnerName;

                return {
                    Interval: Value.interval,
                    Name,
                    NumFrames: Value.frames.length
                };
            });

        const Out: Array<FPage> = [ ];
        TheSpinners.forEach((TheSpinner: FSpinner): void =>
        {
            const ExistingPage: FPage | undefined = Out.find((Page: FPage): boolean =>
            {
                return (
                    Page.Interval === TheSpinner.Interval &&
                    Page.NumFrames === TheSpinner.NumFrames
                );
            });

            if (ExistingPage !== undefined)
            {
                ExistingPage.Names.push(TheSpinner.Name);
            }
            else
            {
                const NewPage: FPage =
                    {
                        Names: [ TheSpinner.Name ],
                        Interval: TheSpinner.Interval,
                        NumFrames: TheSpinner.NumFrames
                    };

                Out.push(NewPage);
            }
        });

        return Out;
    })();

    let PageIndex: number = 0;

    const Intervals: Array<number> = Object.keys(GroupedSpinners).map((Key: string) => parseInt(Key));

    const Interval: number = Intervals[PageIndex];

    const SpinnerState: Array<string> = Pages[PageIndex].Names.map((Name: SpinnerName): string =>
    {
        const NumSpacesBase: number = spinners[Name].frames[0].length;
        const NumSpaces: number = Math.max(NumSpacesBase, 3);
        return Spaces(NumSpaces);
    });

    function ClearTerminal(): void
    {
        process.stdout.write("\x1Bc");
        process.stdout.write("  ".repeat(SpinnerState.length));
    }

    const SpinnerWidth: 30 = 30 as const;

    function Spaces(Num: number): string
    {
        return " ".repeat(Num);
    }

    const LongestPageLength: number = Math.max(...Pages.map((Page: FPage): number =>
    {
        return Page.Names.length;
    }));

    function Draw(): void
    {
        const LongestSpinner: number = Math.max(
            ...Pages[PageIndex].Names.map((Name: string): number => spinners[Name].frames[0].length)
        );

        SpinnerState.forEach((Frame: string, Index: number): void =>
        {
            if (Index >= Pages[PageIndex].Names.length)
            {
                Readline.cursorTo(process.stdout, 0, Index);
                process.stdout.write(Spaces(SpinnerWidth));
                return;
            }

            const X: number = 0;
            const Y: number = Index;
            const ThisSpinnerLength: number = spinners[Pages[PageIndex].Names[Index]].frames[0].length;
            const ThisNameLength: number = Pages[PageIndex].Names[Index].length;
            const LeftPadding: number = LongestSpinner - ThisSpinnerLength + 1;
            const RightPadding: number = SpinnerWidth - LeftPadding - ThisNameLength - 1;
            Readline.cursorTo(process.stdout, X, Y);
            process.stdout.write([
                Frame,
                " ",
                Spaces(LeftPadding),
                Pages[PageIndex].Names[Index],
                Spaces(RightPadding)
            ].join(""));
            // console.log(SpinnerState[Index]);
        });

        Readline.cursorTo(process.stdout, 0, LongestPageLength + 1);
        const NumFramesString: string = Pages[PageIndex].NumFrames.toString();
        const IntervalString: string = Pages[PageIndex].NumFrames.toString();
        const NumberOfFramesLabel: string = "Number of Frames: ";
        const IntervalLabel: string = "Interval: ";
        // const MaxOuterPadding: number = 4;
        // const OuterPadding: number = Math.min(process.stdout.columns, MaxOuterPadding);
        // const InnerPadding: number =
        //     process.stdout.columns -
        //     (OuterPadding +
        //     NumberOfFramesLabel.length +
        //     NumFramesString.length +
        //     IntervalLabel.length +
        //     IntervalString.length +
        //     OuterPadding);
        // const InnerPadding: number = 6;
        // const OuterPadding: number = Math.floor((process.stdout.columns - (
        //     InnerPadding +
        //     NumberOfFramesLabel.length +
        //     NumFramesString.length +
        //     IntervalLabel.length +
        //     IntervalString.length
        // )) / 2);

        const MakeCentered = (In: string): string =>
        {
            const InLength: number = Chalk.reset(In).length;
            // console.log(InLength, process.stdout.columns);
            const OuterPadding: number = Math.floor((process.stdout.columns - InLength) / 2);
            return Spaces(OuterPadding) + In;
        };

        const NumFramesLeftPadding: number =
            Math.floor((process.stdout.columns - (NumberOfFramesLabel.length + NumFramesString.length)) / 2);

        process.stdout.write([
            Spaces(NumFramesLeftPadding - 9) + NumberOfFramesLabel + Chalk.greenBright(NumFramesString),
            Spaces(6),
            IntervalLabel + Chalk.greenBright(IntervalString) + Spaces(6),
            "\n"
        ].join(""));

        const PageIndexString: string = PageIndex.toString();
        const TotalPagesNumString: string = (Pages.length - 1).toString();
        const LeftPageLabel: string = "← • Page ";
        const OfLabel: string = " of ";
        const RightPageLabel: string = " • →";

        const TotalNavigationContentLength: number =
            PageIndexString.length +
            TotalPagesNumString.length +
            LeftPageLabel.length +
            OfLabel.length +
            RightPageLabel.length;

        process.stdout.write(
            Spaces(Math.floor((process.stdout.columns - TotalNavigationContentLength) / 2)) +
            [
                Chalk.gray(LeftPageLabel),
                Chalk.whiteBright(PageIndexString),
                Chalk.gray(OfLabel),
                Chalk.whiteBright(TotalPagesNumString),
                Chalk.gray(RightPageLabel)
            ].join("")
        );
    }

    const AnimateFrame = (): void =>
    {
        const Page: FPage = Pages[PageIndex];
        Page.Names.forEach((Name: SpinnerName, Index: number): void =>
        {
            // console.log(FrameIndex);

            SpinnerState[Index] = spinners[Name].frames[AnimationIndex];
        });

        Draw();

        AnimationIndex = (AnimationIndex + 1) % Page.NumFrames;
    };

    function SetShowCursor(Show: boolean): void
    {
        if (Show)
        {
            process.stdout.write("\x1B[?25h");
        }
        else
        {
            process.stdout.write("\x1B[?25l");
        }
    }

    ClearTerminal();
    Readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    SetShowCursor(false);

    function HandleKeypress(_Character: string, Key: Readline.Key): void
    {
        if (Key.name === "left")
        {
            PageIndex = (PageIndex === 0)
                ? (Pages.length - 1)
                : (PageIndex - 1);

            if (Timer !== undefined)
            {
                clearInterval(Timer);
            }

            Timer = setInterval(AnimateFrame, Pages[PageIndex].Interval);
            return;
        }

        if (Key.name === "right")
        {
            PageIndex = (PageIndex === Pages.length - 1)
                ? 0
                : (PageIndex + 1);

            if (Timer !== undefined)
            {
                clearInterval(Timer);
            }

            Timer = setInterval(AnimateFrame, Pages[PageIndex].Interval);
            return;
        }

        SetShowCursor(true);
        process.exit(0);
    }

    process.stdin.on("keypress", HandleKeypress);
    Timer = setInterval(AnimateFrame, Interval);
}

Main();
