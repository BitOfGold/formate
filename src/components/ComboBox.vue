<template>
    <div ref="trigger" v-click-outside="leave" v-focus-outside="leave" @keydown="onKey($event)">
      <div :class="classes">
        <input :id="id" ref="input" :tabindex="tabindex" type="text" role="presentation" autocomplete="off" class="w-full h-full pl-10 pr-8 bg-transparent outline-0" @click="opened=true;correct()" />
        <div class="absolute left-3 pointer-events-none w-6 h-6">
          <v-icon name="la-search-solid" flip="horizontal" />
        </div>
        <div class="absolute right-1 pointer-events-none w-6 h-6">
          <v-icon name="hi-selector"/>
        </div>
      </div>
    </div>
    <div ref="floating" :style="styles" :class="'absolute z-[1000] top-0 left-0 bg-base-100 p-1 rounded-md shadow-lg overflow-y-scroll scrollstyle ' + (opened ? ' block ' : ' hidden ')">
      <ul class="leading-none w-full">
        <li v-for="(o, n) in opt" @click="select(o);leave()" @mouseover="select(o)" :class="'px-4 py-2 flex items-center cursor-pointer outline-0 border-0 '+ (o.selected ? 'bg-accent text-base-200 ': ' ')">
          <a><b class="pr-4">{{ o.title }}</b>
          <small class="opacity-70">{{ o.description }}</small></a>
        </li>
        </ul>
    </div>
</template>

<script setup>
// https://stackoverflow.com/questions/55508836/prevent-page-scrolling-when-mouse-is-over-one-particular-div
import { computed, defineProps, defineEmits, ref, toRefs, onMounted } from "vue"
import { addIcons } from "oh-vue-icons"
import { LaSearchSolid, HiSelector } from "oh-vue-icons/icons"
addIcons(LaSearchSolid)
addIcons(HiSelector)

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
  tabindex: Number,
  classes: String,
})
const { modelValue, id, name, classes, options, search, tabindex } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'change'])

let opened = ref(false)

const select = (o) => {
  for (let oo of opt) {
    oo.selected = false
  }
  o.selected = true
  emit('update:modelValue', o)
  emit('change', o)
  console.log('selected', o)  
}

const leave = () => {
  if (opened.value) {
    opened.value = false
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
    const border = 16
    const minh = 210
    const maxh = 420
    const minw = 420
    var rect = trigger.value.getBoundingClientRect()
    let vw = window.innerWidth
    let vh = window.innerHeight
    let placeUp = rect.top - border
    let placeDown = vh - rect.top - rect.height - border
    let placeRight = vw - rect.left - border
    let x = 0
    let y = rect.height + 4
    let w
    if ((placeRight > rect.width) && (placeRight > minw)) {
      w = rect.width
    } else if (placeRight > minw) {
      w = Math.max(placeRight, minw)
    } else {
      w = vw - (border * 2)
      x = -rect.left + (vw - w) / 2
    }
    let h
    if (placeDown > minh) {
      h = Math.min(maxh, placeDown)
    } else if (placeUp > minh) {
      h = Math.min(maxh, placeUp)
      y = - h - 4
    } else {
      h = Math.min(maxh, vh - (border * 2))
      y = -rect.height + (vh - h) / 2
    }
    styles.value = `left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px`
    //console.log(`placeLeft: ${placeLeft}, placeRight: ${placeRight}, placeUp: ${placeUp}, placeDown: ${placeDown}`, styles.value)
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
  }, 120)
})

let opt = [
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