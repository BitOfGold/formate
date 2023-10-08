<template>
    <form @submit.prevent="onSubmit" :class="'select-none flex-col gap-2 ' + classes" :language="locale">
        <slot></slot>
        <fieldset v-for="(g, n) in freshSchema.groups" :class="'flex flex-col gap-2 field-group ' + g.class">
            <legend v-if="g.label" :class="legendClasses + (g['label-class'] ? g['label-class'] : ' ')">{{ g.label }}</legend>
            <FormField v-for="(f, fn) in g.fields" :name="fn" :schema="f" :floating="floating" :side="side" :messages="messages"></FormField>
        </fieldset>
        <FormField v-for="(f, n) in freshSchema.fields" :name="n" :schema="f" :floating="floating" :side="side" :messages="messages"></FormField>
    </form>
</template>

<script setup>
const legendClasses = "w-full text-lg font-bold pb-1 mb-4 "
import { useSlots, defineProps, defineEmits, computed, ref, toRefs, watch, onMounted } from 'vue'
import FormField from './FormField.vue'
import { useForm, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n';

// Properties -------------------------------------
const props = defineProps({
    modelValue: Object,
    schema: Object,
    locale: String,
    floating: Boolean|String,
    side: Boolean|String,
    class: String,
})

const { modelValue, schema, locale, floating, side } = toRefs(props)
const classes = ref(props.class)
const emit = defineEmits(['update:modelValue', 'change', 'submit'])


// Localize ---------------------------------------
const messages = ref({})

async function setLocale(locale) {
    const loc = await fetch('https://unpkg.com/formpi@0.1.1/locale/' + locale + '.json', {
      headers: {
        'content-type': 'application/json',
      },
    }).then(res => res.json())
    if (!loc.code) {
      console.error('Could not identify locale, ensure the locale file contains `code` field')
      return
    }
    localize({ [loc.code]: loc })
    configure({
        generateMessage: localize(locale)
    })
    messages.value = loc.messages
}

if (locale.value) {
    setLocale(locale.value)
} else {
    locale.value = 'en'
    setLocale('en')
}
watch(() => locale, (n) => {
    setLocale(n.value)
})


// Init Form --------------------------------------
const { handleSubmit, values } = useForm({
    initialValues: modelValue.value,
})

watch(values, (n) => {
    emit('update:modelValue', values)
    emit('change', n)
}, {deep: true})

const onSubmit = handleSubmit((values) => {
    emit('update:modelValue', values)
    emit('submit', values)
    console.log('----------- Submit: ', values)
}, ({ values, errors, results }) => {
    console.warn('----------- invalid Submit: ', values, errors)
})


// Refresh schema ---------------------------------
const freshSchema = computed(() => {
    const slots = useSlots()

    let allSchema = {groups: {}, fields: {}}
    let tabindex = 1
    let gid = 1
    let fid = 1

    function addGroup(attr = {}) {
        let name = false;
        if (attr.name) {
            name = attr.name
        }
        if (!name) {
            name = 'group_' + gid++
        }
        delete attr.name
        allSchema.groups[name] = attr
        return name
    }

    function addField(attr, group = false) {
        if (attr.type != 'html') {
            attr.tabindex = tabindex
            tabindex += 100
        }
        let name = false;
        if (attr.name) {
            name = attr.name
        }
        if (!name) {
            name = 'field_' + fid++;
        }
        delete attr.name;
        if (!attr.type) {
            if (name.startsWith('email')) {
                attr.type = 'email'
            }
            else if (name.startsWith('password')) {
                attr.type = 'password'
            }
            else if (name.startsWith('phone')) {
                attr.type = 'phone'
            }
            else if (name.startsWith('date')) {
                attr.type = 'date'
            }
            else {
                attr.type = 'text'
            }
        }
        if (group) {
            if (!allSchema.groups[group].fields) {
                allSchema.groups[group].fields = {}
            }
            allSchema.groups[group].fields[name] = attr
        }
        else {
            allSchema.fields[name] = attr
        }
    }

    if (slots.default) {
        slots.default().forEach((vNode) => {
            if (vNode.type && vNode.type.name === 'field') {
                addField(vNode.props)
            }
            if (vNode.type && vNode.type.name === 'group') {
                let groupName = addGroup(vNode.props);
                if (vNode.children && vNode.children.default) {
                    vNode.children.default().forEach((cNode) => {
                        if (cNode.type && cNode.type.name === 'field') {
                            addField(cNode.props, groupName);
                        }
                    })
                }
            }
        })
    }

    return allSchema
})

</script>
