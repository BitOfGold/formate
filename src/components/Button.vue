<template>
    <button :tabindex="tabindex" :class="twMerge('button', buttonClasses, classes && classes)">
        <slot></slot>
    </button>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue'
import { tailwindSanitize, sanitizeOptions } from "../utils.js"
import { twMerge } from 'tailwind-merge'


const props = defineProps({
    class: String,
    color: { type: String, default: 'accent' },
    outline: { type: Boolean, default: false },
    tabindex: Number,
})
const { color, outline } = toRefs(props)
const classes = ref(props.class)

const colorClasses = {
    filled: {
        base: `
bg-gradient-to-br from-base-200 to-base-300
outline-base-300
border-base-400
border-b-base-200
border-r-base-200
text-base-700
drop-shadow-md
    `,

        dark: `
bg-gradient-to-br from-base-600 to-base-700
outline-base-700
border-base-600
border-b-base-700
border-r-base-700
text-white
drop-shadow-md
textshadow
    `,

        accent: `
bg-gradient-to-br from-accent-500 to-accent-600
outline-accent-600
border-accent
border-b-accent-600
border-r-accent-600
text-white
drop-shadow-md
textshadow
    `,

        extra: `
bg-gradient-to-br from-extra-500 to-extra-600
outline-extra-600
border-extra
border-b-extra-600
border-r-extra-600
text-white
drop-shadow-md
textshadow
    `,

        success: `
bg-gradient-to-br from-success-500 to-success-600
outline-success-600
border-success
border-b-success-600
border-r-success-600
text-white
drop-shadow-md
textshadow
`,

        info: `
bg-gradient-to-br from-info-500 to-info-600
outline-info-600
border-info
border-b-info-600
border-r-info-600
text-white
drop-shadow-md
textshadow
`,

        warning: `
bg-gradient-to-br from-warning-500 to-warning-600
outline-warning-600
border-warning
border-b-warning-600
border-r-warning-600
text-white
drop-shadow-md
textshadow
`,

        error: `
bg-gradient-to-br from-error-500 to-error-600
outline-error-600
border-error
border-b-success-600
border-r-success-600
text-white
drop-shadow-md
textshadow
`,
    },
    outline: {
        base: `
border-2
backdrop-blur-md
outline-transparent
border-base
text-base
    `,

        dark: `
border-2
backdrop-blur-md
outline-transparent
border-base-700
text-base-700
    `,

        accent: `
border-2
backdrop-blur-md
outline-transparent
border-accent
text-accent
    `,

        extra: `
border-2
backdrop-blur-md
outline-transparent
border-extra
text-extra
    `,

        success: `
border-2
backdrop-blur-md
outline-transparent
border-success
text-success
`,

        info: `
border-2
backdrop-blur-md
outline-transparent
border-info
text-info
`,

        warning: `
border-2
backdrop-blur-md
outline-transparent
border-warning
text-warning
`,

        error: `
border-2
backdrop-blur-md
outline-transparent
border-error
text-error
`,

    }
}

const buttonClasses = computed(() => tailwindSanitize(`
inline-flex items-center justify-center
px-8 py-2 rounded-lg cursor-pointer
w-full xl:w-auto 
transition-all duration-300 ease-in-out
font-bold text-center
outline-offset-0 outline outline-1 border
brightness-100

${colorClasses[outline.value ? 'outline' : 'filled'][color.value]}

disabled:opacity-30 disabled:cursor-not-allowed

ring-accent
focus:ring-4
focus:outline-opacity-0

[&:hover:not(:disabled)]:brightness-90
[&:hover:not(:disabled)]:translate-x-0.5 [&:hover:not(:disabled)]:translate-y-0.5
[&:hover:not(:disabled)]:drop-shadow-none
`))

</script>
