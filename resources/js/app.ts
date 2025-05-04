import { createApp } from "vue";
import App from "./pages/App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import { createPinia } from "pinia";
import { Scripts } from "./app/script";

const vuetify = createVuetify({
    components,
    directives,
});
const pinia = createPinia();

createApp(App)
    .use(vuetify)
    .use(pinia)
    .use(Scripts.Loadings.DefaultLoad.DefaultLoad)
    .mount("#app");
