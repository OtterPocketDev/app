<template>
  <div>
    <input type="file" ref="file" @change="selectFile" hidden />

    <v-btn
      fixed
      fab
      small
      v-if="!$vuetify.breakpoint.lgAndUp && !drawer"
      @click="drawer = true"
      class="mt-2 mx-2"
      ><v-icon small> mdi-menu</v-icon></v-btn
    >
    <v-navigation-drawer v-model="drawer" fixed>
      <v-list-item>
        <v-list-item-avatar v-html="avatar"> </v-list-item-avatar>

        <v-list-item-title>
          <a :href="`https://polygonscan.com/address/${web3Data.address}`">{{
            web3Data.address
          }}</a></v-list-item-title
        >

        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <v-btn
        color="success"
        style="width: 80%; margin: 1em 1em;"
        @click="loadFile"
      >
        <v-icon>mdi-upload</v-icon> Upload
      </v-btn>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            <v-img
              v-if="item.image"
              :src="item.image"
              style="max-width: 25px;"
            ></v-img>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <a href="https://otterpocket.io">
          <v-img
            style="max-width: 10em; margin: 0 auto; border-radius: 1em;"
            src="https://otterpocket.mypinata.cloud/ipfs/QmZ69cbn7XfakmSm3AX4g6Gf7BDhaGoaFsyn6wAYLx5Nd6"
          ></v-img
        ></a>

        <div class="pa-6">
          <v-btn block @click="$emit('logout')">
            Switch Wallet
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.lgAndUp"
      :mini-variant.sync="mini"
      permanent
      fixed
      class="side-bar"
      color="white"
    >
      <v-list-item class="px-2">
        <v-list-item-avatar v-html="avatar"> </v-list-item-avatar>

        <v-list-item-title
          ><a :href="`https://polygonscan.com/address/${web3Data.address}`">{{
            web3Data.address
          }}</a></v-list-item-title
        >

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <v-btn
        color="success"
        style="width: 80%; margin: 1em 1em;"
        v-if="!mini"
        @click="loadFile"
      >
        <v-icon>mdi-upload</v-icon> Upload
      </v-btn>

      <v-list dense>
        <v-list-item link v-if="mini">
          <v-list-item-icon>
            <v-icon color="success">mdi-upload</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :href="item.link"
        >
          <v-list-item-icon>
            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            <v-img
              v-if="item.image"
              :src="item.image"
              style="max-width: 25px;"
            ></v-img>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <template v-slot:append>
        <a href="https://otterpocket.io">
          <v-img
            style="max-width: 10em; margin: 1em auto; border-radius: 1em;"
            src="https://otterpocket.mypinata.cloud/ipfs/QmZ69cbn7XfakmSm3AX4g6Gf7BDhaGoaFsyn6wAYLx5Nd6"
          ></v-img
        ></a>

        <div class="pa-6" v-if="!mini">
          <v-btn block @click="$emit('logout')">
            Switch Wallet
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-overlay :value="showUploadOverlay" opacity="0.2">
      <v-card
        v-if="readyToUpload"
        color="transparent"
        style="  transition: 1s;"
        :class="{ animate: animateCard }"
      >
        <v-sheet
          height="15em"
          style=" background-color: rgba(240, 248, 255, .5);  
 backdrop-filter: blur(5px); "
        >
          <v-toolbar
            light
            style=" background-color: rgba(240, 248, 255, .5);  
 backdrop-filter: blur(5px); "
          >
            <v-toolbar-title>{{ fileLoaded.name }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="showUploadOverlay = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list color="transparent">
            <v-list-item style="color: black;">
              Type: {{ fileLoaded.type }}
            </v-list-item>
            <v-list-item style="color: black;">
              Size: {{ formatSize(fileLoaded.size) }}
            </v-list-item>
          </v-list>
        </v-sheet>
        <v-card-actions
          ><v-btn color="success" @click="upload" width="100%"
            >UPLOAD <v-icon>mdi-icon</v-icon>
          </v-btn></v-card-actions
        >
      </v-card>
    </v-overlay>
    <v-snackbar v-model="fileUploadSuccess" color="green" outlined>
      <v-icon>mdi-check</v-icon>
      File Successfully Uploaded!
      <v-btn color="black" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="loadingApproval" color="alert" outlined timeout="-1">
      <v-icon>mdi-table-arrow-up</v-icon>
      Waiting for approval transaction...
      <v-btn color="black" text v-if="approvalTX">
        <a :href="`https://polygonscan.com/tx/${approvalTX}`">TX</a>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="loadingToIpfs" color="alert" outlined timeout="-1">
      <v-icon>mdi-cloud-upload-outline</v-icon>
      Uploading to IPFS network...
    </v-snackbar>
    <v-snackbar
      v-model="loadingToBlockchain"
      color="alert"
      outlined
      timeout="-1"
    >
      <v-icon>mdi-table-arrow-up</v-icon>
      Waiting for blockhain transaction...

      <v-btn color="black" text v-if="blockchainTX">
        <a :href="`https://polygonscan.com/tx/${blockchainTX}`">TX</a>
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import avatar from "animal-avatar-generator";
import FileUploadService from "../../utilities/uploadService";
import FormatSize from "../../utilities/formatSize";
export default {
  props: {
    web3Data: {
      type: Object,
    },
  },
  data() {
    return {
      gasPrice: 20,
      drawer: false,
      animateCard: false,
      readyToUpload: false,
      loadingToBuffer: false,
      loadingApproval: false,
      approvalTX: "",
      loadingToIpfs: false,
      loadingToBlockchain: false,
      blockchainTX: "",
      fileUploadSuccess: false,
      showUploadOverlay: false,
      fileLoaded: {},
      folderLoaded: {},
      items: [
        {
          title: `${this.web3Data.maticBalance} Matic`,
          icon: "",
          image:
            "https://otterpocket.mypinata.cloud/ipfs/Qmer6oGSe9SC42NHpV4HkvVWPFG8m89RhtLPRMZoievKKc",
          link: "https://www.binance.com/en/buy-Polygon-Matic",
        },
        {
          title: `${this.web3Data.otterBalance} Otter`,
          icon: "",
          image:
            "https://otterpocket.mypinata.cloud/ipfs/QmY1JQjFyudsNBTwm6meyBCY2kbuf6ChcdkSpLnqQoLLfJ",
          link:
            "https://quickswap.exchange/#/swap?outputCurrency=0xe718eda678aff3f8d1592e784652bcbeeb49e352",
        },
        {
          title: `Fee: ${this.web3Data.uploadFee} Otter`,
          icon: "mdi-cloud-upload",
          link: "https://otterpocket.io",
        },
        {
          title: `Otter Price: ${this.web3Data.otterPrice}`,
          icon: "mdi-currency-usd",
          link:
            "https://dex.guru/token/0xe718eda678aff3f8d1592e784652bcbeeb49e352-polygon/",
        },
      ],
      mini: true,
    };
  },
  computed: {
    avatar() {
      return avatar(this.web3Data.address, { size: 200 });
    },
  },
  methods: {
    formatSize(size) {
      return FormatSize(size);
    },
    selectFile(event) {
      this.showUploadOverlay = true;
      this.fileLoaded = event.target.files[0];
      this.readyToUpload = true;
    },
    loadFile() {
      this.mini = !this.mini;
      let fileInputElement = this.$refs.file;
      fileInputElement.click();
    },
    async upload() {
      this.animateCard = true;
      fetch("https://gasstation-mainnet.matic.network")
        .then((response) => response.json())
        .then((json) => (this.gasPrice = json.fastest));
      this.loadingApproval = true;
      await this.approveSpending();
      this.showUploadOverlay = false;

      this.loadingApproval = false;
      this.loadingToIpfs = true;
      let ipfsResponse = await FileUploadService.uploadFile(this.fileLoaded);

      this.loadingToIpfs = false;
      const fileToBlockchain = {
        hash: ipfsResponse.data.IpfsHash,
        size: ipfsResponse.data.PinSize,
        type: this.fileLoaded.type,
        name: this.fileLoaded.name,
        description: "Unused field",
      };
      this.loadingToBlockchain = true;

      await this.uploadToBlockchain(fileToBlockchain);

      this.loadingToBlockchain = false;
    },

    async uploadToBlockchain(file) {
      await this.web3Data.otterPocketContract.methods
        .uploadFile(
          file.hash,
          file.size,
          file.type,
          file.name,
          file.description
        )
        .send({
          from: this.web3Data.address,
          gasPrice: this.web3Data.web3.utils.toBN(this.gasPrice * 10 ** 9),
        })
        .once("transactionHash", function(hash) {
          console.log("Approval tx Hash:", hash);
          this.blockchainTX = hash;
        })
        .once("receipt", (receipt) => {
          console.log("Approval Receipt:", receipt);
          this.fileUploadSuccess = true;

          window.location.reload();
          return;
        })
        .on("error", (e) => {
          window.alert("Error", e);
        });
    },
    async approveSpending() {
      await this.web3Data.otterContract.methods
        .increaseAllowance(
          "0x501C5074bEd28987d50ce493018d7ccdE6B7C2d9",
          this.web3Data.web3.utils.toBN(this.web3Data.uploadFee * 10 ** 18)
        )
        .send({
          from: this.web3Data.address,
          gasPrice: this.web3Data.web3.utils.toBN(this.gasPrice * 10 ** 9),
        })
        .once("transactionHash", function(hash) {
          this.approvalTX = hash;
          console.log("Approval tx Hash:", this.approvalTX);
        })
        .once("receipt", (receipt) => {
          console.log("Approval Receipt:", receipt);

          return;
        })
        .on("error", (error) => {
          console.log("Error:", error);
        });
    },
  },
};
</script>
<style scoped>
.side-bar {
  height: 100vh !important;
}
a {
  text-decoration: none;
  color: inherit !important;
}
.animate {
  transform: translatey(-50em);
}
</style>
