import { decode } from "js-base64";

export function getConfigData() {
  const token = sessionStorage.getItem("x-nft-config-token");
  return token && JSON.parse(decode(token));
}

export async function fetchConfigData() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch("https://sosal.in/endpoints/GetConfig.php", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      sessionStorage.setItem("x-nft-config-token", result);
      return result;
    })
    .catch((error) => console.log("error", error));
}
