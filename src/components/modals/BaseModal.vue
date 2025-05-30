<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div
          class="relative bg-card-bg rounded-2xl shadow-2xl border border-white/10 w-full max-h-[90vh] overflow-hidden"
          :class="maxWidth || 'max-w-2xl'"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-white/10">
            <h2 class="text-xl font-bold text-white">{{ title }}</h2>
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  maxWidth?: string
}

defineProps<Props>()
defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(-20px);
}

/* Кастомный скролл для блока уведомлений */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--primary) 30%, transparent)
    color-mix(in srgb, var(--text-primary) 5%, transparent);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--primary) 30%, transparent);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--primary) 50%, transparent);
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: color-mix(in srgb, var(--primary) 70%, transparent);
}

/* Для старых браузеров без поддержки color-mix */
@supports not (background: color-mix(in srgb, var(--primary) 30%, transparent)) {
  .custom-scrollbar {
    scrollbar-color: rgba(255, 48, 64, 0.3) rgba(255, 255, 255, 0.05);
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 48, 64, 0.3);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 48, 64, 0.5);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: rgba(255, 48, 64, 0.7);
  }
}
</style>
