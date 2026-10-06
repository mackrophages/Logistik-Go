// Logistik Go: service worker de la app instalable. Lo arma herramientas/construir-web.js (no editar el de web/).
// - Guarda el "cascarón" de la app (página, íconos, lector de QR) para que abra aunque no haya señal.
// - La página se pide primero a la red, sin la copia del navegador (así llegan las versiones nuevas); si no hay señal
//   o tarda más de 4 segundos, sale la copia guardada.
// - No toca las llamadas al servidor de Google (otro dominio): esas las maneja la app.
var VERSION = "6bdc3d37af43";
var CACHE = 'logistik-go-' + VERSION;
var CASCARON = ["./","manifest.webmanifest","jsQR.min.js","iconos/apple-touch-icon.png","iconos/favicon-48.png","iconos/icono-192.png","iconos/icono-512.png","iconos/icono-maskable-512.png"];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(CASCARON.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (claves) {
    return Promise.all(claves.filter(function (k) { return k.indexOf('logistik-go-') === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(paginaRedPrimero(req)); return; }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (r) { return r || fetch(req); }));
});

function paginaRedPrimero(req) {
  function copia() { return caches.open(CACHE).then(function (c) { return c.match('./'); }); }
  return new Promise(function (resolve) {
    var listo = false;
    function dar(r) { if (!listo && r) { listo = true; resolve(r); } }
    var reloj = setTimeout(function () { copia().then(dar); }, 4000);
    // req.url y no req: una petición de navegación no se puede copiar con otras opciones.
    fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (r) {
      clearTimeout(reloj);
      if (r && r.ok) {
        var guardar = r.clone();
        caches.open(CACHE).then(function (c) { return c.put('./', guardar); });
        dar(r);
      } else {
        copia().then(function (c) { dar(c || r); });
      }
    }, function () {
      clearTimeout(reloj);
      copia().then(function (c) { dar(c || Response.error()); });
    });
  });
}
