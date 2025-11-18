require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;


const allowedOrigins = ['http://localhost:8080', 'https://endless-forge-web.web.app/'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));

app.get('/api/changelog', async (req, res) => {
    const GITHUB_PAT = process.env.GITHUB_PAT;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    

    res.json({ message: "Changelog API endpoint hit successfully." }); 
});

app.get("/health", (req, res) => res.send({ status: "OK", uptime: process.uptime() }));


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});