import { Resend } from 'resend';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

let resend;
try {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_demo_key_placeholder') {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Subscribe API: Resend initialized successfully');
  } else {
    console.log('Subscribe API: Resend not initialized - API key missing or placeholder');
  }
} catch (error) {
  console.warn('Subscribe API: Resend initialization error:', error.message);
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
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if Resend is configured
    if (!resend) {
      console.log('Newsletter subscription:', { email });
      return res.status(200).json({ success: true, message: 'Subscribed (email service not configured)' });
    }

    // Send notification email to you
    const { data: notificationData, error: notificationError } = await resend.emails.send({
      from: `Newsletter <${process.env.FROM_EMAIL}>`,
      to: [process.env.TO_EMAIL],
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <hr>
        <p><small>Sent from Fancy Gourmand website newsletter signup</small></p>
      `,
      text: `
New Newsletter Subscription

Email: ${email}
Date: ${new Date().toLocaleDateString()}

Sent from Fancy Gourmand website newsletter signup
      `.trim()
    });

    if (notificationError) {
      console.error('Resend notification error:', notificationError);
      return res.status(500).json({ error: 'Failed to process subscription' });
    }

    // Send welcome email to subscriber
    const { data: welcomeData, error: welcomeError } = await resend.emails.send({
      from: `Fancy Gourmand <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: 'Welcome to Fancy Gourmand Business Tips!',
      html: `
        <h2>Welcome to our newsletter!</h2>
        <p>Thank you for subscribing to Fancy Gourmand business tips.</p>
        <p>You'll receive valuable insights about:</p>
        <ul>
          <li>International business expansion strategies</li>
          <li>US market entry best practices</li>
          <li>Luxury and high-end product positioning</li>
          <li>Industry trends and opportunities</li>
        </ul>
        <p>We're excited to help your business thrive in the US market!</p>
        <p>Best regards,<br>The Fancy Gourmand Team</p>
        <hr>
        <p><small>You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE".</small></p>
      `,
      text: `
Welcome to our newsletter!

Thank you for subscribing to Fancy Gourmand business tips.

You'll receive valuable insights about:
• International business expansion strategies
• US market entry best practices  
• Luxury and high-end product positioning
• Industry trends and opportunities

We're excited to help your business thrive in the US market!

Best regards,
The Fancy Gourmand Team

You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE".
      `.trim()
    });

    if (welcomeError) {
      console.error('Resend welcome error:', welcomeError);
      // Don't fail the request if welcome email fails, just log it
    }

    res.status(200).json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}