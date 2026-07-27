/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import BackdropProvider from "./BackdropProvider.js";
import Badge from "./Badge.js";
import Box from "./Box.js";
import Button from "./Button.js";
import CenterText from "./CenterText.js";
import Checkbox from "./Checkbox.js";
import CodeEditor from "./CodeEditor.js";
import Command from "./Command.js";
import CommandScope from "./CommandScope.js";
import CompletionMenu from "./CompletionMenu.js";
import type { ComponentStory } from "../Story.js";
import ConfirmOverlay from "./ConfirmOverlay.js";
import Display from "./Display.js";
import FocusScope from "./FocusScope.js";
import Focusable from "./Focusable.js";
import Frame from "./Frame.js";
import GradientBadge from "./GradientBadge.js";
import H1 from "./H1.js";
import H2 from "./H2.js";
import H3 from "./H3.js";
import H4 from "./H4.js";
import H5 from "./H5.js";
import H6 from "./H6.js";
import HeaderBar from "./HeaderBar.js";
import HeaderTable from "./HeaderTable.js";
import HelpOverlay from "./HelpOverlay.js";
import HelpProvider from "./HelpProvider.js";
import Icon from "./Icon.js";
import InkThreeView from "./InkThreeView.js";
import InteractionProvider from "./InteractionProvider.js";
import JsonBodyViewer from "./JsonBodyViewer.js";
import JumpBadge from "./JumpBadge.js";
import Latex from "./Latex.js";
import MouseProvider from "./MouseProvider.js";
import Overlay from "./Overlay.js";
import PhosphorIcon from "./PhosphorIcon.js";
import PickerOverlay from "./PickerOverlay.js";
import ScrollArea from "./ScrollArea.js";
import ScrollView from "./ScrollView.js";
import Select from "./Select.js";
import ShadowProvider from "./ShadowProvider.js";
import Shortcut from "./Shortcut.js";
import StatusBar from "./StatusBar.js";
import Svg from "./Svg.js";
import Tabs from "./Tabs.js";
import Text from "./Text.js";
import TextArea from "./TextArea.js";
import TextInput from "./TextInput.js";
import ThemePickerOverlay from "./ThemePickerOverlay.js";
import ThemeProvider from "./ThemeProvider.js";
import TimelineDetailOverlay from "./TimelineDetailOverlay.js";
import TimelineEntry from "./TimelineEntry.js";
import TimelineTab from "./TimelineTab.js";
import Tips from "./Tips.js";
import Toast from "./Toast.js";
import Tooltip from "./Tooltip.js";
import ValidationNotice from "./ValidationNotice.js";
import VarInput from "./VarInput.js";
import VarText from "./VarText.js";
import View from "./View.js";
import ViewPane from "./ViewPane.js";
import YamlEditorOverlay from "./YamlEditorOverlay.js";

export/**
       * The stories provided by the showcase.
       *
       * @category Storybook
       * @since 1.0.0
       */
const Stories: ReadonlyArray<ComponentStory> =
    [
        BackdropProvider,
        Badge,
        Box,
        Button,
        CenterText,
        Checkbox,
        CodeEditor,
        Command,
        CommandScope,
        CompletionMenu,
        ConfirmOverlay,
        Display,
        Focusable,
        FocusScope,
        Frame,
        GradientBadge,
        H1,
        H2,
        H3,
        H4,
        H5,
        H6,
        HeaderBar,
        HeaderTable,
        HelpOverlay,
        HelpProvider,
        Icon,
        InkThreeView,
        InteractionProvider,
        JsonBodyViewer,
        JumpBadge,
        Latex,
        MouseProvider,
        Overlay,
        PhosphorIcon,
        PickerOverlay,
        ScrollArea,
        ScrollView,
        Select,
        ShadowProvider,
        Shortcut,
        StatusBar,
        Svg,
        Tabs,
        Text,
        TextArea,
        TextInput,
        ThemePickerOverlay,
        ThemeProvider,
        TimelineDetailOverlay,
        TimelineEntry,
        TimelineTab,
        Tips,
        Toast,
        Tooltip,
        ValidationNotice,
        VarInput,
        VarText,
        View,
        ViewPane,
        YamlEditorOverlay
    ].sort((Left: ComponentStory, Right: ComponentStory) => Left.Name.localeCompare(Right.Name));
