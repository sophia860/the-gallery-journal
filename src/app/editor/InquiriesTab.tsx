import { useState, useEffect } from 'react';
import { Mail, Calendar, Tag, MessageSquare, Eye, CheckCircle2, Reply } from 'lucide-react';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  type: 'General Inquiry' | 'Submission Question' | 'Partnership' | 'Other';
  subject: string;
  message: string;
  dateSubmitted: string;
  status: 'new' | 'read' | 'responded';
}

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');

  // Load inquiries from localStorage
  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = () => {
    const stored = localStorage.getItem('gallery_inquiries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setInquiries(parsed.sort((a: ContactInquiry, b: ContactInquiry) => 
        new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
      ));
    }
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    const updated = inquiries.map(inq => 
      inq.id === id ? { ...inq, status } : inq
    );
    setInquiries(updated);
    localStorage.setItem('gallery_inquiries', JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    const inquiry = inquiries.find(inq => inq.id === id);
    if (inquiry && inquiry.status === 'new') {
      updateInquiryStatus(id, 'read');
    }
  };

  const filteredInquiries = statusFilter === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === statusFilter);

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(inq => inq.status === 'new').length,
    read: inquiries.filter(inq => inq.status === 'read').length,
    responded: inquiries.filter(inq => inq.status === 'responded').length,
  };

  const typeColors = {
    'General Inquiry': 'bg-blue-500/10 text-blue-700 border-blue-500',
    'Submission Question': 'bg-purple-500/10 text-purple-700 border-purple-500',
    'Partnership': 'bg-teal-500/10 text-teal-700 border-teal-500',
    'Other': 'bg-gray-500/10 text-gray-700 border-gray-500',
  };

  const statusColors = {
    new: 'bg-amber-500/10 text-amber-700 border-amber-500',
    read: 'bg-blue-500/10 text-blue-700 border-blue-500',
    responded: 'bg-green-500/10 text-green-700 border-green-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Lora'] text-3xl text-[#0D0D0D] mb-2">Contact Inquiries</h2>
          <p className="text-sm text-[#717171] font-['Inter']">
            Manage messages from the contact form on the About page
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-[#E8E0D8] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.12em] text-[#717171] font-['Inter'] font-semibold">
              Total
            </span>
            <Mail className="w-5 h-5 text-[#8B7355]" />
          </div>
          <div className="font-['Lora'] text-3xl text-[#0D0D0D]">{stats.total}</div>
        </div>

        <div className="bg-white border-2 border-amber-500 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.12em] text-[#717171] font-['Inter'] font-semibold">
              New
            </span>
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div className="font-['Lora'] text-3xl text-amber-700">{stats.new}</div>
        </div>

        <div className="bg-white border-2 border-blue-500 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.12em] text-[#717171] font-['Inter'] font-semibold">
              Read
            </span>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div className="font-['Lora'] text-3xl text-blue-700">{stats.read}</div>
        </div>

        <div className="bg-white border-2 border-green-500 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.12em] text-[#717171] font-['Inter'] font-semibold">
              Responded
            </span>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="font-['Lora'] text-3xl text-green-700">{stats.responded}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {(['all', 'new', 'read', 'responded'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 text-sm uppercase tracking-[0.12em] font-['Inter'] font-semibold transition-all ${
              statusFilter === filter
                ? 'bg-[#C41E3A] text-white'
                : 'bg-white text-[#717171] border border-[#E8E0D8] hover:bg-[#F5F0EB]'
            }`}
          >
            {filter === 'all' ? 'All Inquiries' : filter}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white border-2 border-[#E8E0D8] p-12 text-center">
          <Mail className="w-12 h-12 text-[#E8E0D8] mx-auto mb-4" />
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
            No inquiries yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map(inquiry => (
            <div
              key={inquiry.id}
              className={`bg-white border-2 ${
                inquiry.status === 'new' ? 'border-amber-500 shadow-md' : 'border-[#E8E0D8]'
              } hover:shadow-lg transition-all`}
            >
              {/* Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => {
                  setSelectedInquiry(selectedInquiry === inquiry.id ? null : inquiry.id);
                  markAsRead(inquiry.id);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Subject & Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-['Lora'] text-xl text-[#0D0D0D]">
                        {inquiry.subject}
                      </h3>
                      <span className={`px-2 py-1 text-xs uppercase tracking-wider font-['Inter'] font-semibold border ${statusColors[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                    </div>

                    {/* Name, Email, Type */}
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <span className="font-['Inter'] text-sm text-[#2C1810] font-semibold">
                        {inquiry.name}
                      </span>
                      <span className="font-['Courier_New'] text-sm text-[#8B7355]">
                        {inquiry.email}
                      </span>
                      <span className={`px-2 py-1 text-xs uppercase tracking-wider font-['Inter'] font-semibold border ${typeColors[inquiry.type]}`}>
                        {inquiry.type}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-[#717171] font-['Inter']">
                      <Calendar className="w-4 h-4" />
                      {new Date(inquiry.dateSubmitted).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <div className="text-[#8B7355]">
                    {selectedInquiry === inquiry.id ? '−' : '+'}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {selectedInquiry === inquiry.id && (
                <div className="border-t-2 border-[#E8E0D8] p-6 bg-[#FAF8F5]">
                  {/* Message */}
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-[0.12em] text-[#717171] mb-3 font-['Inter'] font-semibold">
                      Message
                    </label>
                    <div className="font-['Libre_Baskerville'] text-base text-[#2C1810] leading-relaxed whitespace-pre-wrap bg-white border border-[#E8E0D8] p-4">
                      {inquiry.message}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                      disabled={inquiry.status === 'read'}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Inter'] text-sm font-semibold uppercase tracking-wider"
                    >
                      <Eye className="w-4 h-4" />
                      Mark as Read
                    </button>
                    
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'responded')}
                      disabled={inquiry.status === 'responded'}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Inter'] text-sm font-semibold uppercase tracking-wider"
                    >
                      <Reply className="w-4 h-4" />
                      Mark as Responded
                    </button>

                    <a
                      href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-all font-['Inter'] text-sm font-semibold uppercase tracking-wider"
                    >
                      <Mail className="w-4 h-4" />
                      Email Reply
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
