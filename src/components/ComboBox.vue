<template>
    <Dropdown v-model="opened">
      <template #target="{ toggleDropdown }">
        <div ref="trigger" v-click-outside="leave" v-focus-outside="leave" @wheel="onWheel($event)" @keydown="onKey($event)">
        <div :class="classes">
          <input :id="id" ref="input" :tabindex="tabindex" type="text" role="presentation" autocomplete="off" :class="'w-full h-full '+ (!search || !opened ? ' opacity-0 ': '') +(search?' pl-10 ':' pl-3 cursor-pointer ')+' bg-transparent outline-0'" @click="open" />
          <div v-if="selected && !opened" 
            :class="'absolute w-full h-full pointer-events-none pl-' + (search?'10':'4')
            + ' py-2 flex items-center '
            + (optionClass ? optionClass : '')
          ">
            <slot name="selected" :option="selected">
              <a>
                <b class="pr-2">{{ selected.title }}</b>
              </a>
            </slot>
          </div>
          <div v-if="!selected && !opened" 
            :class="'absolute w-full h-full pointer-events-none pl-'
            +(search?'10':'4')
            +' py-2 flex items-center '
            + (optionClass ? optionClass : '')
            "
          >
            <slot name="notselected">
            -- Nincs kiválasztva --
            </slot>
          </div>
          <div v-if="search" class="absolute w-6 h-6 pointer-events-none left-3">
            <Icon name="la-search-solid" flip="horizontal" />
          </div>
          <div class="absolute w-6 h-6 pointer-events-none right-1">
            <Icon name="hi-selector"/>
          </div>
        </div>
      </div>
      </template>
      <div ref="floating" :class="'py-1 overflow-y-auto scrollstyle '" @wheel="onWheel($event)">
      <ul class="w-full py-1 leading-none">
        <li v-for="(o, n) in opt"
            @click="select(o.value);leave()"
            @mouseover="focus(o.value)"
            :class="'px-4 py-2 flex items-center cursor-pointer outline-0 border-0 '
            + (focused == o.value ? 'bg-accent text-white textshadow ': ' ')
            + (optionClass ? optionClass : '')
            "
        >
          <slot name="option" :option="o">
            <div v-if="isSelected(o.value)" class="w-6 h-6 mr-4">
              <Icon name="md-checkbox" />
            </div>
            <div v-else class="w-6 h-6 mr-4">
              <Icon name="md-checkboxoutlineblank" />
            </div>
            <a>
              <b class="pr-2">{{ o.title }}</b>
              <small class="opacity-70">{{ o.description }}</small>
            </a>
          </slot>
        </li>
        </ul>
    </div>
    </Dropdown>
</template>

<script setup>
import { computed, ref, toRefs, onMounted } from "vue"
import { LaSearchSolid, HiSelector, MdCheckbox, MdCheckboxoutlineblank } from "oh-vue-icons/icons"
window.addIcons(LaSearchSolid, HiSelector, MdCheckbox, MdCheckboxoutlineblank)

let styles = ref('')
const input = ref(null)
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