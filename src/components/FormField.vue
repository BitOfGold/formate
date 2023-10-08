<template>
  <template v-if="!likeRadio && !isSingle">
    <div
      :class="fieldGroupClasses + (isSide ? fieldGroupSideClasses : ' flex flex-col gap-1 ') + (floating ? fieldGroupFloatingClasses : ' ') + ' field-container ' + (schema['container-class'] ? schema['container-class'] : ' ')">
      <div v-if="!floating" :class="'flex xl:items-end ' + (isSide ? labelSideClasses : ' flex-row ') + ' field-label-container ' + (schema['label-class'] ? schema['label-class'] : ' ')">
        <label :for="name" :class="labelClasses + ' field-label '">
          <span v-html="schema.label"></span>
          <span v-if="schema.rules" :class="requiredClasses">{{ messages.text_required }}</span>
        </label>
      </div>
      <div :class="'flex flex-col w-full relative ' + (floating ? 'floating ' : ' ') + hasValue + ' field-input '">

        <input
          v-if="isInput"
          :type="schema.type"
          :id="name"
          :name="name"
          :tabindex = "schema.tabindex"
          :autocomplete="autocomplete"
          ref="input"
          v-model="value"
          v-bind="schema"
          :class="(floating ? 'floating ' : ' ') + inputClasses + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' input ' + (schema.class ? schema.class : ' ')"
          :placeholder="!floating ? schema.placeholder : ''"
        />

        <textarea
          rows="7"
          v-if="schema.type == 'textarea'"
          :id="name"
          :name="name"
          :tabindex = "schema.tabindex"
          ref="input"
          v-model="value"
          v-bind="schema"
          :class="(floating ? 'floating ' : ' ') + inputClasses + textareaClasses + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' input textarea ' + (schema.class ? schema.class : ' ')"
          v-html="value"
        />

        <ComboBox
          v-if="schema.type == 'select'"
          :id="name"
          :name="name"
          :firstindex = "schema.tabindex"
          ref="input"
          v-model="value"
          :options="schema.options"
          :search="schema.search"
          :classes="(floating ? 'floating ' : ' ') + inputClasses + selectClasses + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' input select ' + (schema.class ? schema.class : ' ')"
        />

        <div class="flex flex-row items-start w-full field-helper">
          <div v-if="errorMsg" :class="errorMessageClasses" v-html="errorMsg"></div>
          <div v-if="schema.help" v-html="schema.help" :class="helperClasses + ' text-right '"></div>
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
    <div
      :class="fieldGroupClasses + (isSide ? fieldGroupSideClasses : '') + ' field-container ' + (schema['container-class'] ? schema['container-class'] : ' ')">
      <label :for="name" :class="labelClasses + (isSide ? labelSideClasses : ' ') + ' field-label '">
        <span v-html="schema.label"></span>
        <span v-if="schema.rules && floating" :class="requiredFloatingClasses">*</span>
        <span v-if="schema.rules && !floating" :class="requiredClasses">{{ messages.text_required }}</span>
      </label>
      <div :class="'flex flex-col w-full relative input ' + (floating ? 'floating ' : ' ') + hasValue + ' field-input '">
        <div v-if="schema.help" v-html="schema.help" :class="helperClasses + ' text-left pb-2 pl-3 '"></div>
        <div class="flex items-center pl-3">

          <template v-if="schema.type == 'switch'">
            <input type="checkbox" :name="name" :id="name" :tabindex = "schema.tabindex" :autocomplete="autocomplete" ref="input" v-model="value"
            :class="switchClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' switch '" />
            <label :for="name" :class="labelClasses + ' mx-0 py-0 pl-6 font-normal cursor-pointer '" v-html="schema['option-label']"></label>
          </template>

          <template v-if="schema.type == 'checkbox'">
            <input type="checkbox" :name="name" :id="name" :tabindex = "schema.tabindex" :autocomplete="autocomplete" ref="input" v-model="value"
            :class="checkBoxClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' checkbox '" />
            <label :for="name" :class="labelClasses + ' mx-0 py-0 pl-3 font-normal cursor-pointer '" v-html="schema['option-label']"></label>
          </template>

          <template v-if="schema.type == 'radio'">
            <div class="flex flex-col">
              <div class="mb-4 flex items-center">
                <input type="radio" :name="name" :id="name + 'first'"  :tabindex = "schema.tabindex" value="first" :autocomplete="autocomplete" ref="input" v-model="value"
                :class="radioClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' radio '" />
                <label :for="name + 'first'" :class="labelClasses + ' mx-0 py-0 pl-3 font-normal cursor-pointer '" v-html="schema['option-label']"></label>
              </div>
              <div class="mb-4 items-center">
                <input type="radio" :name="name" :id="name + 'second'"  :tabindex = "schema.tabindex + 1" value="second" :autocomplete="autocomplete" ref="input" v-model="value"
                :class="radioClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' radio '" />
                <label :for="name + 'second'" :class="labelClasses + ' mx-0 py-0 pl-3 font-normal cursor-pointer '" v-html="schema['option-label']"></label>
              </div>
              <div class="mb-4 items-center">
                <input type="radio" :name="name" :id="name + 'third'"  :tabindex = "schema.tabindex + 2"  value="third" :autocomplete="autocomplete" ref="input" v-model="value"
                :class="radioClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : ' ') + ' radio '" />
                <label :for="name + 'third'" :class="labelClasses + ' mx-0 py-0 pl-3 font-normal cursor-pointer '" v-html="schema['option-label']"></label>
              </div>
            </div>
          </template>

        </div>
        <div v-if="errorMsg && side" :class="errorMessageClasses + ' pl-3 '" v-html="errorMsg"></div>
      </div>
      <div v-if="errorMsg && !side" :class="errorMessageClasses + ' pl-3 '" v-html="errorMsg"></div>
    </div>
  </template>


  <template v-if="isSingle">
    <div :class="'flex ' + ' field-container ' + (schema['container-class'] ? schema['container-class'] : ' ')">
      <button v-if="schema.type == 'button'"  :tabindex = "schema.tabindex" :class="buttonClasses + (schema.class ? schema.class : ' ') + ' button '">{{ schema.label }}</button>
      <div v-if="schema.type == 'html'" :class="'flex ' + ' field-container ' + (schema['container-class'] ? schema['container-class'] : ' ') + (schema.class ? schema.class : ' ')" v-html="schema.html"></div>
    </div>
  </template>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue"
