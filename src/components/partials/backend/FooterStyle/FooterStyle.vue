<template>
  <footer class="iq-footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6 text-right">
          <h6>Otter Pocket © 2021 | Hosted on IPFS</h6>
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
