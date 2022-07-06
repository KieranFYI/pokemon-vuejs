<template>
    <v-card width="100%">
        <v-card-text>
            <v-row justify="center">
                <v-col cols="12" lg="3" xl="2">
                    <v-text-field v-model="options.search" label="Search" single-line
                                  hide-details></v-text-field>

                    <v-expansion-panels multiple>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Type
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-progress-linear :indeterminate="true" v-if="types.length === 0"></v-progress-linear>
                                <v-checkbox
                                    v-for="(item) in types" :key="item.name"
                                    v-model="options.type_one"
                                    :label="item.name"
                                    :value="item.id"
                                    dense
                                    hide-details="true"
                                    class="d-inline-block ms-1 checkbox-no-gap"
                                    v-else
                                ></v-checkbox>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Subtype
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-progress-linear :indeterminate="true" v-if="types.length === 0"></v-progress-linear>
                                <v-checkbox
                                    v-for="(item) in types" :key="item.name"
                                    v-model="options.type_two"
                                    :label="item.name"
                                    :value="item.id"
                                    dense
                                    hide-details="true"
                                    class="d-inline-block ms-1 checkbox-no-gap"
                                    v-else
                                ></v-checkbox>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Stats
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-progress-linear :indeterminate="true"
                                                   v-if="filters.length === 0"></v-progress-linear>
                                <v-range-slider
                                    :label="item.name"
                                    v-model="options[key]"
                                    :min="item.min"
                                    :max="item.max"
                                    v-for="(item, key) in filters" :key="item.name"
                                    :thumb-label="true"
                                    :thumb-size="24"
                                    @change="fetchData"
                                    v-else
                                ></v-range-slider>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
                <v-col cols="12" lg="9" xl="10">
                    <v-row>
                        <v-col cols="12" v-if="loading && pokemon.data.length === 0" class="mt-3">
                            <v-progress-linear :indeterminate="true"></v-progress-linear>
                        </v-col>
                        <v-col cols="12" v-else-if="pokemon.data.length === 0"
                               class="red--text text-center headline mt-3">
                            No Pokemon Found
                        </v-col>
                        <v-col cols="12" v-else-if="pokemon.last_page > 1">
                            <v-pagination v-model="options.page" :length="pokemon.last_page"
                                          total-visible="6"></v-pagination>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="item in pokemon.data" :key="item.id"
                               @click="overlay = item">
                            <v-card
                                elevation="2"
                                :loading="loading"
                            >
                                <v-img
                                    :src="item.image_url_gif"
                                    height="200px"
                                    contain
                                    class="ma-2"
                                ></v-img>
                                <v-card-title class="text-center">{{ item.name }}</v-card-title>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-card-text>

        <v-overlay v-if="overlay !== null">
            <v-card
                class="mx-auto"
                outlined
            >
                <v-list-item three-line>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            {{  overlay.name }}
                        </v-list-item-title>
                        {{ overlay.description}}
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                    >
                        <v-img :src="overlay.image_url_gif"></v-img>
                    </v-list-item-avatar>
                </v-list-item>
                <v-card-text>
                    Type: {{ overlay.type_one.name }} <br/>
                    Subtype: {{ overlay.type_two !== null ? overlay.type_two.name : 'None'}} <br/>
                    Hitpoints: {{ overlay.hit_points }} <br/>
                    Attack: {{ overlay.attack }} <br/>
                    Defense: {{ overlay.defense }} <br/>
                    Speed: {{ overlay.speed }} <br/>
                    Special: {{ overlay.special }}
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        text
                        @click="overlay = null"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-overlay>
    </v-card>
</template>

<style>
.checkbox-no-gap .v-input--selection-controls__input {
    margin-right: 0;
}
</style>

<script>
export default {
    data() {
        return {
            loading: true,
            pokemon: {
                data: [],
            },
            options: {
                search: '',
                page: 1,
                type_one: [],
                type_two: [],
            },
            types: [],
            filters: [],
            overlay: null,
        }
    },

    methods: {
        show(id) {
            alert(id);
        }
    },

    beforeMount() {
        let $this = this;

        $this.$axios.get('api/pokemon/type')
            .then((response) => {
                if (response.data.success === true) {
                    $this.types = response.data.data;
                }
            });
        $this.$axios.get('api/pokemon/filters')
            .then((response) => {
                if (response.data.success === true) {
                    $this.filters = response.data.data;
                    Object.keys($this.filters).forEach(key => {
                        $this.options[key] = [
                            $this.filters[key]['min'],
                            $this.filters[key]['max'],
                        ];
                    });
                }
            });

        $this.fetchData();
    },

    beforeCreate() {
        let $this = this;

        $this.loading = true;
        $this.fetchData = $this.$lodash.debounce(() => {
            $this.loading = true;

            $this.$axios.get('api/pokemon', {params: $this.options})
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
        options: {
            handler: 'fetchData',
            deep: true
        }
    },

}
</script>
