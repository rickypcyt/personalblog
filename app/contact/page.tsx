'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Here you would typically send the form data to your API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="h-full bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-400">Have a question or want to work together? Send me a message!</p>
        </div>

        <div className="bg-black rounded-lg p-6 border border-[#212125]">
          {status === 'success' ? (
            <div className="p-4 bg-green-900/50 border border-[#212125] rounded-md text-green-200">
              Thank you for your message! I&apos;ll get back to you soon.
            </div>
          ) : status === 'error' ? (
            <div className="p-4 bg-red-900/50 border border-[#212125] rounded-md text-red-200">
              Something went wrong. Please try again later.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-[#212125] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#212125] focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-[#212125] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#212125] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-[#212125] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#212125] focus:border-transparent"
                  placeholder="Your message here..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-3 bg-black hover:bg-[#212125] text-white font-medium rounded-md border border-[#212125] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#212125] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
