import { Data, imagesData } from "./Mock";
import Web3 from "web3";
import ABI from "../../ui/src/CONTRACT-ABI/NFT.json";
import ADDRESS from "../../ui/src/CONTRACT-ABI/Address.json";

import { WalletPrivateKey, InfuraNodeURL } from "../../ui/src/config";

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
  let loader = document.getElementById("loader");
  loader.style.display = "block";
  document.getElementById("startButton").style.display = "none";

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
  loader.style.display = "none";
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
    refrigerator: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.refrigerator?.image
    )?.image,
    ac: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.ac?.image
    )?.image,
    almirah: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.almirah?.image
    )?.image,
    bedWood: imagesData.find(
      (data) => data.name === tokenData?.metaverceData?.bedWood?.image
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
