<template>
    <v-row align="center" justify="center">
        <v-col cols="10" sm="8" md="4">
            <v-progress-linear :indeterminate="true" v-if="userStore.loading"></v-progress-linear>
            <v-card v-else-if="!displayRegistration">
                <v-card-text>
                    <v-text-field
                        :error-messages="login.errors.name"
                        v-model="login.fields.name"
                        :disabled="loading"
                        prepend-icon="mdi-account"
                        name="name"
                        label="Name"
                        type="text"
                    ></v-text-field>
                    <v-text-field
                        :error-messages="login.errors.password"
                        v-model="login.fields.password"
                        :disabled="loading"
                        prepend-icon="mdi-lock"
                        name="password"
                        label="Password"
                        type="password"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="showRegistration(true)" :disabled="loading">Register</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="doLogin" color="accent" :disabled="loading" :loading="loading">Login</v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-else>
                <v-card-text>
                    <v-text-field
                        :error-messages="registration.errors.name"
                        v-model="registration.fields.name"
                        :disabled="loading"
                        prepend-icon="mdi-account"
                        name="name"
                        label="Name"
                        type="text"
                    ></v-text-field>
                    <v-text-field
                        :error-messages="registration.errors.email"
                        v-model="registration.fields.email"
                        :disabled="loading"
                        prepend-icon="mdi-email"
                        name="email"
                        label="Email"
                        type="email"
                    ></v-text-field>
                    <v-text-field
                        :error-messages="registration.errors.password"
                        v-model="registration.fields.password"
                        :disabled="loading"
                        prepend-icon="mdi-lock"
                        name="password"
                        label="Password"
                        type="password"
                    ></v-text-field>
                    <v-text-field
                        :error-messages="registration.errors.password_confirmation"
                        v-model="registration.fields.password_confirmation"
                        :disabled="loading"
                        prepend-icon="mdi-lock"
                        name="password_confirmation"
                        label="Password Confirmation"
                        type="password"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="showRegistration(false)" :disabled="loading">
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="doRegistration" color="accent" :disabled="loading" :loading="loading">Create an Account</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { useUserStore } from "@/store/user";

export default {
    data() {
        return {
            userStore: useUserStore(),
            loading: false,
            displayRegistration: false,
            login: {
                fields: {
                    name: null,
                    password: null,
                },
                errors: {
                    name: [],
                    password: [],
                }
            },
            registration: {
                fields: {
                    name: null,
                    email: null,
                    password: null,
                    password_confirmation: null,
                },
                errors: {
                    name: [],
                    email: [],
                    password: [],
                    password_confirmation: [],
                }
            },
        }
    },

    methods: {
        reset() {
            let $this = this;
            Object.keys(this.login.fields).forEach(key => {
                $this.login.fields[key] = []
            });
            Object.keys(this.registration.fields).forEach(key => {
                $this.registration.fields[key] = []
            });
            this.resetErrors();
        },
        resetErrors() {
            let $this = this;
            Object.keys(this.login.errors).forEach(key => {
                $this.login.errors[key] = []
            });
            Object.keys(this.registration.errors).forEach(key => {
                $this.registration.errors[key] = []
            });
        },
        showRegistration(state) {
            this.reset();
            this.displayRegistration = state;
        },
        doLogin() {
            let $this = this;
            let userStore = useUserStore();
            $this.resetErrors();
            $this.loading = true;
            $this.$axios.get('sanctum/csrf-cookie')
                .then(() => {
                    this.$axios.post('auth/login', $this.login.fields)
                        .catch((error) => {
                            if (!error.response) {
                                return;
                            }
                            if (error.response.data.success === false) {
                                $this.login.errors.name.push(error.response.data.message);
                            } else {
                                Object.keys(error.response.data.errors).forEach(key => {
                                    $this.login.errors[key] = error.response.data.errors[key]
                                });
                            }
                        })
                        .then((response) => {
                            if (response.data.success === true) {
                                userStore.load(response.data.data.token);
                            }
                        })
                        .finally(() => {
                            $this.loading = false;
                        });
                });
        },
        doRegistration() {
            let $this = this;
            this.resetErrors();
            $this.loading = true;
            $this.$axios.get('sanctum/csrf-cookie')
                .then(() => {
                    this.$axios.post('auth/register', $this.registration.fields)
                        .catch((error) => {
                            if (!error.response) {
                                return;
                            }
                            if (error.response.data.success === false) {
                                $this.registration.errors.name.push(error.response.data.message);
                            } else {
                                Object.keys(error.response.data.errors).forEach(key => {
                                    $this.registration.errors[key] = error.response.data.errors[key]
                                });
                            }
                        })
                        .then((response) => {
                            if (response.data.success === true) {
                                let name = $this.registration.fields.name;
                                $this.showRegistration(false);
                                $this.login.fields.name = name;
                            }
                        })
                        .finally(() => {
                            $this.loading = false;
                        });
                });
        }
    }
}
</script>
