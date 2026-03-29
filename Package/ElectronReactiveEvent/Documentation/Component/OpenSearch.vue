<script setup lang="ts">
import { ref } from "vue";
import VPLocalSearchBox from "vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue";

const ShowSearch = ref(false);

function OpenBuiltInSearch(Query: string): void
{
    sessionStorage.setItem("vitepress:local-search-filter", Query);
    ShowSearch.value = true;
}

function OnSearchLinkClick(Event: MouseEvent): void
{
    Event.preventDefault();
    OpenBuiltInSearch("#Function");
}
</script>

<template>
    <a href="" @click="OnSearchLinkClick">
        Search for #Function
    </a>

    <VPLocalSearchBox
        v-if="ShowSearch"
        @close="ShowSearch = false"
    />
</template>
