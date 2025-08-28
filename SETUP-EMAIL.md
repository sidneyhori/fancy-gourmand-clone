# Email Setup Instructions for Fancy Gourmand

This guide will help you set up email functionality using Resend for your contact form and newsletter signup.

## Prerequisites

1. **Resend Account**: You mentioned you already have one
2. **Verified Domain**: You'll need to verify your domain with Resend
3. **Deployment Platform**: We'll use Vercel (free tier available)

## Step 1: Resend Configuration

### 1.1 Get Your API Key
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `re_`)

### 1.2 Verify Your Domain
1. Go to [Resend Domains](https://resend.com/domains)
2. Add `fancygourmand.com` (or your domain)
3. Follow the DNS setup instructions
4. Wait for verification (usually takes a few minutes)

## Step 2: Local Development

### 2.1 Install Dependencies
```bash
cd /Users/sidneyhorihawthorne/repos/fancy-gourmand-clone
npm install
```

### 2.2 Environment Variables
1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your actual values:
```
RESEND_API_KEY=your_actual_resend_api_key_here
FROM_EMAIL=noreply@fancygourmand.com
TO_EMAIL=contact@fancygourmand.com
```

### 2.3 Test Locally
```bash
npm run dev
```

Visit http://localhost:3000 and test the contact form and newsletter signup.

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy
```bash
vercel
```

### 3.4 Set Environment Variables
```bash
vercel env add RESEND_API_KEY
vercel env add FROM_EMAIL
vercel env add TO_EMAIL
```

Or set them in the Vercel dashboard at https://vercel.com/[your-project]/settings/environment-variables

## Step 4: Update Email Addresses

Before going live, update these files with your actual email addresses:

### 4.1 Contact Form (`api/contact.js`)
- Line 24: Change `from` email to your verified domain
- Line 25: Change `to` email to where you want to receive messages
- Line 41: Change `from` email for confirmation emails

### 4.2 Newsletter (`api/subscribe.js`)
- Line 24: Change `from` email to your verified domain
- Line 25: Change `to` email for subscription notifications
- Line 37: Change `from` email for welcome emails

## Step 5: Test Production

After deployment:

1. Test the contact form
2. Test the newsletter signup
3. Check your email for both notifications and confirmations
4. Verify all emails are delivered properly

## Troubleshooting

### Common Issues:

1. **"Invalid from address"**: Make sure your domain is verified in Resend
2. **"API key invalid"**: Double-check your RESEND_API_KEY
3. **Functions not working**: Make sure you're using Node.js 18+ and the `resend` package is installed
4. **CORS errors**: The API functions should handle CORS automatically

### Logs and Debugging:

- Check Vercel function logs in your dashboard
- Look at browser console for frontend errors
- Test API endpoints directly: `POST /api/contact` and `POST /api/subscribe`

## Security Notes

- Never commit `.env.local` to git (it's already in .gitignore)
- Use environment variables for all sensitive data
- Consider adding rate limiting for production use
- Validate all inputs on the server side

## Alternative Deployment Options

If you prefer not to use Vercel:

1. **Netlify**: Similar serverless functions, adjust import syntax
2. **Railway**: Full hosting with environment variables
3. **AWS Lambda**: More complex but powerful

The serverless functions are designed for Vercel but can be adapted for other platforms.