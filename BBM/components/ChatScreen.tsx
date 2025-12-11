import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message } from '../types';
import { ChevronLeft, MoreVertical, SendIcon, PingIcon } from './Icons';

interface ChatScreenProps {
  contact: Contact;
  onBack: () => void;
  onSendMessage: (text: string, isPing?: boolean) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ contact, onBack, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [contact.history]);

  // Effect to handle shake animation if the last message is a PING from sender 'them'
  useEffect(() => {
    const lastMsg = contact.history[contact.history.length - 1];
    if (lastMsg && lastMsg.isPing && lastMsg.sender === 'them') {
      setIsShaking(true);
      if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
      }
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [contact.history]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handlePing = () => {
    onSendMessage("PING!!!", true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 ${isShaking ? 'animate-ping-shake' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 p-3 border-b border-slate-600 shadow-md flex items-center justify-between z-10">
        <button onClick={onBack} className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-sm font-semibold">Chats</span>
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-100">{contact.name}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{contact.statusType}</span>
        </div>

        <button className="text-slate-400 hover:text-white">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e0e5ec] bg-opacity-5">
        <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest my-4 opacity-50">
          --- CONVERSATION STARTED ---
        </div>
        
        {contact.history.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              
              {msg.isPing ? (
                <div className={`px-4 py-3 rounded-md font-bold text-lg shadow-sm border
                  ${msg.sender === 'me' 
                    ? 'bg-red-600 text-white border-red-700' 
                    : 'bg-red-600 text-white border-red-700'
                  }`}>
                  PING!!!
                </div>
              ) : (
                <div className={`px-3 py-2 rounded-md text-sm shadow-sm border leading-snug
                  ${msg.sender === 'me' 
                    ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-slate-300 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
              )}

              {/* Status Indicators for 'me' */}
              {msg.sender === 'me' && (
                <div className="flex items-center gap-1 mt-1 mr-0.5">
                   <span className={`text-[9px] font-bold font-mono
                     ${msg.status === 'read' ? 'text-green-500' : 
                       msg.status === 'delivered' ? 'text-slate-400' : 'text-slate-500'}`}>
                     {msg.status === 'read' ? 'R' : msg.status === 'delivered' ? 'D' : '✔'}
                   </span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 p-2 border-t border-slate-700 flex items-end gap-2">
        <button 
          onClick={handlePing}
          className="p-2 text-red-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
          title="Send PING!!!"
        >
          <PingIcon className="w-6 h-6" />
        </button>
        
        <div className="flex-1 bg-white rounded-md flex items-center overflow-hidden border border-slate-500 focus-within:ring-2 focus-within:ring-blue-500">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter message"
            className="w-full max-h-24 py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none bg-transparent"
            rows={1}
          />
        </div>

        <button 
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;