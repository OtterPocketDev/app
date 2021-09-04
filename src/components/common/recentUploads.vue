<template>
  <div>
    <h3>Recent Uploads</h3>
    <v-card
      v-if="!connectedToWeb3"
      height="15em"
      style=" background-color: rgba(240, 248, 255, .5);  
 backdrop-filter: blur(5px); "
    >
      <div style="padding: 2em 2em;">
        <h3>Connect Metamask to access your files.</h3>
      </div>
    </v-card>
    <v-card
      v-if="connectedToWeb3 && !onPolygonNetwork"
      height="15em"
      style=" background-color: rgba(240, 248, 255, .5);  
 backdrop-filter: blur(5px); "
    >
      <div style="padding: 2em 2em;">
        <h3>Please connect to the Polygon Network</h3>
      </div>
    </v-card>
    <vue-horizontal
      responsive
      class="slider"
      v-if="connectedToWeb3 && loadingFiles && onPolygonNetwork"
    >
      <section v-for="index in 10" :key="index">
        <v-skeleton-loader
          class="mx-auto"
          height="15em"
          max-width="300"
          type="card"
        ></v-skeleton-loader>
      </section>
    </vue-horizontal>
    <v-overlay :value="showViewer" opacity="0">
      <FileModal :card="cardInViewer" @close="showViewer = false" />
    </v-overlay>
    <vue-horizontal
      responsive
      class="slider"
      v-if="connectedToWeb3 && !loadingFiles && onPolygonNetwork"
      style="min-height: 12em;"
    >
      <section v-for="card in computedCards" :key="card.id">
        <v-card class="file-card" color="transparent">
          <v-img
            v-if="card.type == 'image'"
            :src="card.link"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="150px"
            @click="loadViewer(card)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="blue lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
            <v-card-title>
              <p
                class="mt-4"
                style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis; "
              >
                {{ card.name }}
              </p></v-card-title
            >
          </v-img>
          <VueVideoThumbnail
            v-if="card.type == 'video'"
            :video-src="card.link"
            :snapshot-at-duration-percent="1"
            :chunks-quantity="20"
            :snapshotQuality="1"
          >
            <template #snapshot="{snapshot}">
              <v-img
                v-if="card.type == 'video'"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="150px"
                :src="snapshot"
                style="text-align:center;"
                @click="loadViewer(card)"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="blue lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
                <v-btn bottom dark color="transparent" fab style="top: 2.5em;">
                  <v-icon dark style="margin: 0 auto;">mdi-play</v-icon>
                </v-btn>

                <v-card-title>
                  <p
                    class="mt-4"
                    style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis; "
                  >
                    {{ card.name }}
                  </p>
                </v-card-title>
              </v-img>
            </template>
          </VueVideoThumbnail>

          <v-sheet
            height="150px"
            color="#DCDCDC"
            v-if="card.type == 'doc'"
            style="text-align: center;"
            @click="loadViewer(card)"
          >
            <v-icon large center style="top: 1em;"> mdi-file-document </v-icon>
            <v-card-title>
              <p
                class=""
                style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis; margin-top: 2em;"
              >
                {{ card.name }}
              </p>
            </v-card-title>
          </v-sheet>
          <v-sheet
            height="150px"
            color="#DCDCDC"
            v-if="card.type == 'app'"
            style="text-align: center;"
            @click="loadViewer(card)"
          >
            <v-icon large center style="top: 1em;">
              mdi-application
            </v-icon>
            <v-card-title>
              <p
                class=""
                style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis; margin-top: 2em;"
              >
                {{ card.name }}
              </p>
            </v-card-title>
          </v-sheet>
          <v-sheet
            height="150px"
            color="#DCDCDC"
            v-if="card.type == 'audio'"
            style="text-align: center;"
            @click="loadViewer(card)"
          >
            <v-icon large center style="top: 1em;">
              mdi-music
            </v-icon>
            <v-card-title>
              <p
                class=""
                style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis; margin-top: 2em;"
              >
                {{ card.name }}
              </p>
            </v-card-title>
          </v-sheet>
          <v-card-actions style="background: transparent;">
            <v-icon v-if="card.type == 'video'" @click="loadViewer(card)"
              >mdi-movie</v-icon
            >
            <v-icon v-else-if="card.type == 'image'" @click="loadViewer(card)"
              >mdi-camera</v-icon
            >
            <v-icon v-else-if="card.type == 'doc'" @click="loadViewer(card)"
              >mdi-file-document</v-icon
            >
            <v-icon v-else-if="card.type == 'app'" @click="loadViewer(card)"
              >mdi-application</v-icon
            >
            <v-icon v-else-if="card.type == 'audio'" @click="loadViewer(card)"
              >mdi-music</v-icon
            >

            <v-spacer></v-spacer>

            <v-btn
              icon
              v-clipboard:copy="card.link"
              v-clipboard:success="copied"
            >
              <v-icon color="success">mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </section>
    </vue-horizontal>
    <v-snackbar v-model="snackbar" color="green">
      <v-icon>mdi-check</v-icon>
      Copied!

      <template v-slot:action="{ attrs }">
        <v-btn color="black" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import VueHorizontal from "vue-horizontal";
import VueVideoThumbnail from "vue-video-thumbnail";

import FileModal from "../common/fileModal.vue";
export default {
  components: {
    VueHorizontal,
    VueVideoThumbnail,
    FileModal,
  },
  props: {
    cards: {
      type: Array,
    },
    connectedToWeb3: {
      type: Boolean,
      default: false,
    },
    onPolygonNetwork: {
      type: Boolean,
      default: false,
    },
    loadingFiles: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
  data() {
    return {
      snapshots: [],
      cardInViewer: {},
      showViewer: false,
      snackbar: false,
    };
  },
  methods: {
    copied() {
      this.snackbar = true;
    },
    loadViewer(card) {
      this.showViewer = true;
      this.cardInViewer = card;
    },
  },
  computed: {
    computedCards() {
      return this.cards;
    },
  },
};
</script>
<style scoped>
.file-card {
  transition: all 0.2s ease-in-out;
}
.file-card:hover {
  cursor: pointer;
  transform: scale(1) translate(0, 15px);
}
.slider >>> .v-hl-container {
  clip-path: none !important;
}
</style>
