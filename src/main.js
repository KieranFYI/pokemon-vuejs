import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router';
import AxiosAlias from 'axios';
import { createPinia, PiniaVuePlugin } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueCompositionAPI from '@vue/composition-api'
import { useUserStore } from "@/store/user";
import Lodash from 'lodash';

Vue.prototype.$lodash = Lodash;

Vue.prototype.$axios = AxiosAlias.create({
    withCredentials: true,
    baseURL: Vue.config.devtools ? '//127.0.0.1/api/' : '//api-pokemon.kieran.fyi/api/'
});
Vue.prototype.$axios.interceptors.request.use(function (config) {
    let userStore = useUserStore();
    if (userStore.token !== null) {
        config.headers.Authorization = 'Bearer ' + userStore.token;
    }

    return config;
});

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
Vue.use(VueCompositionAPI)

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to.meta.title !== undefined) {
        document.title = to.meta.title + ' | Pokemon';
    } else {
        document.title = 'Pokemon';
    }

    next();
});


new Vue({
    vuetify,
    router,
    pinia,
    render: h => h(App)
}).$mount('#app')
