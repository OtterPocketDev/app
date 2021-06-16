<template>
  <footer class="iq-footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6">
          Otter Team - 2021
        </div>
        <div class="col-lg-6 text-right">
          Dapp Hosted on IPFS
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Footer",
  prop: {},
  computed: {
    ...mapGetters({
      appName: "appName",
    }),
  },
};
</script>
