<template class="main-wrapper">
  <div>
    <SideBar
      v-if="web3DataLoaded && onPolygonNetwork"
      :web3Data="web3Data"
      @logout="logout"
      @fileUploaded="loadFiles"
    />

    <v-card
      style="justify-self: center; min-height: 100vh; overflow: hidden;"
      class="main-wrapper"
    >
      <ToolBar
        :connectedToWeb3="connectedToWeb3"
        :metaMaskInstalled="metaMaskInstalled"
        :onPolygonNetwork="onPolygonNetwork"
        @connect="connectToMetamask"
        @search="filterEvent"
      />
      <v-container>
        <RecentUploads
          :cards="recentUploads"
          :connectedToWeb3="connectedToWeb3"
          :loadingFiles="loadingFiles"
          :onPolygonNetwork="onPolygonNetwork"
        />
        <div class="quick-access">
          <h3 style="margin-bottom: 1em;">Quick Access</h3>
          <div class="items">
            <v-btn
              rounded
              v-for="button in quickAccessButtons"
              fab
              x-large
              :key="button.name"
              :color="activeButton == button.name ? '#46cdfd' : 'transparent'"
              @click="setActiveQuickAccess(button)"
              ><v-icon
                :color="activeButton == button.name ? 'white' : '#46cdfd'"
                >{{ button.icon }}</v-icon
              ></v-btn
            >
          </div>
        </div>
        <AllFiles :files="filteredFiles" />
      </v-container>
    </v-card>
  </div>
</template>

<script>
import ToolBar from "./common/toolBar.vue";
import SideBar from "./common/sideBar.vue";
import RecentUploads from "./common/recentUploads.vue";
import File from "../interfaces/fileInterface";
import FileType from "../enums/fileEnums";
import OtterContract from "../abi/Otter.json";
import MaticContract from "../abi/Matic.json";
import PocketContract from "../abi/Pocket.json";
import AllFiles from "./common/allFiles.vue";
import Web3 from "web3";

