import "./formpi.scss"

import Modal from "./components/Modal.vue"
import Dropdown from "./components/Dropdown.vue"
import Card from "./components/Card.vue"
import Button from "./components/Button.vue"

import FormPi from "./components/FormPi.vue"
import Group from "./components/group.vue"
import Field from "./components/field.vue"

import { defineRule } from "vee-validate"
import * as AllRules from "@vee-validate/rules"

import { OhVueIcon, addIcons } from "oh-vue-icons"

import { throttle, tailwindSanitize } from "./utils"

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

const clickOutside = {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!el || !el.contains || !event.target || !event.target.nodeType) {
        return
      }
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event.target)
      }
    }
    document.addEventListener("click", el.clickOutsideEvent)
  },
  unmounted: (el) => {
    document.removeEventListener("click", el.clickOutsideEvent)
  },
}

const focusOutside = {
  beforeMount: (el, binding) => {
    el.focusOutsideEvent = (event) => {
      if (!el || !el.contains || !event.target || !event.target.nodeType) {
        return
      }
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event.target)
      }
    }
    window.addEventListener("focus", el.focusOutsideEvent, true)
  },
  unmounted: (el) => {
    window.removeEventListener("focus", el.focusOutsideEvent, true)
  },
}


export default {
  install: (app, options) => {
    app.component("Modal", Modal)
    app.component("Dropdown", Dropdown)
    app.component("Card", Card)
    app.component("Button", Button)

    app.component("Form", FormPi)
    app.component("group", Group)
    app.component("field", Field)

    app.directive("click-outside", clickOutside)
    app.directive("focus-outside", focusOutside)
    app.component("Icon", OhVueIcon)
    window.addIcons = addIcons
    app.config.globalProperties.$throttle = throttle
    app.config.globalProperties.$tailwindSanitize = tailwindSanitize
    
  },
}
