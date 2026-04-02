<script setup>
import DefaultTheme from "vitepress/theme-without-fonts"
import HeroLayout from "./HeroLayout.md";
import NotFound from "./NotFound.vue";

const { Layout } = DefaultTheme;
</script>

<template>
    <Layout>
        <template #home-hero-actions-after>
            <HeroLayout class="HeroSnippet"/>
        </template>
        <template #not-found>
            <NotFound />
        </template>
    </Layout>
</template>

<style>
.HeroSnippet
{
    margin-top: 3rem;
    max-width: 460px;
}

/* Hides the language name in the upper-right corner of the code block. */
span.lang
{
    display: none;
}

button.copy {
    opacity: 1 !important;
    transition-property: unset !important;
}

.HeroSnippet {
    display: flex;
    justify-content: flex-start;
}

.HeroSnippet .language-bash {
    min-width: calc(100% + 3rem);
}

@media (max-width: 960px)
{
    .vp-doc {
        display: flex;
        justify-content: center;
    }
    .HeroSnippet {
        justify-content: center !important;
        min-width: 100%;
    }
}

.HeroSnippet pre
{
    margin: 0;
    padding: 1rem 1.25rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
    overflow-x: auto;
}

.HeroSnippet code
{
    font-family: var(--vp-font-family-mono);
}
</style>
