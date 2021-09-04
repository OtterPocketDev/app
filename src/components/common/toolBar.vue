<template>
  <v-toolbar flat color="transparent">
    <a href="https://otterpocket.io" v-if="!connectedToWeb3">
      <v-img
        style="max-width: 3em;"
        src="https://otterpocket.mypinata.cloud/ipfs/QmY1JQjFyudsNBTwm6meyBCY2kbuf6ChcdkSpLnqQoLLfJ"
      ></v-img
    ></a>

    <v-spacer></v-spacer>
    <v-text-field
      v-model="searchParam"
      append-icon="mdi-magnify"
      label="Search by name"
      solo
      hide-details
      style="max-width: 200px;"
    ></v-text-field>
    <v-spacer></v-spacer>
    <v-btn v-if="!metaMaskInstalled" href="https://metamask.io/">
      <v-icon color="error">mdi-cloud-download-outline</v-icon>
      <div style="color:#ff5252;">Metamask</div>
    </v-btn>
    <v-btn
      v-if="!connectedToWeb3 && metaMaskInstalled"
      @click="$emit('connect')"
      :icon="!$vuetify.breakpoint.lgAndUp"
    >
      <v-icon left color="error">mdi-login-variant</v-icon>
      <div style="color:#ff5252;" v-if="$vuetify.breakpoint.lgAndUp">
        Connect
      </div>
    </v-btn>
    <v-btn
      v-if="connectedToWeb3 && onPolygonNetwork"
      :icon="!$vuetify.breakpoint.lgAndUp"
    >
      <v-icon medium color="success" left
        >mdi-checkbox-marked-circle-outline</v-icon
      >
      <div style="color:#4caf50;" v-if="$vuetify.breakpoint.lgAndUp">
        Connected
      </div>
    </v-btn>
    <v-btn
      v-if="connectedToWeb3 && metaMaskInstalled && !onPolygonNetwork"
      color="error"
    >
      <v-icon medium left>mdi-network-strength-4-alert</v-icon>
      <div>Wrong Network</div>
    </v-btn>
  </v-toolbar>
</template>
<script>
export default {
  props: {
    connectedToWeb3: {
      type: Boolean,
      default: false,
    },
    metaMaskInstalled: {
      type: Boolean,
      default: false,
    },
    onPolygonNetwork: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchParam: "",
    };
  },
  watch: {
    searchParam() {
      this.$emit("search", this.searchParam);
    },
  },
};
</script>
<style scoped></style>
