<template>
    <v-navigation-drawer app :mobile-breakpoint="$vuetify.breakpoint.thresholds.sm">
        <v-list dense nav>
            <v-list-item :to="{ name: 'home' }" active-class="noactive">
                <v-list-item-content>
                    <v-img src="@/assets/logo.png"/>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list dense nav>
            <v-list-item :to="{ name: 'home' }" exact>
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'import' }">
                <v-list-item-icon>
                    <v-icon>mdi-import</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Import Dataset</v-list-item-title>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-list dense nav>
            <v-list-item :to="{ name: 'user' }">
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-html="userStore.data.name" style="color:#00FF00">
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item @click="logout">
                <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
</template>

<style scoped>
.v-list-item--active.noactive {
    color: transparent;
}
</style>

<script>
import {useUserStore} from "@/store/user";

export default {
    props: ['drawer'],
    data() {
        return {
            userStore: useUserStore(),
        }
    },

    methods: {
        logout() {
            let userStore = useUserStore();
            userStore.logout();
        }
    }
}
</script>
