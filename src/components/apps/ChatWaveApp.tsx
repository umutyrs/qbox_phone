import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreHorizontal } from 'lucide-react';
import { AppProps } from '../../types/App';

export const ChatWaveApp: React.FC<AppProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! How are you doing?', sent: false, time: '10:15' },
    { id: 2, text: 'I\'m great! Just working on some new projects 😊', sent: true, time: '10:16' },
    { id: 3, text: 'That sounds awesome! What kind of projects?', sent: false, time: '10:17' },
    { id: 4, text: 'Building some mobile apps with React. It\'s really fun!', sent: true, time: '10:18' },
    { id: 5, text: 'Cool! I\'d love to see them when you\'re done', sent: false, time: '10:19' }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onClose}>
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              👩‍💼
            </div>
            <div>
              <h1 className="font-semibold">Emma Wilson</h1>
              <p className="text-sm opacity-80">Online</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button><Phone size={20} /></button>
            <button><Video size={20} /></button>
            <button><MoreHorizontal size={20} /></button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-4 flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
              msg.sent 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                : 'bg-white text-gray-800 shadow-sm'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sent ? 'text-blue-100' : 'text-gray-500'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};