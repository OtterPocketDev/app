<template>
  <div>
    <div class="header">
      <div class="logo">
        <a href="https://otterpocket.io">
          <img src="@/assets/images/Otter-Title.png" alt="" />
        </a>
        Alpha 1.0.0
      </div>

      <div class="nav-right">
        <div class="balance" v-if="walletAccount && network == 137">
          Otter: {{ otterBalance }}
        </div>
        <div class="balance" v-if="walletAccount && network == 137">
          Matic: {{ polygonBalance.toFixed(2) }}
        </div>
        <div class="address" v-if="walletAccount">
          <a
            :href="`https://polygonscan.com/address/${walletAccount[0]}`"
            style="color: white;"
          >
            {{ walletAccount[0].substring(0, 6) }}...{{
              walletAccount[0].substring(38, 42)
            }}
          </a>
        </div>
        <div
          class="connect-address"
          v-if="!walletAccount"
          @click="reloadPage()"
        >
          Connect
        </div>
      </div>
    </div>
    <div
      class="close-button"
      @click="showSideMenu = true"
      style="z-index:100;"
      v-if="!showSideMenu"
    >
      <i class="ri-menu-unfold-line"></i>
    </div>
    <div class="side-bar" :class="{ active: showSideMenu }">
      <span
        @click="showSideMenu = false"
        class="close-button"
        style="position: relative; top: 0em; left: 7em;"
      >
        <i class="ri-menu-fold-line"></i>
      </span>
      <div
        style="position: absolute; top:2em; left: 1em; font-weight: 600; color:#46cdfd;"
      >
        Upload Price: <br />
        {{ uploadFee }} OTTER
      </div>
      <div style="position: absolute; top:8em; left: 1em; ">
        <a
          href="https://quickswap.exchange/"
        >
          <span
            style="padding: 0.5em 1em; border: 1px solid #46cdfd; border-radius: 1em; color:#46cdfd;"
          >
            Buy OTTER 
          </span>
        </a>
      </div>
      <div style="position: absolute; top:12em; left: 1em; ">
        <a
          href="https://matic.supply/"
        >
          <span
            style="padding: 0.5em 1em; border: 1px solid #46cdfd; border-radius: 1em; color:#46cdfd; font-size: 0.7em;"
          >
            Need Matic for TX?
          </span>
        </a>
      </div>
      <div style="position: absolute; bottom:8em; left: 2em; font-weight: 600;">
        <a href="https://quickchart.app/">
          <img src="@/assets/images/otter-icon.png" style="width: 2em;" />
          <span style="color:#46cdfd; "> ${{ otterPrice }}</span></a
        >
      </div>
      <div style="position: absolute; bottom:4em; left: 2em; ">
        <a href="https://twitter.com/Otter_pocket">
          <img
            src="@/assets/images/icon/twitter.png"
            style="width: 2em; margin-right: 0.5em;"
          />
        </a>
        <a href="https://t.me/otterpocketstorage">
          <img src="@/assets/images/icon/telegram.png" style="width: 2em; margin-right: 0.5em;" />
        </a>
        <a href="https://otterpocket.medium.com/">
                  <img src="@/assets/images/icon/medium.png" style="width: 2em;" />

        </a>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div
            class="card-transparent card-block card-stretch card-height mb-3"
          >
            <div class="d-flex justify-content-between">
              <div class="select-dropdown input-prepend input-append">
                <div class="btn-group">
                  <h4 class="mb-2">My Pocket</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div
            class="card card-block card-stretch card-height iq-welcome"
            :style="
              `background: url(${require('@/assets/images/appFiles.png')}) no-repeat scroll right center; background-color: #ffffff; background-size: contain;`
            "
          >
            <div class="card-body property2-content">
              <div class="d-flex flex-wrap align-items-center">
                <div class="col-lg-6 col-sm-6 p-0">
                  <p class="mb-3" v-if="network == 1">
                    You are connected to Ethereum Network! Transaction Fees are
                    a way too high for this network so the Otter team decided to
                    develop on the Polygon Network. Please connect to Polygon
                    Network. Here's a tutorial
                    <a
                      href="https://medium.com/stakingbits/setting-up-metamask-for-polygon-matic-network-838058f6d844"
                      >Connect Polygon Network to metamask</a
                    >
                  </p>
                  <p class="mb-3" v-if="network == 56">
                    You are connected to BSC Network! Transaction Fees are a
                    little high for this network so the Otter team decided to
                    develop on the Polygon Network. Please connect to Polygon
                    Netwok. Here's a tutorial
                    <a
                      href="https://medium.com/stakingbits/setting-up-metamask-for-polygon-matic-network-838058f6d844"
                      >Connect Polygon Network to metamask</a
                    >
                  </p>
                  <h3 class="mb-3" v-if="network == 137">
                    You are connected to Polygon Network!
                  </h3>
                  <p
                    class="mb-3"
                    v-if="
                      network &&
                        network !== 137 &&
                        network !== 56 &&
                        network !== 1
                    "
                  >
                    Looks like you are connected to a testnet. Please connect to
                    Polygon Netwok. Here's a tutorial
                    <a
                      href="https://medium.com/stakingbits/setting-up-metamask-for-polygon-matic-network-838058f6d844"
                      >Connect Polygon Network to metamask</a
                    >
                  </p>
                  <p class="mb-3" v-if="!network">
                    Looks like you need to connect your web3 browser... Metamask
                    is the most popular. Here's a tutorial
                    <a
                      href="https://medium.com/stakingbits/setting-up-metamask-for-polygon-matic-network-838058f6d844"
                      >Connect Polygon Network to metamask</a
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="upload">
            <h4 @click="showUploadModal = true">Upload</h4>
          </div>
        </div>
        <div v-if="showUploadModal && walletAccount && network == 137" class="uploadModal">
          <div class="uploadModal__toolbar">
            <h4>Upload your File</h4>
            <h4 class="close" @click="showUploadModal = false">X</h4>
          </div>
          <UploadModal
            :Otter="Otter"
            :Pocket="Pocket"
            :myAddress="walletAccount[0]"
            :web3="web3"
            :fee="uploadFee"
          />
        </div>

        <div class="col-lg-8 col-xl-8">
          <div class="card card-block card-stretch card-height files-table">
            <div class="card-header d-flex justify-content-between">
              <div class="header-title">
                <h4 class="card-title">Files in your Pocket</h4>
              </div>
            </div>
            <div class="card-body pt-0">
              <div class="table-responsive">
                <table class="table mb-0 table-borderless tbl-server-info">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Size</th>
                      <th scope="col">Uploaded</th>
                      <th scope="col">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(file, index) in Files" :key="index">
                      <td>
                             <a  :href="`https://ipfs.infura.io/ipfs/${file.fileHash}`">
                             <div class="d-flex align-items-center">
                          <div :class="file.fileColor">
                            <i :class="file.fileIcon"></i>
                          </div>
                          <span style="color:#535F6B;">{{
                            file.fileName
                          }}</span>
                        </div>
                      </a>
                      </td>
                      <td>{{ file.fileType }}</td>
                      <td>{{ convertBytes(file.fileSize) }}</td>
                      <td>
                        {{ date(file.uploadTime) }}
                      </td>
                      <td>
                        <a
                          :href="`https://gateway.pinata.cloud/ipfs/${file.fileHash}`"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {{ file.fileHash.substring(0, 10) }}...
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadModal from "../UploadModal.vue";
import Web3 from "web3";
import OtterToken from "../../../abi/Otter.json";
import OtterPocket from "../../../abi/Pocket.json";
import { convertBytes } from "./helpers";
import moment from "moment";
import "remixicon/fonts/remixicon.css";

