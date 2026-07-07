const fs = require('fs');
const path = require('path');

const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(base64Png, 'base64');

['apple-touch-icon.png', 'icon-192.png', 'icon-512.png'].forEach(filename => {
    fs.writeFileSync(path.join(__dirname, 'public', filename), buffer);
});
console.log('Icons generated successfully.');
