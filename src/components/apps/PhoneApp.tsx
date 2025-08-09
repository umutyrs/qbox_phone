import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, PhoneCall, UserPlus, Search, Clock, Users, Hash } from 'lucide-react';
import { AppProps } from '../../types/App';

interface Contact {
  id: number;
  name: string;
  number: string;
  avatar?: string;
}

interface CallLog {
  id: number;
  contact: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export const PhoneApp: React.FC<AppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'recent' | 'keypad'>('recent');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [dialNumber, setDialNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // FiveM API calls
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:30120/phone/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'player' })
      });
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      // Fallback data for demo
      setContacts([
        { id: 1, name: 'Police Department', number: '911' },
        { id: 2, name: 'EMS', number: '912' },
        { id: 3, name: 'Mechanic', number: '555-0123' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCallLogs = async () => {
    try {
      const response = await fetch('http://localhost:30120/phone/calllogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'player' })
      });
      const data = await response.json();
      setCallLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch call logs:', error);
      // Fallback data for demo
      setCallLogs([
        { id: 1, contact: 'Police Department', number: '911', type: 'outgoing', timestamp: '2 min ago', duration: '1:23' },
        { id: 2, contact: 'Unknown', number: '555-0199', type: 'missed', timestamp: '1 hour ago' }
      ]);
    }
  };

  const makeCall = async (number: string) => {
    try {
      await fetch('http://localhost:30120/phone/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: 'player',
          target: number,
          action: 'start_call'
        })
      });
    } catch (error) {
      console.error('Failed to make call:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchCallLogs();
  }, []);

  const handleKeypadPress = (key: string) => {
    if (key === 'call' && dialNumber) {
      makeCall(dialNumber);
      return;
    }
    if (key === 'delete') {
      setDialNumber(prev => prev.slice(0, -1));
      return;
    }
    setDialNumber(prev => prev + key);
  };

  const TabButton: React.FC<{ tab: string; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex flex-col items-center py-2 px-4 ${
        activeTab === tab ? 'text-blue-500' : 'text-gray-400'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">Phone</h1>
          <UserPlus size={24} className="text-blue-500" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b border-gray-800 px-4">
        <TabButton tab="recent" icon={<Clock size={20} />} label="Recent" />
        <TabButton tab="contacts" icon={<Users size={20} />} label="Contacts" />
        <TabButton tab="keypad" icon={<Hash size={20} />} label="Keypad" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'recent' && (
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-3">
                {callLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'missed' ? 'bg-red-500' : 
                        log.type === 'incoming' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium">{log.contact}</div>
                        <div className="text-sm text-gray-400">{log.number}</div>
                        <div className="text-xs text-gray-500">{log.timestamp}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => makeCall(log.number)}
                      className="p-2 bg-green-600 rounded-full"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search contacts"
                  className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white"
                />
              </div>
            </div>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="font-semibold">{contact.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-400">{contact.number}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => makeCall(contact.number)}
                    className="p-2 bg-green-600 rounded-full"
                  >
                    <Phone size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keypad' && (
          <div className="p-4">
            <div className="text-center mb-8">
              <div className="text-2xl font-mono bg-gray-900 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                {dialNumber || 'Enter number'}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="w-16 h-16 bg-gray-800 rounded-full text-xl font-semibold active:bg-gray-700"
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex justify-center space-x-8 mt-8">
              <button
                onClick={() => handleKeypadPress('delete')}
                className="p-4 bg-red-600 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => handleKeypadPress('call')}
                className="p-4 bg-green-600 rounded-full"
                disabled={!dialNumber}
              >
                <PhoneCall size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};