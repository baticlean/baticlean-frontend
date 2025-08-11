// vite-plugin-version-injector.js

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
// On importe la version depuis package.json
import pkg from './package.json';

export default function versionInjector() {
  // On récupère la version manuelle (ex: "1.0.0")
  const manualVersion = pkg.version;
  // On récupère l'identifiant court du commit git (ex: "c6d664a")
  const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

  // On combine les deux pour créer la version finale
  const buildVersion = `${manualVersion}-${gitCommitHash}`;

  return {
    name: 'version-injector',
    
    transformIndexHtml(html) {
      const metaTag = `<meta name="app-version" content="${buildVersion}">`;
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },
    
    closeBundle() {
      const distPath = path.resolve(process.cwd(), 'dist');
      if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);
      
      const meta = { version: buildVersion };
      fs.writeFileSync(path.join(distPath, 'meta.json'), JSON.stringify(meta));
      
      console.log(`\nVersion complète injectée : ${buildVersion}`);
    }
  };
}