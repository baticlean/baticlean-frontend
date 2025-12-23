// vite-plugin-version-injector.js 

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// On lit le fichier package.json de manière robuste pour obtenir la version
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'));

export default function versionInjector() {
  const manualVersion = pkg.version;
  const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const fullVersion = `${manualVersion}-${gitCommitHash}`; // La version complète pour la détection

  return {
    name: 'version-injector',
    
    transformIndexHtml(html) {
      // On injecte toujours la version COMPLÈTE dans l'HTML pour une identification unique
      const metaTag = `<meta name="app-version" content="${fullVersion}">`;
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },
    
    closeBundle() {
      const distPath = path.resolve(process.cwd(), 'dist');
      if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);
      
      // ✅ Le fichier meta.json contient maintenant les deux versions
      const meta = { 
        fullVersion: fullVersion,          // Pour la logique de détection
        displayVersion: manualVersion      // Pour l'affichage utilisateur
      };
      fs.writeFileSync(path.join(distPath, 'meta.json'), JSON.stringify(meta));
      
      console.log(`\nVersion complète injectée : ${fullVersion}`);
    }
  };
}
