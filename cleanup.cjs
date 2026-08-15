const fs = require('fs');
const path = require('path');

const dir = 'e:/Maharashtra Dashboard/West-bengal-main/src/components/views';
const files = ['AffiliationView.tsx', 'CampusView.tsx', 'ResearchView.tsx'];

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove onClick that calls onOpenDrilldown
    content = content.replace(/\bonClick=\{\s*\(\)\s*=>\s*onOpenDrilldown\([^)]+\)\s*\}/g, '');
    
    // Remove cursor-pointer and specific hover effects from the classes
    content = content.replace(/\bcursor-pointer\b/g, '');
    content = content.replace(/\bhover:-translate-y-0\.5\b/g, '');
    content = content.replace(/\bhover:shadow-md\b/g, '');
    content = content.replace(/\bhover:scale-105\b/g, '');
    // Not removing hover:bg-slate-50 because it might be used on valid buttons/pills

    // Fix double spaces inside quotes (className strings)
    let inQuote = false;
    let newContent = '';
    for(let i=0; i<content.length; i++) {
        if(content[i] === '"' || content[i] === "'") {
            inQuote = !inQuote;
            newContent += content[i];
        } else if (inQuote && content[i] === ' ' && content[i-1] === ' ') {
            // skip extra spaces inside classes
        } else {
            newContent += content[i];
        }
    }
    
    fs.writeFileSync(filePath, newContent);
    console.log(`Cleaned ${file}`);
});
