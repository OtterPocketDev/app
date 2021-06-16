<template>
  <div>
    <Loader />
    <div class="wrapper">
      <div class="content-page">
        <transition name="router-anim">
          <router-view />
        </transition>
      </div>
    </div>
    <FooterStyle />
  </div>
</template>
<script>
import Loader from "@/components/loader/Loader";
import FooterStyle from "@/components/partials/backend/FooterStyle/FooterStyle";
import { core } from "@/config/pluginInit";
export default {
  name: "Layout-2",
  components: {
    FooterStyle,
    Loader,
  },
  mounted() {
    document.body.classList = "";
    setTimeout(() => {
      core.verticalImagePopup();
    }, 2000);
  },
  destroyed() {
    document.body.classList = "";
  },
};
</script>
<style></style>
