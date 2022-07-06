<template>
    <v-row align="center" justify="center" class="fill-height" style="flex-direction: column;">
        <v-col cols="10" sm="8" md="4" style="flex-basis: 0">
            <v-card>
                <v-card-text>
                    <v-file-input
                        :error-messages="errors.file"
                        v-model="fields.file"
                        :disabled="loading"
                        label="File input"
                        outlined
                        dense
                    ></v-file-input>
                    <v-progress-linear :indeterminate="uploadPercentage <= 0 || uploadPercentage >= 100" color="green"
                                       v-if="loading" :value="uploadPercentage"></v-progress-linear>
                </v-card-text>
                <v-card-actions>
                    <v-alert
                        type="info"
                        v-text="message"
                        v-if="showMessage"
                        dense
                    ></v-alert>
                    <v-spacer></v-spacer>
                    <v-btn @click="doImport" color="accent" :disabled="loading" :loading="loading">Import File
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="10" sm="8" md="4">
            <v-card>
                <v-card-text>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th class="text-left">
                                    Filename
                                </th>
                                <th class="text-left">
                                    Status
                                </th>
                                <th class="text-right">
                                    Created
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr
                                v-for="item in imports"
                                :key="item.id"
                            >
                                <td>{{ item.filename_original }}</td>

                                <td v-if="item.finished_at !== null">Finished</td>
                                <td v-else>Processing</td>

                                <td class="text-right">{{ item.created_at_date.toLocaleString() }}</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<style>
</style>

<script>
export default {
    data() {
        return {
            loading: false,
            message: '',
            showMessage: false,
            uploadPercentage: -1,
            fields: {
                file: null
            },
            errors: {
                file: []
            },
            imports: [],
        }
    },
    methods: {
        reset() {
            let $this = this;
            Object.keys($this.errors).forEach(key => {
                $this.errors[key] = []
            });
            $this.showMessage = false;
        },
        doImport() {
            let $this = this;
            $this.reset();
            $this.loading = true;
            $this.$axios.post('imports/pokemon', $this.fields,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: function (progressEvent) {
                        $this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    }
                })
                .catch((error) => {
                    if (!error.response) {
                        return;
                    }
                    Object.keys(error.response.data.errors).forEach(key => {
                        $this.errors[key] = error.response.data.errors[key]
                    });
                })
                .then((response) => {
                    if (response.data.success === true) {
                        $this.message = response.data.message;
                        $this.showMessage = true;
                        $this.fetchData();
                    }
                })
                .finally(() => {
                    $this.fields.file = null;
                    $this.loading = false;
                });

        },
        fetchData() {
            let $this = this;
            $this.$axios.get('imports/pokemon')
                .then((response) => {
                    if (response.data.success === true) {
                        $this.imports = response.data.data.imports;
                        Object.keys($this.imports).forEach(key => {
                            let item = $this.imports[key];
                            item.updated_at_date = new Date(item.updated_at);
                            item.created_at_date = new Date(item.created_at);
                            item.finished_at_date = new Date(item.finished_at);
                        });
                    }
                })
        }
    },
    beforeMount() {
        this.fetchData()
    },
}
</script>
