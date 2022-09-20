import { Data } from "./Mock";

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

export const roomData = () => {
  const roomNo = getRoomNo();
  const findRoom = Data.find((val) => val.room == roomNo);
  if (findRoom) {
    return findRoom;
  } else if (roomNo % 2 == 0) {
    return Data[1];
  } else return Data[0];
};
