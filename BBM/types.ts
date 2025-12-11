export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isPing?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  pin: string;
  avatar: string;
  statusMessage: string;
  statusType: 'available' | 'busy' | 'listening';
  lastSeen: Date;
  history: Message[];
  persona: string; // Internal instruction for Gemini
}

export interface UserProfile {
  name: string;
  pin: string;
  statusMessage: string;
  avatar: string;
}

export enum ViewState {
  CONTACTS = 'CONTACTS',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}