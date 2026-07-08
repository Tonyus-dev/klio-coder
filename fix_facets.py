import re

with open('src/lib/facets.ts', 'r') as f:
    text = f.read()

# Remove the first klio block (the one with #C98A65)
text = re.sub(r"klio_alt:\s*\{\s*id:\s*'klio',\s*name:\s*'Klio',\s*color:\s*'#C98A65'[^}]+\},\s*", "", text)
# Rename klio_alt back to klio
text = text.replace("klio_alt: {", "klio: {")

with open('src/lib/facets.ts', 'w') as f:
    f.write(text)

with open('src/lib/app-registry.ts', 'r') as f:
    text = f.read()

# The first klio block in app-registry has color: '#C98A65'
# Since the block has nested braces (surfaces array), it's trickier to regex correctly.
# I'll just use string find to replace it.
block_to_remove = """klio: {
    id: 'klio',
    name: 'Klio',
    icon: 'Compass',
    color: '#C98A65', // Cobre Klio
    description: 'Gestão pessoal, agenda, jurídico, corpo e presença.',
    surfaces: [
      { id: 'chat', name: 'Presença Chat', description: 'Canal de diálogo com filtro Qwen 1.5B', status: 'real', path: '/klio' },
      { id: 'agenda', name: 'Agenda Pessoal', description: 'Compromissos e rituais diários', status: 'real', path: '/agenda' },
      { id: 'juridico', name: 'Jurídico', description: 'Salvaguardas e contratos legais', status: 'mock', path: '/juridico' }
    ]
  },
  """
text = text.replace(block_to_remove, "")
text = text.replace("klio_alt: {", "klio: {")
with open('src/lib/app-registry.ts', 'w') as f:
    f.write(text)

