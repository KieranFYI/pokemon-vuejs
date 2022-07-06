<template>
    <v-row align="center" justify="center" class="fill-height" style="flex-direction: column;">
        <v-col cols="10" sm="8" md="4">
            <v-card>
                <v-card-text>
                    <v-text-field
                        v-model="token"
                        :disabled="loading"
                        label="Token"
                        outlined
                        dense
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="generateToken" color="accent" :disabled="loading" :loading="loading">Generate Token
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            token: '',
        }
    },

    methods: {
        generateToken() {
            let $this = this;

            $this.loading = true;
            $this.$axios
                .post('api/auth/token')
                .then((response) => {
                    if (response.data.success === true) {
                        $this.token = response.data.data.token;
                    }
                })
                .finally(function () {
                    $this.loading = false;
                });
        }
    }
}
</script>