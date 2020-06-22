# A complete toolkit for setting up independent Web Push notification.

Everything you need to enable Web Push Notification in your Node.JS web application or Progressive web application, without any third-party service. 

## 🌍[Check the client example](https://theanam.github.io/pushkit)

## 🚀[Check the server example](https://pushkit.herokuapp.com/)

## Installation
This package contains both the client and server tools packaged in their own module loading format. To install the package run this:
```shell
yarn add pushkit
```
### Generate your VAPID keys first: 
Before starting the setup, you need to create own own VAPID key pair. This is extremely easy to do. You can go to [this site](https://web-push-codelab.glitch.me/) and generate them online. Or you can generate them from Command line using [this tool](https://www.npmjs.com/package/web-push)

Once you have your VAPID key pair (Public and Private key), you can use them to setup your web push implementation. 

### Client Setup: 
Once you have installed the package, you can use it like this: 

```js
import {PushKit} from "pushkit/client";
// create an instance
let pkInstance = new PushKit("PUBLIC_VAPID_KEY", true);
// register service worker
navigator.serviceWorker.register("./sw.js").then(swreg=>{
    // start push registration after service worker registration
    pkInstance.handleRegistration(swreg).then(pushreg=>{
        // Once push registration is done
        // Send the registration data to the server
        // You can implement this part in your convenient way
        // The below example uses `fetch` API to do it.
        let regData = JSON.stringify(pushreg);
        fetch("/reg", {
            method  : "POST",
            body    : regData,
            headers : {
                "content-type":"application/json"
            }
        });
    })
```
The above code creates a `PushKit` Instance, The constructor takes two arguments, The first argument is required. The second argument is false by default, setting it true will generate console logs.

```js
let _pk = new PushKit("<PUBLIC_VAPID_KEY>", [verbose = false]);
```

The registration of service worker is not included in the plugin itself. This is to avoid getting in the user's way. Besides it's simple. The method `navigator.serviceWorker.register` takes the service worker file (more in this later) and returns a promise. This promise is resolved with a `ServiceWorkerRegistration` object. 

```js
pushKitInstance.handleRegistration(ServiceWorkerRegistration)
```
this also returns a promise that resolves either with a `null` if the user denies, or push is not supported or there's any error. Or the push registration.

The registration object is different for every user and every browser. You have to send this registration object to the server and store it there for that user. In the example, `fetch` was used to do it. This registration object will be used to send push notification to that user.

#### Using from a CDN:
*If you are not using a module bundler, or you'd like to use a CDN for the frontend part instead, you can manually add the script tag in your HTML file like this:*

```html
<script src="https://unpkg.com/pushkit@3.0.8/client/dist/index.js"></script>
```
> If you chose to include the JavaScript file in your HTML, instead of calling `new PushKit()` you have to call `new pushKit.PushKit()`. Every other frontend API are the same.


### Server Setup
To set up the server, install the `pushkit` package on the server as well and then it can be imported like this:

```js
const createSender  = require("pushkit/server");
let sender     = createSender({
    publicKey  : "PUBLIC_VAPID_KEY",
    privateKey : "PRIVATE_VAPID_KEY"
},"your@email.address");
```
The Email Address is requred for web push API. Once instance of sender is enough for one set of vapid key (one application).
### Sending Push Notification `sender.send`:
 ```js
 sender.send(pushRegistrationObject, title, [options]);
```
```js
let options = {
    body: "Street dogs don't want anything more than love and shelter."
}
// Here, the `pushRegistrationObject` is the object sent from the client that was stored on the server.
// Make sure to parse the pushRegistrationObject from JSON string
sender.send(pushRegistrationObject,"Adopt a street dog today!", options);
```
<style>
table{
    width: 100%;
}
</style>

## Options:
The options object can be used to customize the behaviour of the push notification. These can be sent from the server as per-message basis or can be set in the service worker binding as default. Settings sent from server will always get precedence over default settings.

| property | Data Type | description |
|----------|-----------|-------------|
|body| String|Text to show in the notification body| 
|badge|String|URL of an image to be used as badge, mostly in mobile devices|
|dir|String|Useful if you want to determine the text direction, default is `auto`. It can be set to `ltr`, or `rtl`|
|icon|String|URL of an image to be used as the icon of the notification|
|image|String|URL of an image to be showin in the notification body (for notification with image content)|
|lang|String|A [BCP47](https://tools.ietf.org/html/bcp47) Language code for the notification language|
|renotify|Boolean|Used with the `tag` property, if set to will renotify for all the notificatio on the same tag|
|requireInteraction|Boolean|Determine if the notification REQUIRES user to interact before it disappears, use it responsibly|
|silent|Boolean|When set to true, notifications will not play notification sound or vibrate|
|tag|String|Useful when you want to group notification on the same topic. e.g: chat from the same person, just set a common tag|
|timestamp|Number|Determines when the notification is created, useful for figuring out how long it took to deliver|
|vibrate|Array of Number|Determines a vibration pattern to use, each number represents milleseconds of vibration|

A more detailed documentation on the options are here: <https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification>

### Setting up the service worker
The last piece of puzzle is to set up a service worker. Now if you are using a boilerplate/generator there's a chance that you already have a service worker. A service worker is a JavaScript file that gets loaded in the client in such a way, that it can still remain active even after you've left the web application. That's why Service workers can receive push notifications. In the client setup section we used a service worker file called `sw.js`, the URL should be accessible from the browser and have to be on the same domain (for security reasons). 

If you don't have a service worker, create one, if you have one, open it, and import the piece of code required to initiate the service Worker. You can either use it from CDN, or download the `worker/binding.js` file from the repository and import it. 
```js
importScripts("https://unpkg.com/pushkit@3.0.0/worker/binding.js"); 
```
Either way, you'll end up with the same result. This will expose a function called `attachPushKit`: 
```js
attachPushKit(self,pushOptions, [defaultTitle = "", defaultURL = "", verbose = false]);
```
Sample Use: 

```js
var pushOptions = {
    icon  : "ICON_URL",
    badge : "BADGE_URL"
}
attachPushKit(self, pushOptions);
```
The `PushOptions` object can have any properties from the [Options](#options) object mentioned above.If the same properties are also sent from the server, server values will get precedence. You can read the full documentation of the available options here: <https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification>

> Make sure your application is served from a secure origin `https`. otherwise this will never work.

**** 
This tool is released under the MIT License. Feel free to contribute.


Made with 💙 and JavaScript
