<template>
  <div class="example-full">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files here to upload</h3>
    </div>
    <div class="upload" v-show="!isOption">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Thumb</th>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!files.length">
              <td colspan="9">
                <div class="text-center p-5">
                  <h4>Drop files anywhere to upload<br />or</h4>
                  <label :for="name" class="btn btn-lg btn-primary"
                    >Select Files</label
                  >
                </div>
              </td>
            </tr>
            <tr v-for="file in files" :key="file.id">
              <td>
                <img
                  class="td-image-thumb"
                  v-if="file.thumb"
                  :src="file.thumb"
                  style="max-width: 10em !important;"
                />
                <span v-if="file.type.includes('video')"
                  ><img src="./video.png" alt="" style="max-width: 10em;"
                /></span>
              </td>
              <td>
                <div class="filename">
                  {{ file.name }}
                </div>
              </td>
              <td>{{ file.type }}</td>
              <td>{{ formatSize(file.size) }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn" type="button">
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="$refs.upload.remove(file)"
                      >Remove</a
                    >
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="loader" v-if="loadingIPFS">
        <Spinner />
        Uploading file to IPFS...
      </div>
      <div class="loader" v-if="loadingBlockchain">
        <Block />
        Uploading data to Blockchain...
        <a :href="`https://polygonscan.com/tx/${hash}`">TX</a>
      </div>
      <div class="loader" v-if="loadingApproval">
        <Block />
        Will cost {{fee}} Otter. Waiting for Approval
      </div>
      <div class="example-footer">
        <div class="btn-group">
          <file-upload
            class="btn btn-primary"
            :post-action="postAction"
            :put-action="putAction"
            :multiple="multiple"
            :directory="directory"
            :create-directory="createDirectory"
            :size="size || 0"
            :thread="thread < 1 ? 1 : thread > 5 ? 5 : thread"
            :headers="headers"
            :data="data"
            :drop="drop"
            :drop-directory="dropDirectory"
            :add-index="addIndex"
            v-model="files"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="upload"
          >
            <i class="fa fa-plus"></i>
            Select
          </file-upload>
        </div>
        <button
          type="button"
          class="btn btn-success"
          v-if="readyToUpload"
          @click="approve()"
        >
          <i class="fa fa-upload" aria-hidden="true"></i>
          Upload
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.example-footer {
  position: absolute;
  bottom: 1em;
  display: flex;
  justify-content: center;
  width: 100%;
}

.example-full {
  height: 80%;
  color: white !important;
}
.example-full .btn-group .dropdown-menu {
  display: block;
  visibility: hidden;
  transition: all 0.2s;
}
.example-full .btn-group:hover > .dropdown-menu {
  visibility: visible;
}
.example-full label.dropdown-item {
  margin-bottom: 0;
}
.example-full .btn-group .dropdown-toggle {
  margin-right: 0.6rem;
}
.td-image-thumb {
  max-width: 4em;
  max-height: 4em;
}
.example-full .filename {
  margin-bottom: 0.3rem;
  color: rgb(85, 147, 240);
}
.example-full .btn-is-option {
  margin-top: 0.25rem;
}
.example-full .example-foorer {
  padding: 0.5rem 0;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}
.example-full .edit-image img {
  max-width: 100%;
}
.example-full .edit-image-tool {
  margin-top: 0.6rem;
}
.example-full .edit-image-tool .btn-group {
  margin-right: 0.6rem;
}
.example-full .footer-status {
  padding-top: 0.4rem;
}
.example-full .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 1;
  opacity: 0.6;
  text-align: center;
  background: #000;
}
.example-full .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
.loader {
  background: rgba(0, 76, 148, 0.912);
  height: max-content;
  width: max-content;
  padding: 5em;
  border-radius: 2em;
}
</style>

