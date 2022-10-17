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

document.querySelector('#snapBtn').addEventListener("click",()=>{
  event.preventDefault()
  context.drawImage(video,0,0,640,480) 
    canvas.toBlob((blob)=>{
      const formData = new FormData();
      formData.append('video', blob);
    },'image/jpg')
    
    recognizePhoto(formData)
})


async function recognizePhoto () {
let result = await fetch(`/recognize`);
}

