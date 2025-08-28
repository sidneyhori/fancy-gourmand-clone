document.addEventListener('DOMContentLoaded', () => {
  const subForm = document.getElementById('subscribe-form');
  if (subForm) {
    subForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = subForm.querySelector('#email').value.trim();
      if (!email) {
        alert('Please enter your email address.');
        return;
      }

      // Show loading state
      const submitBtn = subForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
          alert('Thank you for subscribing! Check your email for confirmation.');
          subForm.reset();
        } else {
          throw new Error(result.error || 'Failed to subscribe');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        alert('Sorry, there was an error subscribing. Please try again later.');
      } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all fields.');
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          alert('Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
          contactForm.reset();
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        alert('Sorry, there was an error sending your message. Please try again later.');
      } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});