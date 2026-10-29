// Service worker: tiene l'app in cache così si apre anche senza internet.
// Quando cambi i file dell'app, aumenta il numero di VERSIONE.
const VERSIONE = 'v1';
const CACHE = `tracker-10elotto-${VERSIONE}`;
const FILE_APP = [
    './',
    './index.html',
    './config.js',
    './manifest.webmanifest',
    './vendor/tailwind.js',
    './vendor/fontawesome/css/all.min.css',
    './vendor/fontawesome/webfonts/fa-solid-900.woff2',
    './vendor/fontawesome/webfonts/fa-regular-400.woff2',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png'
];

self.addEventListener('install', (evento) => {
    evento.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILE_APP)));
    self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        caches.keys()
            .then(nomi => Promise.all(nomi.filter(n => n !== CACHE).map(n => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (evento) => {
    const richiesta = evento.request;
    if (richiesta.method !== 'GET') return;
    const url = new URL(richiesta.url);

    // Pagina: prima la rete (per avere sempre l'ultima versione), la cache se offline o lenta
    if (richiesta.mode === 'navigate') {
        evento.respondWith(primaLaRete(richiesta, 3000));
        return;
    }

    // File dell'app e font di Google: subito dalla cache, aggiornati in background
    if (url.origin === self.location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
        evento.respondWith(cacheEAggiorna(richiesta));
    }
    // Tutto il resto (Google Drive, login Google) passa senza cache
});

async function primaLaRete(richiesta, attesaMassima) {
    const cache = await caches.open(CACHE);
    try {
        const risposta = await Promise.race([
            fetch(richiesta),
            new Promise((_, rifiuta) => setTimeout(() => rifiuta(new Error('timeout')), attesaMassima))
        ]);
        if (risposta.ok) cache.put('./index.html', risposta.clone());
        return risposta;
    } catch (e) {
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
    }
}

async function cacheEAggiorna(richiesta) {
    const cache = await caches.open(CACHE);
    const inCache = await cache.match(richiesta);
    const dallaRete = fetch(richiesta)
        .then(risposta => {
            if (risposta.ok || risposta.type === 'opaque') cache.put(richiesta, risposta.clone());
            return risposta;
        })
        .catch(() => inCache || Response.error());
    return inCache || dallaRete;
}
