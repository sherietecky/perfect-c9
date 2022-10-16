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

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: ture, sound: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    });
}
