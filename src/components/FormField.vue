<template>
  <template v-if="!likeRadio && !isSingle">
    <div :class="fieldGroupClasses">
      <div v-if="!floating"
        :class="'flex xl:items-end ' + (isSide ? labelSideClasses : ' flex-row ') + ' field-label-container ' + (schema['label-class'] ? schema['label-class'] : ' ')">
        <label :for="name" :class="labelClasses + ' field-label '">
          <span v-html="schema.label"></span>
          <span v-if="schema.rules" :class="requiredClasses">{{ messages.text_required }}</span>
        </label>
      </div>
      <div
        :class="'flex flex-col w-full relative ' + (floating ? 'floating ' : ' ') + hasValue + ' field-input '">

        <input v-if="isInput" :type="schema.type" :id="name" :name="name" :tabindex="schema.tabindex"
          :autocomplete="autocomplete" :placeholder="floating ? '' : schema.placeholder" ref="input"
          v-model="value" v-bind="filteredSchema"
          :class="(floating ? 'floating ' : ' ') + inputClasses + ' px-3 ' + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' input ' + (schema.class ? schema.class : ' ')" />

        <textarea rows="7" v-if="schema.type == 'textarea'" :id="name" :name="name"
          :tabindex="schema.tabindex" ref="input" v-model="value" v-bind="filteredSchema"
          :class="(floating ? 'floating ' : ' ') + inputClasses + textareaClasses + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' input textarea ' + (schema.class ? schema.class : ' ')"
          v-html="value" />

        <ComboBox v-if="schema.type == 'combo' || schema.type == 'combobox'" :id="name" :name="name"
          :tabindex="schema.tabindex" ref="input" v-model="value" :options="sOptions"
          :option-class="schema['option-class']" :search="schema.search"
          :class="(floating ? 'floating ' : ' ') + inputClasses + selectClasses + (errorMsg ? errorFieldClasses : ' nincserror ') + hasValue + ' input select ' + (schema.class ? schema.class : ' ')" />

        <div v-if="schema.type == 'select'"
          :class="(floating ? 'floating ' : ' ') + inputClasses + selectClasses + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' input textarea ' + (schema.class ? schema.class : ' ')">
          <select :id="name" :name="name" :tabindex="schema.tabindex" ref="input" v-model="value"
            v-bind="filteredSchema"
            class="w-full h-full px-3 bg-transparent border-0 outline-none cursor-pointer ">
            <option v-for="o in sOptions" :key="o.value" :value="o.value" v-html="o.title"></option>
          </select>
          <div class="absolute w-6 h-6 pointer-events-none right-1 top-2">
            <Icon name="hi-selector" />
          </div>
        </div>

        <div class="flex flex-row items-start w-full field-helper">
          <div v-if="schema.help" v-html="schema.help" :class="helperClasses"></div>
          <div v-if="errorMsg" :class="errorMessageClasses + ' text-right '" v-html="errorMsg"></div>
        </div>
      </div>
      <label v-if="floating" :for="name"
        :class="labelClasses + labelFloatingClasses + ' field-label ' + (schema['label-class'] ? schema['label-class'] : ' ')">
        <span v-html="schema.label"></span>
        <span v-if="schema.rules" :class="requiredFloatingClasses">*</span>
      </label>
    </div>
  </template>

  <template v-if="likeRadio">
    <div :class="fieldGroupClasses">
      <label :for="name" :class="labelClasses + (isSide ? labelSideClasses : ' ') + ' field-label '">
        <span v-html="schema.label"></span>
        <span v-if="schema.rules && floating" :class="requiredFloatingClasses">*</span>
        <span v-if="schema.rules && !floating" :class="requiredClasses">{{ messages.text_required
        }}</span>
      </label>
      <div
        :class="'flex flex-col w-full relative input ' + (floating ? 'floating ' : ' ') + hasValue + ' field-input '">
        <div v-if="schema.help" v-html="schema.help" :class="helperClasses + ' text-left pb-2 pl-3 '">
        </div>
        <div class="flex items-center pl-3">

          <template v-if="schema.type == 'switch'">
            <label
              :class="labelClasses + ' flex items-center mb-4 mx-0 py-0 font-normal cursor-pointer '">
              <input type="checkbox" :name="name" :id="name" :tabindex="schema.tabindex"
                :autocomplete="autocomplete" ref="input" v-model="value" v-bind="filteredSchema"
                :class="switchClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' switch '" />
              <div class="pl-4" v-html="schema['option-label']"></div>
            </label>
          </template>

          <template v-if="schema.type == 'checkbox'">
            <label :for="name"
              :class="labelClasses + ' flex items-center mb-4 mx-0 py-0 font-normal cursor-pointer '">
              <input type="checkbox" :name="name" :id="name" :tabindex="schema.tabindex"
                :autocomplete="autocomplete" ref="input" v-model="value" v-bind="filteredSchema"
                :class="checkBoxClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' checkbox '" />
              <div class="pl-3" v-html="schema['option-label']"></div>
            </label>
          </template>

          <template v-if="schema.type == 'radio'">
            <div class="flex flex-col">
              <label v-for="(o, n) in sOptions" :key="o.code"
                :class="labelClasses + ' flex items-center mb-4 mx-0 py-0 font-normal cursor-pointer '">
                <input type="radio" :name="name" :id="name + '-' + o.value"
                  :tabindex="schema.tabindex" :value="o.value" ref="input" v-model="value"
                  v-bind="filteredSchema"
                  :class="radioClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' radio '" />
                <div class="pl-3" v-html="o.title"></div>
              </label>
            </div>
          </template>

        </div>
        <div v-if="errorMsg && side" :class="errorMessageClasses + ' pl-3 '" v-html="errorMsg"></div>
      </div>
      <div v-if="errorMsg && !side" :class="errorMessageClasses + ' pl-3 '" v-html="errorMsg"></div>
    </div>
  </template>


  <template v-if="isSingle">
    <div
      :class="'flex ' + ' field-container ' + (schema['container-class'] ? schema['container-class'] : ' ')">
      <Button v-if="schema.type == 'button'" :tabindex="schema.tabindex"
        :class="twMerge('mt-6 mx-2', schema.class && schema.class)">{{ schema.label }}</Button>
      <div v-if="schema.type == 'html'"
        :class="twMerge('flex', 'field-container', schema['container-class'] && schema['container-class'], schema.class && schema.class)"
        v-html="schema.html"></div>
    </div>
  </template>
