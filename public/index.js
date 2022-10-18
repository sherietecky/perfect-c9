// try DB
async function trydb() {
  const res = await fetch("/trydb");
  const json = await res.json();
  console.log(json.username);
  console.log(json.password);

  document.querySelector("#test-name").textContent = json.username;
  document.querySelector("#test-password").textContent = json.password;
}

trydb();

// use the camera
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let video = document.querySelector("#video");
const constraints = {
  audio: false,
  video: true,
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

document.querySelector("#snapBtn").addEventListener("click", async () => {
  context.drawImage(video, 0, 0, 600, 600);

  const dataURL = canvas.toDataURL("image/jpeg", 0.8);
  // console.log(dataURL);

  // const formData = new FormData();
  // formData.append('predict_image', dataURL);
  var blob = dataURItoBlob(dataURL);
  var fd = new FormData(document.forms[0]);
  fd.append("predict_image", blob);

  let res = await fetch("/snap", {
    method: "post",
    body: fd,
  });

  let json = res.json()
  json.then(function(result) {
    document.querySelector(".productName").textContent = result["result"];
    document.querySelector(".possibility").textContent = result["possibility"];
 });

});

// const photo = await getImage({ canvas, width: 600, height: 600 });

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
