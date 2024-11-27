const axios = require('axios');
const qs = require('qs');
const { configVar } = require('../config/config');
require('dotenv').config();

async function startAuth() {
  const { default: open } = await import('open');
  const authUrl = await getAuthUrl();
  console.log('Opening authentication URL...');
  open(authUrl);
}

async function getAuthUrl() {
  const url = `${configVar.authority}/${configVar.tenantId}/oauth2/v2.0/authorize`;
  const params = qs.stringify({
    client_id: configVar.clientId,
    response_type: 'code',
    redirect_uri: configVar.redirectUri,
    scope: configVar.scope,
  });

  return `${url}?${params}`;
}

async function getToken(code) {
  const url = `${configVar.authority}/${configVar.tenantId}/oauth2/v2.0/token`;
  const data = qs.stringify({
    client_id: configVar.clientId,
    client_secret: configVar.clientSecret,
    code,
    redirect_uri: configVar.redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

module.exports = { startAuth, getAuthUrl, getToken };