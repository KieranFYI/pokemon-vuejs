import {defineStore} from 'pinia'
import Vue from "vue";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            loading: false,
            loggedIn: false,
            token: null,
            data: {
                name: 'Guest',
            }
        }
    },
    actions: {
        load(token) {
            let $this = this;
            Vue.prototype.$axios
                .create()
                .get('user', {headers: {Authorization: 'Bearer ' + token}})
                .catch(() => {
                    $this.loggedIn = false;
                    $this.token = null;
                })
                .then((response) => {
                    $this.data.name = response.data.name;
                    $this.loggedIn = true;
                    $this.token = token;
                })
                .finally(() => {
                    $this.loading = false;
                });
        },
        logout() {
            this.loggedIn = false;
            this.token = null;
        }
    },
    persist: {
        afterRestore: (context) => {
            if (context.store.token !== null) {
                context.store.loggedIn = false;
                context.store.loading = true;
                context.store.load(context.store.token);
            }
        },
    },
})