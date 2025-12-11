import React, { useState, useCallback, useEffect } from 'react';
import { ViewState, Contact, UserProfile, Message } from './types';
import ContactList from './components/ContactList';
import ChatScreen from './components/ChatScreen';
import { getGeminiResponse } from './services/geminiService';

// Mock Data
const MY_PROFILE: UserProfile = {
  name: "RetroUser",
  pin: "2A4F99C1",
  statusMessage: "Listening to nostalgia...",
  avatar: "https://picsum.photos/100/100?random=100"
};

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: "Tech Support",
    pin: "33B102AA",
    avatar: "https://picsum.photos/100/100?random=1",
    statusMessage: "Have you tried turning it off?",
    statusType: 'available',
    lastSeen: new Date(),
    history: [],
    persona: "A cynical but helpful IT support technician from 2010. You love talking about servers, Blackberry phones, and dislike printers."
  },
  {
    id: 'c2',
    name: "Sarah (Uni)",
    pin: "44C211BB",
    avatar: "https://picsum.photos/100/100?random=2",
    statusMessage: "Exams are killing me x_x",
    statusType: 'busy',
    lastSeen: new Date(),
    history: [],
    persona: "A university student in 2010. You use lots of abbreviations (lol, rotfl, brb). You are stressed about exams but love partying."
  },
  {
    id: 'c3',
    name: "Business Bob",
    pin: "55D322CC",
    avatar: "https://picsum.photos/100/100?random=3",
    statusMessage: "In a meeting. Urgent only.",
    statusType: 'busy',
    lastSeen: new Date(),
    history: [],
    persona: "A corporate executive. You use formal language, buzzwords (synergy, leverage), and are always busy. You value brevity."
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);

  const activeContact = contacts.find(c => c.id === activeContactId) || null;

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setView(ViewState.CHAT);
  };

  const handleBack = () => {
    setView(ViewState.CONTACTS);
    setActiveContactId(null);
  };

  const updateMessageStatus = useCallback((contactId: string, messageId: string, status: 'delivered' | 'read') => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          history: c.history.map(m => m.id === messageId ? { ...m, status } : m)
        };
      }
      return c;
    }));
  }, []);

  const addMessage = useCallback((contactId: string, message: Message) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          history: [...c.history, message],
          lastSeen: new Date()
        };
      }
      return c;
    }));
  }, []);

  const handleSendMessage = async (text: string, isPing: boolean = false) => {
    if (!activeContactId) return;

    const currentId = activeContactId; // Capture for closure
    const messageId = Date.now().toString();

    // 1. Add User Message
    const newMessage: Message = {
      id: messageId,
      sender: 'me',
      text,
      timestamp: new Date(),
      status: 'sending',
      isPing
    };
    addMessage(currentId, newMessage);

    // 2. Simulate Network Delay for 'Sent' -> 'Delivered'
    setTimeout(() => {
      updateMessageStatus(currentId, messageId, 'delivered');
    }, 800);

    // 3. AI Processing
    const targetContact = contacts.find(c => c.id === currentId);
    if (!targetContact) return;

    try {
      // Simulate "Read" status just before typing starts/responding
      setTimeout(() => {
        updateMessageStatus(currentId, messageId, 'read');
      }, 1500);

      // AI Response
      // If it's a ping, we send a special prompt or just let the AI handle the text "PING!!!"
      const aiResponseText = await getGeminiResponse(targetContact, text, targetContact.history);

      // Simulate typing delay based on length
      const typingDelay = Math.min(Math.max(aiResponseText.length * 20, 1000), 4000);

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: aiResponseText,
          timestamp: new Date(),
          status: 'read', // Incoming messages don't really have status for us, but for consistency
          isPing: false // AI doesn't ping back usually, but could be programmed to
        };
        addMessage(currentId, aiMessage);
      }, 1500 + typingDelay);

    } catch (error) {
      console.error("Failed to get response", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-0 sm:p-4">
      <div className="w-full max-w-md h-[100vh] sm:h-[800px] bg-slate-900 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-800 relative">
        
        {/* Bezel effect for desktop */}
        <div className="hidden sm:block absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 opacity-50 z-50"></div>
        
        {view === ViewState.CONTACTS && (
          <ContactList 
            user={MY_PROFILE} 
            contacts={contacts} 
            onSelectContact={handleSelectContact} 
          />
        )}

        {view === ViewState.CHAT && activeContact && (
          <ChatScreen 
            contact={activeContact} 
            onBack={handleBack} 
            onSendMessage={handleSendMessage} 
          />
        )}

        {/* LED Notification Light (Decorative) */}
        <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] z-50 pointer-events-none hidden sm:block"></div>

      </div>
    </div>
  );
};

export default App;