</template>

<script setup>
import { computed, toRefs, getCurrentInstance } from "vue"
import { tailwindSanitize, sanitizeOptions } from "../utils.js"
import { twMerge } from 'tailwind-merge'
import { useField } from "vee-validate"
import ComboBox from "./ComboBox.vue"
import { HiSelector } from "oh-vue-icons/icons"
window.addIcons(HiSelector)

// Global functions -------------------------------
const app = getCurrentInstance().appContext.config.globalProperties

// Properties -------------------------------------
const props = defineProps({
  modelValue: String | Number | Object,
  name: String,
  schema: Object,
  floating: Boolean | String | Number,
  side: Boolean | String,
  messages: Object,
})
const { name, schema, floating, side, messages } = toRefs(props)
const isSide = computed(() => {
  let s = '?'
  if (typeof (side.value) == "string") {
    s = side.value.charAt(0).toLowerCase() == "f" || side.value.charAt(0).toLowerCase() == "n" ?
      false : side.value
  } else {
    s = side.value ? 'xl:w-1/3' : false
  }
  return s
})

const filteredSchema = computed(() => {
  let fs = JSON.parse(JSON.stringify(schema.value))
  for (let key of [
    'id', 'name', 'ref', 'type', 'tabindex', 'floating', 'side', 'messages',
    'label', 'placeholder', 'class', 'container-class', 'label-class', 'classes',
    'input-class', 'input-container-class', 'input-label-class',
    'slots', 'options', 'option-label', 'option-class', 'help', 'autocomplete', 'required', 'rules',
    'v-model', 'v-bind']) {
    delete fs[key]
  }
  return fs
})

