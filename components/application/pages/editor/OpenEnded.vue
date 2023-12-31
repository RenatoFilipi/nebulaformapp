<script setup lang="ts">
import type { elementProps, openEndedProps } from "~/lib/utils.interfaces";
const props = defineProps<{
  id: elementProps["id"];

  type: elementProps["type"];
  props: openEndedProps;
}>();
</script>

<template>
  <div class="p-4 border flex flex-col gap-2">
    <span>{{ props.id }}</span>
  </div>
</template>