export default {
  components: {
    ToolBar,
    SideBar,
    RecentUploads,
    AllFiles,
  },
  data() {
    return {
      loadingFiles: false,
      metaMaskInstalled: false,
      connectedToWeb3: false,
      searchParam: "",
      onPolygonNetwork: false,
      web3Data: {
        web3: null,
        address: "",
        network: null,
        maticBalance: null,
        otterBalance: null,
        otterContract: null,
        maticContract: null,
        usdcContract: null,
        otterPocketContract: null,
        uploadFee: null,
        otterPrice: 0,
      },
      web3DataLoaded: false,
      activeButton: null,
      quickAccessButtons: [
        { name: "image", icon: "mdi-image" },
        { name: "video", icon: "mdi-movie" },
        { name: "audio", icon: "mdi-music" },
        { name: "doc", icon: "mdi-file-document" },
        { name: "app", icon: "mdi-application" },
      ],
      files: [],
      filteredFiles: [],
    };
  },
  async mounted() {
    this.metaMaskInstalled = this.isMetaMaskInstalled();
    if (this.metaMaskInstalled && window.ethereum.isConnected()) {
      await this.connectToMetamask();
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
      window.ethereum.on("disconnect", (error) => {
        console.log("Blockchain network connectivity error: ", error);
      });
    }
  },
  methods: {
    async logout() {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    },
    isMetaMaskInstalled() {
      //Have to check the ethereum binding on the window object to see if it's installed
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    },
    filterEvent(search) {
      this.searchParam = search;
      this.filterFiles();
    },
    async connectToMetamask() {
      try {
        const { ethereum } = window;

        await ethereum.request({ method: "eth_requestAccounts" });
        this.loadWeb3();
      } catch (error) {
        console.error("Could not connect:", error);
        window.location.reload();
      }
    },
    async loadWeb3() {
      this.web3Data.web3 = new Web3(window.web3.currentProvider);

      this.web3Data.network = await this.web3Data.web3.eth.net.getId();
      console.log(this.web3Data.network, "-Network");
      if (this.web3Data.network == 137) {
        this.onPolygonNetwork = true;
      }

      this.web3Data.address = await this.web3Data.web3.eth.getAccounts();
      this.web3Data.address = this.web3Data.address[0];

      this.web3Data.maticBalance = this.web3Data.web3.utils.fromWei(
        await this.web3Data.web3.eth.getBalance(this.web3Data.address),
        "ether"
      );
      console.log("Connected:", this.web3Data.address);

      this.web3Data.maticBalance = this.web3Data.maticBalance.toString();
      this.web3Data.maticBalance = this.web3Data.maticBalance.substring(0, 5);
      this.web3Data.otterContract = new this.web3Data.web3.eth.Contract(
        OtterContract,
        "0xE718EDA678AFF3F8d1592e784652BcbEeb49e352"
      );
      this.web3Data.maticContract = new this.web3Data.web3.eth.Contract(
        MaticContract,
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
      );
      this.web3Data.usdcContract = new this.web3Data.web3.eth.Contract(
        MaticContract,
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      );
      this.web3Data.otterPocketContract = new this.web3Data.web3.eth.Contract(
        PocketContract,
        "0x501C5074bEd28987d50ce493018d7ccdE6B7C2d9"
      );
      await this.getOtterBalance();
      await this.getOtterPrice();
      this.connectedToWeb3 = true;

      this.web3DataLoaded = true;
      await this.loadFiles();
    },
    setActiveQuickAccess(button) {
      if (this.activeButton == button.name) {
        this.activeButton = null;
      } else {
        this.activeButton = button.name;
      }
      this.filterFiles();
      console.log("ACTIVE BUTTON:", this.activeButton);
    },
    async getOtterPrice() {
      if (this.onPolygonNetwork) {
        const maticInLP = this.web3Data.web3.utils.fromWei(
          await this.web3Data.maticContract.methods
            .balanceOf("0x34Ce4379CF8E06c0c72467364043d28cCBaAC46B")
            .call(),
          "ether"
        );
        const otterInLP = this.web3Data.web3.utils.fromWei(
          await this.web3Data.otterContract.methods
            .balanceOf("0x34Ce4379CF8E06c0c72467364043d28cCBaAC46B")
            .call(),
          "ether"
        );
        const maticPrice = await this.getMaticPrice();
        const OtterPriceInMatic = maticInLP / otterInLP;
        console.log(maticPrice, OtterPriceInMatic);
        this.web3Data.otterPrice = OtterPriceInMatic * maticPrice;
        this.web3Data.otterPrice = this.web3Data.otterPrice.toString();
        this.web3Data.otterPrice = this.web3Data.otterPrice.substring(0, 5);
      }
    },
    async getMaticPrice() {
      const maticInLP = this.web3Data.web3.utils.fromWei(
        await this.web3Data.maticContract.methods
          .balanceOf("0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827")
          .call(),
        "ether"
      );
      const usdcInLP = this.web3Data.web3.utils.fromWei(
        await this.web3Data.usdcContract.methods
          .balanceOf("0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827")
          .call(),
        "ether"
      );
      let maticPrice = usdcInLP / maticInLP;
      maticPrice = maticPrice.toString();
      maticPrice = maticPrice.substring(0, 5);
      maticPrice = parseFloat(maticPrice);

      return maticPrice;
    },
    async getOtterBalance() {
      if (this.web3Data.network == 137) {
        this.web3Data.otterBalance = this.web3Data.web3.utils.fromWei(
          await this.web3Data.otterContract.methods
            .balanceOf(this.web3Data.address)
            .call(),
          "ether"
        );
        this.web3Data.otterBalance = this.web3Data.otterBalance.toString();
        this.web3Data.otterBalance = this.web3Data.otterBalance.substring(0, 5);
        this.web3Data.uploadFee = await this.web3Data.otterPocketContract.methods
          .fee()
          .call();
      }
    },
    async loadFiles() {
      if (this.web3Data.network == 137) {
        this.loadingFiles = true;
        const fileCount = await this.web3Data.otterPocketContract.methods
          .users(this.web3Data.address)
          .call();

        // Load files&sort by the newest

        for (var i = fileCount; i >= 1; i--) {
          let response;
          try {
            response = await this.web3Data.otterPocketContract.methods
              .getFile(this.web3Data.address, i)
              .call();
          } catch {
            console.log("Error fetching file from smart contract");
            continue;
          }

          let file = {
            id: response[0][0],
            size: Number(response[0][1]),
            timestamp: response[0][2],
            hash: response[1][0],
            type: response[1][1],
            name: response[1][2],
            description: response[1][3],
          };
          const imageCondtions = [
            "jpeg",
            "png",
            "jpg",
            "gif",
            "tiff",
            "svg",
            "icon",
            "webp",
            "bmp",
          ];
          const docConditions = [
            "msword",
            "document",
            "epub",
            "html",
            "pdf",
            "plain",
          ];
          const videoConditions = ["webm", "video"];
          const audioConditions = ["audio", ""];
          const appConditions = ["executable", "octet-stream"];

          if (imageCondtions.some((el) => file.type.includes(el))) {
            file.type = FileType.IMAGE;
          } else if (docConditions.some((el) => file.type.includes(el))) {
            file.type = FileType.DOC;
          } else if (videoConditions.some((el) => file.type.includes(el))) {
            file.type = FileType.VIDEO;
          } else if (audioConditions.some((el) => file.type.includes(el))) {
            file.type = FileType.AUDIO;
          } else if (appConditions.some((el) => file.type.includes(el))) {
            file.type = FileType.APP;
          } else {
            file.type = FileType.APP;
          }
          let baseLink = `https://otterpocket.mypinata.cloud/ipfs/${file.hash}`;
          file.timestamp = parseInt(file.timestamp);
          file.timestamp = new Date(file.timestamp * 1000);
          file.timestamp = file.timestamp.toLocaleString();
          let newFile = new File(
            file.id,
            file.name,
            file.size,
            file.timestamp,
            file.type,
            file.hash,
            baseLink
          );
          this.files.push(newFile);
          this.filteredFiles.push(newFile);
        }
        this.loadingFiles = false;
      }
    },
    filterFiles() {
      if (this.activeButton) {
        this.filteredFiles = this.files.filter((file) => {
          return file.type == this.activeButton;
        });
      } else if (this.searchParam) {
        this.filteredFiles = this.files.filter((file) => {
          return file.name.includes(this.searchParam);
        });
      } else this.filteredFiles = this.files;
    },
  },
  computed: {
    recentUploads() {
      return this.files.slice(0, 10);
    },
  },
};
</script>
<style scoped>
.main-wrapper {
  background-color: #d6d6d6;
  background-image: linear-gradient(270deg, #cdf3ff 0%, #ffffff 100%);
}
.quick-access {
  margin: 3em 0em;
  padding-bottom: 1em;
}
.items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.active-button {
  color: rgb(0, 132, 255);
}
</style>
