import cilling from "./img/false-ceiling-interior-design-idea-07.jpg";
import cilling2 from "./img/845eb937006335.5731a981ed4b8.jpg";
import cilling3 from "./img/WhatsApp-Image-2020-11-12-at-13.38.25-2.jpeg";
import wall2 from "./img/2053687.jpg";
import wall3 from "./img/tekstura-fon-abstraktsiia-abstract-texture-background-rose-g.jpg";
import wall4 from "./img/WALL-TEXTURE-FEATURE-compressed.jpg";
import wall5 from "./img/well.png";
import doorImage from "./img/4bf02906d8b7f0a3446edf0ccf4296c8.jpg";
import doorImage2 from "./img/rf.jpg";
import doorImage3 from "./img/10-sagwan-chokhat-500x500.jpg";
import windowImage from "./img/monsey-glass-windows.jpg";
import windowImageBack from "./img/single-pane-versus-dual-pane-windows-in-sydney.jpg";
import sideWall from "./img/depositphotos_392505906-stock-photo-light-abstract-wall-background-copy.jpg";
import sideWall2 from "./img/grey-grainy-wall-texture-monochromatic-plaster-bright-sun-147638989.jpg";
import marble from "./img/marble.jpg";
import marble2 from "./img/5-things-to-keep-in-mind-while-choosing-floor-tiles-840x480.jpg";

export const Data = [
  {
    room: 1,
    topCilling: cilling,
    toiletWall: wall2,
    leftWall: wall3,
    entranceDoorImage: doorImage2,
    frontWindow: windowImage,
    windowImageBack: windowImageBack,
    sideWall: sideWall,
    rightsideWall: sideWall,
    floorImg: marble,
  },
  {
    room: 2,
    topCilling: cilling2,
    toiletWall: marble,
    leftWall: wall4,
    entranceDoorImage: doorImage,
    frontWindow: windowImage,
    windowImageBack: windowImageBack,
    sideWall: sideWall2,
    rightsideWall: wall5,
    floorImg: marble,
  },
  {
    room: 3,
    topCilling: cilling3,
    toiletWall: marble,
    leftWall: sideWall2,
    entranceDoorImage: doorImage3,
    frontWindow: windowImage,
    windowImageBack: windowImageBack,
    sideWall: sideWall2,
    rightsideWall: wall5,
    floorImg: marble2,
  },
];

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
  } else return Data[0];
};
