// <script src="https://cdn.rawgit.com/dmester/jdenticon/5bbdf8cb/dist/jdenticon.min.js"></script>;
import { createApp } from 'vue';
import Vue from 'vue';
// https://github.com/VinceG/vue-click-away#readme
import VueClickAway from 'vue3-click-away';

import App from './App.vue';
import router from './router';
import './index.css';
import { VueDapp } from 'vue-dapp';

const app = createApp(App);

app.use(router);
app.use(VueDapp, {
  infuraId: '',
});
app.use(VueClickAway);

app.mount('#app');
