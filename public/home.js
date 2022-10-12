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
