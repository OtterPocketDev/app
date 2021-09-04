const axios = require("axios");

export default {
  async uploadFile(file) {
    let ipfsResponse = await _uploadFiletoIPFS(file).catch((error) => {
      return error;
    });
    return ipfsResponse;
  },
};
function _uploadFiletoIPFS(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", file);
  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: "4868d7bfb3a5c10959ea",
        pinata_secret_api_key:
          "c43dd3f6b7ec9effc72e733643cca1298aa7563425cb7930650cad9e7f192633",
      },
    })
    .then(function(response) {
      console.log("Uploaded Successfully!", response);
      return response;
    })
    .catch(function(error) {
      console.log("Uploaded Error!", error);
      return error;
    });
}
