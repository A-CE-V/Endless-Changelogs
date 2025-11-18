require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { parseReleaseBody } = require('./helpers/githubBodyParser');

const app = express();
const port = process.env.PORT || 3000;

const allowedOriginsStr = process.env.ALLOWED_ORIGINS
const allowedOrigins = allowedOriginsStr.split(',').map(s => s.trim());


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); 
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    const msg = `The CORS policy for this site does not allow access from the Origin: ${origin}`;
    return callback(new Error(msg), false);
  }
};
app.use(cors(corsOptions));

// --- Main Changelog API Endpoint ---
app.get('/api/changelog', async (req, res) => {
    const GITHUB_PAT = process.env.GITHUB_PAT;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    
    if (!GITHUB_PAT || !REPO_OWNER || !REPO_NAME) {
        return res.status(500).json({ error: 'Server configuration error: Missing GitHub credentials.' });
    }

    try {
        const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`;
        
        const response = await fetch(githubUrl, {
            headers: {
                'Authorization': `token ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            console.error(`GitHub API returned status: ${response.status}`);
            return res.status(response.status).json({ error: 'Failed to retrieve data from GitHub.' });
        }

        const releases = await response.json();
        
        const formattedChangelog = releases
            .filter(release => !release.draft)
            .map(release => ({
                version: release.tag_name,
                date: new Date(release.published_at).toISOString().split('T')[0],
                changes: parseReleaseBody(release.body), 
            }));

        res.json(formattedChangelog);

    } catch (error) {
        console.error("API Fetch Error:", error.message);
        res.status(500).json({ error: 'Internal server error while fetching changelog.' });
    }
});

app.get("/health", (req, res) => res.send({ status: "OK", uptime: process.uptime() }));


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});