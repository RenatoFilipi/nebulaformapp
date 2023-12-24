<script setup lang="ts">
import { Box, Copy, PenSquare } from "lucide-vue-next";
import type { Database } from "~/lib/database.types";
import type { SBformsType, statusType } from "~/lib/utils.type";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();

useHead({
  title: "Form - Nebulaform",
});

definePageMeta({
  layout: "application",
});

watch(
  user,
  () => {
    if (!user.value) {
      return navigateTo("/login");
    }
  },
  { immediate: true }
);

const status = ref<statusType>("isLoading");
const form = ref<SBformsType>({ created_at: "", id: "", owner_id: "", responses: 0, title: "", updated_at: "" });

const { data } = await useAsyncData("form", async () => {
  status.value = "isLoading";

  const { data, error } = await supabase.from("forms").select("*").eq("id", route.params.id).single();
  return { data, error };
});

if (data.value !== null) {
  if (!data.value.error) {
    if (data.value.data !== null) {
      if (data.value.data.owner_id === (user.value?.id as string)) {
        form.value = data.value.data;
        status.value = "isIdle";
      } else {
        navigateTo("/dashboard");
      }
    }
  }
} else {
  status.value = "isRejected";
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-12">
        <div class="flex justify-between items-center">
          <div class="flex justify-center items-center gap-6">
            <div class="flex items-center justify-center gap-2">
              <Box />
              <span class="font-semibold text-xl">{{ form.title }}</span>
            </div>
            <Badge variant="outline">{{ form.responses }} responses</Badge>
          </div>
          <div class="flex justify-center items-center gap-4">
            <Button variant="outline"><Copy class="mr-2 w-4 h-4" />Copy Link</Button>
            <Button as-child
              ><NuxtLink :to="'/dashboard/editor/' + form.id"><PenSquare class="mr-2 w-4 h-4" />Edit Form</NuxtLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
