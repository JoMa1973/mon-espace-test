'use strict';
const CACHE='nexus-v5.6.1';
const OFFLINE=['./index.html','./nexus-cloud.js?v=5.6.1','./nexus-cloud.css?v=5.6.1','./style.css?v=5.6.1','./app.js?v=5.6.1','./manifest.webmanifest?v=5.6.1','./icon-192.png','./icon-512.png','./nexus-horizon.jpg','./nexus-metropolis.jpg','./nexus-quantum.jpg','./nexus-serenity.jpg','./nexus-altitude.jpg','./nexus-infinity.jpg','./nexus-maison.jpg','./nexus-voyage.jpg','./nexus-notes.jpg','./nexus-projets.jpg','./nexus-v56-sport.jpg','./nexus-v56-nutrition.jpg','./nexus-v56-agenda.jpg','./nexus-v56-budget.jpg','./nexus-v56-house.jpg','./nexus-v56-travel.jpg','./nexus-v56-notes.jpg','./nexus-v56-projects.jpg','./nexus-v56-trading.jpg','./nexus-v56-home.jpg'];
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
