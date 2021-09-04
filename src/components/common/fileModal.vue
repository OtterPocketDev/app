<template>
  <v-card class="card" light>
    <v-card-title>
      <p
        class="mt-4"
        style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis; "
      >
        {{ card.name }}
      </p>
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" class="mx-2" dark v-bind="attrs" v-on="on">
            Share
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn v-clipboard:copy="card.link" v-clipboard:success="copied"
              >OtterPocket</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn
              v-clipboard:copy="`https://ipfs.infura.io/ipfs/${card.hash}`"
              v-clipboard:success="copied"
              >Infura</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn
              v-clipboard:copy="`https://dweb.link/ipfs/${card.hash}`"
              v-clipboard:success="copied"
              >Dweb.link</v-btn
            >
          </v-list-item>
          <v-list-item
            v-clipboard:copy="`https://ipfs.io/ipfs/${card.hash}`"
            v-clipboard:success="copied"
          >
            <v-btn>IPFS.io</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn @click="download" v-if="card.type == 'app' || card.type == 'doc'"
        ><v-icon>mdi-download</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-icon right bottom @click="$emit('close')">mdi-close</v-icon>
    </v-card-title>
    <d-player
      v-if="card.type == 'video'"
      :options="{ video: { url: card.link } }"
      style="width: 100%; height: 70%;"
    >
    </d-player>
    <v-sheet
      v-if="card.type == 'app'"
      width="100%"
      height="70%"
      color="#A9A9A9"
      style="text-align: center; align-content: center;"
    >
      <v-icon center large style="top:50%;">mdi-application</v-icon>
    </v-sheet>

    <embed
      :src="card.link"
      v-if="card.type == 'doc' || card.type == 'audio'"
      style="width: 100%; height: 70%; background-color:white;"
    />

    <v-img
      v-if="card.type == 'image'"
      :src="card.link"
      class="white--text align-end"
      contain
      style="max-height:70%; max-width: 100%"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="blue lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-card-actions class="actions">
      <div class="card-info">
        <div outlined class="info-chip">Size: {{ formatSize(card.size) }}</div>
        <div outlined class="info-chip">Uploaded: {{ card.timestamp }}</div>
        <div outlined class="info-chip">Type: {{ card.type }}</div>
        <div
          class="info-chip"
          v-clipboard:copy="card.hash"
          v-clipboard:success="copied"
        >
          IPFS CID: {{ card.hash }}
        </div>
      </div>
    </v-card-actions>
    <v-snackbar v-model="snackbar" color="green">
      <v-icon>mdi-check</v-icon>
      Copied!

      <template v-slot:action="{ attrs }">
        <v-btn color="black" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";
import FormatSize from "../../utilities/formatSize";

export default {
  props: {
    card: {},
  },
  components: {
    "d-player": VueDPlayer,
  },
  data() {
    return {
      snackbar: false,
      options: {
        video: {
          url: "",
        },
        autoplay: false,
      },
      player: null,
    };
  },
  mounted() {
    this.options.video.url = this.card.link;
  },
  methods: {
    formatSize(size) {
      return FormatSize(size);
    },
    copied() {
      this.snackbar = true;
    },
    download() {
      window.open(this.card.link, "_blank");
    },
  },
};
</script>
<style scoped>
.card {
  width: 100vw;
  height: 100vh;
  background-color: rgba(240, 248, 255, 0.5);
  backdrop-filter: blur(5px);
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
}

.card-info {
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
}
.info-chip {
  max-width: 100%;
  margin: 0.5em 0.25em;
  border: 1px solid grey;
  border-radius: 1em;
  padding: 0.3em;
}
:hover.info-chip {
  background-color: grey;
}
</style>
