// version-injector-plugin.js

import fs from 'fs';
import path from 'path';

export default function versionInjector() {
  // On génère la version une seule fois au début du build
  const buildVersion = new Date().toISOString();

  return {
    // Nom du plugin (utile pour le débogage)
    name: 'version-injector',
    
    // Ce hook est appelé par Vite pour transformer le fichier index.html final
    transformIndexHtml(html) {
      const metaTag = `<meta name="app-version" content="${buildVersion}">`;
      // On injecte la balise de manière sûre
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },
    
    // Ce hook est appelé par Vite juste avant de finaliser le build
    closeBundle() {
      // On s'assure que le dossier 'dist' existe
      const distPath = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
      }
      
      // On écrit le fichier meta.json
      const meta = { version: buildVersion };
      fs.writeFileSync(path.join(distPath, 'meta.json'), JSON.stringify(meta));
      
      console.log(`\nVersion injectée : ${buildVersion}`);
    }
  };
}