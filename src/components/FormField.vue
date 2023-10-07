<template>
  <template v-if="{text:true,email:true,tel:true,password:true,number:true}[schema.type]">
    <div :class="fieldGroupClasses + (side ? fieldGroupSideClasses : ' ') + (schema.containerclass ? schema.containerclass : '') ">
      <div v-if="!floating" :class="'flex items-end label ' + (side ? labelSideClasses : ' flex-row ')">
        <label :for="name" :class="labelClasses">
          <span v-html="schema.label"></span>
          <span v-if="schema.rules" :class="requiredClasses">Required</span>
        </label>
      </div>
      <div :class="'flex flex-col w-full relative input ' + (floating?'floating ':' ') + hasValue">
        <input
          :type="schema.type"
          :id="name"
          :name="name"
          :autocomplete="autocomplete"
          ref="input"
          v-model="value"
          :class="(floating?'floating ':' ') + inputClasses + (errorMsg ? errorFieldClasses : ' ') + hasValue + ' ' + (schema.class ? schema.class : '')"
          :placeholder="!floating?schema.placeholder:''"
        />
        <div class="flex flex-row items-start w-full">
          <div v-if="errorMsg" :class="errorMessageClasses" v-html="errorMsg"></div>
          <div v-if="schema.help" v-html="schema.help" :class="helperClasses + ' text-right '"></div>
        </div>
      </div>
      <label v-if="floating" :for="name" :class="labelClasses + labelFloatingClasses">
        <span v-html="schema.label"></span>
        <span v-if="schema.rules" :class="requiredFloatingClasses">*</span>
      </label>
    </div>
  </template>
  <template v-if="schema.type=='switch'">
    <div :class="fieldGroupClasses + (side ? fieldGroupSideClasses : '') + (schema.containerclass ? schema.containerclass : '') ">
      <label :for="name" :class="labelClasses + (side ? labelSideClasses : ' ')">
          <span v-html="schema.label"></span>
          <span v-if="schema.rules && floating" :class="requiredFloatingClasses">*</span>
          <span v-if="schema.rules && !floating" :class="requiredClasses">Required</span>
      </label>
      <div :class="'flex flex-col w-full relative input ' + (floating?'floating ':' ') + hasValue">
        <div v-if="schema.help" v-html="schema.help" :class="helperClasses + ' text-left pb-2 pl-3 '"></div>
        <div class="flex items-center pl-3">
          <input
            type="checkbox"
            :id="name"
            :name="name"
            :autocomplete="autocomplete"
            ref="input"
            v-model="value"
            :class="switchClasses + (errorMsg ? 'border-red-300 ' : ' ') + hasValue + (schema.class ? schema.class : '')"
          />
          <label :for="name" :class="labelClasses + ' mx-0 py-0 pl-6 font-normal cursor-pointer '" v-html="schema['side-label']"></label>
        </div>
        <div v-if="errorMsg && side" :class="errorMessageClasses" v-html="errorMsg"></div>
      </div>
      <div v-if="errorMsg && !side" :class="errorMessageClasses" v-html="errorMsg"></div>
    </div>
  </template>
  <template v-if="schema.type=='button'">
    <div :class="'flex ' + (schema.containerclass ? schema.containerclass : '') ">
      <button :class="buttonClasses + (schema.class ? schema.class : '')">{{ schema.label }}</button>
    </div>
  </template>
</template>

<script setup>

const fieldGroupClasses = "mt-6 w-full relative appearance-none "
const fieldGroupSideClasses = "flex flex-col xl:flex-row xl:items-top "
const inputClasses = "bg-white dark:bg-darkmode-900 relative outline-none h-10 w-full px-3 disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 select-text "
const buttonClasses = "bg-primary font-bold mt-6 transition duration-200 inline-flex items-center justify-center py-2 px-3 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary border-primary text-white dark:border-primary mr-2 shadow-md text-shadow "
const switchClasses = "bg-slate-300 before:bg-white outline-none transition-all duration-100 ease-in-out shadow-sm border-slate-700 cursor-pointer focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-darkmode-700 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&[type='radio']]:checked:bg-primary [&[type='radio']]:checked:border-primary [&[type='radio']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary [&[type='checkbox']]:checked:border-primary [&[type='checkbox']]:checked:border-opacity-10 [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-800/50 [&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/50 w-[56px] h-[24px] p-px rounded-full relative before:w-[20px] before:h-[20px] before:shadow-[1px_1px_4px_rgba(0,0,0,0.4)] before:transition-[margin-left] before:duration-200 before:ease-in-out before:absolute before:inset-y-0 before:ml-[2px] before:my-auto before:rounded-full before:dark:bg-darkmode-500 dark:before:checked:bg-darkmode-300 checked:bg-primary checked:border-primary checked:bg-none before:checked:ml-[28px] before:checked:bg-white "
const errorMessageClasses = "text-sm pt-1 px-3 font-bold text-red-600 dark:text-red-800 "
const errorFieldClasses = "outline-1 outline-dashed outline-red-600 "
const labelClasses = "font-bold w-full "
const labelSideClasses = "w-full flex-col xl:w-1/3 xl:text-right xl:pr-4 "
const labelFloatingClasses = "pointer-events-none inset-0 px-3 py-2 mt-0 absolute block mt-0 opacity-50 "
const helperClasses = "text-sm pt-1 leading-snug text-slate-400 dark:text-slate-400 grow "
const requiredClasses = "ml-2 px-2 py-0.5 bg-slate-300 text-slate-600 dark:bg-darkmode-600 dark:text-slate-400 text-xs rounded-md "
const requiredFloatingClasses = " "

import { computed, defineProps, toRefs} from "vue"
import { useField } from "vee-validate"

const props = defineProps({
  modelValue: String | Number,
  name: String,
  schema: Object,
  floating: Boolean,
  side: Boolean
})

const {name, schema, floating, side } = toRefs(props)

const { value, errors, errorMessage, meta } = useField(name.value, schema.value.rules, {
  syncVModel: true,
})

const errorMsg = computed(() => errorMessage.value ? ('' + errorMessage.value).replace(name.value, schema.value.label):false)

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

</script>

<style lang="scss" scoped>

.text-shadow {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
}

[type=checkbox], [type=radio] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.input.floating.has-value ~ label,
.input.floating:focus-within ~ label
{
  opacity: 1;
  font-size: 0.8rem;
  margin-top: -1.8rem;
  transition: all 0.2s ease-in-out;
}

</style>