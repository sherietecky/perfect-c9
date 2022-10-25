let predictProduct = document.querySelector(".productName");
let searchField = document.querySelector("input.searchField");
let searchBtn = document.querySelector(".searchBtn");
let priceCard = document.querySelector(".priceCard");
let sortButtonsContainer = document.querySelector(".sortButtonsContainer");
let market1 = document.querySelector("button.market1");
let market2 = document.querySelector("button.market2");
let market3 = document.querySelector("button.market3");
let market4 = document.querySelector("button.market4");
let showAll = document.querySelector("button.showAll");
let recipeCard = document.querySelector(".recipeCard");
let image_display = document.querySelector("div.resultDisplay > img");
let tabTwo = document.querySelector("#tabTwo");

if (Notification.permission === "granted") {
  console.log("already have the notification permission");
} else if (Notification.permission === "denied") {
  Notification.requestPermission().then((permission) => {
    console.log(permission);
  });
}

function displayNotification() {
  const notif = new Notification("Message from Perfect C9", {
    body: "Your result is ready!!!",
    icon: "https://www.citypng.com/public/uploads/preview/-31622652360keqnmdomq3.png",
  });

  notif.onClick = (event) => {
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then(function (clientList) {
          if (data.WebUrl) {
            let client = null;

            for (let i = 0; i < clientList.length; i++) {
              let item = clientList[i];

              if (item.url) {
                client = item;
                break;
              }
            }

            if (client && "navigate" in client) {
              client.focus();
              event.notification.close();
              return client.navigate(data.WebUrl);
            } else {
              event.notification.close();
              // if client doesn't have navigate function, try to open a new browser window
              return clients.openWindow(data.WebUrl);
            }
          }
        })
    );
  };
}

// loader, sorting buttons and search results template removed
loading.style.display = "none";
sortButtonsContainer.style.display = "none";
priceCard.remove();
recipeCard.remove();
searchField.value = "";

