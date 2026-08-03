/**
 * Showcase story for rendering a Three.js scene in Ink.
 *
 * @module @sorrell/ink-ui/Showcase/Stories/InkThreeView
 *
 * @file      InkThreeView.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import * as Three from "three";
import { InkThreeView } from "../../Source/Three/InkThreeView.js";
import { SimpleStory } from "./Factory.js";

const Scene = new Three.Scene();
const Camera = new Three.PerspectiveCamera(60, 2, 0.1, 100);
Camera.position.z = 3;
Scene.add(new Three.Mesh(new Three.BoxGeometry(), new Three.MeshBasicMaterial()));
const Basic = (): React.ReactElement => <InkThreeView Camera={ Camera }
    Fps={ 1 }
    Height={ 6 }
    Scene={ Scene }
    Width={ 20 } />;
const Fallback = (): React.ReactElement => <Ink.Text>Three.js terminal renderer</Ink.Text>;
export default SimpleStory({
    Basic: { Code: "<InkThreeView Scene={scene} Camera={camera} Width={20} Height={6} />", Preview: Basic },
    Description: "Projects a Three.js scene into a character or color terminal framebuffer.",
    Examples: [ { Code: "<InkThreeView RenderWireframe RenderColor Color=\"#66ccff\" ... />", Preview: Fallback, Title: "Wireframe color" } ],
    Name: "InkThreeView",
    Source: { Component: "InkThreeView", Path: "Three/InkThreeView.tsx", Props: "InkThreeViewProps" }
});
