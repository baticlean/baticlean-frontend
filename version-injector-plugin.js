// vite-plugin-version-injector.js

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export default function versionInjector() {
  // On récupère l'identifiant unique du commit git
  const buildVersion = execSync('git rev-parse --short HEAD').toString().trim();
  // On récupère la date et l'heure actuelles
  const buildTimestamp = new Date().toISOString();

  return {
    name: 'version-injector',
    
    transformIndexHtml(html) {
      const metaTag = `<meta name="app-version" content="${buildVersion}">`;
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },
    
    closeBundle() {
      const distPath = path.resolve(process.cwd(), 'dist');
      if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);
      
      // Le fichier meta contient maintenant la version ET la date
      const meta = { 
        version: buildVersion,
        timestamp: buildTimestamp
      };
      fs.writeFileSync(path.join(distPath, 'meta.json'), JSON.stringify(meta));
      
      console.log(`\nVersion injectée : ${buildVersion} (${buildTimestamp})`);
    }
  };
} 