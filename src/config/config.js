require('dotenv').config();

const configVar = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tenantId: process.env.TENANT_ID,
  redirectUri: process.env.REDIRECT_URI,
  scope: 'Files.ReadWrite.All Sites.ReadWrite.All',
  authority: 'https://login.microsoftonline.com',
  siteId: process.env.SITE_ID,
  driveId: process.env.DRIVE_ID,
  folderPath: 'General/Integrations Usage Reports/Dashboard project/Test',
};

module.exports = { configVar };