const axios = require('axios');

async function uploadFileToSharePoint(accessToken, binaryFile, siteId, driveId, folderPath, fileName) {
  const encodedFolderPath = encodeURIComponent(folderPath);

  try {
    const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${encodedFolderPath}/${fileName}:/content`;

    const response = await axios.put(uploadUrl, binaryFile, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    console.log('File uploaded successfully:', response.data);
    return 'File uploaded successfully!';
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error.message);
    return 'Error uploading file';
  }
}

module.exports = { uploadFileToSharePoint };