// Init field ------------------------------------

const { value, errors, errorMessage, meta } = useField(name.value, schema.value.rules, {
  syncVModel: true,
})

const errorMsg = computed(() => errorMessage.value ?
  ('' + errorMessage.value).replace(name.value, schema.value.label)
  : false)

const hasValue = computed(() => value.value && value.value.length > 0 ? "has-value " : "no-value")

const autocomplete = computed(() => {
  if (schema.value.autocomplete) {
    return schema.value.autocomplete
  }
  if (schema.value.type == "email") {
    return "email"
  }
  if (schema.value.type == "tel") {
    return "tel"
  }
  if (schema.value.type == "password") {
    return "new-password"
  }
  return "off"
})

const likeInput = computed(() => {
  const inputTypes = {
    text: true,
    number: true,
    email: true,
    tel: true,
    password: true,
  }
  return inputTypes[schema.value.type]
})

const isInput = computed(() => {
  const inputTypes = {
    text: true,
    number: true,
    email: true,
    tel: true,
    password: true,
  }
  return inputTypes[schema.value.type]
})

const likeRadio = computed(() => {
  const listTypes = {
    switch: true, // Boolean value, option-label is the one option
    switchlist: true, // always a list, has options
    checkbox: true, // Boolean value, option-label is the one option
    checklist: true, // always a list, has options
    radio: true, // always a list, has options
    radiogroup: true, // always a list, has options
  }
  return listTypes[schema.value.type]
})

const isSingle = computed(() => {
  const singleTypes = {
    button: true,
    html: true,
  }
  return singleTypes[schema.value.type]
})

const sOptions = computed(() => {
  let res = []
  res = schema.value.options
  res = sanitizeOptions(res)
  return res
})

// Classes ---------------------------------------

const rounding = '-md'

const fieldGroupSideClasses = "flex flex-col gap-2 xl:flex-row xl:items-top"
const fieldGroupFloatingClasses = "mt-4"

const fieldGroupClasses = computed(() => tailwindSanitize(
  "w-full relative appearance-none",
  (isSide.value ? fieldGroupSideClasses : 'flex flex-col gap-1'),
  (floating.value ? fieldGroupFloatingClasses : ' '),
  schema.value['input-container-class'],
  schema.value['container-class']
))

const inputClasses = computed(() => tailwindSanitize(`
relative select-text py-[0.375rem] w-full rounded${rounding}
transition-all duration-600 ease-in-out
bg-base-50
outline-none
disabled:opacity-30 disabled:cursor-not-allowed
[&[readonly]]:cursor-not-allowed
[&[readonly]]:dark:border-transparent
ring-accent
focus:ring-4 focus-within:ring-4

`, schema.value['input-class']))

const textareaClasses = tailwindSanitize(`
h-auto
h-min-96
p-3
`)

const selectClasses = tailwindSanitize(`
relative flex items-center
`)

const inputBorderClasses = tailwindSanitize(`
border-2 border-base-800 outline-none

`)

const switchClasses = tailwindSanitize(`
w-[48px] h-[24px] p-px rounded-full relative
transition-all duration-600 ease-in-out
before:transition-all before:duration-600 before:ease-in-out
cursor-pointer
bg-base-300 
before:bg-white
border-0 outline-none
shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1)]
disabled:opacity-30 disabled:cursor-not-allowed
ring-accent
focus:ring-4
[&[type='checkbox']]:checked:border-opacity-10
before:w-[20px] before:h-[20px] before:shadow-[2px_2px_4px_rgba(0,0,0,0.3)]
before:absolute before:inset-y-0
before:ml-[2px] before:my-auto before:rounded-full
before:checked:ml-[28px] before:checked:bg-white
  `)
