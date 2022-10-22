let searchBtn = document.querySelector(".searchBtn");
let priceCard = document.querySelector(".priceCard");
let sortButtonsContainer = document.querySelector(".sortButtonsContainer");
let market1 = document.querySelector("button.market1");
let market2 = document.querySelector("button.market2");
let market3 = document.querySelector("button.market3");
let market4 = document.querySelector("button.market4");
let showAll = document.querySelector("button.showAll");

// loader, sorting buttons and search results template removed
loading.style.display = "none";
sortButtonsContainer.style.display = "none";
priceCard.remove();

// use the camera
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let video = document.querySelector("#video");
const constraints = {
  audio: false,
  video: {
    facingMode: "environment",
    // mandatory: {
    // minWidth: 200,
    // maxWidth: 200,
    // minHeight: 200,
    // maxHeight: 200}
    width: 400,
    height: 400,
  },
};

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => {
      if (error.name === "PermissionDeniedError") {
        console.error(
          "Permissions have not been granted to use your camera and " +
            "microphone, you need to allow the page access to your devices in " +
            "order for the demo to work."
        );
      } else {
        console.error(`getUserMedia error: ${error.name}`, error);
      }
    });
}

let predictResult;

document.querySelector("#snapBtn").addEventListener("click", async () => {
  loading.style.display = "flex";
  // context.drawImage(video, 0, 0, 640, 640);
  context.drawImage(video, 0, 0, 400, 400, 0, 0, 400, 400);
  const dataURL = canvas.toDataURL("image/jpeg", 0.8);

  var blob = dataURItoBlob(dataURL);
  var fd = new FormData(document.forms[0]);
  fd.append("predict_image", blob);

  let res = await fetch("/snap", {
    method: "post",
    body: fd,
  });

  let json = res.json();
  json.then(async function (result) {
    predictResult = result["result"];
    let possibility = result["possibility"].toString();
    let tempNumArr = possibility.split(".");
    let possibilityNum = parseInt(tempNumArr[0]);
    console.log(result["result"]);
    if (possibilityNum > 40) {
      document.querySelector(".productName").textContent = result["result"];
      document.querySelector(".possibility").textContent = `${possibilityNum}%`;
      let newCookie;
      if (!getCookie("perfectc9")) {
        newCookie = `{"history": ["${result["result"]}"]}`;
        setCookie("perfectc9", newCookie, 999);
        refreshCookie();
      } else {
        let cookieJSON = JSON.parse(getCookie("perfectc9"));
        let arr = cookieJSON["history"];
        if (arr.includes(result["result"])) {
          let resultIndex = arr.indexOf(result["result"]);
          arr.splice(resultIndex, 1);
          arr.unshift(result["result"]);
          cookieJSON["history"] = arr;
        } else {
          arr.unshift(result["result"]);
          cookieJSON["history"] = arr;
        }
        setCookie("perfectc9", JSON.stringify(cookieJSON), 999);
        refreshCookie();
      }
    } else {
      document.querySelector(".productName").textContent = "未能確定結果";
    }

    // show price details & sorting buttons after identifying item

    const res = await fetch(`/marketdata/${result["result"]}`);
    let json = await res.json();

    sortButtonsContainer.style.display = "flex";

    for (let data of json) {
      console.log(data);
      let node = priceCard.cloneNode(true);
      node.querySelector(".priceCard > a").href = data.product_link;
      node.querySelector(".productPic").src = data.display_pic;
      node.querySelector(".supermarket").textContent = data.market_name;
      node.querySelector(".displayName").textContent =
        data.product_display_name;
      node.querySelector(".quantity").textContentsrc = data.quantity;
      node.querySelector(".price").textContent = "$" + data.price;
      node.querySelector(".bargain").textContent = data.bargain;
      document.querySelector(".priceDisplay").append(node);
    }

    market1.addEventListener("click", async () => {
      let parent = document.querySelector(".priceDisplay");
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      // let searchItem = document.querySelector(".productName").textContent
      // console.log(searchItem);

      const result = await fetch(`/marketdata/${result["result"]}/1`);
      let json = await result.json();
      console.log(json);
      for (let data of json) {
        console.log(data);
        let node = priceCard.cloneNode(true);
        node.querySelector(".priceCard > a").href = data.product_link;
        node.querySelector(".productPic").src = data.display_pic;
        node.querySelector(".supermarket").textContent = data.market_name;
        node.querySelector(".displayName").textContent =
          data.product_display_name;
        node.querySelector(".quantity").textContentsrc = data.quantity;
        node.querySelector(".price").textContent = "$" + data.price;
        node.querySelector(".bargain").textContent = data.bargain;
        document.querySelector(".priceDisplay").append(node);
      }
    });

    market2.addEventListener("click", async () => {
      let parent = document.querySelector(".priceDisplay");
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const result = await fetch(`/marketdata/${result["result"]}/2`);
      let json = await result.json();
      console.log(json);
      for (let data of json) {
        console.log(data);
        let node = priceCard.cloneNode(true);
        node.querySelector(".priceCard > a").href = data.product_link;
        node.querySelector(".productPic").src = data.display_pic;
        node.querySelector(".supermarket").textContent = data.market_name;
        node.querySelector(".displayName").textContent =
          data.product_display_name;
        node.querySelector(".quantity").textContentsrc = data.quantity;
        node.querySelector(".price").textContent = "$" + data.price;
        node.querySelector(".bargain").textContent = data.bargain;
        document.querySelector(".priceDisplay").append(node);
      }
    });

    market3.addEventListener("click", async () => {
      let parent = document.querySelector(".priceDisplay");
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const result = await fetch(`/marketdata/${result["result"]}/3`);
      let json = await result.json();
      console.log(json);
      for (let data of json) {
        console.log(data);
        let node = priceCard.cloneNode(true);
        node.querySelector(".priceCard > a").href = data.product_link;
        node.querySelector(".productPic").src = data.display_pic;
        node.querySelector(".supermarket").textContent = data.market_name;
        node.querySelector(".displayName").textContent =
          data.product_display_name;
        node.querySelector(".quantity").textContentsrc = data.quantity;
        node.querySelector(".price").textContent = "$" + data.price;
        node.querySelector(".bargain").textContent = data.bargain;
        document.querySelector(".priceDisplay").append(node);
      }
    });

    market4.addEventListener("click", async () => {
      let parent = document.querySelector(".priceDisplay");
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const result = await fetch(`/marketdata/${result["result"]}/4`);
      let json = await result.json();
      console.log(json);
      for (let data of json) {
        console.log(data);
        let node = priceCard.cloneNode(true);
        node.querySelector(".priceCard > a").href = data.product_link;
        node.querySelector(".productPic").src = data.display_pic;
        node.querySelector(".supermarket").textContent = data.market_name;
        node.querySelector(".displayName").textContent =
          data.product_display_name;
        node.querySelector(".quantity").textContentsrc = data.quantity;
        node.querySelector(".price").textContent = "$" + data.price;
        node.querySelector(".bargain").textContent = data.bargain;
        document.querySelector(".priceDisplay").append(node);
      }
    });

    showAll.addEventListener("click", async () => {
      let parent = document.querySelector(".priceDisplay");
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      const result = await fetch(`/marketdata/${result["result"]}`);
      let json = await result.json();
      console.log(json);
      for (let data of json) {
        console.log(data);
        let node = priceCard.cloneNode(true);
        node.querySelector(".priceCard > a").href = data.product_link;
        node.querySelector(".productPic").src = data.display_pic;
        node.querySelector(".supermarket").textContent = data.market_name;
        node.querySelector(".displayName").textContent =
          data.product_display_name;
        node.querySelector(".quantity").textContentsrc = data.quantity;
        node.querySelector(".price").textContent = "$" + data.price;
        node.querySelector(".bargain").textContent = data.bargain;
        document.querySelector(".priceDisplay").append(node);
      }
    });

    loading.style.display = "none";
  });
});

