import re

# Fix app-registry.ts duplicate key
with open('src/lib/app-registry.ts', 'r') as f:
    text = f.read()
# Replace second occurrence of 'klio:' with 'klio_alt:'
text = text.replace("klio: {\n    id: 'klio',\n    name: 'Klio',", "klio_alt: {\n    id: 'klio',\n    name: 'Klio',")
with open('src/lib/app-registry.ts', 'w') as f:
    f.write(text)

# Fix facets.ts duplicate key
with open('src/lib/facets.ts', 'r') as f:
    text = f.read()
text = text.replace("klio: {\n    id: 'klio',", "klio_alt: {\n    id: 'klio',")
with open('src/lib/facets.ts', 'w') as f:
    f.write(text)

# Fix PromptScore.tsx type error
with open('src/promptforge/components/PromptScore.tsx', 'r') as f:
    text = f.read()
text = text.replace("<MiniBar key={key} value={score[key]} label={SCORE_LABELS[key]} />", "<MiniBar value={score[key]} label={SCORE_LABELS[key]} />")
with open('src/promptforge/components/PromptScore.tsx', 'w') as f:
    f.write(text)

# Fix StatsPage.tsx type error
with open('src/promptforge/pages/StatsPage.tsx', 'r') as f:
    text = f.read()
text = text.replace("<ModeBar key={m} mode={m} count={stats.prompts_by_mode[m] || 0} total={total} />", "<ModeBar mode={m} count={stats.prompts_by_mode[m] || 0} total={total} />")
with open('src/promptforge/pages/StatsPage.tsx', 'w') as f:
    f.write(text)

