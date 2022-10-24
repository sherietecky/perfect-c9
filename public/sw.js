self.addEventListener('install',(evt)=> {
    console.log('sw installed')
})
self.addEventListener('activate',(evt)=> {
    console.log('sw activated')
})
self.addEventListener('fetch',(evt)=> {
    console.log('fetch', evt)
})