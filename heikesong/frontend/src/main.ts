import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { assetPath } from "./utils/asset";
import { initAppSettings } from "./utils/settings";
import "./styles.css";

initAppSettings();

function cssAssetUrl(path: string) {
  return `url("${new URL(assetPath(path), window.location.href).href}")`;
}

document.documentElement.style.setProperty(
  "--asset-bg-vintage",
  cssAssetUrl("images/bg-vintage.jpg"),
);
document.documentElement.style.setProperty(
  "--asset-border-frame",
  cssAssetUrl("images/border-frame.png"),
);

createApp(App).use(router).mount("#app");
