const fs = require('fs');
const path = require('path');

const dir = 'e:/Maharashtra Dashboard/West-bengal-main/src/components/views';
const files = ['AffiliationView.tsx', 'CampusView.tsx', 'ResearchView.tsx'];

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    while(true) {
        const onClickIndex = content.indexOf('onClick={');
        if (onClickIndex === -1) break;
        
        let braceCount = 0;
        let endIndex = -1;
        for (let i = onClickIndex + 8; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
        
        if (endIndex !== -1) {
            const onClickContent = content.substring(onClickIndex, endIndex + 1);
            if (onClickContent.includes('onOpenDrilldown')) {
                // Remove the entire onClick block, and any preceding whitespace if possible
                let start = onClickIndex;
                while(start > 0 && (content[start-1] === ' ' || content[start-1] === '\t' || content[start-1] === '\n' || content[start-1] === '\r')) {
                    start--;
                }
                content = content.substring(0, start) + content.substring(endIndex + 1);
            } else {
                content = content.substring(0, onClickIndex) + 'ON_CLICK_SAFE' + content.substring(onClickIndex + 7);
            }
        } else {
            break;
        }
    }
    
    // Restore valid onClicks
    content = content.replace(/ON_CLICK_SAFE/g, 'onClick');
    
    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Processed ${file}`);
});
