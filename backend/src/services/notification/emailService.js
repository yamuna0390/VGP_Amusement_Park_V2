const nodemailer = require('nodemailer');

/**
 * Notification / Email Service
 * 
 * Reusable SMTP email service.
 */
class EmailService {
  constructor() {
    this.createTransporter();
  }

  createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: {
          user: user,
          pass: pass,
        },
      });
    } else {
      this.transporter = null;
    }
  }

  /**
   * Generic method to send an email with attachments.
   * 
   * @param {Object} options
   * @param {string|string[]} options.to - Recipient email(s)
   * @param {string} options.subject - Email subject
   * @param {string} [options.text] - Plain text body
   * @param {string} [options.html] - HTML body
   * @param {Array} [options.attachments] - Array of attachment objects { filename: string, path: string }
   * @returns {Promise<Object>} - Result of the send operation
   */
  async sendEmail({ to, subject, text, html, attachments = [] }) {
    if (!this.transporter) {
      this.createTransporter();
    }

    if (!this.transporter) {
      throw new Error('[EMAIL SERVICE] SMTP configuration is missing. Cannot send email.');
    }

    if (!to || !subject) {
      throw new Error('[EMAIL SERVICE] Recipient and subject are required.');
    }

    if (!text && !html) {
      throw new Error('[EMAIL SERVICE] Either text or html body is required.');
    }

    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
    };

    if (text) mailOptions.text = text;
    if (html) mailOptions.html = html;
    if (attachments.length > 0) mailOptions.attachments = attachments;

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Email sent successfully to: ${to} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[EMAIL SERVICE] Failed to send email to ${to}:`, error.message);
      throw new Error(`[EMAIL SERVICE] Failed to send email: ${error.message}`);
    }
  }

  /**
   * Sends a password reset email
   * 
   * @param {string} toEmail - The recipient's email address
   * @param {string} resetUrl - The fully qualified URL containing the reset token
   * @returns {Promise<boolean>} - True if email was "sent", false otherwise
   */
  async sendPasswordResetEmail(toEmail, resetUrl) {
    try {
      const html = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background-color: #5e35b1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `;

      if (!this.transporter && (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD)) {
        console.log('====================================================');
        console.log(`[EMAIL SERVICE] Sending password reset email to: ${toEmail}`);
        console.log(`[EMAIL SERVICE] Reset URL generated successfully.`);
        console.log('[EMAIL SERVICE] Status: Delivery pending configuration. (MOCKED)');
        console.log('====================================================');
        return true;
      }

      await this.sendEmail({
        to: toEmail,
        subject: 'Password Reset - VGP Universal Kingdom',
        html: html
      });
      
      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send password reset email:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
