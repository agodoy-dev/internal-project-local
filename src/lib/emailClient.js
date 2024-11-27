const imaps = require('imap-simple');
const { configVar } = require('../config/config.js');
const { uploadFileToSharePoint } = require('./sharepoint.js');
const { getAccessToken } = require('./token.js');
require('dotenv').config();

const config = {
    imap: {
        user: process.env.RACKSPACE_EMAIL_USER,
        password: process.env.RACKSPACE_EMAIL_PASSWORD,
        host: 'secure.emailsrvr.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
    },
};

async function processEmails() {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = [['UNSEEN'], ['SUBJECT', 'test']];
    const fetchOptions = {
        bodies: ['HEADER', 'TEXT'],
        struct: true,
        markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const item of messages) {
        const text = item.parts.find((part) => part.which === 'TEXT');
        const header = item.parts.find((part) => part.which === 'HEADER');

        const subject = header.body.subject;

        console.log(`\n\nProcessing email with subject: '${subject}'\n`);

        const attachment = await extractAttachment(text);

        const emailTemp = {
            subject: subject,
            attachmentName: attachment ? attachment.filename : "",
            attachmentContent: attachment ? attachment.content : "",
        };

        try {
            if (emailTemp.attachmentName.includes(".xlsx")) {
                const binaryFile = emailTemp.attachmentContent;
                const fileName = emailTemp.attachmentName;
                const siteId = configVar.siteId;
                const driveId = configVar.driveId;
                const folderPath = configVar.folderPath;
                const accessToken = getAccessToken();

                await uploadFileToSharePoint(accessToken, binaryFile, siteId, driveId, folderPath, fileName);
            }
        } catch (error) {
            console.error(`Error processing email with subject: '${subject}'. Error: ${error}`);
        }
    }

    await connection.end();
}

async function extractAttachment(textPart) {
    try {
        // Check if the Content-Disposition contains an attachment
        const contentDispositionMatch = textPart.body.match(/Content-Disposition: attachment; filename="([^"]+)"/);
        if (!contentDispositionMatch) {
            console.log("No attachment found in the email.");
            return null;
        }

        const filename = contentDispositionMatch[1];

        if (!filename.endsWith('.xlsx')) {
            console.log("Attachment is not an xlsx file.");
            return null;
        }

        // Find the base64 content between the specific markers
        const base64Match = textPart.body.match(
            /X-Attachment-Id: [^\r\n]+\r\n\r\n([\s\S]+?)\r\n--/
        );

        if (!base64Match) {
            console.error("Base64 content not found in the email body.");
            return null;
        }

        let base64Content = base64Match[1];

        base64Content = base64Content.replace(/[\r\n]+/g, ''); // Remove all line breaks

        const binaryContent = Buffer.from(base64Content, 'base64');

        return {
            filename,
            content: binaryContent
        };

    } catch (error) {
        console.error("Error extracting attachment:", error.message);
        return null;
    }
}

module.exports = { processEmails, extractAttachment };