import { useField } from "vee-validate"
import ComboBox from "./ComboBox.vue"

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
    s = side.value.charAt(0).toLowerCase() == "f" || side.value.charAt(0).toLowerCase() == "n" ? false : side.value
  } else {
    s = side.value ? 'xl:w-1/3': false
  }
  return s
})


// Init field ------------------------------------
const { value, errors, errorMessage, meta } = useField(name.value, schema.value.rules, {
  syncVModel: true,
})

const errorMsg = computed(() => errorMessage.value ? ('' + errorMessage.value).replace(name.value, schema.value.label) : false)

const hasValue = computed(() => value.value && value.value.length > 0 ? "has-value " : " ")

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

const likeInput = computed (() => {
  const inputTypes = {
    text: true,
    number: true,
    email: true,
    tel: true,
    password: true,
  }
  return inputTypes[schema.value.type]
})

const isInput = computed (() => {
  const inputTypes = {
    text: true,
    number: true,
    email: true,
    tel: true,
    password: true,
  }
  return inputTypes[schema.value.type]
})

const likeRadio = computed (() => {
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

const isSingle = computed (() => {
  const singleTypes = {
    button: true,
    html: true,
  }
  return singleTypes[schema.value.type]
})


// Classes ---------------------------------------
function sanitize(classes) {
  return classes.replace(/\n/g, " ").replace(/\s+/g, " ")
}

const fieldGroupClasses = "w-full relative appearance-none "
const fieldGroupSideClasses = "flex flex-col xl:flex-row xl:items-top "
const fieldGroupFloatingClasses = "mt-4 "
const inputClasses = sanitize(`
relative select-text h-10 w-full px-3 shadow-inner rounded-md
transition-all duration-300 ease-in-out
bg-white dark:bg-darkmode-900
placeholder:text-slate-400/90 dark:placeholder:text-slate-500/80
outline-none

disabled:opacity-30 disabled:cursor-not-allowed
[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent

focus:ring-4 focus:ring-primary focus:ring-opacity-20
dark:focus:ring-opacity-50

focus-within:ring-4 focus-within:ring-primary focus-within:ring-opacity-20
dark:focus-within:ring-opacity-50

`)

const textareaClasses = sanitize(`
h-auto
h-min-96

`)

const selectClasses = sanitize(`

`)

const inputBorderClasses = sanitize(`
border-2 border-neutral-300 outline-none

`)

const buttonClasses = sanitize(`
inline-flex items-center justify-center mt-6 mx-2 py-2 px-8 shadow-lg rounded-md cursor-pointer
transition-all duration-300 ease-in-out
bg-primary
font-bold text-white text-shadow text-center
border-0 outline-none

disabled:opacity-30 disabled:cursor-not-allowed

focus:ring-4 focus:ring-primary focus:ring-opacity-20
dark:focus:ring-opacity-50

[&:hover:not(:disabled)]:opacity-70

`)

const switchClasses = sanitize(`
w-[56px] h-[24px] p-px rounded-full relative shadow-inner
transition-all duration-300 ease-in-out
cursor-pointer
bg-slate-200 before:bg-white dark:bg-darkmode-900 dark:before:bg-darkmode-300
border-0 outline-none

focus:ring-4 focus:ring-primary focus:ring-opacity-20
dark:focus:ring-opacity-50

[&[type='checkbox']]:checked:bg-primary [&[type='checkbox']]:checked:border-primary
[&[type='checkbox']]:checked:border-opacity-10

[&:disabled:not(:checked)]:bg-slate-400 [&:disabled:not(:checked)]:cursor-not-allowed
[&:disabled:not(:checked)]:dark:bg-darkmode-800/40 [&:disabled:checked]:opacity-40
[&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/40

before:w-[20px] before:h-[20px] before:shadow-[1px_1px_4px_rgba(0,0,0,0.4)] before:absolute before:inset-y-0
before:ml-[2px] before:my-auto before:rounded-full

dark:before:checked:bg-darkmode-300
checked:bg-primary checked:bg-none
before:checked:ml-[28px] before:checked:bg-white
  
`)
// border-2 border-solid before:dark:bg-darkmode-500  border-neutral-300 outline-none dark:border-transparent checked:border-primary 

const checkBoxClasses = sanitize(`
relative float-left mr-[6px] mt-[-0.5] h-[24px] w-[24px] appearance-none rounded-[4px] shadow-inner
bg-white dark:bg-darkmode-900
border-0 outline-none
before:pointer-events-none before:absolute before:h-[14px] before:w-[14px] before:scale-0 before:rounded-full
before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-['']

checked:bg-primary
checked:border-primary
checked:before:opacity-[0.16]

checked:after:absolute checked:after:-mb-[2px] checked:after:ml-[6px] checked:after:block
checked:after:h-[1.2rem] checked:after:w-[0.6rem] checked:after:rotate-45 checked:after:border-[0.25rem]
checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white
checked:after:bg-transparent checked:after:content-['']
dark:checked:bg-primary dark:checked:after:border-darkmode-300

focus:ring-4 focus:ring-primary focus:ring-opacity-20
dark:focus:ring-opacity-50

`)
// border-2 border-solid border-neutral-300 outline-none dark:border-darkmode-400
// dark:checked:border-primary 


const radioClasses = sanitize(`
relative float-left mr-1 mt-[-0.5] h-[24px] w-[24px] appearance-none rounded-full shadow-inner
bg-white dark:bg-darkmode-900
border-0 outline-none
before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full
before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-['']

after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-['']

checked:border-8 checked:border-solid checked:border-primary checked:before:opacity-[0.16]

checked:after:absolute checked:after:left-1/2 checked:after:top-1/2
checked:after:h-[12px] checked:after:w-[12px] checked:after:rounded-full checked:after:border-primary
checked:after:bg-white checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)]

dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-darkmode-300
focus:ring-4 focus:ring-primary focus:ring-opacity-20
dark:focus:ring-opacity-50

`)
// border-2 border-solid border-neutral-300 outline-none dark:border-darkmode-400


const errorMessageClasses = "text-sm pl-1 pt-1 font-bold text-red-600 dark:text-red-800 "
const errorFieldClasses = "outline-1 outline-dashed outline-red-600 "
const labelClasses = " font-bold "
const labelSideClasses = computed(()=>`flex-col w-full ${ isSide.value } xl:text-right xl:pr-4 leading-none `)
const labelFloatingClasses = "pointer-events-none inset-0 px-3 mt-2 absolute block mt-0 opacity-50 w-max"
const helperClasses = `text-sm pt-1 leading-none opacity-60 grow pr-1`
const requiredClasses = "ml-2 px-2 py-0.5 leading-none bg-slate-300 text-slate-600 dark:bg-darkmode-600 dark:text-darkmode-300 text-xs rounded-md "
const requiredFloatingClasses = " "

</script>

<style lang="scss" scoped>
.text-shadow {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
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

</style>