import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#303b3f",
        secondary: "#b2f202",
        accent: "#998542",
        error: "#3C0000",
        success: "#5B6236"
      }
    }
  }
});
