import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initAppSettings } from "./utils/settings";
import "./styles.css";

initAppSettings();

createApp(App).use(router).mount("#app");
