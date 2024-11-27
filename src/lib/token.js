const fs = require('fs');
const path = require('path');

const TOKEN_FILE = path.join(__dirname, './../config/token.json');

// Function to save or overwrite the token in the file
function setAccessToken(token) {
  try {
    // Always overwrite the token in the file
    const data = JSON.stringify({ token: token }, null, 2);
    fs.writeFileSync(TOKEN_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Error saving token to file:', error);
  }
}

// Function to retrieve the token from the file
function getAccessToken() {
  try {
    // Check if the file exists
    if (!fs.existsSync(TOKEN_FILE)) {
      console.error('Token file does not exist.');
      return null;
    }

    // Read and parse the token data
    const data = fs.readFileSync(TOKEN_FILE, 'utf-8');
    const { token } = JSON.parse(data);
    return token;
  } catch (error) {
    console.error('Error reading token from file:', error);
    return null;
  }
}

module.exports = { setAccessToken, getAccessToken };