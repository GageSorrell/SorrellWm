import { defineConfig } from "vitepress";
import typedocSidebar from "../reference/typedoc-sidebar.json";
import * as Type from "typedoc-plugin-markdown";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "electron-reactive-event",
  description: "@TODO Description",
  themeConfig: {
    nav: [{ text: "Home", link: "/" }],
    logo: "./logo.png",
    sidebar: [
        {
            text: "Articles",
            items:
            [
                {
                    text: "Introduction",
                    link: "/articles/introduction"
                },
                {
                    text: "Glossary",
                    link: "/articles/glossary"
                },
                {
                    text: "Project Setup",
                    link: "/articles/project-setup"
                },
                {
                    text: "Declaring Events",
                    link: "/articles/declaring-events"
                },
                {
                    text: "Registering Event Callbacks",
                    link: "/articles/registering-event-callbacks"
                },
                {
                    text: "Sending Events",
                    link: "/articles/sending-events"
                },
                {
                    text: "CLI",
                    link: "/articles/cli"
                }
            ]
        },
      {
        text: "Reference",
        items: typedocSidebar,
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/GageSorrell/SorrellWm/tree/Master/Package/ElectronReactiveEvent" },
    ],
  },
});
