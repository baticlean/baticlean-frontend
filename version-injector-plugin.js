// vite-plugin-version-injector.js

import fs from 'fs';
import path from 'path';

export default function versionInjector() {
  // Lit la version actuelle depuis le fichier racine
  const versionPath = path.resolve(process.cwd(), 'version.json');
  const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));
  const currentVersion = versionData.version;

  // Logique d'incrémentation
  const parts = currentVersion.split('.').map(Number);
  let i = parts.length - 1;
  while (i >= 0) {
    parts[i]++;
    if (parts[i] < 10) break;
    if (i > 0) {
      parts[i] = 0;
      i--;
    }
  }
  const newVersion = parts.join('.');

  const updateTimestamp = new Date().toISOString();

  return {
    name: 'version-injector',

    transformIndexHtml(html) {
      const metaTag = `<meta name="app-version" content="${newVersion}">`;
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },

    closeBundle() {
      const distPath = path.resolve(process.cwd(), 'dist');
      if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

      // Le fichier meta.json contient maintenant toutes les infos
      const meta = { 
        oldVersion: currentVersion,
        newVersion: newVersion, 
        timestamp: updateTimestamp 
      };
      fs.writeFileSync(path.join(distPath, 'meta.json'), JSON.stringify(meta));

      // On met à jour le fichier version.json pour le prochain build
      fs.writeFileSync(versionPath, JSON.stringify({ version: newVersion }, null, 2));

      console.log(`\nVersion précédente: ${currentVersion}`);
      console.log(`Nouvelle version injectée: ${newVersion}`);
    }
  };
}