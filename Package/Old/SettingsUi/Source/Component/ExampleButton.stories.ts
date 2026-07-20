/**
 * @file      ExampleButton.stories.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleButton } from "./ExampleButton";

const Metadata: Meta<typeof ExampleButton> =
    {
        args:
        {
            Label: "Example Button"
        },
        component: ExampleButton,
        title: "Component/ExampleButton"
    };

export default Metadata;

type FStory = StoryObj<typeof Metadata>;

export const Default: FStory = { };

export const Disabled: FStory =
    {
        args:
        {
            Label: "Disabled Button",
            disabled: true
        }
    };
