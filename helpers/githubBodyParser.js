// helpers/githubBodyParser.js

function parseReleaseBody(body) {
    if (!body) return [];
  
    // 1. Split the text by new lines (handle Windows or Unix line endings)
    const lines = body.split(/\r?\n/);
  
    return lines
      .map(line => line.trim()) // Clean up whitespace
      .filter(line => line.length > 0) // Remove empty lines
      .filter(line => !line.includes('Full Changelog')) // Remove GitHub's auto-generated bottom link
      .map(line => {
        // 2. Clean up Markdown bullets (* or -) so lines look clean
        // We return just the string, allowing the Frontend to decide the Icon/Color
        return line.replace(/^[\*\-]\s+/, '');
      });
  }
  
module.exports = { parseReleaseBody };