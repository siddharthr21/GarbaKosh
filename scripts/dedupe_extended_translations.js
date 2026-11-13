const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'src', 'data', 'extendedTranslations.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// We can load EXTENDED_PHRASES by regex matching each language block or evaluating
// Let's parse each language block: 'en-US': { ... }, 'kn-IN': { ... }, etc.
const langs = ['en-US', 'kn-IN', 'hi-IN', 'ta-IN', 'te-IN', 'ml-IN'];

// Let's create an object of objects
const result = {};
langs.forEach(lang => { result[lang] = {}; });

// For each language, find the block
for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];
  const startPattern = `'${lang}': {`;
  const startIdx = content.indexOf(startPattern);
  if (startIdx === -1) continue;
  
  let endIdx;
  if (i < langs.length - 1) {
    const nextStart = `'${langs[i + 1]}': {`;
    endIdx = content.indexOf(nextStart);
    // Find the last closing brace before nextStart
    endIdx = content.lastIndexOf('}', endIdx);
  } else {
    // Last language, find the last closing brace
    endIdx = content.lastIndexOf('};');
    endIdx = content.lastIndexOf('}', endIdx - 1);
  }

  const blockText = content.slice(startIdx + startPattern.length, endIdx);
  // Match key-value pairs: "key" or 'key' followed by : and "value" or 'value'
  const lineRegex = /^\s*["'](.+?)["']\s*:\s*["']([\s\S]*?)["'],?\s*$/gm;
  let match;
  while ((match = lineRegex.exec(blockText)) !== null) {
    const key = match[1];
    const val = match[2];
    result[lang][key] = val;
  }
}

// Now re-generate the file cleanly without ANY duplicate keys
let output = `import { SupportedLanguageCode } from './translations';\n\nexport const EXTENDED_PHRASES: Record<SupportedLanguageCode, Record<string, string>> = {\n`;

for (const lang of langs) {
  output += `  '${lang}': {\n`;
  const keys = Object.keys(result[lang]);
  keys.forEach((key, index) => {
    const comma = index === keys.length - 1 ? '' : ',';
    output += `    ${JSON.stringify(key)}: ${JSON.stringify(result[lang][key])}${comma}\n`;
  });
  output += `  },\n`;
}

output += `};\n`;

fs.writeFileSync(targetFile, output, 'utf8');
console.log('Successfully deduped and formatted extendedTranslations.ts. Keys per language:');
for (const lang of langs) {
  console.log(`  ${lang}: ${Object.keys(result[lang]).length} keys`);
}
