---
name: portable-email-manager
description: Send and read emails via any IMAP/SMTP provider (Zoho, Outlook, Gmail, etc.). Fully self-contained Node.js implementation; no external system binaries required. Ideal for environments without root access.
---

# Portable Email Manager

A lightweight, self-contained email skill for TARS. It uses standard IMAP and SMTP protocols to manage emails.

**Key Features:**
*   **Zero Dependencies:** No need to install `himalaya` or system libraries. Uses bundled Node.js modules.
*   **Universal:** Works with Zoho, Outlook (App Passwords), Gmail, iCloud, and custom servers.
*   **Secure:** Credentials read from environment variables.

## Credentials

Set the following environment variables in your OpenClaw configuration or `.env`:

- `EMAIL_USER`: Your email address (e.g., `user@zohomail.eu`)
- `EMAIL_PASS`: Your App Password (recommended) or account password.

## Installation

1.  Navigate to the skill directory:
    ```bash
    cd skills/portable-email-manager
    ```
2.  Install dependencies:
    ```bash
    npm install nodemailer imap-simple mailparser
    # Or simply run 'npm install' if package.json is present
    ```

## Usage

### Send Email
```bash
./scripts/email.js send "recipient@example.com" "Subject Line" "Body text goes here."
```

### Read Unread Emails
Reads and marks as read the latest N unread emails.
```bash
./scripts/email.js read 5
```

## Configuration (Advanced)

By default, the script is pre-configured for Zoho Mail EU (`smtp.zoho.eu` / `imap.zoho.eu`).
To use another provider, edit `scripts/email.js` constants: `smtpConfig` and `imapConfig`.
