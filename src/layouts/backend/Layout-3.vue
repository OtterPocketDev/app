<template>
  <div>
     <Loader/>
    <div class="wrapper">
      <SidebarStyle3/>
      <HeaderStyle3/>
      <div class="content-page">
        <transition name="router-anim">
          <router-view/>
        </transition>
      </div>
    </div>
    <FooterStyle />
  </div>
</template>
<script>
import Loader from '@/components/loader/Loader'
import SidebarStyle3 from "@/components/partials/backend/SidebarStyle/SidebarStyle3";
import HeaderStyle3 from "@/components/partials/backend/HeaderStyle/HeaderStyle3";
import FooterStyle from "@/components/partials/backend/FooterStyle/FooterStyle";
export default {
  name: 'Layout-3',
  components: {
    HeaderStyle3,
    FooterStyle,
    SidebarStyle3,
    Loader
  },
  mounted(){
    document.body.classList='fixed-top-navbar'
  },
  destroyed () {
    document.body.classList='fixed-top-navbar'
  }
}
</script>
<style>
</style>
