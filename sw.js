'use strict';
const CACHE='nexus-v4.9.0';
const OFFLINE=['./index.html','./style.css?v=4.9.0','./app.js?v=4.9.0','./manifest.webmanifest?v=4.9.0','./icon-192.png','./icon-512.png','./nexus-horizon.webp','./nexus-metropolis.webp','./nexus-quantum.webp','./nexus-serenity.webp','./nexus-altitude.webp','./nexus-infinity.webp'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(OFFLINE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('mon-espace-')||key.startsWith('nexus-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  // Toujours préférer le réseau, y compris pour le document et le code.
  // Les anciennes ressources ne sont utilisées que hors connexion.
  event.respondWith(fetch(request,{cache:'no-store'}).catch(async()=>{
    const cached=await caches.match(request);
    if(cached)return cached;
    if(request.mode==='navigate')return caches.match('./index.html');
    return Response.error();
  }));
});