// use the camera
let canvas = document.querySelector("#canvas");
canvas.style.display = "none";
let context = canvas.getContext("2d");
let video = document.querySelector("#video");
// add for ios to try
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");
const constraints = {
  audio: false,
  video: {
    facingMode: "environment",
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
  searchField.value = "";
  loading.style.display = "flex";
  // context.drawImage(video, 0, 0, 640, 640);
  context.drawImage(video, 0, 0, 400, 400, 0, 0, 400, 400);
  const dataURL = canvas.toDataURL("image/jpeg", 0.8);

  // canvas.style.display = "none";

  var blob = dataURItoBlob(dataURL);
  var fd = new FormData(document.forms[0]);
  fd.append("predict_image", blob);

  let res = await fetch("/snap", {
    method: "post",
    body: fd,
  });

  const result_image = await fetch("/result_image");
  let json_image = await result_image.json();
  console.log(json_image);

  image_display.src = `${json_image}`;

  let json = res.json();
  json.then(async function (result) {
    predictResult = result["result"];
    let possibility = result["possibility"].toString();
    let tempNumArr = possibility.split(".");
    let possibilityNum = parseInt(tempNumArr[0]);

    if (possibilityNum > 40) {
      // if posssibility num > 40
      // 1. show result
      document.querySelector(".productName").textContent = result["result"];
      document.querySelector(".possibility").textContent = `${possibilityNum}%`;

      // 2. cookie + search history
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

      // 3. show notification
      displayNotification();

      // 4. show scraped price details + sorting buttons
      const res = await fetch(`/marketdata/${result["result"]}`);
      let json = await res.json();

      searchField.value = result["result"];
      searchBtn.click();

      let searchHistory = document.querySelectorAll(".history > div");

      searchHistory.forEach((div) => {
        div.addEventListener("click", async () => {
          searchField.value = div.textContent;
          searchBtn.click();
        });
      });
      // else if possibility is not > 40
    } else {
      document.querySelector(".productName").textContent = "未能確定結果";
    }
  });
  loading.style.display = "none";
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

searchField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", async () => {
  // clear original result + show sorting  buttons
  let parent = document.querySelector(".priceDisplay");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  document.querySelector(".recipeSection").innerHTML = "";
  sortButtonsContainer.style.display = "flex";

  // locate search word
  let searchFieldText = document.querySelector(".searchField").value;
  console.log(searchFieldText);

  // add to cookie
  let newCookie;
  if (!getCookie("perfectc9")) {
    newCookie = `{"history": ["${searchFieldText}"]}`;
    setCookie("perfectc9", newCookie, 999);
    refreshCookie();
  } else {
    let cookieJSON = JSON.parse(getCookie("perfectc9"));
    let arr = cookieJSON["history"];
    if (arr.includes(searchFieldText)) {
      let resultIndex = arr.indexOf(searchFieldText);
      arr.splice(resultIndex, 1);
      arr.unshift(searchFieldText);
      cookieJSON["history"] = arr;
    } else {
      arr.unshift(searchFieldText);
      cookieJSON["history"] = arr;
    }
    setCookie("perfectc9", JSON.stringify(cookieJSON), 999);
    refreshCookie();
  }

  // fetch data
  const result = await fetch(`/marketdata/${searchFieldText}`);
  // const result = await fetch(`/marketdata/${countPrice}/${searchFieldText}`);
  let json = await result.json();
  console.log(json);

  // display price & recipe data

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

  const result_recipe = await fetch(`/recipes/${searchFieldText}`);
  let json_recipe = await result_recipe.json();
  console.log(json_recipe);
  // let parentRecipe = document.querySelector(".recipeSection");
  // recipeCard.innerHTML = data
  //   .map(
  //     (obj) => `
  // <div class="recipeCard">
  //                 <a class="recipeLink" href="${obj.url}">
  //                   <img class="recipePic" src="${image}">
  //                   <p class="recipeName">${recipe_name}</p>
  //                   <p class="ingredients">${ingredients}/p>
  //                 </a>
  //               </div>`
  //   )
  //   .join("");
  for (let data of json_recipe) {
    console.log(data);
    let node = recipeCard.cloneNode(true);
    node.querySelector(".recipeCard > a").href = data.url;
    node.querySelector(".recipePic").src = data.image;
    node.querySelector(".recipeName").textContent = data.recipe_name;
    node.querySelector(".ingredients").textContent = data.ingredients;
    document.querySelector(".recipeSection").append(node);
  }

  // sorting buttons

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
AOS.init();
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
AOS.init();

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
AOS.init();

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
AOS.init();

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
AOS.init();
  });

  tabTwo.addEventListener("click", async () => {
    document.querySelector(".recipeSection").innerHTML = "";
    let searchFieldText = document.querySelector(".searchField").value;
    const result_recipe = await fetch(`/recipes/${searchFieldText}`);

    let json_recipe = await result_recipe.json();
    console.log(json_recipe);
    // let parentRecipe = document.querySelector(".recipeSection");
    // recipeCard.innerHTML = data
    //   .map(
    //     (obj) => `
    // <div class="recipeCard">
    //                 <a class="recipeLink" href="${obj.url}">
    //                   <img class="recipePic" src="${image}">
    //                   <p class="recipeName">${recipe_name}</p>
    //                   <p class="ingredients">${ingredients}/p>
    //                 </a>
    //               </div>`
    //   )
    //   .join("");
    for (let data of json_recipe) {
      console.log(data);
      let node = recipeCard.cloneNode(true);
      node.querySelector(".recipeCard > a").href = data.url;
      node.querySelector(".recipePic").src = data.image;
      node.querySelector(".recipeName").textContent = data.recipe_name;
      node.querySelector(".ingredients").textContent = data.ingredients;
      document.querySelector(".recipeSection").append(node);
    }
  });

  let searchHistory = document.querySelectorAll(".history > div");

  searchHistory.forEach((div) => {
    div.addEventListener("click", async () => {
      searchField.value = div.textContent;
      searchBtn.click();
    });
  });
});

// click search history

let searchHistory = document.querySelectorAll(".history > div");

searchHistory.forEach((div) => {
  div.addEventListener("click", async () => {
    searchField.value = div.textContent;
    searchBtn.click();
  });
});

// load more
let countPrice = 1;
let loadmorePrice = document.querySelector(".loadmorePrice");
loadmorePrice.addEventListener("click", async () => {
  countPrice += 1;
  getPageNum();
  return countPrice;
});

async function getPageNum() {
  let searchFieldText = document.querySelector(".searchField").value;
  console.log(searchFieldText);
  let getPage = await fetch(`/marketdata/${countPrice}/${searchFieldText}`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page: countPrice, product: searchFieldText }),
  });
  let pageNum = await getPage.json();

  for (let data of pageNum) {
    console.log(data);
    let node = priceCard.cloneNode(true);
    node.querySelector(".priceCard > a").href = data.product_link;
    node.querySelector(".productPic").src = data.display_pic;
    node.querySelector(".supermarket").textContent = data.market_name;
    node.querySelector(".displayName").textContent = data.product_display_name;
    node.querySelector(".quantity").textContentsrc = data.quantity;
    node.querySelector(".price").textContent = "$" + data.price;
    node.querySelector(".bargain").textContent = data.bargain;
    document.querySelector(".priceDisplay").append(node);
  }
}
