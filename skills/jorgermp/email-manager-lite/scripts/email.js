#!/usr/bin/env node

const nodemailer = require('nodemailer');
const imap = require('imap-simple');
const { simpleParser } = require('mailparser');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Error: EMAIL_USER and EMAIL_PASS environment variables required.');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0];

// Zoho EU Configuration
const smtpConfig = {
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true, // SSL
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
};

const imapConfig = {
  imap: {
    user: EMAIL_USER,
    password: EMAIL_PASS,
    host: 'imap.zoho.eu',
    port: 993,
    tls: true,
    authTimeout: 20000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function sendEmail(to, subject, text) {
  console.log(`Sending email to ${to}...`);
  const transporter = nodemailer.createTransport(smtpConfig);
  const info = await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject,
    text
  });
  console.log(`Email sent: ${info.messageId}`);
}

async function readEmails(limit = 5) {
  console.log(`Checking inbox (last ${limit} messages)...`);
  let connection;
  try {
    console.log("Connecting to IMAP...");
    connection = await imap.connect(imapConfig);
    console.log("Connected. Opening INBOX...");
    
    await connection.openBox('INBOX');
    console.log("INBOX opened. Searching UNSEEN...");
    
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      markSeen: true
    };
    
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Found ${messages.length} unread messages.`);
    
    if (messages.length === 0) {
        return;
    }

    const recentMessages = messages.sort((a, b) => {
        return new Date(b.attributes.date) - new Date(a.attributes.date);
    }).slice(0, limit);

    for (const item of recentMessages) {
      const all = item.parts.find(part => part.which === '');
      const id = item.attributes.uid;
      const idHeader = "Imap-Id: "+id+"\r\n";
      
      const mail = await simpleParser(idHeader + all.body);
      
      console.log(`\n--- Email FROM: ${mail.from.text} ---`);
      console.log(`Subject: ${mail.subject}`);
      console.log(`Date: ${mail.date}`);
      console.log(`Body:\n${mail.text}`);
      console.log('-----------------------------------');
    }
  } catch (err) {
      console.error("IMAP Operation Error:", err);
  } finally {
    if (connection) {
        console.log("Closing connection...");
        connection.end();
    }
  }
}

async function main() {
  switch (command) {
    case 'send':
      await sendEmail(args[1], args[2], args[3]);
      break;
    case 'read':
      await readEmails(parseInt(args[1]) || 5);
      break;
    default:
      console.log('Usage: email.js send <to> <subject> <body> | read [limit]');
  }
}

main().catch(console.error);
