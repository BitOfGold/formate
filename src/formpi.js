import FormPi from "./components/FormPi.vue"
import Group from "./components/group.vue"
import Field from "./components/field.vue"

import { defineRule } from "vee-validate"
import * as AllRules from '@vee-validate/rules'

Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule])
})

export default {
  install: (app, options) => {
    app.component("formpi", FormPi)
    app.component("group", Group)
    app.component("field", Field)
  },
}
