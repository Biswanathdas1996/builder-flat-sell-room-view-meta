import { Data, imagesData } from "./Mock";

import Web3 from "web3";
import ABI from "./Blockchain/ABI.json";
import ADDRESS from "./Blockchain/Addess.json";

var InfuraNodeURL = `https://rinkeby.infura.io/v3/24022fda545f41beb59334bdbaf3ef32`;
var WalletPrivateKey =
  "33e8389993eea0488d813b34ee8d8d84f74f204c17b95896e9380afc6a514dc7";

const web3 = new Web3(new Web3.providers.HttpProvider(InfuraNodeURL));
const signer = web3.eth.accounts.privateKeyToAccount(WalletPrivateKey);
web3.eth.accounts.wallet.add(signer);
const contract = new web3.eth.Contract(ABI, ADDRESS);

console.log("-------------signer-->", signer);
const getTokenUri = async (tokenId) => {
  const response = await contract.methods
    .tokenURI(tokenId)
    .call({ from: signer?.address });
  console.log(response);
  return response;
};

const getRoomNo = () => {
  var urlParams;
  (window.onpopstate = function () {
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
      },
      query = window.location.search.substring(1);

    urlParams = {};
    while ((match = search.exec(query)))
      urlParams[decode(match[1])] = decode(match[2]);
  })();
  return urlParams?.room;
};

const getDataFromBlockchain = async (roomNo) => {
  const tokenUri = await getTokenUri(roomNo);
  console.log("---tokenUri->", tokenUri);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const tokenData = await fetch(tokenUri, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
  return tokenData;
};

export const roomData = async () => {
  const roomNo = getRoomNo();
  const tokenData = await getDataFromBlockchain(roomNo);
  const roomUiData = {
    topCilling: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.topCilling
    )?.image,
    toiletWall: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.toiletWall
    )?.image,
    leftWall: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.leftWall
    )?.image,
    entranceDoorImage: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.entranceDoorImage
    )?.image,
    frontWindow: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.frontWindow
    )?.image,
    windowImageBack: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.windowImageBack
    )?.image,
    frontWall: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.frontWall
    )?.image,
    backWall: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.backWall
    )?.image,
    rightWall: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.rightWall
    )?.image,
    floorImg: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.floorImg
    )?.image,
  };

  return roomUiData;
};

export const ifFurnished = async () => {
  const roomNo = getRoomNo();
  const tokenData = await getDataFromBlockchain(roomNo);
  return {
    furnished: tokenData?.metaverceData?.furnished,
    appliances: tokenData?.metaverceData?.appliances,
  };
};
