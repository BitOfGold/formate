<template>
    <div ref="trigger" v-click-outside="leave" v-focus-outside="leave" @wheel="onWheel($event)" @keydown="onKey($event)">
      <div :class="classes">
        <input :id="id" ref="input" :tabindex="tabindex" type="text" role="presentation" autocomplete="off" :class="'w-full h-full '+ (!search || !opened ? ' opacity-0 ': '') +(search?' pl-10 ':' pl-3 cursor-pointer ')+' pr-8 bg-transparent outline-0'" @click="open" />
        <div v-if="selected && !opened" 
          :class="'absolute w-full h-full pointer-events-none px-' + (search?'10':'3')
          + ' pr-8 py-2 flex items-center '
          + (optionClass ? optionClass : '')
        ">
          <slot name="selected" :option="selected">
            <a><b class="pr-4">{{ selected.title }}</b>
            <small class="opacity-70">{{ selected.description }}</small></a>
          </slot>
        </div>
        <div v-if="!selected && !opened" 
          :class="'absolute w-full h-full pointer-events-none px-'
          +(search?'10':'3')
          +' pr-8 py-2 flex items-center '
          + (optionClass ? optionClass : '')
          "
        >
          <slot name="notselected">
          -- Nincs kiválasztva --
          </slot>
        </div>
        <div v-if="search" class="absolute w-6 h-6 pointer-events-none left-3">
          <v-icon name="la-search-solid" flip="horizontal" />
        </div>
        <div class="absolute w-6 h-6 pointer-events-none right-1">
          <v-icon name="hi-selector"/>
        </div>
      </div>
    </div>
    <div ref="floating" :style="styles"
      :class="'absolute z-[1000] top-0 left-0 bg-base-100 p-1 rounded-md shadow-lg overflow-y-scroll scrollstyle '
        + (opened ? ' block ' : ' hidden ')
      "
      @wheel="onWheel($event)"
    >
      <ul class="w-full leading-none">
        <li v-for="(o, n) in opt"
            @click="select(o.value);leave()"
            @mouseover="focus(o.value)"
            :class="'px-4 py-2 flex items-center cursor-pointer outline-0 border-0 '
            + (isSelected(o.value) ? 'bg-accent text-base-200 ': ' ')
            + (focused == o.value ? ' ring-4 ring-accent ring-opacity-50 ': ' ')
            + (optionClass ? optionClass : '')
            "
        >
          <slot name="option" :option="o">
            <a><b class="pr-4">{{ o.title }}</b>
            <small class="opacity-70">{{ o.description }}</small></a>
          </slot>
        </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref, toRefs, onMounted } from "vue"
import { addIcons } from "oh-vue-icons"
import { LaSearchSolid, HiSelector } from "oh-vue-icons/icons"
addIcons(LaSearchSolid)
addIcons(HiSelector)

let styles = ref('')
const input = ref(null)
const floating = ref(null)
const trigger = ref('')
const focused = ref(false)

const props = defineProps({
  modelValue: String | Number | Object,
  id: String,
  name: String,
  options: Array | Object,
  search: String | Boolean,
  tabindex: Number,
  class: String,
  optionClass: String,
})
const { modelValue, id, name, options, search, tabindex, optionClass } = toRefs(props)
const classes = ref(props.class)

const opt = computed(() => {
  console.log('combobox opt', options.value)
  return options.value
})

const selected = computed(() => {
  if (modelValue.value !== undefined) {
    return opt.value.find((o) => o.value == modelValue.value)
  } else {
    return false
  }
})

const focusedIndex = computed(() => {
  if (focused !== false) {
    return opt.value.findIndex((o) => o.value == focused.value)
  } else {
    return -1
  }
})

function focusNext(dir) {
  let ind = focusedIndex.value
  if (ind == -1) {
    if (dir == 1) {
      ind = opt.value.length - 1
    } else {
      ind = 0
    }
  } else {
    ind += dir
    if (ind < 0) {
      ind = 0
    } else if (ind >= opt.value.length) {
      ind = opt.value.length - 1
    }
  }
  if (opt.value[ind]) {
    focus(opt.value[ind].value)
    let frect = floating.value.getBoundingClientRect()
    let fheight = frect.height
    let clen = opt.value.length
    let cheight = floating.value.scrollHeight
    //console.log('focusNext', frect, fheight, clen, cheight, '->', cheight / clen)
  }
}

const isSelected = (value) => {
  return modelValue.value == value
}

const emit = defineEmits(['update:modelValue', 'change'])

let opened = ref(false)

const focus = (value) => {
  focused.value = value
  // if not multiselect
  select(value)
}

const select = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const open = () => {
  opened.value = true
  correct()
}

const leave = () => {
  if (opened.value) {
    opened.value = false
  }
}

const onKey = (e) => {
  let key = (''+e.key).toLowerCase()
  console.log('onKey', key)
  if (key == 'escape') {
    leave()
    e.preventDefault()
    return false
  } else if (key == 'tab') {
    if (opened.value) {
      leave()
      e.preventDefault()
      return false
    }
  } else if (key == 'enter') {
    if (opened.value) {
      leave()
    } else {
      open()
    }
    e.preventDefault()
    return false
  } else if (key == 'arrowup' || key == 'pgup') {
    if (!opened.value) {
      open()
    } else {
      focusNext(key == 'pgup' ? -10 : -1)
    }
    e.preventDefault()
    return false
  } else if (key == 'arrowdown'  || key == 'pgdown') {
    if (!opened.value) {
      open()
    } else {
      focusNext(key == 'pgdown' ? 10 : 1)
    }
    e.preventDefault()
    return false
  }
}

const onWheel = (e) => {
  if (opened.value) {
    const delta = Math.sign(e.deltaY)
    floating.value.scrollBy({
      left: 0,
      top: delta * 200,
      behavior: 'smooth'
    })
    e.preventDefault()
    e.stopPropagation()
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

onMounted(() => {
  console.log('onMounted')
  window.setInterval(() => {
    correct()
  }, 120)
})


</script>


<style lang="scss" scoped>

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