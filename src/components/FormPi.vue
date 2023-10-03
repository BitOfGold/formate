<template>
  <slot></slot>
  <pre class="text-xs text-gray-500">
  {{ schema }}
  </pre>
</template>
<script>
import { defineComponent, ref, toRefs } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: Object,
    schema: Object
  }, 
  setup: (props,  { attrs, slots, emit }) => {
    console.log('FormPi', props, attrs)
    var { modelValue, schema } = toRefs(props)

    let gid = 1
    let fid = 1
    if (!schema) {
      schema = ref({ value: {}})
    }
    if (!schema.value.groups) {
      schema.value.groups = {}
    }
    if (!schema.value.fields) {
      schema.value.fields = {}
    }

    function addGroup(attr={}) {
      let name = false
      if (attr.name) {
        name = attr.name
      }
      if (!name) {
        name = 'group_' + gid++
      }
      delete attr.name
      schema.value.groups[name] = attr
      return name
    }

    function addField(attr, group=false) {
      let name = false
      if (attr.name) {
        name = attr.name
      }
      if (!name) {
        name = 'field_' + fid++
      }
      delete attr.name
      if (!attr.type) {
        if (name.startsWith('email')) {
          attr.type = 'email'
        } else if (name.startsWith('password')) {
          attr.type = 'password'
        } else if (name.startsWith('phone')) {
          attr.type = 'phone'
        } else if (name.startsWith('date')) {
          attr.type = 'date'
        } else {
          attr.type = 'text'
        }
      }
      if (group) {
        if (!schema.value.groups[group].fields) {
          schema.value.groups[group].fields = {}
        }
        schema.value.groups[group].fields[name] = attr
      } else {
        schema.value.fields[name] = attr
      }
      
    }

    if (slots.default) {
      slots.default().forEach((vNode) => {
        if (vNode.type && vNode.type.name === 'field') {
          addField(vNode.props)
        }
        if (vNode.type && vNode.type.name === 'group') {
          let groupName = addGroup(vNode.props)
          if (vNode.children && vNode.children.default) {
            vNode.children.default().forEach((cNode) => {
              if (cNode.type && cNode.type.name === 'field') {
                addField(cNode.props, groupName)
              }
            })
          }
        }
      })
    }

    return {
      schema
    }
  }
})
</script>
