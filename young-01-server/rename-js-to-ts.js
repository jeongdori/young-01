// rename-js-to-ts.js
const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            walk(full);
        } else if (file.endsWith('.js')) {
            const newName = full.replace(/\.js$/, '.ts');
            fs.renameSync(full, newName);
            console.log(`renamed: ${file} → ${path.basename(newName)}`);
        }
    });
}

walk(path.resolve(__dirname, 'src'));
