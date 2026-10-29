import { loadDatabase, saveDatabase, resetDatabase, uploaderProfiles } from './data.js';
import { initCursor } from './cursor.js';

initCursor();

let db = loadDatabase();
let activeCat = "All";
let query = "";
let logoClicks = 0;

const torrentList = document.getElementById('torrentList');
const posterStrip = document.getElementById('posterStrip');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const hoverPoster = document.getElementById('hoverPoster');
const nfoModal = document.getElementById('nfoModal');
const uploadModal = document.getElementById('uploadModal');
const ircBox = document.getElementById('ircBox');
const ircToggleBtn = document.getElementById('ircToggleBtn');
const ircMessages = document.getElementById('ircMessages');
const ircForm = document.getElementById('ircForm');
const ircInput = document.getElementById('ircInput');
const easterEggBanner = document.getElementById('easterEggBanner');

function renderPosters() {
    posterStrip.innerHTML = '';
    const topItems = [...db].sort((a, b) => b.seeds - a.seeds).slice(0, 8);
    topItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'poster-card';
        div.innerHTML = `
            <span class="poster-tag">${item.cat} // ${item.size}</span>
            <div class="poster-art">[:: ${item.uploader.toUpperCase()} ::]<br>#0x${item.id}</div>
            <div class="poster-title">${item.title.substring(0, 28)}...</div>
        `;
        div.onclick = () => openNfo(item);
        posterStrip.appendChild(div);
    });
}

function checkSearchEasterEggs(q) {
    if (!easterEggBanner) return false;
    easterEggBanner.style.display = 'none';

    if (q.includes('cmake')) {
        easterEggBanner.style.display = 'block';
        easterEggBanner.style.borderColor = '#d9534f';
        easterEggBanner.style.background = '#1f0d0d';
        easterEggBanner.style.color = '#ff6b6b';
        easterEggBanner.textContent = '[ FATAL ERROR 0x7719: merp7719 HAS BANNED "CMAKE" FROM 0xday! USE ES6 MODULES OR MAKEFILES INSTEAD ]';
        return true;
    }

    if (q.includes('wake me up') || q.includes('september')) {
        easterEggBanner.style.display = 'block';
        easterEggBanner.style.borderColor = '#5cb85c';
        easterEggBanner.style.background = '#0f1f0f';
        easterEggBanner.style.color = '#99eab1';
        easterEggBanner.textContent = '[ GREENDAY BOT: SEPTEMBER ENDED 28 DAYS AGO! ALL PUNK FLAC RELEASES ARE NOW 100% FREELEECH! ]';
        return false;
    }

    if (q.includes('espresso') || q.includes('dhaka')) {
        easterEggBanner.style.display = 'block';
        easterEggBanner.style.borderColor = '#ea9999';
        easterEggBanner.style.background = '#1f1212';
        easterEggBanner.style.color = '#ea9999';
        easterEggBanner.textContent = '[ SABRINA_BANGLADESH NODE: 10Gbps DHAKA FIBER BOOST ACTIVATED — CAFFEINE LEVELS AT 400% ]';
        return false;
    }

    if (q.includes('0xday') || q.includes('dream')) {
        easterEggBanner.style.display = 'block';
        easterEggBanner.style.borderColor = '#e0d599';
        easterEggBanner.style.background = '#1c1a10';
        easterEggBanner.style.color = '#e0d599';
        easterEggBanner.textContent = '[ 0xday! SYSTEM MESSAGE: WHERE ALL YOUR DREAMS COME TRUE // SEED FOREVER ]';
        return false;
    }

    return false;
}

