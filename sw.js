const C='ctva-admin-v2',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// Only same-origin GET page files are cached. Backend (Apps Script) calls are never touched.
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));});
// Tapping a notification opens (or focuses) the admin app.
self.addEventListener('notificationclick',e=>{e.notification.close();
e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus();}return self.clients.openWindow('./');}));});
// Ready for real server push, should it be added later.
self.addEventListener('push',e=>{let d={};try{d=e.data.json();}catch(x){d={body:e.data?e.data.text():''};}
e.waitUntil(self.registration.showNotification(d.title||'CTVA Admin',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:'ctva-push',renotify:true}));});
