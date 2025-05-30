<script setup lang="ts">
import { useDocumentTitle } from '@/composables/useDocumentTitle'

// Инициализируем управление заголовком документа
useDocumentTitle()
</script>

<template>
  <div class="min-h-screen bg-background text-white mx-auto px-4 py-8">
    <div class=" mx-auto w-full">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>
