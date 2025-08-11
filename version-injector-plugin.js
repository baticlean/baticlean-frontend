// vite-plugin-version-injector.js

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Une manière plus robuste de lire le package.json
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'));

export default function versionInjector() {
  const manualVersion = pkg.version;
  const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
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