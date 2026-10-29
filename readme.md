# 0xday! [where all your dreams come true]

a classic rarbg style torrent site clone i built for a web development project using vanilla html, css and modular js (`type="module"`). 

no blue ai looking theme, just pure dark mode with crt scanlines, custom hud cursor, live irc chat, standalone `.nfo` file viewer/downloader and a bunch of easter eggs.

## live link

you dont even need to download anything to test it, just open the github pages link here:
**[https://fillintheblanks1.github.io/torrent-clone-project/](https://fillintheblanks1.github.io/torrent-clone-project/)**

---

## how to run this locally from terminal

since this project uses es6 modules (`import` / `export` across different js files), double clicking `index.html` directly wont load the data because browsers block local modules with cors. you just need to run a quick local server:

### step 1: clone the repo
```bash
git clone [https://github.com/fillintheblanks1/torrent-clone-project.git](https://github.com/fillintheblanks1/torrent-clone-project.git)
cd torrent-clone-project
```

### step 2: start a local server (pick any one)

* **using python (fastest in terminal):**
  ```bash
  python -m http.server 8000
  ```
  then open `http://localhost:8000` in your browser.

* **using node.js:**
  ```bash
  npx serve
  ```

* **using vs code:**
  install the **Live Server** extension, right click `index.html` and click **Open with Live Server**.

---

## what files contain what

| file / folder | what it does |
| :--- | :--- |
| `index.html` | main webpage structure, layout, modals and links to css/js |
| `nfo.html` | dedicated standalone ascii `.nfo` viewer page with crt phosphor color toggles |
| `css/main.css` | rarbg dark theme, 1px borders, table styling and crt scanline filter |
| `css/cursor.css` | custom green crosshair hud cursor and click ripple animations |
| `js/main.js` | main logic: renders table, search filters, upload form, irc chat and links to `nfo.html` |
| `js/nfo.js` | reads url params (`?id=` or `?user=`), renders ascii nfo and downloads real `.nfo` files |
| `js/data.js` | fake torrent database array, uploader profiles and localstorage save/reset |
| `js/cursor.js` | tracks mouse x/y coordinates in hex (`0x`) and animates the custom cursor |

### folder structure
```text
torrent-clone-project/
├── index.html
├── nfo.html
├── README.md
├── css/
│   ├── main.css
│   └── cursor.css
└── js/
    ├── main.js
    ├── nfo.js
    ├── data.js
    └── cursor.js
```

---

## features & easter eggs to try

* **standalone `.nfo` viewer & downloader:** click any torrent title or `[NFO]` button to open `nfo.html`, switch between Green, Amber, and DOS White CRT themes, and download an actual `.nfo` file to your PC.
* **hall of legends:** click on `danklovic`, `merp7719`, `sabrina_bangladesh` or `greenday` in the sidebar or table to view their secret ascii dossiers.
* **live `#0xday` irc chat:** type messages in the top irc box and the bots will actually reply to you based on what you say.
* **search bar easter eggs:** try searching `cmake`, `wake me up`, `espresso`, or `0xday` in the search box.
* **root override:** click the top left `0xday!` logo 3 times to add +10,000 seeders to every torrent.
* **custom uploads:** click `[+ Upload Release]` to add your own torrent to the table (saves in your browser localstorage, and you can reset it anytime with `[Purge Cache]`).

---

## what i could have implemented (future upgrades)

i kept it lightweight with vanilla js and `localStorage`. if i wanted to scale this into a full production project, here is what i could have added:

* **build tools & bundler (`npm` / `npx vite`):** instead of raw es6 modules, i could use **Vite** (`npx create-vite`) as a build system (kind of like CMake for web) to bundle, minify, and optimize all the js/css files into a single fast production build.
* **real backend & database server (`Node.js` + `PostgreSQL` / `MongoDB` / `Supabase`):** right now, uploaded torrents save in `localStorage` (so only you see what you upload). hooking up an Express.js or Fastify backend with a real SQL/NoSQL database would mean anyone visiting the site sees new uploads globally in real time.
* **real multiplayer irc chat (`WebSockets` / `Socket.io`):** currently the `#0xday-scene` irc chat uses bot replies. with WebSockets, actual users on the site could chat with each other live in the same room.
* **browser-based p2p torrenting (`WebTorrent` api):** using the open-source `webtorrent` js library (which runs over WebRTC), the site could actually stream and seed real legal Linux ISOs or open-source media directly inside the browser tab without needing qBittorrent.
* **actual `.torrent` file parser (`bencode`):** instead of typing the file size and magnet hash manually in the upload form, i could add a drag-and-drop zone that reads binary `.torrent` files, decodes the bencoded metadata, and auto-generates the infohash and file tree.
* **tmdb / igdb api integration:** fetching real movie posters, imdb ratings, and game screenshots automatically when hovering over a release instead of text placeholders.