function renderTable() {
    const q = query.trim().toLowerCase();
    const haltTable = checkSearchEasterEggs(q);

    if (haltTable) {
        torrentList.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:25px; color:#ff6b6b; font-weight:bold;">
            merp7719 intercepted your search query and deleted CMakeLists.txt from your hard drive.
        </td></tr>`;
        return;
    }

    let rows = db.filter(item => {
        const matchCat = activeCat === "All" || item.cat === activeCat;
        const matchSearch = !q ||
                            q === 'wake me up' ||
                            q === '0xday' ||
                            item.title.toLowerCase().includes(q) ||
                            item.spec.toLowerCase().includes(q) ||
                            item.uploader.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const sortMode = sortSelect.value;
    rows.sort((a, b) => {
        if (sortMode === 'seeds') return b.seeds - a.seeds;
        if (sortMode === 'size') return b.sizeMB - a.sizeMB;
        if (sortMode === 'date') return b.added.localeCompare(a.added);
    });

    torrentList.innerHTML = '';

    if (rows.length === 0) {
        torrentList.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">
            [ 0x00 RECORDS FOUND — EVEN DANKLOVIC & SABRINA_BANGLADESH DON'T HAVE THIS YET ]
        </td></tr>`;
        updateStats();
        return;
    }

    rows.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="cat-badge cat-${item.cat}">${item.cat}</span></td>
            <td>
                <div class="file-cell">
                    <div>
                        <span class="file-title">${item.title}</span>
                        <div class="file-sub">${item.spec}</div>
                    </div>
                    <div class="dl-links">
                        <button type="button" class="dl-btn" data-magnet="${item.magnet}">[MAGNET]</button>
                        <button type="button" class="dl-btn" data-nfo="${item.id}">[NFO]</button>
                    </div>
                </div>
            </td>
            <td class="num-col">${item.added}</td>
            <td class="num-col">${item.size}</td>
            <td class="seed">${item.seeds}</td>
            <td class="leech">${item.leeches}</td>
            <td><span class="vip-user" data-user="${item.uploader}" style="color:#b8b8b8; text-decoration:underline; cursor:pointer;">${item.uploader}</span></td>
        `;

        const titleEl = tr.querySelector('.file-title');
        titleEl.addEventListener('click', () => openNfo(item));
        titleEl.addEventListener('mouseenter', (e) => showHover(e, item));
        titleEl.addEventListener('mousemove', moveHover);
        titleEl.addEventListener('mouseleave', () => hoverPoster.style.display = 'none');

        const magBtn = tr.querySelector('[data-magnet]');
        magBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(item.magnet);
            magBtn.textContent = '[COPIED]';
            setTimeout(() => magBtn.textContent = '[MAGNET]', 1000);
        });

        tr.querySelector('[data-nfo]').addEventListener('click', () => openNfo(item));
        tr.querySelector('.vip-user').addEventListener('click', () => openUploaderProfile(item.uploader));

        torrentList.appendChild(tr);
    });

    updateStats();
}

function showHover(e, item) {
    hoverPoster.style.display = 'block';
    hoverPoster.innerHTML = `
        <div style="font-weight:bold; color:#5cb85c; margin-bottom:3px;">0x${item.id} // ${item.uploader}</div>
        <div style="color:#aaa; font-size:10px; margin-bottom:5px;">${item.spec}</div>
        <div style="background:#161616; border:1px solid #2e2e2e; padding:8px 4px; text-align:center; color:#fff; font-weight:bold;">
            SWARM: ${item.seeds} S / ${item.leeches} L
        </div>
    `;
    moveHover(e);
}

function moveHover(e) {
    hoverPoster.style.left = `${e.clientX + 22}px`;
    hoverPoster.style.top = `${e.clientY + 18}px`;
}

function openNfo(item) {
    window.location.href = `nfo.html?id=${item.id}`;
}

function openUploaderProfile(username) {
    window.location.href = `nfo.html?user=${encodeURIComponent(username)}`;
}

function updateStats() {
    document.getElementById('statTotal').textContent = db.length;
    document.getElementById('statSeeds').textContent = db.reduce((s, x) => s + x.seeds, 0);
    document.getElementById('statLeeches').textContent = db.reduce((s, x) => s + x.leeches, 0);
}

function appendIrcLine(user, color, text) {
    if (!ircMessages) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const div = document.createElement('div');
    div.innerHTML = `<span style="color:#666;">[${time}]</span> <span style="color:${color}; font-weight:bold;">&lt;${user}&gt;</span> ${text}`;
    ircMessages.appendChild(div);
    ircMessages.scrollTop = ircMessages.scrollHeight;
}

if (ircToggleBtn && ircBox) {
    ircToggleBtn.addEventListener('click', () => {
        const isHidden = ircBox.style.display === 'none';
        ircBox.style.display = isHidden ? 'block' : 'none';
        ircToggleBtn.textContent = isHidden ? '[IRC: ONLINE]' : '[IRC: HIDDEN]';
        ircToggleBtn.style.color = isHidden ? '#5cb85c' : '#bbbbbb';
        ircToggleBtn.style.borderColor = isHidden ? '#5cb85c' : '#383838';
    });
}

if (ircForm) {
    ircForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = ircInput.value.trim();
        if (!msg) return;
        appendIrcLine('guest_0x', '#ffffff', msg);
        ircInput.value = '';

        const lower = msg.toLowerCase();
        setTimeout(() => {
            if (lower.includes('cmake')) {
                appendIrcLine('+merp7719', '#99bce0', 'DID SOMEONE JUST SAY CMAKE?! *loads banhammer*');
            } else if (lower.includes('sabrina') || lower.includes('dhaka') || lower.includes('espresso')) {
                appendIrcLine('@sabrina_bangladesh', '#ea9999', 'working on 3 new 2160p encodes rn, fueled by double espresso!');
            } else if (lower.includes('greenday') || lower.includes('september') || lower.includes('wake')) {
                appendIrcLine('%greenday', '#99eab1', 'wake me up when your seed ratio hits 2.0');
            } else if (lower.includes('danklovic') || lower.includes('hl3')) {
                appendIrcLine('@danklovic', '#e0d599', 'trust me bro the Half-Life 3 build is 100% real, compiled it in my submarine');
            } else {
                const bots = [
                    { u: '@danklovic', c: '#e0d599', t: 'based and 0xday-pilled. keep seeding!' },
                    { u: '+merp7719', c: '#99bce0', t: 'real programmers link scripts with type="module"' },
                    { u: '@sabrina_bangladesh', c: '#ea9999', t: 'peering with you at 10Gbps from Dhaka!' },
                    { u: '%greenday', c: '#99eab1', t: 'dont forget to grab the 24bit Vinyl FLAC pack!' }
                ];
                const pick = bots[Math.floor(Math.random() * bots.length)];
                appendIrcLine(pick.u, pick.c, pick.t);
            }
        }, 450);
    });
}

document.querySelectorAll('.left-nav .vip-user').forEach(el => {
    el.addEventListener('click', () => openUploaderProfile(el.dataset.user));
});

document.getElementById('logoEasterEgg').addEventListener('click', () => {
    logoClicks++;
    if (logoClicks === 3) {
        db.forEach(item => item.seeds += 10000);
        renderTable();
        appendIrcLine('SYSTEM', '#5cb85c', 'ROOT OVERRIDE ACTIVATED: +10,000 SEEDERS GRANTED BY DANKLOVIC!');
        logoClicks = 0;
    }
});

document.getElementById('catMenu').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    document.querySelectorAll('#catMenu li').forEach(el => el.classList.remove('active'));
    li.classList.add('active');
    activeCat = li.dataset.cat;
    renderTable();
});

document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        searchInput.value = tag.dataset.tag;
        query = tag.dataset.tag;
        renderTable();
    });
});

searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    renderTable();
});

document.getElementById('searchBtn').addEventListener('click', () => {
    query = searchInput.value;
    renderTable();
});

sortSelect.addEventListener('change', renderTable);

document.getElementById('closeNfo').onclick = () => nfoModal.style.display = 'none';
document.getElementById('openUploadBtn').onclick = () => uploadModal.style.display = 'flex';
document.getElementById('closeUpload').onclick = () => uploadModal.style.display = 'none';

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        nfoModal.style.display = 'none';
        uploadModal.style.display = 'none';
    }
});

document.getElementById('resetDataBtn').onclick = () => {
    db = resetDatabase();
    query = "";
    searchInput.value = "";
    renderPosters();
    renderTable();
};

document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const entry = {
        id: Math.floor(Math.random() * 900) + 200,
        title: document.getElementById('upTitle').value,
        cat: document.getElementById('upCat').value,
        added: new Date().toISOString().split('T')[0],
        size: document.getElementById('upSize').value,
        sizeMB: Number(document.getElementById('upSizeBytes').value) || 1000,
        seeds: 420,
        leeches: 69,
        uploader: document.getElementById('upUser').value,
        spec: "0xday! Custom Scene Drop",
        magnet: document.getElementById('upMagnet').value,
        nfo: document.getElementById('upNfo').value
    };
    db.unshift(entry);
    saveDatabase(db);
    appendIrcLine('ANNOUNCE', '#5cb85c', `NEW TORRENT: ${entry.title} uploaded by ${entry.uploader}!`);
    e.target.reset();
    uploadModal.style.display = 'none';
    renderPosters();
    renderTable();
});

renderPosters();
renderTable();