
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    // IMPORTANT: Replace with your actual email service credentials in environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email provider
        auth: {
            user: process.env.EMAIL_SERVER_USER, // Your email address
            pass: process.env.EMAIL_SERVER_PASSWORD, // Your email password or app-specific password
        },
    });

    const mailOptions = {
        from: `"${fullName}" <${email}>`, // Use user's name and email as sender
        to: 'savriiofficial@gmail.com', // Your receiving email address
        replyTo: email, // Set the reply-to to the user's email
        subject: `Contact Form: ${subject}`,
        text: `You have a new message from your contact form:\n\nName: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error: any) {
        console.error('Failed to send email:', error);
        // Add a warning about environment variables not being set
        if (error.code === 'EAUTH' || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
             res.status(500).json({ 
                error: 'Could not send email. The server is not configured for sending emails. Please set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD environment variables.'
            });
        } else {
             res.status(500).json({ error: 'Failed to send email.' });
        }
    }
}
