<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="w-full bg-background border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors"
    :class="[
      error ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-primary',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  error?: boolean
  disabled?: boolean
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.base-input {
  @apply w-full rounded-lg px-4 py-3 bg-white/90 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary transition;
}
</style>
