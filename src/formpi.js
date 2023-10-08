import FormPi from "./components/FormPi.vue"
import Group from "./components/group.vue"
import Field from "./components/field.vue"

import { defineRule } from "vee-validate"
import * as AllRules from "@vee-validate/rules"

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

const throttle = (func, delay) => {
  let prev = 0
  return (...args) => {
    let now = new Date().getTime()
    if (now - prev > delay) {
      prev = now
      return func(...args)
    }
  }
}

const clickOutside = {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!el || !el.contains || !event.target || !event.target.nodeType) {
        return
      }
      if (!(el == event.target || el.contains(event.target))) {
        binding.value()
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
        binding.value()
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
    app.component("formpi", FormPi)
    app.component("group", Group)
    app.component("field", Field)
    app.directive('click-outside', clickOutside)
    app.directive('focus-outside', focusOutside)
    app.config.globalProperties.$throttle = throttle
  },
}
