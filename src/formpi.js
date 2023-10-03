import FormPi from "./components/FormPi.vue"
import Group from "./components/group.vue"
import Field from "./components/field.vue"

export default {
  install: (app, options) => {
    app.component("formpi", FormPi)
    app.component("group", Group)
    app.component("field", Field)
  }
}
