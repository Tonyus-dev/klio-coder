import re

with open('src/components/KlioChat.tsx', 'r') as f:
    text = f.read()

# Replace state definition
text = re.sub(
    r"const \[KlioVersion, setKlioVersion\] = useState\<'V27' \| 'V27b'\>\(\(\) => \{[^{}]*\}\);",
    "const [runtimeMode, setRuntimeMode] = useState<'online' | 'local'>(() => {\n    const legacy = localStorage.getItem('klio_version');\n    if (legacy === 'V27') return 'online';\n    if (legacy === 'V27b') return 'local';\n    return (localStorage.getItem('klio_runtime_mode') as 'online' | 'local') || 'online';\n  });",
    text
)

# Replace useEffect for event listener
text = text.replace(
    "const handleVersionChange = (e: any) => {\n      setKlioVersion(e.detail);\n    };\n    window.addEventListener('KlioVersionChanged', handleVersionChange);\n    return () => window.removeEventListener('KlioVersionChanged', handleVersionChange);",
    "const handleVersionChange = (e: any) => {\n      setRuntimeMode(e.detail);\n    };\n    window.addEventListener('klioRuntimeModeChanged', handleVersionChange);\n    return () => window.removeEventListener('klioRuntimeModeChanged', handleVersionChange);"
)
text = text.replace(
    "const handleVersionChange = (e: any) => {\n      setKlioVersion(e.detail);\n    };\n    window.addEventListener('klioVersionChanged', handleVersionChange);\n    return () => window.removeEventListener('klioVersionChanged', handleVersionChange);",
    "const handleVersionChange = (e: any) => {\n      setRuntimeMode(e.detail);\n    };\n    window.addEventListener('klioRuntimeModeChanged', handleVersionChange);\n    return () => window.removeEventListener('klioRuntimeModeChanged', handleVersionChange);"
)

# Replace local storage sync in setup
text = re.sub(
    r"setKlioVersion\(\(localStorage\.getItem\('Klio_version'\) as 'V27' \| 'V27b'\) \|\| 'V27'\);",
    "const legacy = localStorage.getItem('klio_version');\n      if (legacy === 'V27') setRuntimeMode('online');\n      else if (legacy === 'V27b') setRuntimeMode('local');\n      else setRuntimeMode((localStorage.getItem('klio_runtime_mode') as 'online' | 'local') || 'online');",
    text
)

# Replace effect that saves to local storage
text = re.sub(
    r"useEffect\(\(\) => \{\n\s*localStorage\.setItem\('Klio_version', KlioVersion\);\n\s*\}, \[KlioVersion\]\);",
    "useEffect(() => {\n    localStorage.setItem('klio_runtime_mode', runtimeMode);\n  }, [runtimeMode]);",
    text
)

# Replace KlioVersion === 'V27' and 'V27b' with runtimeMode === 'online' and 'local'
text = text.replace("KlioVersion === 'V27'", "runtimeMode === 'online'")
text = text.replace("KlioVersion === 'V27b'", "runtimeMode === 'local'")

# Text replacements inside strings
text = text.replace("[Klio V27 - Mobile via Klio API]", "[Klio Online - via Klio API]")
text = text.replace("[Klio V27b - Desktop via Ollama Local]", "[Klio Local - via Ollama]")
text = text.replace("Klio V27 (Mobile)", "Klio Online")
text = text.replace("Klio V27b (Desktop)", "Klio Local")
text = text.replace("a Klio V27b (Desktop)", "a Klio Local")

text = text.replace("V27 (Mobile) vs V27b (Desktop)", "Online vs Local")
text = text.replace("Klio V27 - Mobile", "Klio Online")
text = text.replace("V27b", "Local")
# Also fix the specific string on line 803: "V27b?"
text = text.replace("V27b?", "Local?")

with open('src/components/KlioChat.tsx', 'w') as f:
    f.write(text)

