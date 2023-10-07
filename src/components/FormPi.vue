<template>
    <div :class="'select-none ' + classes">
        <form @submit.prevent="onSubmit">
            <slot></slot>
            <fieldset v-for="(g, n) in freshSchema.groups" :class="g.class">
                <legend v-if="g.label" :class="legendClasses + (g.legendclass ? g.legendclass : ' ')">{{ g.label }}</legend>
                <FormField v-for="(f, fn) in g.fields" :name="fn" :schema="f" :floating="floating" :side="side"></FormField>
            </fieldset>
            <FormField v-for="(f, n) in freshSchema.fields" :name="n" :schema="f" :floating="floating" :side="side"></FormField>
        </form>
    </div>
</template>

<script setup>
const legendClasses = "w-full text-lg font-bold pb-1 mb-4 "
import { useSlots, defineProps, defineEmits, computed, ref, toRefs, watch, onMounted } from 'vue'
import FormField from './FormField.vue'
import { useForm, configure } from 'vee-validate'
import { localize, loadLocaleFromURL } from '@vee-validate/i18n';

const props = defineProps({
    modelValue: Object,
    schema: Object,
    language: String,
    floating: Boolean,
    side: Boolean,
    class: String,
})

const { modelValue, schema, language, floating, side } = toRefs(props)
const classes = ref(props.class)

function setLanguage(lang) {
    if (lang) {
        loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/' + lang + '.json').then((messages) => {
            configure({
                generateMessage: localize(lang)
            })
        })
    }
}
if (language) {
    setLanguage(props.language)
} else {
    language.value = 'en'
    setLanguage('en')
}

watch(() => language, (n) => {
    setLanguage(n)
})

const { handleSubmit, values } = useForm({
    initialValues: modelValue.value,
})

const emit = defineEmits(['update:modelValue', 'change', 'submit'])


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

const freshSchema = computed(() => {
    const slots = useSlots()

    let allSchema = {groups: {}, fields: {}}
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
