import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Plus, Search } from 'lucide-react';
import { AppProps } from '../../types/App';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  contact: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
}

export const MessagesApp: React.FC<AppProps> = ({ onClose }) => {
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // FiveM API calls
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:30120/phone/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'player', action: 'get_conversations' })
      });
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // Fallback data for demo
      setConversations([
        { id: 1, contact: 'Police Department', lastMessage: 'We received your report', timestamp: '2 min ago', unread: 0 },
        { id: 2, contact: 'Mechanic Shop', lastMessage: 'Your car is ready for pickup', timestamp: '1 hour ago', unread: 1 },
        { id: 3, contact: 'Bank Manager', lastMessage: 'Loan approved', timestamp: '3 hours ago', unread: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contact: string) => {
    try {
      const response = await fetch('http://localhost:30120/phone/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: 'player', 
          action: 'get_messages',
          contact: contact
        })
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Fallback data for demo
      setMessages([
        { id: 1, sender: contact, content: 'Hello, how can I help you?', timestamp: '10:30 AM', isOwn: false },
        { id: 2, sender: 'You', content: 'I need assistance with my vehicle', timestamp: '10:32 AM', isOwn: true },
        { id: 3, sender: contact, content: 'Sure, bring it to our shop', timestamp: '10:35 AM', isOwn: false }
      ]);
    }
  };

  const sendMessage = async (content: string, recipient: string) => {
    try {
      await fetch('http://localhost:30120/phone/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'send_message',
          recipient: recipient,
          message: content
        })
      });
      
      // Add message to local state
      const newMsg: Message = {
        id: Date.now(),
        sender: 'You',
        content: content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const openChat = (contact: string) => {
    setCurrentChat(contact);
    setView('chat');
    fetchMessages(contact);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      sendMessage(newMessage.trim(), currentChat);
    }
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={view === 'chat' ? () => setView('list') : onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">
            {view === 'chat' ? currentChat : 'Messages'}
          </h1>
          {view === 'list' && <Plus size={24} className="text-blue-500" />}
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Search */}
          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search messages"
                className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openChat(conv.contact)}
                    className="w-full p-4 flex items-center space-x-3 hover:bg-gray-900 active:bg-gray-800"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="font-semibold">{conv.contact.charAt(0)}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{conv.contact}</span>
                        <span className="text-xs text-gray-400">{conv.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 truncate">{conv.lastMessage}</span>
                        {conv.unread > 0 && (
                          <span className="bg-blue-600 text-xs rounded-full px-2 py-1 ml-2">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 rounded-full px-4 py-2 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 rounded-full disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};