// border-2 border-solid before:dark:bg-darkmode-500  border-neutral-300 outline-none
// dark:border-transparent checked:border-accent 

const checkBoxClasses = tailwindSanitize(`
relative float-left mr-[6px] mt-[-0.5] h-[24px] w-[24px] appearance-none rounded${rounding}
cursor-pointer
bg-base-50
border-0 outline-none
disabled:opacity-30 disabled:cursor-not-allowed
shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1)]
before:pointer-events-none before:absolute before:h-[14px] before:w-[14px] before:scale-0
before:rounded-full before:bg-transparent before:opacity-0
before:shadow-[0px_0px_0px_13px_transparent] before:content-['']
checked:before:opacity-[0.16]
checked:after:absolute checked:after:-mb-[2px] checked:after:ml-[6px] checked:after:block
checked:after:h-[1.2rem] checked:after:w-[0.6rem] checked:after:rotate-45
checked:after:border-[0.25rem] checked:after:border-l-0 checked:after:border-t-0
checked:after:border-solid checked:after:border-white
checked:after:bg-transparent checked:after:content-['']
checked:after:drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]
ring-accent
focus:ring-4
`)


const radioClasses = tailwindSanitize(`
relative float-left mr-1 mt-[-0.5] h-[24px] w-[24px] appearance-none rounded-full cursor-pointer
bg-base-50
border-0 outline-none
disabled:opacity-30 disabled:cursor-not-allowed
shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1)]
before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full
before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-['']
after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-['']
checked:border-8 checked:border-solidchecked:before:opacity-[0.16]
checked:after:absolute checked:after:left-[-2px] checked:after:top-[-2px]
checked:after:h-[12px] checked:after:w-[12px] checked:after:rounded-full
checked:after:bg-white checked:after:content-[''] checked:after:[transform:tranbase(-50%,-50%)]
checked:after:shadow-[1px_1px_4px_rgba(0,0,0,0.4)]
ring-accent
focus:ring-4

`)


const errorMessageClasses = "text-sm pl-1 pt-1 font-bold text-error "
const errorFieldClasses = "ring-4 ring-error "

const labelSideClasses = computed(() => `flex-col w-full ${isSide.value} xl:text-right xl:pr-4 leading-none `)
const labelFloatingClasses = "pointer-events-none inset-0 px-3 mt-2 absolute block mt-0 opacity-50 w-max"
const labelClasses = computed(() => tailwindSanitize("font-bold ", schema.value['input-label-class']))

const helperClasses = `text-sm pt-1 leading-none opacity-60 grow pr-1`
const requiredClasses = "ml-2 px-2 py-0.5 leading-none bg-base-300 text-base-600 text-xs rounded${rounding} "
const requiredFloatingClasses = " "

</script>

<style lang="scss" scoped>
:root[class~="dark"],
.dark {

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus,
  input:autofill,
  input:autofill:hover,
  input:autofill:focus,
  textarea:autofill,
  textarea:autofill:hover,
  textarea:autofill:focus,
  select:autofill,
  select:autofill:hover,
  select:autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #1b3d7a inset !important;
    box-shadow: 0 0 0 30px #1b3d7a inset !important;
    -webkit-text-fill-color: #fff !important;
  }
}



[type=checkbox],
[type=radio],
select,
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.field-input.floating.has-value~label,
.field-input.floating:focus-within~label {
  opacity: 1;
  font-size: 0.9rem;
  margin-top: -1.4rem;
  transition: all 0.3s ease-in-out;
}

input[type=number] {
  position: relative;
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  opacity: 1;
  //-webkit-appearance: inner-spin-button !important;
  width: 1rem;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  cursor: pointer;
}

.switch, .checkbox {
  &:checked {
    background: var(--accent-500);
  }
}

.radio {
  &:checked {
    border-color: var(--accent-500);
  }
  &:checked::after {
    border-color: var(--accent-500);
  }
}
</style>