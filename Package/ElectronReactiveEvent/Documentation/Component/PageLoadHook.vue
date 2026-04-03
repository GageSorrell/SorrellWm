<script setup lang="ts">
import { onMounted, type Ref } from "vue";
import { useData, useRoute, useRouter } from "vitepress";

const { page, frontmatter, params, title } = useData();
const Route = useRoute();
const Router = useRouter();

function HandlePageLoad(): void
{
    const FromRef = (In: Ref): unknown =>
    {
        if (In.value === undefined)
        {
            return undefined;
        }

        return JSON.parse(JSON.stringify(In.value));
    };

    const LogRef = (In: Ref, Title: string | undefined = undefined): void =>
    {
        if (Title !== undefined)
        {
            console.log(`${ Title }:`);
        }

        console.dir(FromRef(In));
    };

    console.log("Route:", Route.data);
    LogRef(frontmatter, "FrontMatter");
    LogRef(title, "Title");
    LogRef(params, "Params");

    function GetVersionHeaderLabel(): HTMLSpanElement | null
    {
        return document.querySelectorAll("div.VPFlyout.VPNavBarMenuGroup > button.button > span")[1] as HTMLSpanElement || null;
    }

    const StoredVersionKey: "DocsVersion" = "DocsVersion" as const;
    const DefaultVersion: "1.0.0" = "1.0.0" as const;

    function GetStoredVersion(): string
    {
        const StoredVersion: string | null = window.localStorage.getItem("DocsVersion");

        if (StoredVersion === null)
        {
            window.localStorage.setItem(StoredVersionKey, DefaultVersion);
            return DefaultVersion;
        }
        else
        {
            return StoredVersion;
        }
    }

    const VersionLabel: HTMLSpanElement | null = GetVersionHeaderLabel();
    if (VersionLabel !== null)
    {
        const VersionLabelTextElement: HTMLSpanElement = (VersionLabel.childNodes[0].nodeType === Node.COMMENT_NODE)
            ? VersionLabel.childNodes[1]
            : VersionLabel.childNodes[0];

        console.log(VersionLabelTextElement);

        VersionLabelTextElement.innerText = `v${ GetStoredVersion() }`;
        console.log(`Updated version text to ${ GetStoredVersion() }.`);

        const VersionMenu: Element = document.querySelectorAll("div.VPFlyout.VPNavBarMenuGroup > .menu .items")[1];
        if (VersionMenu instanceof HTMLElement)
        {
            const Items = VersionMenu.querySelectorAll(".VPMenuLink a");
            Items.forEach((Item: Element, Index: number): void =>
            {
                if (Item instanceof HTMLElement)
                {
                    if (Index === 0 && Item instanceof HTMLAnchorElement)
                    {
                        Item.href = "";
                        console.log("Heer", Item);
                    }
                    Item.classList.add(Index === 0
                        ? "HeaderDropdownLabel"
                        : "VersionDropdownLabel"
                    );
                }
            });
        }
    }
    else
    {
        console.log("VersionLabel was null.");
    }

}

onMounted((): void =>
{
    HandlePageLoad();
});

Router.onAfterRouteChange = async (): Promise<void> =>
{
    HandlePageLoad();
};
</script>

<template></template>
