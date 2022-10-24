if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then((reg)=> console.log('sw reg ed', reg))
    .catch((err)=> console.log('sw not reg ed', err))

}