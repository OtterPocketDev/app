<template>
  <div class="iq-sidebar  sidebar-default ">
    <div
      class="iq-sidebar-logo d-flex align-items-center justify-content-between"
    >
      <router-link :to="{ name: 'layout.dashboard1' }" class="header-logo">
        <img :src="logo" class="img-fluid rounded-normal" alt="logo" />
      </router-link>
      <div class="iq-menu-bt-sidebar">
        <i class="las la-bars wrapper-menu"></i>
      </div>
    </div>
    <div class="data-scrollbar" data-scroll="1" id="sidebar-scrollbar">
      <div
        class="new-create select-dropdown input-prepend input-append"
        v-sidebar-toggle
      >
        <div class="btn-group">
          <label class="iq-user-toggle">
            <div class="upload">
              Upload
            </div>
            <span class="search-replace"></span>
            <span class="caret"><!--icon--></span>
          </label>
        </div>
      </div>
      <nav class="iq-sidebar-menu">
        <CollapseMenu :items="sidebarItems" :open="true" />
      </nav>
      <div class="sidebar-bottom">
        <a href="#" class="btn btn-outline-primary view-more mt-4">Buy Otter</a>
      </div>
      <div class="p-3"></div>
    </div>
  </div>
</template>
<script>
import CollapseMenu from "@/components/menustyle/CollapseMenu";
import sideBarItem from "@/JsonData/sidebar.json";
import { mapGetters } from "vuex";
import { core } from "@/config/pluginInit";
export default {
  name: "SidebarStyle",
  data() {
    return {
      homeurl: "",
      sidebarItems: sideBarItem,
    };
  },
  mounted() {
    core.SmoothScrollbar();
    core.changesidebar();
  },
  destroyed() {
    core.SmoothScrollbar();
    core.changesidebar();
  },
  components: {
    CollapseMenu,
  },
  computed: {
    ...mapGetters({
      appName: "appName",
      logo: "logo",
    }),
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.upload {
  margin-left: 1em;
  padding: 1em 3em;
  border-radius: 1em;
  color: white;
  background-size: 300% 100%;
  transition: all 0.4s ease-in-out;
  cursor: pointer;
  text-align: center;
  background-image: linear-gradient(
    to right,
    #198edc,
    #63c0fd,
    #80beee,
    #75d3ff
  );
  &:hover {
    background-position: 100% 0;
  }
}
</style>
