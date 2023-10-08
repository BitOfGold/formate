# FormPI

> A Vue Form component library/form builder. Using Tailwind CSS and VeeValidate
## Development :sunglasses:

(Under development, please don't use it, yet :smirk: )

## install

```sh
$ npm i formpi
```

## Usage

### In your main:

```js
import { createApp } from "vue";
import App from "./App.vue";
import FormPI from "formpi";

const app = createApp(App);

app.use(FormPI, {}); // You can set FormPI options here

app.mount("#app");
```

### In your template:

```vue
<template>
  <formpi v-bind="userData">
    <group title="Registration">
      <field name="email" validate />
      <field name="tel" type="phone" validate="phone" />
      <field name="password" validate="password,min=8" />
      <field name="password2" validate="password" />
      <field type="button" classes="bg-red-400">
    </group>
  </formpi>
</template>

```
