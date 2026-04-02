<script setup lang="ts">
import { withBase } from "vitepress";
import { VPButton } from "vitepress/theme-without-fonts";
</script>

<template>
    <section class="CustomNotFound">
        <div class="container">
            <div class="main">
                <code style="font-weight: 600; font-size: 1.5rem;">Error 404.</code>
                <h1 class="title">:(</h1>
                <p class="tagline">
                    The page you were looking for does not exist, or has moved.
                </p>

                <div class="actions">
                    <div class="action">
                        <VPButton
                            tag="a"
                            size="medium"
                            text="Go Home"
                            style="background-color: white !important; color: #161616 !important;"
                            :href="withBase('/')"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
* {
    background-color: rgb(10, 113, 169) !important;
    color: #FFFFFF !important;
}

.CustomNotFound
{
    margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px) 24px 48px;
    padding-bottom: -32px !important;
    min-height: 100vh;
    overflow-y: hidden;
}

.main
{
    display: flex;
    flex-direction: column;
    gap: 5rem !important;
    justify-content: flex-start;
    align-items: flex-start;
}
@media (min-width: 640px)
{
    .CustomNotFound
    {
        padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 48px 64px;
    }
}

@media (min-width: 960px)
{
    .CustomNotFound
    {
        padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 64px 64px;
    }
}

.container
{
    margin: 0 auto;
    max-width: 1152px;
}

.main
{
    max-width: 592px;
}

.code
{
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--vp-c-brand-1);
}

.title
{
    margin: 8px 0 0;
    letter-spacing: -0.4px;
    line-height: 40px;
    font-size: 8rem !important;
}

@media (min-width: 640px)
{
    .title
    {
        line-height: 56px;
        font-size: 48px;
    }
}

@media (min-width: 960px)
{
    .title
    {
        line-height: 64px;
        font-size: 56px;
    }
}

code {
    padding-top: 12px;
    line-height: 32px;
}

.tagline
{
    max-width: 576px;
    font-size: 20px;
    font-weight: 500;
    color: var(--vp-c-text-2);
}

.actions
{
    display: flex;
    flex-wrap: wrap;
    margin: -6px;
    padding-top: 32px;
}

.action
{
    padding: 6px;
}
</style>
