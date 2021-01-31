<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link to="/"
          ><v-img
            alt="Momentum Logo"
            class="shrink"
            contain
            src="./assets/logo.png"
            transition="scale-transition"
            width="40"
            router
          />
        </router-link>
        <span>
          omentum
        </span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Linkedins</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Map />
    </v-main>
  </v-app>
</template>

<script>
import Map from "./components/Map";

export default {
  name: "App",

  components: {
    Map
  },

  data: () => ({
    //
  }),
  mounted() {
    console.log(this.L);
  }
};
</script>
<style>
html {
  overflow-y: auto;
}
</style>
