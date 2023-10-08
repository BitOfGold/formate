<template>
  <div class="relative" v-click-outside="leave" v-focus-outside="leave" @keydown="onKey($event)">
    <div :class="classes" ref="reference">
      <input :id="id" ref="input" :tabindex="firstindex" type="text" class="w-full h-full bg-transparent outline-0" @click="opened=true;focused=false" @focus="focused=false" />
      <div class="absolute right-3 top-2 text-gray-400 pointer-events-none"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
    </div>
    <div ref="floating" v-if="opened" :class="'absolute w-full z-[1000] mt-[4px] bg-gray-100 rounded-md shadow-lg max-h-96 overflow-y-scroll no-scrollbar' + (opened ? ' block ' : ' hidden ')">
      <ul class="mp-1 px-1 py-2 leading-none w-full">
        <li v-for="(o, n) in opt" @click="select(o)" @mouseover="$event.target.focus();" @focus="focused=o" :tabindex="firstindex+1+n" class="px-8 py-4 focus:bg-primary focus:text-gray-200 cursor-pointer outline-0 border-0 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-opacity-50 ">
          <a><b class="pr-4">{{ o.title }}</b>
          <small class="opacity-70">{{ o.description }}</small></a>
        </li>
        </ul>
    </div>
  </div>
</template>

<script setup>

import { computed, defineProps, defineEmits, ref, toRefs } from "vue"
import { useFloating, autoUpdate, autoPlacement, offset, flip, shift } from '@floating-ui/vue'

const reference = ref(null)
const floating = ref(null)
const input = ref(null)

const {floatingStyles} = useFloating(reference, floating, {
  placement: 'bottom',
  whileElementsMounted: autoUpdate,
  middleware: [
    autoPlacement({crossAxis: true}),
    offset({crossAxis: true}),
    flip({crossAxis: true}),
    shift({crossAxis: true}),
  ],
})

const props = defineProps({
  modelValue: String | Number | Object,
  id: String,
  name: String,
  options: Array | Object,
  search: String,
  firstindex: Number,
  classes: String,
})
const { modelValue, id, name, classes, options, search, firstindex } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'change'])

let opened = ref(false)
let focused = ref(false)

const select = (o) => {
  emit('update:modelValue', o)
  emit('change', o)
  leave()

  console.log('selected', o)  
}

const leave = () => {
  if (opened.value) {
    opened.value = false
    focused.value = false
    input.value.focus()
  }
}

const onKey = (e) => {
  let key = (''+e.key).toLowerCase()
  if (key == 'escape') {
    leave()
  } else if (key == 'enter') {
    if (focused.value) {
      select(focused.value)
      e.preventDefault()
      return false
    } else {
      opened.value = true
      e.preventDefault()
      return false
    }
  } else if (key == 'arrowup') {
    e.preventDefault()
    return false
  } else if (key == 'arrowdown') {
    e.preventDefault()
    return false
  }
}

const opt = [
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
{
  title: 'Title',
  description: 'Description'
},
]

</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: -moz-scrollbars-none;
}
</style> 