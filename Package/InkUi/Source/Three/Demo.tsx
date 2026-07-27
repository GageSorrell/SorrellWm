/**
 * Demo `ink` application that renders an animated ThreeJS scene.
 *
 * @module @sorrell/ink-ui/Three/Demo
 * @internal
 *
 * @file      Demo.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import * as THREE from "three";
import { InkThreeView } from "./InkThreeView.js";
import type { LightingOptions } from "./Terminal/Renderer.js";
import { RenderMode } from "./Terminal/RenderMode.js";

interface DemoScene
{
    readonly Scene: THREE.Scene;
    readonly Camera: THREE.PerspectiveCamera;
    readonly Group: THREE.Group;
}

const RenderModes: ReadonlyArray<RenderMode> =
    [
        RenderMode.Braille(),
        RenderMode.Fixed(),
        RenderMode.HalfBlock(),
        RenderMode.Quadrant(),
        RenderMode.Shade()
    ] as const;

/**
 * Renders the interactive demo application.
 *
 * @category Rendering
 * @since 1.0.0
 */
const Demo = (): React.ReactElement =>
{
    const { exit }: { exit: () => void } = Ink.useApp();
    const [ Mode, SetMode ] = React.useState<RenderMode>(RenderMode.Braille());

    const Lighting: LightingOptions = React.useMemo<LightingOptions>(() =>
    {
        return {
            AmbientIntensity: 0.2,
            DiffuseIntensity: 0.8,
            Direction: new THREE.Vector3(0.35, 0.6, 1)
        };
    }, [ ]);

    const DemoObjects: DemoScene = React.useMemo<DemoScene>(() =>
    {
        const Scene: THREE.Scene = new THREE.Scene();
        const Camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, 100 / 32, 0.1, 100);
        const Group: THREE.Group = new THREE.Group();
        const RedCube: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.35, 1.35, 1.35),
            new THREE.MeshBasicMaterial({ color: "#ff5555" })
        );
        const GreenCube: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.35, 1.35, 1.35),
            new THREE.MeshBasicMaterial({ color: "#55ff88" })
        );
        const BlueCube: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.35, 1.35, 1.35),
            new THREE.MeshBasicMaterial({ color: "#5599ff" })
        );

        RedCube.position.x = -1.55;
        GreenCube.position.x = 0;
        GreenCube.position.z = -0.3;
        BlueCube.position.x = 1.55;

        RedCube.userData.Color = "#ff5555";
        BlueCube.userData.Color = "#5599ff";

        Group.add(RedCube, GreenCube, BlueCube);

        Camera.position.z = 6.5;
        Scene.add(Group);

        return {
            Camera,
            Group,
            Scene
        };
    }, [ ]);

    React.useEffect(() =>
    {
        const Interval: ReturnType<typeof setInterval> = setInterval(() =>
        {
            DemoObjects.Group.rotation.x += 0.025;
            DemoObjects.Group.rotation.y += 0.04;
        }, 1000 / 30);

        return () =>
        {
            clearInterval(Interval);
        };
    }, [ DemoObjects ]);

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        if (Input === "q")
        {
            exit();
            return;
        }

        if (Key.leftArrow)
        {
            SetMode((CurrentRenderMode: RenderMode) => GetAdjacentRenderMode(CurrentRenderMode, -1));
            return;
        }

        if (Key.rightArrow)
        {
            SetMode((CurrentRenderMode: RenderMode) => GetAdjacentRenderMode(CurrentRenderMode, 1));
        }
    });

    const { rows: Height, columns: Width } = Ink.useWindowSize();
    const RenderHeight: number = Math.max(1, Height - 1);

    return (
        <Ink.Box flexDirection="column">
            <InkThreeView
                Camera={ DemoObjects.Camera }
                CharacterRamp=" .:-=+*#%@"
                Color="#66CCFF"
                Fps={ 60 }
                Height={ RenderHeight }
                RenderColor
                RenderFaces
                RenderMode={ Mode }
                RenderWireframe
                Scene={ DemoObjects.Scene }
                { ...{ Lighting, Width } }
            />
            <Ink.Text>
                Mode: { Mode._tag }  Left/Right: cycle render mode  q: quit
            </Ink.Text>
        </Ink.Box>
    );
};

// interface LoadingScene
// {
//     readonly Scene: THREE.Scene;
//     readonly Camera: THREE.PerspectiveCamera;
//     readonly Spinner: THREE.Group;
// }

