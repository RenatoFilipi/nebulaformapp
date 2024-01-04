<script setup lang="ts">
import { Box, Loader2, Copy } from "lucide-vue-next";
import type { Database } from "~/lib/database.types";
import { parseFormatDistanceDate } from "~/lib/utils";
import type { SBformsType, statusType, SBresponsesType } from "~/lib/utils.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseFormatDateWithDistanceDate } from "~/lib/utils";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const config = useRuntimeConfig();
const { toast } = useToast();

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

const statusForm = ref<statusType>("isLoading");
const statusResponses = ref<statusType>("isLoading");
const isLoadingSettings = ref(false);

const form = ref<SBformsType>({
  created_at: "",
  id: "",
  owner_id: "",
  responses: 0,
  title: "",
  updated_at: "",
  description: "",
  public_id: "",
  mode: "",
});

const responses = ref<SBresponsesType[]>([]);
const shareLink = ref("");

const { data: dataForm } = await useAsyncData("form", async () => {
  statusForm.value = "isLoading";

  const { data, error } = await supabase.from("forms").select("*").eq("id", route.params.id).single();
  return { data, error };
});

const { data: dataResponses } = await useAsyncData("responses", async () => {
  statusResponses.value = "isLoading";

  const { data: dataFetch, error } = await supabase.from("responses").select("*").eq("form_id", route.params.id);
  const data = dataFetch !== null ? dataFetch : [];
  return { data, error };
});

const afterFormFetch = () => {
  if (dataForm.value === null || dataForm.value.error || dataForm.value.data === null) {
    navigateTo("/dashboard");
    return;
  }
  if (dataForm.value.data.owner_id !== (user.value?.id as string)) {
    navigateTo("/dashboard");
  }
  form.value = dataForm.value.data;
  shareLink.value = config.public.baseFormShareUrl + "/r/" + form.value.public_id;
  statusForm.value = "isIdle";
};

const afterResponsesFetch = () => {
  if (dataResponses.value === null || dataResponses.value.error) {
    statusResponses.value = "isRejected";
    return;
  }
  responses.value = dataResponses.value.data;
  statusResponses.value = "isIdle";
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    toast({ description: "Copied to Clipboard" });
  } catch (err) {
    toast({ variant: "destructive", description: "Failed to copy to Clipboard" });
  }
};

const handleDeleteForm = async () => {
  try {
    isLoadingSettings.value = true;
    const { error } = await supabase.from("forms").delete().eq("id", route.params.id);
    if (error) throw new Error(error.message);
    navigateTo("/dashboard");
  } catch (err: any) {
    toast({ variant: "destructive", description: err.message });
  } finally {
    isLoadingSettings.value = false;
  }
};

afterFormFetch();
afterResponsesFetch();
</script>

<template>
  <div class="flex flex-col items-center">
    <Tabs default-value="responses" class="flex flex-1 w-full flex-col py-40 px-80 gap-2">
      <div class="flex justify-between items-center">
        <div class="flex justify-center items-center gap-6">
          <div class="flex items-center justify-center gap-2">
            <Box />
            <span class="font-semibold text-xl">{{ form.title }}</span>
          </div>
          <div class="flex justify-start items-center gap-4">
            <Badge variant="outline">{{ form.mode }}</Badge>
            <Badge variant="outline">{{ form.responses }} {{ form.responses === 1 ? "response" : "responses" }}</Badge>
          </div>
        </div>
        <div class="flex justify-center items-center gap-4">
          <TabsList>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Button as-child><NuxtLink :to="'/dashboard/editor/' + form.id">Editor</NuxtLink> </Button>
        </div>
      </div>
      <div class="flex">
        <span class="text-zinc-500 text-sm">Last update was {{ parseFormatDistanceDate(form.updated_at) }}</span>
      </div>
      <div class="mt-10">
        <TabsContent value="responses">
          <Card v-if="statusResponses === 'isLoading'" class="flex justify-center items-center py-44">
            <div class="animate-spin">
              <Loader2 class="w-6 h-6 text-primary" />
            </div>
          </Card>
          <Card v-if="statusResponses === 'isIdle' && responses.length <= 0" class="flex flex-col">
            <div class="border-b p-3"><span class="text-zinc-500">Latest form activity</span></div>
            <div class="flex justify-center items-center p-44">
              <span class="text-zinc-500 text-sm">No form responses to show.</span>
            </div>
          </Card>
          <Card v-if="statusResponses === 'isIdle' && responses.length >= 1" class="flex flex-col">
            <div class="border-b p-3"><span class="text-zinc-500">Latest form activity</span></div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Submited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow class="text-neutral-700" v-for="(response, index) in responses" :key="index">
                  <TableCell># {{ response.id }}</TableCell>
                  <TableCell>{{ parseFormatDateWithDistanceDate(response.created_at) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card></TabsContent
        >
        <TabsContent value="share">
          <Card class="p-6">
            <div class="flex flex-col gap-2 mb-4">
              <span>Share via link</span>
              <Input class="bg-sky-50 text-neutral-500" readonly v-model="shareLink" />
            </div>
            <Button variant="outline" @click="copyToClipboard"><Copy class="mr-2 w-4 h-4" />Copy Link</Button>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card class="p-6 border-destructive">
            <div class="flex flex-col gap-2 mb-4">
              <span class="text-lg">Danger Zone</span>
              <span class="text-neutral-500">The following actions are destructive and cannot be reversed.</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="destructive">Delete Form</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle class="flex justify-start items-center">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription class="text-red-500">
                    This action cannot be undone. This will permanently delete this form of the form and all information
                    associated with this form.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel :disabled="isLoadingSettings">Cancel</AlertDialogCancel>
                  <Button variant="destructive" type="button" @click="handleDeleteForm" :disabled="isLoadingSettings">
                    <div class="flex justify-center items-center" v-if="isLoadingSettings">
                      <Loader2 class="animate-spin mr-2 h-4 w-4" />Deleting Form
                    </div>
                    <div v-else>Delete Form</div></Button
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card></TabsContent
        >
      </div>
    </Tabs>
  </div>
</template>