console.log(predictResult);

// convert dataURI to Blob
function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

//cookie
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function refreshCookie() {
  let historyArr = JSON.parse(getCookie("perfectc9"))["history"];
  let htmlStr = "";
  for (let item of historyArr) {
    htmlStr += `<div>${item}</div>`;
  }
  document.querySelector(".history").innerHTML = htmlStr;
}

if (!getCookie("perfectc9")) {
  document.querySelector(".history").textContent = `No search history`;
} else {
  refreshCookie();
}

// Function to convert image to blob, will delete
// async function getImage({
//   canvas,
//   width,
//   height,
//   mime = "image/jpeg",
//   quality = 0.8,
// }) {
//   return new Promise((resolve) => {
//     const tmpCanvas = document.createElement("canvas");
//     tmpCanvas.width = width;
//     tmpCanvas.height = height;

//     const ctx = tmpCanvas.getContext("2d");
//     ctx.drawImage(
//       canvas,
//       0,
//       0,
//       canvas.width,
//       canvas.height,
//       0,
//       0,
//       width,
//       height
//     );

//     tmpCanvas.toBlob(resolve, mime, quality);
//   });
// }

// manual search button

searchBtn.addEventListener("click", async () => {
  let parent = document.querySelector(".priceDisplay");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  sortButtonsContainer.style.display = "flex";
  let searchFieldText = document.querySelector(".searchField").value;
  console.log(searchFieldText);

  const result = await fetch(`/marketdata/${searchFieldText}`);
  let json = await result.json();
  console.log(json);

  for (let data of json) {
    console.log(data);
    let node = priceCard.cloneNode(true);
    node.querySelector(".priceCard > a").href = data.product_link;
    node.querySelector(".productPic").src = data.display_pic;
    node.querySelector(".supermarket").textContent = data.market_name;
    node.querySelector(".displayName").textContent = data.product_display_name;
    node.querySelector(".quantity").textContent = data.quantity;
    node.querySelector(".price").textContent = "$" + data.price;
    node.querySelector(".bargain").textContent = data.bargain;
    document.querySelector(".priceDisplay").append(node);
  }

  market1.addEventListener("click", async () => {
    let parent = document.querySelector(".priceDisplay");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    let searchFieldText = document.querySelector(".searchField").value;
    console.log(searchFieldText);

    const result = await fetch(`/marketdata/${searchFieldText}/1`);
    let json = await result.json();
    console.log(json);
    for (let data of json) {
      console.log(data);
      let node = priceCard.cloneNode(true);
      node.querySelector(".priceCard > a").href = data.product_link;
      node.querySelector(".productPic").src = data.display_pic;
      node.querySelector(".supermarket").textContent = data.market_name;
      node.querySelector(".displayName").textContent =
        data.product_display_name;
      node.querySelector(".quantity").textContentsrc = data.quantity;
      node.querySelector(".price").textContent = "$" + data.price;
      node.querySelector(".bargain").textContent = data.bargain;
      document.querySelector(".priceDisplay").append(node);
    }
  });

  market2.addEventListener("click", async () => {
    let parent = document.querySelector(".priceDisplay");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    let searchFieldText = document.querySelector(".searchField").value;
    console.log(searchFieldText);

    const result = await fetch(`/marketdata/${searchFieldText}/2`);
    let json = await result.json();
    console.log(json);
    for (let data of json) {
      console.log(data);
      let node = priceCard.cloneNode(true);
      node.querySelector(".priceCard > a").href = data.product_link;
      node.querySelector(".productPic").src = data.display_pic;
      node.querySelector(".supermarket").textContent = data.market_name;
      node.querySelector(".displayName").textContent =
        data.product_display_name;
      node.querySelector(".quantity").textContentsrc = data.quantity;
      node.querySelector(".price").textContent = "$" + data.price;
      node.querySelector(".bargain").textContent = data.bargain;
      document.querySelector(".priceDisplay").append(node);
    }
  });

  market3.addEventListener("click", async () => {
    let parent = document.querySelector(".priceDisplay");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }

    let searchFieldText = document.querySelector(".searchField").value;
    console.log(searchFieldText);
    const result = await fetch(`/marketdata/${searchFieldText}/3`);
    let json = await result.json();
    console.log(json);
    for (let data of json) {
      console.log(data);
      let node = priceCard.cloneNode(true);
      node.querySelector(".priceCard > a").href = data.product_link;
      node.querySelector(".productPic").src = data.display_pic;
      node.querySelector(".supermarket").textContent = data.market_name;
      node.querySelector(".displayName").textContent =
        data.product_display_name;
      node.querySelector(".quantity").textContentsrc = data.quantity;
      node.querySelector(".price").textContent = "$" + data.price;
      node.querySelector(".bargain").textContent = data.bargain;
      document.querySelector(".priceDisplay").append(node);
    }
  });

  market4.addEventListener("click", async () => {
    let parent = document.querySelector(".priceDisplay");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }

    let searchFieldText = document.querySelector(".searchField").value;
    console.log(searchFieldText);
    const result = await fetch(`/marketdata/${searchFieldText}/4`);
    let json = await result.json();
    console.log(json);
    for (let data of json) {
      console.log(data);
      let node = priceCard.cloneNode(true);
      node.querySelector(".priceCard > a").href = data.product_link;
      node.querySelector(".productPic").src = data.display_pic;
      node.querySelector(".supermarket").textContent = data.market_name;
      node.querySelector(".displayName").textContent =
        data.product_display_name;
      node.querySelector(".quantity").textContentsrc = data.quantity;
      node.querySelector(".price").textContent = "$" + data.price;
      node.querySelector(".bargain").textContent = data.bargain;
      document.querySelector(".priceDisplay").append(node);
    }
  });

  showAll.addEventListener("click", async () => {
    let parent = document.querySelector(".priceDisplay");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    let searchFieldText = document.querySelector(".searchField").value;
    console.log(searchFieldText);
    const result = await fetch(`/marketdata/${searchFieldText}`);
    let json = await result.json();
    console.log(json);
    for (let data of json) {
      console.log(data);
      let node = priceCard.cloneNode(true);
      node.querySelector(".priceCard > a").href = data.product_link;
      node.querySelector(".productPic").src = data.display_pic;
      node.querySelector(".supermarket").textContent = data.market_name;
      node.querySelector(".displayName").textContent =
        data.product_display_name;
      node.querySelector(".quantity").textContentsrc = data.quantity;
      node.querySelector(".price").textContent = "$" + data.price;
      node.querySelector(".bargain").textContent = data.bargain;
      document.querySelector(".priceDisplay").append(node);
    }
  });
});
