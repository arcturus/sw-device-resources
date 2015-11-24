Concept: Use ServiceWorker to cache and serve specific content based on your device type
========================================================================================
This is just a concept on how we could use ServiceWorker to cache specific (and shared) resources for different kind of devices.

Why should you do that when you have progressive enhancement?
=============================================================
Again, is just a concept. You should continue using progressive enhancement, but sometimes we want to be pretty smart when serving our content, adapt it for specific devices, screen resolutions and densities, or even device capabilities.

How is this working?
====================
+ You have an entry point to the app ```index.html```, which contains the string 'Loading ...'.
+ `index.html` detects the device type (right now using a simple, non trustable mechanism, viewport size), saves this into iDB, and register the ServiceWorker.
+ The ServiceWorker during ```install``` phase, reads from iDB the kind of device and cache the specific content for that device.
Also writes in the cache a new `index.html` file that will be overwriting our original one, with the `index.html` per device.
+ On ```fetch``` phase we just have a simple policy ```cache first, then network``` to serve the content.
+ Why an ```index.html``` file from a different folder can overwrite the original file, don't you have problems with paths? No, we are using the [base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base), that setups what's the base url for the rest of the files in the document.

How to run this?
================
Taking into account the use of the [base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base), you will see how the ```index.html``` in the subfolders are pointing to an specific host and port:
```html
<base href="http://localhost:8080/desktop/"/>
```
You will need to serve this content from your local machine on the port ```8080``` or change this on the different ```index.html``` files.
