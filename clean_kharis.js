const fs = require('fs');
let file = fs.readFileSync('src/components/KlioChat.tsx', 'utf8');

file = file.replace(/activeMode === 'kharis'\s*\?\s*`[^`]*`\s*:\s*(`[^`]*`)/g, '$1');
file = file.replace(/activeMode === 'kharis'\s*\?\s*'[^']*'\s*:\s*('[^']*')/g, '$1');

// also replace some variables
file = file.replace(/const next = val === 'kharis' \? 'kharis' : val === 'klio' \? 'coder' : 'Klio';/g, "const next = val === 'klio' ? 'coder' : 'Klio';");
file = file.replace(/activeMode === 'kharis' \? "Modo Voz \(Kháris\)" : activeMode === 'coder' \? "Modo Voz \(Klio\)" : "Modo Voz \(Klio\)"/g, 'activeMode === \'coder\' ? "Modo Voz (Klio)" : "Modo Voz (Klio)"');

// line 1039:
file = file.replace(/\s*\} : m\.sender === 'kharis' \? \{\s*tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '\/brand\/kharis\.png', shadow8: 'shadow-\[0_0_8px_rgba\(224,168,78,0\.2\)\]'\s*/g, "");

// line 1059:
file = file.replace(/onClick=\{\(\) => setActiveMode\(prev => prev === 'Klio' \? 'coder' : prev === 'coder' \? 'kharis' : 'Klio'\)\}/g, "onClick={() => setActiveMode(prev => prev === 'Klio' ? 'coder' : 'Klio')}");

// activeMode === 'kharis' on line 897 (which is `activeMode === 'coder' ? t.tagName : activeMode === 'kharis' ? t.tagName : 'Klio'`)
file = file.replace(/activeMode === 'coder' \? t\.tagName\s*:\s*activeMode === 'kharis'\s*\?\s*t\.tagName\s*:\s*'Klio'/g, "activeMode === 'coder' ? t.tagName : 'Klio'");

fs.writeFileSync('src/components/KlioChat.tsx', file, 'utf8');
