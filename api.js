const express = require('express');
const { setAccessToken } = require('./src/lib/token');
const { getToken, startAuth } = require('./src/lib/auth');
const { processEmails } = require('./src/lib/emailClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
          <!DOCTYPE html>
          <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Project Home Page</title>
              </head>
              <body>
                <h1>Welcome to the app for uploading Usage Reports from your Rackspace inbox to Sharepoint</h1>
                <p>To upload the XLSX attachments to Sharepoint, follow the steps below:</p>
                
                <ul>
                  <li><a href="/requestToken">Step 1 (/requestToken)</a><p>Click on the link to open the Microsoft login page.</p></li>
                  <li>Step 2 (/callback). <p>Microsoft will redirect you to this endpoint automatically. In this endpoint, we get and save the token required for following steps.</p></li>
                  <li><a href="/processEmails">Step 3 (/processEmails)</a><p>Once you're authenticated, click on this link to start processing the emails. This will grab all emails containing in its subject the word "test", extract the attachments in the emails and if the attachment it's an XLSX file, it will upload it to Sharepoint.</p></li>
                </ul>
                
              </body>
          </html>
    `);
});

app.get("/processEmails", async (req, res) => {
  await processEmails();

  res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Emails processed</title>
        </head>
        <body>
          <h1>All Emails processed!</h1>
          <p>Check your Sharepoint drive.</p>
        </body>
        </html>
      `);
});

app.get("/requestToken", (req, res) => {
  startAuth();
});

app.get("/callback", async (req, res) => {
  const msCode = req.query.code;

  if (!msCode) {
    console.log('Authorization code not found');
    return res.status(400).send('Authorization Code not found.');
  }

  setAccessToken(await getToken(msCode));

  res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <h1>Authentication successful!</h1>
          <h3>You'll be redirected to the Home page.</h3>
          <p>This window will automatically close after 3 seconds...</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
        </html>
      `);
});

app.all('*', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
