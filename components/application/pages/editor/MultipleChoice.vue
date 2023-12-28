<script setup lang="ts">
import type { elementProps, multipleChoiceProps } from "~/lib/utils.interfaces";
const props = defineProps<{
  id: elementProps["id"];
  name: elementProps["name"];
  type: elementProps["type"];
  props: multipleChoiceProps;
}>();
</script>

<template>
  <div class="p-4 border flex flex-col gap-2">
    <span>{{ props.id }}</span
    ><span>{{ props.name }}</span>
  </div>
</template>
