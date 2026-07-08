import re

with open('src/lib/app-registry.ts', 'r') as f:
    text = f.read()

# I will just find the whole klio: { ... }, klio: { ... } part.
# There are two klio blocks.
# I'll just rewrite the file content if possible.
