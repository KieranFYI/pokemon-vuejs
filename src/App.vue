<template>
    <v-app dark>
        <div v-if="userStore.loggedIn || $route.name == '404'" class="fill-height">
            <navigation transition="scroll-x-transition" v-if="userStore.loggedIn"></navigation>
            <v-main class="fill-height">
                <v-container class="fill-height" fluid transition="scroll-y-transition" align-start>
                    <router-view></router-view>
                </v-container>
            </v-main>
        </div>
        <login v-else></login>
    </v-app>

</template>

<style lang="scss">

</style>

<script>

import Login from '@/components/auth/Login.vue'
import Navigation from '@/components/Navigation.vue'
import {useUserStore} from "@/store/user";

export default {
    name: 'App',
    data() {
        return {
            userStore: useUserStore(),
        }
    },

    components: {
        Navigation,
        Login
    },
}
</script>
