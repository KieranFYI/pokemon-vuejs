<template>
  <v-row align="center" justify="center" id="error">
    <v-col cols="10" sm="8" md="4">
      <v-card>
        <v-card-title class="red darken-3 white--text subheading" primary-title>
          <span class="title">Error: 404</span>
        </v-card-title>
        <v-card-text class="mt-3">
          The page you are trying to find is missing.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text class="red darken-3 white--text" :to="{ name: 'home' }">Home</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style>
#error {
  margin-top: 50px;
}

@media (min-width: 800px) {
  #error {
    margin-top: 150px;
  }
}
</style>

<script>

</script>