<script>
import Cropper from "cropperjs";
import ImageCompressor from "@xkeshi/image-compressor";
import FileUpload from "vue-upload-component";
import Spinner from "../../loaders/spinner.vue";
import Block from "../../loaders/block.vue";
const auth =
  'Basic ' + Buffer.from('1udeNiO9Z0ng22lH97ol0s27ZM8' + ':' + 'da38ac4c32eb23fb4678da36efbcd9f2').toString('base64')
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
    headers: {
    authorization: auth
  }
});
export default {
  components: {
    FileUpload,
    Spinner,
    Block,
  },
  props: {
    Otter: Object,
    Pocket: Object,
    myAddress: String,
    web3: Object,
    fee: Number,
  },
  data() {
    return {
      fileBuffer: null,
      files: [],
      loadingIPFS: false,
      loadingBlockchain: false,
      loadingApproval: false,
      approved: false,
      readyToUpload: false,
      hash: 0,
      accept: "image/png,image/gif,image/jpeg,image/webp/html",
      extensions: "gif,jpg,jpeg,png,webp,mp4",
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: false,
      directory: false,
      drop: true,
      dropDirectory: true,
      createDirectory: false,
      addIndex: false,
      thread: 3,
      name: "file",
      postAction: "/upload/post",
      putAction: "/upload/put",
      headers: {
        "X-Csrf-Token": "xxxx",
      },
      data: {
        _csrf_token: "xxxxxx",
      },
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,
      addData: {
        show: false,
        name: "",
        type: "",
        content: "",
      },
      editFile: {
        show: false,
        name: "",
      },
    };
  },
  computed: {
    feeInt: function () {
      return parseInt(this.fee);
    }
  },
  watch: {
    "editFile.show"(newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, {
          error: this.editFile.error || "",
        });
      }
      if (newValue) {
        this.$nextTick(() => {
          if (!this.$refs.editImage) {
            return;
          }
          let cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false,
          });
          this.editFile = {
            ...this.editFile,
            cropper,
          };
        });
      }
    },
    "addData.show"(show) {
      if (show) {
        this.addData.name = "";
        this.addData.type = "";
        this.addData.content = "";
      }
    },
  },
  methods: {
    async approve() {
      this.loadingApproval = true;
      await this.Otter.methods
        .increaseAllowance(
          "0x501C5074bEd28987d50ce493018d7ccdE6B7C2d9",
          this.web3.utils.toBN(this.feeInt * 10 ** 18)
        )
        .send({ from: this.myAddress })
        .once("transactionHash", function(hash) {
          console.log("Approval tx Hash:", hash);
        })
        .once("receipt", (receipt) => {
          console.log("Approval Receipt:", receipt);
          this.loadingApproval = false;

          this.upload();
        })
        .on("error", (error) => {
          console.log("Error:", error);
          this.loadingApproval = false;
        });
    },
    upload() {
      this.loadingIPFS = true;
      ipfs.add(this.fileBuffer, (error, result) => {
        const file = this.files[0];
        if (error) {
          console.log(error);
          return;
        }
        this.loadingIPFS = false;
        this.Pocket.methods
          .uploadFile(
            result[0].hash,
            result[0].size,
            file.type,
            file.name,
            "Description"
          )
          .send({ from: this.myAddress })
          .on("transactionHash", (hash) => {
            this.loadingBlockchain = true;
            this.hash = hash;
            setInterval(() => {
              this.web3.eth.getTransaction(hash, (err, result) => {
                console.log("tx:", result);
                if (result.blockHash) {
                  this.loadingBlockchain = false;
                  window.location.reload();
                }
              });
            }, 1000);
          })
          .on("error", (e) => {
            window.alert("Error", e);
          });
      });
    },
    formatSize(size) {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + " MB";
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + " KB";
      }
      return size.toString() + " B";
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
        // Automatic compression
        // 自动压缩
        if (
          newFile.file &&
          newFile.error === "" &&
          newFile.type.substr(0, 6) === "image/" &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = "compressing";
          const imageCompressor = new ImageCompressor(null, {
            convertSize: 1024 * 1024,
            maxWidth: 512,
            maxHeight: 512,
          });
          imageCompressor
            .compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, {
                error: "",
                file,
                size: file.size,
                type: file.type,
              });
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, {
                error: err.message || "compress",
              });
            });
        }
      }
      if (
        newFile &&
        newFile.error === "" &&
        newFile.file &&
        (!oldFile || newFile.file !== oldFile.file)
      ) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
      // image size
      // image 尺寸
      if (
        newFile &&
        newFile.error === "" &&
        newFile.type.substr(0, 6) === "image/" &&
        newFile.blob &&
        (!oldFile || newFile.blob !== oldFile.blob)
      ) {
        newFile.error = "image parsing";
        let img = new Image();
        img.onload = () => {
          this.$refs.upload.update(newFile, {
            error: "",
            height: img.height,
            width: img.width,
          });
        };
        img.οnerrοr = () => {
          this.$refs.upload.update(newFile, { error: "parsing image size" });
        };
        img.src = newFile.blob;
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      if (newFile) {
        const file = newFile.file;

        const reader = new window.FileReader();

        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          this.fileBuffer = Buffer(reader.result);
          if (this.fileBuffer) {
            this.readyToUpload = true;
          }
        };
      }

      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    },
    alert(message) {
      alert(message);
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true };
      this.$refs.upload.update(file, { error: "edit" });
    },
    onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert("Your browser does not support");
        this.editFile.show = false;
        return;
      }
      let data = {
        name: this.editFile.name,
        error: "",
      };
      if (this.editFile.cropper) {
        let binStr = atob(
          this.editFile.cropper
            .getCroppedCanvas()
            .toDataURL(this.editFile.type)
            .split(",")[1]
        );
        let arr = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        data.file = new File([arr], data.name, { type: this.editFile.type });
        data.size = data.file.size;
      }
      this.$refs.upload.update(this.editFile.id, data);
      this.editFile.error = "";
      this.editFile.show = false;
    },
    // add folder
    onAddFolder() {
      if (!this.$refs.upload.features.directory) {
        this.alert("Your browser does not support");
        return;
      }
      let input = document.createElement("input");
      input.style =
        "background: rgba(255, 255, 255, 0);overflow: hidden;position: fixed;width: 1px;height: 1px;z-index: -1;opacity: 0;";
      input.type = "file";
      input.setAttribute("allowdirs", true);
      input.setAttribute("directory", true);
      input.setAttribute("webkitdirectory", true);
      input.multiple = true;
      document.querySelector("body").appendChild(input);
      input.click();
      input.onchange = () => {
        this.$refs.upload.addInputFile(input).then(function() {
          document.querySelector("body").removeChild(input);
        });
      };
    },
    onAddData() {
      console.log("Adding Data...");
      this.addData.show = false;
      if (!this.$refs.upload.features.html5) {
        this.alert("Your browser does not support");
        return;
      }
      let file = new window.File([this.addData.content], this.addData.name, {
        type: this.addData.type,
      });
      this.$refs.upload.add(file);
    },
  },
};
</script>
