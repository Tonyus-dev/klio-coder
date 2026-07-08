import re

with open('src/components/KlioChat.tsx', 'r') as f:
    text = f.read()

# Replace ternary operations
text = re.sub(r"activeMode === 'kharis'\s*\?\s*`[^`]*`\s*:\s*(`[^`]*`)", r"\1", text)
text = re.sub(r"activeMode === 'kharis'\s*\?\s*'[^']*'\s*:\s*('[^']*')", r"\1", text)

text = text.replace(
    "const next = val === 'kharis' ? 'kharis' : val === 'klio' ? 'coder' : 'Klio';",
    "const next = val === 'klio' ? 'coder' : 'Klio';"
)
text = text.replace(
    "activeMode === 'kharis' ? \"Modo Voz (Kháris)\" : activeMode === 'coder' ? \"Modo Voz (Klio)\" : \"Modo Voz (Klio)\"",
    "activeMode === 'coder' ? \"Modo Voz (Klio)\" : \"Modo Voz (Klio)\""
)
text = re.sub(
    r"\s*\} : m\.sender === 'kharis' \? \{\s*tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis\.png', shadow8: 'shadow-\[0_0_8px_rgba\(224,168,78,0\.2\)\]'\s*",
    "",
    text
)
text = text.replace(
    "onClick={() => setActiveMode(prev => prev === 'Klio' ? 'coder' : prev === 'coder' ? 'kharis' : 'Klio')}",
    "onClick={() => setActiveMode(prev => prev === 'Klio' ? 'coder' : 'Klio')}"
)
text = re.sub(
    r"activeMode === 'coder' \? t\.tagName\s*:\s*activeMode === 'kharis'\s*\?\s*t\.tagName\s*:\s*'Klio'",
    "activeMode === 'coder' ? t.tagName : 'Klio'",
    text
)

with open('src/components/KlioChat.tsx', 'w') as f:
    f.write(text)

