/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("/anilibrix/workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/anilibrix/workbox-v4.3.1"});

importScripts(
  "/anilibrix/precache-manifest.1f7d7370bdf98c6049997f86fbbda238.js"
);

workbox.core.setCacheNameDetails({prefix: "anilibrix"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.precaching.cleanupOutdatedCaches();
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("index.html"));
