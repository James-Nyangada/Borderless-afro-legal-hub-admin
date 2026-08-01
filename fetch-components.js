const https = require('https');
const fs = require('fs');
const path = require('path');

const components = ['button', 'card', 'input', 'table', 'badge', 'select', 'dropdown-menu', 'sidebar', 'avatar', 'separator', 'skeleton', 'sheet', 'tooltip', 'label'];

fs.mkdirSync(path.join(__dirname, 'components/ui'), { recursive: true });

components.forEach(comp => {
  https.get(`https://ui.shadcn.com/r/styles/new-york/${comp}.json`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.files) {
          json.files.forEach(file => {
            const content = file.content;
            const filename = file.path || file.name;
            const basename = path.basename(filename);
            const filepath = path.join(__dirname, 'components/ui', basename);
            fs.writeFileSync(filepath, content);
            console.log(`Wrote ${filepath}`);
          });
        }
      } catch (e) {
        console.error(`Error parsing ${comp}:`, e);
      }
    });
  }).on('error', (e) => {
    console.error(`Network error on ${comp}:`, e);
  });
});
