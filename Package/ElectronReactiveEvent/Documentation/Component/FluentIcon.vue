<script setup lang="ts">
import { computed } from "vue";

const IconCodePoints = {
    Add: "\uE710",
    ChevronDown: "\uE70D",
    ChevronRight: "\uE76C",
    Globe: "\uE909",
    Home: "\uE80F",
    Light: "\uE793",
    Language: "\uF2B7"
} as const;

type IconName = keyof typeof IconCodePoints;

const Properties = defineProps<{
    Icon: IconName;
}>();

const Glyph = computed((): string =>
{
    return IconCodePoints[Properties.Icon];
});
</script>

<template>
    <span class="FluentIcon">{{ Glyph }}</span>
</template>
