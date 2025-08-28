import { Resend } from 'resend';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

let resend;
try {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_demo_key_placeholder') {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Contact API: Resend initialized successfully');
  } else {
    console.log('Contact API: Resend not initialized - API key missing or placeholder');
  }
} catch (error) {
  console.warn('Contact API: Resend initialization error:', error.message);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if Resend is configured
    if (!resend) {
      console.log('Contact form submission:', { name, email, message: message.substring(0, 100) + '...' });
      return res.status(200).json({ success: true, message: 'Form submitted (email service not configured)' });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `Contact Form <${process.env.FROM_EMAIL}>`,
      to: [process.env.TO_EMAIL],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from Fancy Gourmand website contact form</small></p>
      `,
      // Also send a plain text version
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

Sent from Fancy Gourmand website contact form
      `.trim()
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Optionally send a confirmation email to the user
    await resend.emails.send({
      from: `Fancy Gourmand <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: 'Thank you for contacting Fancy Gourmand',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>The Fancy Gourmand Team</p>
        <hr>
        <p><small>This is an automated confirmation. Please do not reply to this email.</small></p>
      `,
      text: `
Hi ${name},

Thank you for reaching out! We've received your message and will get back to you within 24 hours.

Best regards,
The Fancy Gourmand Team

This is an automated confirmation. Please do not reply to this email.
      `.trim()
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}