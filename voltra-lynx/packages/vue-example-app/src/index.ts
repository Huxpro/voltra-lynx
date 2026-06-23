import { createApp } from 'vue-lynx';

import App from './App.vue';

// Vue Lynx mounts to the Lynx page root — `mount()` takes no DOM selector.
// See https://vue.lynxjs.org/guide/quick-start
const app = createApp(App);
app.mount();