// /* eslint-disable-next-line @typescript-eslint/no-unused-vars, jsdoc/require-jsdoc */
// const LoadingAnimation = (): React.ReactElement =>
// {
//     const { rows: Height, columns: Width } = Ink.useWindowSize();
//     const RenderHeight: number = Math.max(12, Height - 2);
//     const RenderWidth: number = Math.max(36, Width);

//     const Lighting: LightingOptions = React.useMemo<LightingOptions>(() =>
//     {
//         return {
//             AmbientIntensity: 0.28,
//             DiffuseIntensity: 0.72,
//             Direction: new THREE.Vector3(-0.25, 0.55, 1)
//         };
//     }, [ ]);

//     const LoadingObjects: LoadingScene = React.useMemo<LoadingScene>(() =>
//     {
//         const Scene: THREE.Scene = new THREE.Scene();
//         const Camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(50, 100 / 36, 0.1, 100);
//         const Spinner: THREE.Group = new THREE.Group();
//         const Core: THREE.Mesh = new THREE.Mesh(
//             new THREE.TorusKnotGeometry(1.15, 0.4, 96, 14),
//             new THREE.MeshBasicMaterial({ color: "#77D7FF" })
//         );
//         // const Halo: THREE.Mesh = new THREE.Mesh(
//         //     new THREE.TorusGeometry(1.9, 0.035, 8, 80),
//         //     new THREE.MeshBasicMaterial({ color: "#B38CFF" })
//         // );
//         // const DotGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(0.14, 16, 8);
//         // const FirstDot: THREE.Mesh = new THREE.Mesh(
//         //     DotGeometry,
//         //     new THREE.MeshBasicMaterial({ color: "#FFE08A" })
//         // );
//         // const SecondDot: THREE.Mesh = new THREE.Mesh(
//         //     DotGeometry,
//         //     new THREE.MeshBasicMaterial({ color: "#FF88C8" })
//         // );
//         // const ThirdDot: THREE.Mesh = new THREE.Mesh(
//         //     DotGeometry,
//         //     new THREE.MeshBasicMaterial({ color: "#8CFFB7" })
//         // );

//         // FirstDot.position.set(2.05, 0, 0);
//         // SecondDot.position.set(-1.02, 1.78, 0.35);
//         // ThirdDot.position.set(-1.02, -1.78, -0.35);

//         Core.userData.Color = "#77D7FF";
//         // Halo.userData.Color = "#B38CFF";
//         // FirstDot.userData.Color = "#FFE08A";
//         // SecondDot.userData.Color = "#FF88C8";
//         // ThirdDot.userData.Color = "#8CFFB7";

//         // Spinner.add(Core, Halo, FirstDot, SecondDot, ThirdDot);
//         Spinner.add(Core);
//         Camera.position.z = 5.2;
//         Scene.add(Spinner);

//         return {
//             Camera,
//             Scene,
//             Spinner
//         };
//     }, [ ]);

//     React.useEffect(() =>
//     {
//         const Interval: ReturnType<typeof setInterval> = setInterval(() =>
//         {
//             LoadingObjects.Spinner.rotation.x += 0.018;
//             LoadingObjects.Spinner.rotation.y += 0.034;
//             LoadingObjects.Spinner.rotation.z += 0.011;
//         }, 1000 / 45);

//         return () => clearInterval(Interval);
//     }, [ LoadingObjects ]);

//     return (
//         <Ink.Box
//             alignItems="center"
//             flexDirection="column">
//             <InkThreeView
//                 Camera={ LoadingObjects.Camera }
//                 Color="#77D7FF"
//                 Fps={ 45 }
//                 Height={ RenderHeight }
//                 Lighting={ Lighting }
//                 RenderColor
//                 RenderFaces
//                 RenderMode={ RenderMode.Braille() }
//                 RenderWireframe
//                 Scene={ LoadingObjects.Scene }
//                 Width={ RenderWidth }
//             />
//             <Ink.Text dimColor>
//                 Loading
//             </Ink.Text>
//         </Ink.Box>
//     );
// };

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetAdjacentRenderMode(CurrentRenderMode: RenderMode, Direction: -1 | 1): RenderMode
{
    const CurrentIndex: number = RenderModes.indexOf(CurrentRenderMode);
    const SafeCurrentIndex: number = CurrentIndex >= 0 ? CurrentIndex : 0;
    const NextIndex: number = (SafeCurrentIndex + Direction + RenderModes.length) % RenderModes.length;

    return RenderModes[NextIndex]!;
}

Ink.render(<Demo />);
// Ink.render(<LoadingAnimation />);
