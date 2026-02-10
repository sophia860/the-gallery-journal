import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  type: 'General Inquiry' | 'Submission Question' | 'Partnership' | 'Other';
  subject: string;
  message: string;
  dateSubmitted: string;
  status: 'new' | 'read' | 'responded';
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General Inquiry' as ContactInquiry['type'],
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create inquiry object
    const inquiry: ContactInquiry = {
      id: crypto.randomUUID(),
      ...formData,
      dateSubmitted: new Date().toISOString(),
      status: 'new',
    };

    // Get existing inquiries from localStorage
    const existingInquiries = localStorage.getItem('gallery_inquiries');
    const inquiries: ContactInquiry[] = existingInquiries 
      ? JSON.parse(existingInquiries) 
      : [];

    // Add new inquiry
    inquiries.push(inquiry);
    localStorage.setItem('gallery_inquiries', JSON.stringify(inquiries));

    // Reset form and show success message
    setFormData({
      name: '',
      email: '',
      type: 'General Inquiry',
      subject: '',
      message: '',
    });
    setSubmitted(true);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-[#F5F0EB] border-2 border-[#E0D8D0] rounded-lg p-8 md:p-12">
      {submitted ? (
        // Success Message
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8A9A7B]/20 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-[#8A9A7B]" />
          </div>
          <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
            Thank You!
          </h3>
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] leading-relaxed max-w-md mx-auto">
            We've received your message and will respond within 2-3 business days.
          </p>
        </div>
      ) : (
        // Contact Form
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label 
              htmlFor="name" 
              className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2"
            >
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 bg-white border-2 ${
                errors.name ? 'border-[#E11D48]' : 'border-[#E0D8D0]'
              } focus:border-[#C4A265] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 font-['Courier_New'] text-xs text-[#E11D48]">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 bg-white border-2 ${
                errors.email ? 'border-[#E11D48]' : 'border-[#E0D8D0]'
              } focus:border-[#C4A265] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 font-['Courier_New'] text-xs text-[#E11D48]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Inquiry Type */}
          <div>
            <label 
              htmlFor="type" 
              className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2"
            >
              Inquiry Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactInquiry['type'] })}
              className="w-full px-4 py-3 bg-white border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Submission Question">Submission Question</option>
              <option value="Partnership">Partnership</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label 
              htmlFor="subject" 
              className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2"
            >
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-4 py-3 bg-white border-2 ${
                errors.subject ? 'border-[#E11D48]' : 'border-[#E0D8D0]'
              } focus:border-[#C4A265] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors`}
              placeholder="Brief summary of your inquiry"
            />
            {errors.subject && (
              <p className="mt-1 font-['Courier_New'] text-xs text-[#E11D48]">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label 
              htmlFor="message" 
              className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2"
            >
              Message *
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className={`w-full px-4 py-3 bg-white border-2 ${
                errors.message ? 'border-[#E11D48]' : 'border-[#E0D8D0]'
              } focus:border-[#C4A265] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors resize-none`}
              placeholder="Please provide details about your inquiry..."
            />
            {errors.message && (
              <p className="mt-1 font-['Courier_New'] text-xs text-[#E11D48]">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Cardo'] text-lg tracking-wide rounded-lg shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </div>

          {/* Privacy Note */}
          <div className="pt-2 text-center">
            <p className="font-['Courier_New'] text-xs text-[#8B7355]">
              We aim to respond to all inquiries within 2-3 business days
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
