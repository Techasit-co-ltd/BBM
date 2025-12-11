import React from 'react';
import { Contact, UserProfile } from '../types';
import { BBMIcon } from './Icons';

interface ContactListProps {
  user: UserProfile;
  contacts: Contact[];
  onSelectContact: (contactId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ user, contacts, onSelectContact }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 p-4 border-b border-slate-600 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-500 border-2 border-slate-400 overflow-hidden relative shadow-inner">
            <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{user.name}</h1>
            <p className="text-xs text-slate-300 uppercase tracking-wide">PIN: {user.pin}</p>
            <p className="text-xs text-blue-300 italic truncate max-w-[150px]">{user.statusMessage}</p>
          </div>
        </div>
        <div className="text-slate-400">
           <BBMIcon className="w-8 h-8 text-blue-400 opacity-80" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 border-b border-slate-700">
        <button className="flex-1 py-3 text-sm font-semibold text-blue-400 border-b-2 border-blue-400 bg-slate-700/50">Chats</button>
        <button className="flex-1 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200">Contacts</button>
        <button className="flex-1 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200">Groups</button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 bg-slate-900/90 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 backdrop-blur-sm">
          Active Chats
        </div>
        
        {contacts.map((contact) => {
          const lastMsg = contact.history.length > 0 ? contact.history[contact.history.length - 1] : null;
          
          return (
            <div 
              key={contact.id} 
              onClick={() => onSelectContact(contact.id)}
              className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded bg-slate-700 overflow-hidden border border-slate-600">
                  <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                </div>
                {contact.statusType === 'available' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                )}
                {contact.statusType === 'busy' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-sm text-slate-100 truncate">{contact.name}</h3>
                  {lastMsg && (
                    <span className="text-[10px] text-slate-500">
                      {lastMsg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {lastMsg && lastMsg.sender === 'me' && (
                     <span className={`text-[9px] font-bold ${lastMsg.status === 'read' ? 'text-green-500' : 'text-slate-400'}`}>
                       {lastMsg.status === 'read' ? 'R' : lastMsg.status === 'delivered' ? 'D' : '✔'}
                     </span>
                  )}
                  <p className={`text-xs truncate ${lastMsg?.status === 'read' ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                    {lastMsg ? (lastMsg.isPing ? 'PING!!!' : lastMsg.text) : <span className="text-slate-600 italic">No messages yet</span>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactList;