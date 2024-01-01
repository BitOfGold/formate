<template>
    <div ref="dropdownContainer" class="relative dropdown-container">
        <div ref="target">
            <slot name="target" :toggleDropdown="toggleDropdown"></slot>
        </div>
        <Transition name="drop">
            <div v-show="isOpen" ref="dropdownContent"
              class="absolute block border border-base-600/50 z-[100] bg-base-50 text-base-600 rounded-md shadow-md dropdown-content "
              :style="styles">
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, onUnmounted, computed } from 'vue'
import DropdownManager from './dropdownManager.js'

const id = Math.random() * 999999999 | 0

const props = defineProps({
    modelValue: Boolean,
    offset: { type: Number, default: 5 },
    border: { type: Number, default: 16 },
    minWidth: { type: Number, default: 210 },
    minHeight: { type: Number, default: 210 },
    maxHeight: { type: Number, default: 420 },
})

const { offset, border, minWidth, minHeight, maxHeight } = toRefs(props)


const emit = defineEmits(['update:modelValue'])
const dropdownContainer = ref(null)
const dropdownContent = ref(null)
const target = ref(null)

let styles = ref('')

let animationFrameId = null

const isOpen = computed(() => props.modelValue)

watch(isOpen, (newValue) => {
    if (newValue) {
        DropdownManager.setOpenDropdown({
            id: id,
            close: () => emit('update:modelValue', false)
        })
        requestAnimationFrame(updatePosition)
    } else {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
        }
        if ((DropdownManager.state.openDropdown) && (DropdownManager.state.openDropdown.id == id)) {
            DropdownManager.state.openDropdown = null
        }
    }
})

function updatePosition() {
    if (isOpen.value && target.value && dropdownContent.value) {
        const brd = border.value
        const minh = minWidth.value
        const maxh = maxHeight.value
        const minw = minWidth.value

        var rect = target.value.getBoundingClientRect()
        let vw = window.innerWidth
        let vh = window.innerHeight
        let placeUp = rect.top + rect.height + offset.value - brd
        let placeDown = vh - rect.top - rect.height - brd
        let placeRight = vw - rect.left - brd
        let x = 0
        let y = rect.height + offset.value
        let w
        if ((placeRight > rect.width) && (placeRight > minw)) {
            w = Math.max(rect.width, minw)
        } else if (placeRight > minw) {
            w = Math.max(placeRight, minw)
        } else {
            w = vw - (brd * 2)
            x = -rect.left + (vw - w) / 2
        }
        let h
        let tori = 'top'
        if (placeDown > minh) {
            h = Math.min(maxh, placeDown)
        } else if (placeUp > minh) {
            h = Math.min(maxh, placeUp)
            y = - h - offset.value
            tori = 'bottom'
        } else {
            h = Math.min(maxh, vh - (brd * 2))
            y = -rect.height + (vh - h) / 2
        }
        styles.value = `left: ${x}px; top: ${y}px; min-width: ${w}px; width: ${w}px; height: ${h}px; transform-origin: ${tori};`
        console.log(rect, styles.value)
        animationFrameId = requestAnimationFrame(updatePosition);
    }
}

function toggleDropdown() {
    emit('update:modelValue', !isOpen.value)
}

onMounted(() => {

})

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
})

</script>

<style>
.dropdown-content {
    transition: all 0.1s ease-in-out;
    transform-origin: top;
}

.drop-enter-active {
    animation: drop-in 0.3s ease forwards;
}

.drop-leave-active {
    animation: drop-in 0.3s ease reverse;
}

@keyframes drop-in {
    0% {
        opacity: 0;
        transform: scaleY(0);
    }

    60% {
        transform: scaleY(1.1);
    }

    100% {
        opacity: 1;
        transform: scaleY(1);
    }
}</style>
