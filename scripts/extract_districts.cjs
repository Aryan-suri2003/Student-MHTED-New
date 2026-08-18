// Extract WB_DISTRICTS data from WestBengalMap.tsx into a separate JSON file
const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '..', 'src', 'components', 'WestBengalMap.tsx');
const content = fs.readFileSync(srcFile, 'utf-8');

// Find the WB_DISTRICTS array
const startMarker = 'export const WB_DISTRICTS: DistrictMapItem[] = ';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find WB_DISTRICTS');
  process.exit(1);
}

const dataStart = content.indexOf('[', startIdx);
// Find matching closing bracket by counting
let depth = 0;
let dataEnd = -1;
for (let i = dataStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) {
    dataEnd = i + 1;
    break;
  }
}

const jsonStr = content.substring(dataStart, dataEnd);

// Parse to validate and re-serialize
try {
  const data = JSON.parse(jsonStr);
  console.log(`Extracted ${data.length} districts`);
  
  const outFile = path.join(__dirname, '..', 'public', 'data', 'wb_districts_map.json');
  fs.writeFileSync(outFile, JSON.stringify(data));
  console.log(`Written to ${outFile} (${(fs.statSync(outFile).size / 1024).toFixed(1)} KB)`);
} catch (e) {
  console.error('JSON parse error:', e.message);
  // Try writing raw and let user fix
  const outFile = path.join(__dirname, '..', 'public', 'data', 'wb_districts_map.json');
  fs.writeFileSync(outFile, jsonStr);
  console.log(`Written raw to ${outFile} (${(fs.statSync(outFile).size / 1024).toFixed(1)} KB)`);
}
