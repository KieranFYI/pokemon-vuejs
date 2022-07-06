<template>
    <v-card width="100%">
        <v-card-text>
            <v-row justify="center">
                <v-col cols="2">
                    <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
                </v-col>
                <v-col cols="10">
                    <v-row>
                        <v-col cols="12" v-if="loading && pokemon.length === 0" class="mt-3">
                            <v-progress-linear :indeterminate="true"></v-progress-linear>
                        </v-col>
                        <v-col cols="12" v-else-if="pokemon.length === 0" class="red--text text-center headline mt-3">
                            No Pokemon Found
                        </v-col>
                        <v-col cols="12" v-else-if="pokemon.last_page > 1">
                            <v-pagination v-model="page" :length="pokemon.last_page" total-visible="6"></v-pagination>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" v-for="item in pokemon.data" :key="item.id" @click="show(item.id)">
                            <v-card
                                elevation="2"
                                :loading="loading"
                            >
                                <v-img
                                    :src="item.image_url_gif"
                                    height="200px"
                                    contain
                                ></v-img>
                                <v-card-title class="text-center">{{ item.name }}</v-card-title>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<style>
</style>

<script>
export default {
    data() {
        return {
            loading: true,
            pokemon: [],
            page: 1,
            search: ''
        }
    },

    methods: {
        show(id) {
            alert(id);
        }
    },

    beforeMount() {
        this.fetchData()
    },

    beforeCreate() {
        let $this = this;

        $this.loading = true;
        $this.fetchData = $this.$lodash.debounce(() => {
            $this.loading = true;

            let params = {
                search: $this.search,
                page: $this.page,
            }
            console.log(params);

            $this.$axios.get('pokemon', {params: params})
                .then((response) => {
                    if (response.data.success === true) {
                        $this.pokemon = response.data.data;
                    }
                }).finally(() => {
                $this.loading = false;
            })
        }, 500);
    },

    watch: {
        'search': 'fetchData',
        'page': 'fetchData',
    },


}
</script>
