const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Secure reset token
 * @param {string} username - User's username
 */
const sendPasswordResetEmail = async (email, resetToken, username) => {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"PrepPilot AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your PrepPilot AI password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #0a0a0f;
              color: #ffffff;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1a1a24;
              border-radius: 12px;
              padding: 40px;
              border: 1px solid #2d2d3a;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #2d2d3a;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #8b5cf6;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 15px;
            }
            .message {
              margin-bottom: 20px;
              color: #9ca3af;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            }
            .reset-button:hover {
              box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
            }
            .expiry {
              color: #9ca3af;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #2d2d3a;
              text-align: center;
              color: #9ca3af;
              font-size: 14px;
            }
            .footer a {
              color: #8b5cf6;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">PrepPilot AI</div>
            </div>
            <div class="content">
              <p class="greeting">Hi ${username || 'there'},</p>
              <p class="message">
                We received a request to reset your PrepPilot AI password. Click the button below to create a new password:
              </p>
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              <p class="message">
                This link expires in 30 minutes.
              </p>
              <p class="expiry">
                If you did not request this, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>Thanks,<br>PrepPilot AI</p>
              <p>
                <a href="${frontendUrl}">Visit PrepPilot AI</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendPasswordResetEmail,
};