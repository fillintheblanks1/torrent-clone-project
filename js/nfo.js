import { loadDatabase, uploaderProfiles } from './data.js';
import { initCursor } from './cursor.js';

initCursor();

const params = new URLSearchParams(window.location.search);
const releaseId = Number(params.get('id'));
const username = params.get('user');

const db = loadDatabase();
const screen = document.getElementById('nfoViewerScreen');
const headerLabel = document.getElementById('headerFileLabel');
const copyMagnetBtn = document.getElementById('copyMagnetBtn');
const downloadNfoBtn = document.getElementById('downloadNfoBtn');
const actionStatus = document.getElementById('actionStatus');
const fileTreeBox = document.getElementById('fileTreeBox');

let rawNfoText = "";
let downloadFileName = "0xday_release.nfo";
let currentMagnet = "";

const asciiBanner = `
  ██████╗ ██╗  ██╗██████╗  █████╗ ██╗   ██╗██╗
 ██╔═████╗╚██╗██╔╝██╔══██╗██╔══██╗╚██╗ ██╔╝██║
 ██║██╔██║ ╚███╔╝ ██║  ██║███████║ ╚████╔╝ ██║
 ████╔╝██║ ██╔██╗ ██║  ██║██╔══██║  ╚██╔╝  ╚═╝
 ╚██████╔╝██╔╝ ██╗██████╔╝██║  ██║   ██║   ██╗
  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝
 [ 0xday! SCENE ARCHIVE // WHERE ALL YOUR DREAMS COME TRUE ]`;

function buildReleaseNfo(item) {
    const cleanName = item.title.replace(/[^a-zA-Z0-9._-]/g, '_');
    downloadFileName = `${cleanName}.nfo`;
    currentMagnet = item.magnet;
    headerLabel.textContent = `// ${downloadFileName}`;

    rawNfoText = `${asciiBanner}
================================================================================
 RELEASE NAME..: ${item.title}
 RELEASE ID....: 0x${item.id}
 CATEGORY......: ${item.cat}
 UPLOADER......: ${item.uploader}
 RELEASE DATE..: ${item.added}
 TOTAL SIZE....: ${item.size} (${item.sizeMB} MB)
 SWARM STATUS..: ${item.seeds} Seeders / ${item.leeches} Leechers
 SPECS.........: ${item.spec}
 MAGNET URI....: ${item.magnet}
================================================================================

 [:: SCENE RELEASE NOTES & MEDIAINFO ::]

${item.nfo || "No extra NFO notes attached."}

================================================================================
 [:: GREETS & SHOUTOUTS ::]
 danklovic // merp7719 // sabrina_bangladesh // greenday // #0xday-scene
 "Seed until your router melts. CMake is strictly prohibited."
================================================================================`;

    screen.textContent = rawNfoText;

    fileTreeBox.innerHTML = `
        <div style="color:#dcdcdc; font-weight:bold; margin-bottom:6px;">INCLUDED FILES IN TORRENT ARCHIVE:</div>
        <div>+-- ${item.title}/</div>
        <div>|   +-- <span style="color:#5cb85c;">${downloadFileName}</span> (4.2 KB)</div>
        <div>|   +-- ${item.title}.mkv.part01 (${item.size})</div>
        <div>|   +-- checksums.sfv (1.1 KB)</div>
        <div>|   +-- <a href="nfo.html?user=${item.uploader}" style="color:#e0d599; text-decoration:underline;">uploader_${item.uploader}_dossier.nfo</a></div>
    `;
}

function buildUserDossierNfo(user) {
    const profile = uploaderProfiles[user] || {
        rank: "0xday! Scene Contributor",
        ratio: "1.05",
        bio: "Mysterious underground seeder."
    };

    downloadFileName = `${user}_dossier.nfo`;
    headerLabel.textContent = `// ${downloadFileName}`;
    copyMagnetBtn.style.display = 'none';

    const userUploads = db.filter(t => t.uploader.toLowerCase() === user.toLowerCase());

    rawNfoText = `${asciiBanner}
================================================================================
 VIP HANDLE....: ${user}
 SCENE RANK....: ${profile.rank}
 SHARE RATIO...: ${profile.ratio}
 TOTAL UPLOADS.: ${userUploads.length} Indexed Releases on 0xday!
 STATUS........: ONLINE IN #0xday-scene
================================================================================

 [:: OPERATOR LORE & BIOGRAPHY ::]

 ${profile.bio}

================================================================================
 [:: RELEASES UPLOADED BY ${user.toUpperCase()} ::]
${userUploads.map(u => ` -> [0x${u.id}] ${u.title} (${u.size} | S:${u.seeds})`).join('\n') || ' -> No public releases listed.'}
================================================================================`;

    screen.textContent = rawNfoText;

    fileTreeBox.innerHTML = `
        <div style="color:#dcdcdc; font-weight:bold; margin-bottom:6px;">CLICK TO VIEW ${user.toUpperCase()}'S RELEASES:</div>
        ${userUploads.map(u => `<div>+-- <a href="nfo.html?id=${u.id}" style="color:#5cb85c; text-decoration:underline;">${u.title}.nfo</a> (${u.size})</div>`).join('')}
    `;
}

if (username) {
    buildUserDossierNfo(username);
} else {
    const found = db.find(item => item.id === releaseId) || db[0];
    buildReleaseNfo(found);
}

copyMagnetBtn.addEventListener('click', () => {
    if (!currentMagnet) return;
    navigator.clipboard.writeText(currentMagnet);
    actionStatus.style.display = 'inline';
    setTimeout(() => actionStatus.style.display = 'none', 1800);
});

downloadNfoBtn.addEventListener('click', () => {
    const blob = new Blob([rawNfoText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
        screen.className = `nfo-screen ${btn.dataset.theme}`;
    });
});