// try DB
let pagename = document.querySelector(".name");
let psw = document.querySelector(".psw");

async function trydb() {
  const res = await fetch("/trydb");
  const json = await res.json();
  console.log(json.username);

  pagename.textContent = json.username;
  psw.textContent = json.password;
}

trydb();

// use the camera
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let video = document.querySelector("#live-video");
const constraints = {
  audio: false,
  video: true
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

document.querySelector('#snap').addEventListener("click",()=>{
  context.drawImage(video,0,0,640,480)
  // use this image to search
})