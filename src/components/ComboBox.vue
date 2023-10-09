<template>
    <div ref="trigger" v-click-outside="leave" v-focus-outside="otherFocus" @keydown="onKey($event)">
      <div :class="classes">
        <input :id="id" ref="input" :tabindex="firstindex" type="text" class="w-full h-full bg-transparent outline-0" @click="opened=true;focused=false" @focus="focused=false" />
        <div class="absolute right-3 top-2 text-gray-400 pointer-events-none"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
      </div>
    </div>
    <div ref="floating" :style="styles" :class="'absolute top-10 h-96 z-[1000] bg-gray-100 rounded-md shadow-lg overflow-y-scroll scrollstyle ' + (opened ? ' block ' : ' hidden ')">
      <ul class="p-1 leading-none w-full">
        <li v-for="(o, n) in opt" @click="select(o)" @mouseover="$event.target.focus();" @focus="focused=o" :tabindex="firstindex+1+n" class="px-4 h-10 flex items-center focus:bg-primary focus:text-gray-200 cursor-pointer outline-0 border-0 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-opacity-50 ">
          <a><b class="pr-4">{{ o.title }}</b>
          <small class="opacity-70">{{ o.description }}</small></a>
        </li>
        </ul>
    </div>
</template>

<script setup>
// https://stackoverflow.com/questions/55508836/prevent-page-scrolling-when-mouse-is-over-one-particular-div

import { computed, defineProps, defineEmits, ref, toRefs, onMounted } from "vue"
let styles = ref('')
const input = ref(null)
const floating = ref(null)
const trigger = ref('')

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
  input.value.focus()
  console.log('selected', o)  
}

const otherFocus = (e) => {
  if (opened.value) {
    console.log('otherFocus', e)
  }
}

const leave = () => {
  if (opened.value) {
    opened.value = false
    focused.value = false
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

function correct() {
  if (opened.value) {
    var rect = trigger.value.getBoundingClientRect()
    console.log('pos', rect)
  }
}

const onOpen = () => {
  console.log('onOpen')
  correct()
}

onMounted(() => {
  console.log('onMounted')
  window.setInterval(() => {
    correct()
  }, 1000)
})

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

<style scoped>

.scrollstyle {
  scrollbar-color: #aaa transparent;
  scrollbar-width: thin;
}

.scrollstyle::-webkit-scrollbar {
  width: 16px;
}


.scrollstyle::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 0px;
}

.scrollstyle::-webkit-scrollbar-thumb {
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
  background-color: #aaa;
}

</style> 