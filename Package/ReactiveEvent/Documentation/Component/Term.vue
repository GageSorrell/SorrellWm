<script setup lang="ts">
import { computed } from "vue";

const IconCodePoints = {
    Add: "\uE710",
    ChevronDown: "\uE70D",
    ChevronRight: "\uE76C",
    ExternalLink: "\uE8A7",
    Globe: "\uE909",
    Email: "\uE715",
    Home: "\uE80F",
    Link: "\uE8A7",
    Light: "\uE793",
    ReportHacked: "\uE730",
    Lightbulb: "\uEA80",
    Language: "\uF2B7"
} as const;

type IconName = keyof typeof IconCodePoints;

const Properties = withDefaults(
    defineProps<{
    Name: IconName;
    Small?: boolean;
}>(), {
    Small: true
});

const CssClass: string = computed((): string =>
{
    return Properties.Small
        ? "FluentIconSmall"
        : "FluentIcon";
});

const Glyph = computed((): string =>
{
    return IconCodePoints[Properties.Icon];
});
</script>

<template>
    <span :class="CssClass">{{ Glyph }}</span>
</template>

