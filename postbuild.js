// postbuild.js

const fs = require('fs');
const path = require('path');

// Génère un identifiant unique basé sur la date et l'heure actuelles
const buildVersion = new Date().toISOString();

// Crée le fichier meta.json dans le dossier 'dist'
const meta = { version: buildVersion };
fs.writeFileSync(path.join(__dirname, 'dist', 'meta.json'), JSON.stringify(meta));

// Injecte la version dans le fichier index.html
const indexPath = path.join(__dirname, 'dist', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Ajoute la balise meta juste avant la fermeture de </head>
const metaTag = `<meta name="app-version" content="${buildVersion}">`;
indexHtml = indexHtml.replace('</head>', `  ${metaTag}\n</head>`);

fs.writeFileSync(indexPath, indexHtml);

console.log(`Version injectée : ${buildVersion}`);