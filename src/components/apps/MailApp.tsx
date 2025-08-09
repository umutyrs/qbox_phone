import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Search, Plus, Paperclip, Send } from 'lucide-react';
import { AppProps } from '../../types/App';

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  attachments?: number;
}

export const MailApp: React.FC<AppProps> = ({ onClose }) => {
  const [view, setView] = useState<'inbox' | 'email' | 'compose'>('inbox');
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // FiveM API calls
  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:30120/phone/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: 'player',
          action: 'get_emails'
        })
      });
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      // Fallback data for demo
      setEmails([
        {
          id: 1,
          sender: 'City Hall',
          subject: 'Vehicle Registration Renewal',
          preview: 'Your vehicle registration expires soon...',
          timestamp: '2 hours ago',
          isRead: false,
          isImportant: true
        },
        {
          id: 2,
          sender: 'Bank of Los Santos',
          subject: 'Account Statement',
          preview: 'Your monthly statement is ready...',
          timestamp: '1 day ago',
          isRead: true,
          isImportant: false,
          attachments: 1
        },
        {
          id: 3,
          sender: 'Job Center',
          subject: 'New Job Opportunities',
          preview: 'We have found matching positions...',
          timestamp: '3 days ago',
          isRead: true,
          isImportant: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (to: string, subject: string, body: string) => {
    try {
      await fetch('http://localhost:30120/phone/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'send_email',
          to: to,
          subject: subject,
          body: body
        })
      });
      
      // Reset compose form
      setComposeData({ to: '', subject: '', body: '' });
      setView('inbox');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const markAsRead = async (emailId: number) => {
    try {
      await fetch('http://localhost:30120/phone/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'mark_read',
          emailId: emailId
        })
      });
      
      setEmails(prev => prev.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ));
    } catch (error) {
      console.error('Failed to mark email as read:', error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const openEmail = (email: Email) => {
    setCurrentEmail(email);
    setView('email');
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const handleSendEmail = () => {
    if (composeData.to && composeData.subject && composeData.body) {
      sendEmail(composeData.to, composeData.subject, composeData.body);
    }
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={view === 'inbox' ? onClose : () => setView('inbox')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">
            {view === 'inbox' ? 'Mail' : view === 'email' ? 'Email' : 'Compose'}
          </h1>
          {view === 'inbox' && (
            <button onClick={() => setView('compose')}>
              <Plus size={24} className="text-blue-500" />
            </button>
          )}
        </div>
      </div>

      {view === 'inbox' && (
        <>
          {/* Search */}
          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search mail"
                className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-1">
                {emails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => openEmail(email)}
                    className={`w-full p-4 text-left hover:bg-gray-900 active:bg-gray-800 ${
                      !email.isRead ? 'bg-gray-900/50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-medium ${!email.isRead ? 'text-white' : 'text-gray-300'}`}>
                        {email.sender}
                      </span>
                      <div className="flex items-center space-x-2">
                        {email.attachments && (
                          <Paperclip size={12} className="text-gray-400" />
                        )}
                        <span className="text-xs text-gray-400">{email.timestamp}</span>
                      </div>
                    </div>
                    <div className={`font-medium mb-1 ${!email.isRead ? 'text-white' : 'text-gray-400'}`}>
                      {email.subject}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {email.preview}
                    </div>
                    <div className="flex items-center mt-2">
                      {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />}
                      {email.isImportant && <div className="text-yellow-500 text-xs">⭐</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {view === 'email' && currentEmail && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{currentEmail.subject}</h2>
            <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
              <span>From: {currentEmail.sender}</span>
              <span>{currentEmail.timestamp}</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">
              {currentEmail.preview}
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              <br /><br />
              Best regards,<br />
              {currentEmail.sender}
            </p>
          </div>
        </div>
      )}

      {view === 'compose' && (
        <div className="flex-1 flex flex-col p-4">
          <div className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="To"
              value={composeData.to}
              onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
              className="w-full bg-gray-900 rounded-lg px-4 py-2 text-white"
            />
            <input
              type="text"
              placeholder="Subject"
              value={composeData.subject}
              onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full bg-gray-900 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <textarea
            placeholder="Compose email..."
            value={composeData.body}
            onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
            className="flex-1 bg-gray-900 rounded-lg p-4 text-white resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <button className="p-2">
              <Paperclip size={20} className="text-gray-400" />
            </button>
            <button
              onClick={handleSendEmail}
              disabled={!composeData.to || !composeData.subject || !composeData.body}
              className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};