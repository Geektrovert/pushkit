importScripts("https://unpkg.com/pushkit@2.0.6/worker/binding.js"); 
var pushOptions = {
    title : "Pushkit Sample",
    icon  : "/pushkit/pushkit.png",
    badge : "/pushkit/pushkit.png",
    url   : "https://theanam.github.io/pushkit"
}
attachPushKit(self, pushOptions);