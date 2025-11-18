// --- GitHub Release Body Parsing Function ---
/**
 * Parses the Markdown body of a GitHub Release into a structured array of changes.
 * It assumes a common changelog format where each change is on a new line 
 * and might start with an indicator like 'Feature:', 'Fix:', 'Refactor:'.
 */
export function parseReleaseBody(body) {
    if (!body) return [];

    const lines = body.split('\n').filter(line => line.trim().length > 0);
    const changes = [];

    const typeRegex = /^(Feature|Feat|Fix|Bugfix|Refactor|Chore|Docs|Perf):?\s*(.*)/i;
    
    lines.forEach(line => {
        const match = line.match(typeRegex);
        
        if (match) {
            let type = match[1];
            let message = match[2].trim();
            
            let iconClass = 'text-gray-400';
            if (/(Feature|Feat)/i.test(type)) {
                type = 'Feature';
                iconClass = 'text-green-400';
            } else if (/(Fix|Bugfix)/i.test(type)) {
                type = 'Fix';
                iconClass = 'text-red-400';
            } else if (/(Refactor|Perf|Chore)/i.test(type)) {
                type = 'Refactor';
                iconClass = 'text-blue-400';
            }

            changes.push({ type, message, iconClass });

        } else if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
            // Handle simple bullet points as 'Update'
            changes.push({
                type: 'Update',
                message: line.substring(1).trim(),
                iconClass: 'text-yellow-400'
            });
        }
    });

    return changes;
}
