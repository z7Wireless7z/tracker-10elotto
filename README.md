# Tracker 10eLotto

App per tenere il registro della strategia "Gruzzoletto" al 10eLotto: cassa, esito di ogni giornata, calendario del mese, confronto con le probabilità, numeri fortunati e casuali, backup su Google Drive.

È una PWA (Progressive Web App): una pagina web che si installa sul telefono come un'app vera, con la sua icona, e funziona anche senza internet.

## Dove stanno i dati

I dati sono salvati **solo sul telefono** (nella memoria del browser). Non passano da GitHub e da nessun server. Per non perderli, usa il backup:

- **Salva su Drive**: scrive il file `tracker-10elotto-backup.json` nel tuo Google Drive. A ogni salvataggio **sovrascrive** quello precedente: su Drive c'è sempre un solo file, il più recente.
- **Ripristina da Drive**: ricarica i dati da quel file (per esempio su un telefono nuovo).
- **Scarica file / Carica file**: lo stesso backup, come file sul telefono.

L'app ti ricorda il backup: se l'ultimo ha più di 7 giorni, l'avviso diventa arancione.

## Installare l'app sul telefono

Indirizzo dell'app: `https://z7wireless7z.github.io/tracker-10elotto/`

**Android (Chrome)**
1. Apri l'indirizzo in Chrome.
2. Tocca **Installa** in alto, oppure il menu ⋮ → **Installa app** (o "Aggiungi a schermata Home").
3. L'icona compare tra le app. Da quel momento aprila sempre dall'icona.

**iPhone (Safari)**
1. Apri l'indirizzo in Safari (non in Chrome).
2. Tocca **Condividi** (il quadrato con la freccia) → **Aggiungi alla schermata Home**.
3. Apri l'app sempre dall'icona: su iPhone i dati del sito aperto in Safari possono essere cancellati dopo qualche settimana di inutilizzo, quelli dell'app installata no.

## Configurare Google Drive (una volta sola)

Il backup che sovrascrive il file richiede che Google riconosca l'app. Serve un "ID client", gratuito, da creare con il tuo account Google:

1. Vai su <https://console.cloud.google.com/> e accedi con il tuo account Google.
2. In alto, **Seleziona un progetto → Nuovo progetto**. Nome: `Tracker 10eLotto`. Crea e selezionalo.
3. Menu ☰ → **API e servizi → Libreria**. Cerca **Google Drive API** → **Abilita**.
4. Menu ☰ → **Google Auth Platform** (o "Schermata consenso OAuth") → **Inizia**:
   - Nome app: `Tracker 10eLotto`, email di assistenza: la tua.
   - Pubblico: **Esterno**.
   - Email di contatto: la tua. Accetta e **Crea**.
5. Sezione **Pubblico** → **Utenti di test** → **Aggiungi utenti** → la tua Gmail → Salva.
6. Sezione **Client** → **Crea client**:
   - Tipo di applicazione: **Applicazione web**.
   - **Origini JavaScript autorizzate** → Aggiungi URI: `https://z7wireless7z.github.io`
   - Crea, poi copia l'**ID client** (finisce con `.apps.googleusercontent.com`).
7. Incolla l'ID in `config.js`, tra gli apici di `window.GOOGLE_CLIENT_ID = '';` e pubblica di nuovo l'app (oppure passalo a Claude e lo fa lui).

Il primo backup ti chiede di scegliere l'account e di dare il permesso. Google mostrerà l'avviso "Google non ha verificato questa app": è normale per un'app personale in modalità test. Tocca **Continua**.

L'app chiede solo il permesso `drive.file`: può vedere e modificare **soltanto i file che crea lei**, non il resto del tuo Drive.

## Aggiornare l'app

1. Modifica i file.
2. In `sw.js` aumenta `VERSIONE` (es. da `'v1'` a `'v2'`): così i telefoni scaricano la versione nuova.
3. Fai commit e push su GitHub. Dopo un minuto circa, alla successiva apertura dell'app con internet, la versione nuova è attiva.

## File

| File | A cosa serve |
|---|---|
| `index.html` | L'app |
| `config.js` | ID client di Google per il backup su Drive |
| `manifest.webmanifest` | Nome, icona e colori dell'app installata |
| `sw.js` | Service worker: tiene l'app in cache per l'uso offline |
| `icons/` | Icone dell'app |
| `vendor/` | Tailwind e Font Awesome, in locale per funzionare offline |
