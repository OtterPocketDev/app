<template>
  <v-card max-height="50em" style="overflow-x: auto;" color="transparent">
    <v-overlay :value="showViewer" opacity="0.2">
      <FileModal :card="cardInViewer" @close="showViewer = false" />
    </v-overlay>
    <v-list subheader two-line color="transparent">
      <v-list-item v-for="file in files" :key="file.id">
        <v-list-item-avatar @click="loadViewer(file)">
          <v-icon v-if="file.type == 'video'">mdi-movie</v-icon>
          <v-icon v-else-if="file.type == 'image'">mdi-camera</v-icon>
          <v-icon v-else-if="file.type == 'doc'">mdi-file-document</v-icon>
          <v-icon v-else-if="file.type == 'app'">mdi-application</v-icon>
          <v-icon v-else-if="file.type == 'audio'">mdi-music</v-icon>
        </v-list-item-avatar>

        <v-list-item-content @click="loadViewer(file)">
          <v-list-item-title v-text="file.name"></v-list-item-title>
          <v-list-item-subtitle v-text="file.timestamp" />
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon v-clipboard:copy="file.link" v-clipboard:success="copied">
            <v-icon color="green">mdi-share-variant</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-snackbar v-model="snackBar" color="green">
      <v-icon>mdi-check</v-icon>
      Copied!

      <template v-slot:action="{ attrs }">
        <v-btn color="black" text v-bind="attrs" @click="snackBar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
<script>
import FileModal from "../common/fileModal.vue";

export default {
  components: {
    FileModal,
  },
  props: {
    files: [],
  },
  data() {
    return {
      cardInViewer: {},
      snackBar: false,
      showViewer: false,
    };
  },
  methods: {
    copied() {
      this.snackBar = true;
    },
    loadViewer(card) {
      this.showViewer = true;
      this.cardInViewer = card;
    },
  },
};
</script>
<style scoped></style>
