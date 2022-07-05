<template>
    <v-app dark>
        <div v-if="userStore.loggedIn">
            <navigation transition="scroll-x-transition"></navigation>
            <v-main>
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
