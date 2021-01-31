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

      <span>
        LinkedIns:
      </span>
      <v-btn
        href="https://www.linkedin.com/in/jonathanotsamuel"
        target="_blank"
        text
      >
        <span class="mr-2">Jonathan Samuel</span>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
        href="https://www.linkedin.com/in/arvind-balaji-445675186"
        target="_blank"
        text
      >
        <span class="mr-2">Arvind Balaji</span>
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
