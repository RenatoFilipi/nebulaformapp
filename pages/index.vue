<script setup lang="ts">
import { Mail } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

useHead({
  title: "Nebulaform",
});
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" class="flex gap-2"
          ><Mail :size="16" className="mr-2 h-4 w-4 " />Click me</Button
        ></DialogTrigger
      >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription> Make changes to your profile here. Click save when you're done. </DialogDescription>
        </DialogHeader>

        <DialogFooter> Save changes </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