export default {
  name: "Dashbord1",
  components: {
    UploadModal,
  },
  data() {
    return {
      showSideMenu: false,
      uploadFee: 0,
      otterPrice: 0.03,
      walletAccount: null,
      network: 0,
      polygonBalance: 0,
      otterBalance: 0,
      web3: null,
      Otter: null,
      Pocket: null,
      showUploadModal: false,
      fileCount: 0,
      Files: [],
    };
  },
  mounted() {
    this.loadWeb3();
  },
  methods: {
    convertBytes,
    date(date) {
      return moment.unix(date).format("h:mm:ss A M/D/Y");
    },
    reloadPage() {
      window.location.reload();
    },
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        this.web3 = window.web3;
        await window.ethereum.enable();
        this.network = await this.web3.eth.net.getId();

        this.walletAccount = await this.web3.eth.getAccounts();
        this.polygonBalance = await this.web3.eth.getBalance(
          this.walletAccount[0]
        );
        this.polygonBalance = this.web3.utils.fromWei(
          this.polygonBalance,
          "ether"
        );
        this.polygonBalance = parseFloat(this.polygonBalance);
        if (this.network == 137) {
          this.Otter = new this.web3.eth.Contract(
            OtterToken,
            "0xE718EDA678AFF3F8d1592e784652BcbEeb49e352"
          );
          this.Pocket = new this.web3.eth.Contract(
            OtterPocket,
            "0x501C5074bEd28987d50ce493018d7ccdE6B7C2d9"
          );
          this.otterBalance = this.web3.utils.fromWei(
            await this.Otter.methods.balanceOf(this.walletAccount[0]).call(),
            "ether"
          );
          this.otterBalance = parseFloat(this.otterBalance);
          this.otterBalance = this.otterBalance.toFixed(2);
          this.otterBalance = this.otterBalance.toLocaleString();

          const fileCount = await this.Pocket.methods
            .users(this.walletAccount[0])
            .call();
          this.uploadFee = await this.Pocket.methods.fee().call();
          this.fileCount = fileCount;
          // Load files&sort by the newest
          for (var i = this.fileCount; i >= 1; i--) {
            const response = await this.Pocket.methods
              .getFile(this.walletAccount[0], i)
              .call();
            console.log(response);

            let file = {
              fileId: response[0][0],
              fileSize: Number(response[0][1]),
              uploadTime: response[0][2],
              fileHash: response[1][0],
              fileType: response[1][1],
              fileName: response[1][2],
              fileDescription: response[1][3],
            };
            if (
              file.fileType.includes("png") ||
              file.fileType.includes("jpeg") ||
              file.fileType.includes("image")
            ) {
              file.fileIcon = "ri-image-line";
              file.fileColor = "icon-small rounded mr-3 bg-success";
            }
            if (
              file.fileType.includes("mp4") ||
              file.fileType.includes("mov") ||
              file.fileType.includes("video")
            ) {
              file.fileIcon = "ri-film-line";
              file.fileColor = " icon-small rounded mr-3 bg-danger";
            }
            if (
              file.fileType.includes("text") ||
              file.fileType.includes("application")
            ) {
              file.fileIcon = "far fa-file-alt";
              file.fileColor = "icon-small rounded mr-3 bg-warning";
            }
            this.Files.push(file);
          }
        }
      } else if (window.web3) {
        console.log(window.web3);
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "You need a browser capable of accessing BlockChain. Try Metamask plugin!"
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container-fluid {
  margin-top: 3em;
}
.upload {
  margin-left: 1em;
  padding: 1em 3em;
  border-radius: 1em;
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

  h4 {
    color: white;
  }
}
.uploadModal {
  top: 5em;
  position: fixed;
  width: 95vw;
  left: 2.5%;
  height: 80vh;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2); 
  border-radius: 5px;
  background-color: rgba(255, 255, 255, .15);
  
  backdrop-filter: blur(10px);
  z-index: 9009;
  border-radius: 2em;
  &__toolbar {
    background: white;
    border-radius: 2em 2em 0 0;
    padding: 2em;
    display: flex;
    text-align: center;
    justify-content: space-between;
  }
}
.header {
  position: fixed;
  top: 0;
  height: 3em;
  left: 0;
  width: 100%;
  padding: 0 2em;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(
    90deg,
    #675ca8 0%,
    rgba(9, 9, 121, 1) 20%,
    rgba(0, 212, 255, 1) 100%
  );
  z-index: 99;
}
.close-button {
  display: none;
  cursor: pointer;
  i {
    font-size: 2em;
    color: #46cdfd;
  }
}
.side-bar {
  position: fixed;
  left: -4px;
  top: 3em;
  width: 10em;
  height: calc(100% - 3em);
  //border: 4px solid #46cdfd;
  background: white;
  border-radius: 3px;
  z-index: 99;
}
.connect-address {
  border: white 1px solid;
  color: white;
  height: 2em;
  padding: 0 2em;
  margin-top: 0.5em;
  border-radius: 1em;
}
.address {
  border: white 1px solid;
  color: white;
  border-radius: 1em;

  height: 2em;
  padding: 0 2em;
  margin-top: 0.5em;
}
.balance {
  margin-right: 1em;
  border: white 1px solid;
  color: white;
  border-radius: 1em;

  height: 2em;
  padding: 0 2em;
  margin-top: 0.5em;
}
.logo img {
  width: 15em;
  margin-top: 0.25em;
}
.connect-address:hover {
  background: white;
  border: 1px solid black;
  cursor: pointer;
  color: black;
}
.nav-right {
  display: flex;
}
.close {
  cursor: pointer;
}
@media screen and (max-width: 1300px) {
  .side-bar {
    left: -10em;
    z-index: 99;
    top: 5.5em;
  }
  .side-bar.active {
    left: 0;
  }
  .close-button {
    display: inherit;
    position: fixed;
    top: 6em;
    left: 1em;
  }
}
@media screen and (max-width: 950px) {
  .header {
    flex-direction: column;
    height: 5.5em;
  }
  .address {
    font-size: 0.5em;
  }
  .balance {
    margin-bottom: 1em;
    font-size: 0.5em;
  }
}
</style>
