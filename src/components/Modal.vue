<template>
  <Transition name="fade" @after-enter="showContent = true">
    <div v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gray-600 bg-opacity-50"
      @click="close">
      <Transition name="pop" @after-leave="endClose">
        <div v-if="showContent"
          class="relative flex flex-col w-full h-full p-4 lg:p-8 m-auto bg-base-50 text-base-950 lg:rounded-xl lg:w-[90%] lg:h-[80%] lg:shadow-xl lg:border lg:border-base-600/50"
          @click.stop>
          <div class="flex w-full">
            <div class="text-xl">Title</div>
            <button @click="close" class="absolute top-0 right-0 p-4">
              <svg class="w-6 h-6 text-base-950" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex flex-col w-full h-full overflow-hidden overflow-y-auto modal-content">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import DropdownManager from './dropdownManager.js'

const props = defineProps({
  modelValue: Boolean
})

const showContent = ref(false)
const isOpen = computed(() => props.modelValue)

const emit = defineEmits(['update:modelValue'])

const close = () => {
  showContent.value = false
}

const endClose = () => {
  emit('update:modelValue', false)
}

watch(isOpen, (newValue) => {
  if (newValue) {
    DropdownManager.setOpenDropdown(null)
  } else {
    showContent.value = false
  }
})

</script>

<style>
.fade-enter-active {
  transition: opacity 0.1s ease;
}

.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  animation: bounce-in 0.3s ease forwards;
}

.pop-leave-active {
  animation: bounce-in 0.3s ease reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  60% {
    transform: scale(1.05);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}</style>