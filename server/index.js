const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : ''
    }
});

// Verification endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is active and synced.' });
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    const mailOptions = {
        from: `"Swift Sales Support" <${process.env.GMAIL_EMAIL}>`,
        to: 'customercare.swiftsales@gmail.com', // destination email
        subject: `[INTERNAL] Priority Inquiry: ${subject} | ${firstName} ${lastName}`,
        text: `
            NEW INQUIRY RECEIVED
            ---------------------
            Personnel: ${firstName} ${lastName}
            Registry: ${email}
            Subject: ${subject}
            Timestamp: ${new Date().toLocaleString()}
            
            MESSAGE DETAILS:
            ${message}
        `,
        html: `
            <div style="font-family: 'Inter', 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #0f172a; padding: 32px; text-align: center; border-bottom: 4px solid #2563eb;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.025em; font-weight: 800; text-transform: uppercase;">Swift Sales Hub</h1>
                    <p style="color: #60a5fa; margin: 8px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Commercial Support Sync</p>
                </div>
                
                <div style="padding: 40px;">
                    <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
                        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Transmission Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Personnel</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${firstName} ${lastName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Registry Email</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #2563eb; font-weight: 700;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject Area</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${subject}</td>
                            </tr>
                        </table>
                    </div>

                    <div>
                        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">Inquiry Narrative</h2>
                        <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="mailto:${email}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; transition: background-color 0.2s;">
                            Respond to Inquiry
                        </a>
                    </div>
                </div>

                <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                        INTERNAL TRANSMISSION: This is a secure automated sync from the Swift Sales Healthcare Partner Portal.<br />
                        Date Sync: ${new Date().toLocaleString()} | ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to customercare.swiftsales@gmail.com from ${email}`);
        res.status(200).json({ success: true, message: 'Inquiry sync established successfully.' });
    } catch (error) {
        console.error('SMTP Sync Error:', error);
        res.status(500).json({ success: false, message: 'Failed to establish inquiry sync.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
